import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class PillarsMinionRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]pillarsminion$", "Pillars", "#page-pillars-minion", "#button-pillars", pRouter);

    this._handleLocalPillarItems = this._handleLocalPillarItems.bind(this);

    const closeButton = this.pageElement.querySelector("#pillars-minion-button-close");
    closeButton.addEventListener("click", pClickEvent =>
      this.router.goTo("/pillars")
    );
  }

  onShow() {
    const myThis = this;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    const titleElement = document.getElementById("pillars-minion-title");
    titleElement.innerText = "Pillars on " + minionId;

    const localPillarItemsPromise = this.router.api.getLocalPillarItems(minionId);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localPillarItemsPromise.then(pData => {
      myThis._handleLocalPillarItems(pData, minionId);
    }, pData => {
      myThis._handleLocalPillarItems(JSON.stringify(pData), minionId);
    });

    runnerJobsListJobsPromise.then(pData => {
      myThis.handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis.handleRunnerJobsActive(pData);
      }, pData => {
        myThis.handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  _handleLocalPillarItems(pData, pMinionId) {
    const panel = document.getElementById("pillars-minion-panel");
    const menu = new DropDownMenu(panel);
    this._addMenuItemSaltUtilRefreshPillar(menu, pMinionId);

    const container = document.getElementById("pillars-minion-list");

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const titleElement = document.getElementById("pillars-minion-title");
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);

    if(PageRoute.showErrorRowInstead(container.tBodies[0], pData)) return;

    const pillars = pData.return[0][pMinionId];

    if(pillars === undefined) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if(pillars === false) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Minion '" + pMinionId + "' did not answer";
      return;
    }

    // collect the public pillars and compile their regexps
    let publicPillarsText = window.localStorage.getItem("public_pillars");
    if(!publicPillarsText || publicPillarsText === "undefined") publicPillarsText = "[]";
    let publicPillars = JSON.parse(publicPillarsText);
    if(!Array.isArray(publicPillars)) publicPillars = [ ];
    for(let i = 0; i < publicPillars.length; i++) {
      try {
        publicPillars[i] = new RegExp(publicPillars[i]);
      }
      catch(err) {
        // most likely a syntax error in the RE
        publicPillars[i] = null;
      }
    }

    const keys = Object.keys(pillars).sort();
    for(const k of keys) {
      const pillar = document.createElement('tr');

      const nameTd = Route.createTd("pillar-name", k);
      pillar.appendChild(nameTd);

      // menu comes before this data if there was any

      const pillarValueTd = Route.createTd("", "");

      // 25CF = BLACK CIRCLE, 8 of these
      const pillarValueHidden = "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF";
      const pillarHiddenDiv = Route.createDiv("pillar-hidden", pillarValueHidden);
      pillarHiddenDiv.style.display = "inline-block";
      Utils.addToolTip(pillarHiddenDiv, "Click to show");
      // initially use the hidden view
      pillarValueTd.appendChild(pillarHiddenDiv);

      const pillarValueShown = Output.formatObject(pillars[k]);
      const pillarShownDiv = Route.createDiv("pillar-shown", pillarValueShown);
      // initially hide the normal view
      pillarShownDiv.style.display = "none";
      Utils.addToolTip(pillarShownDiv, "Click to hide");
      // add the non-masked representation, not shown yet
      pillarValueTd.appendChild(pillarShownDiv);

      // show public pillars immediatelly
      for(let i = 0; i < publicPillars.length; i++) {
        if(publicPillars[i] && publicPillars[i].test(k)) {
          // same code as when clicking the hidden value
          pillarHiddenDiv.style.display = "none";
          pillarShownDiv.style.display = "inline-block";
          break;
        }
      }

      pillar.appendChild(pillarValueTd);

      pillarHiddenDiv.addEventListener("click", function(pClickEvent) {
        pillarHiddenDiv.style.display = "none";
        pillarShownDiv.style.display = "inline-block";
      });

      pillarShownDiv.addEventListener("click", function(pClickEvent) {
        pillarShownDiv.style.display = "none";
        pillarHiddenDiv.style.display = "inline-block";
      });

      container.tBodies[0].appendChild(pillar);
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(keys.length,
      "No pillars", "{0} pillar", "{0} pillars");
    msgDiv.innerText = txt;
  }

  _addMenuItemSaltUtilRefreshPillar(pMenu, pMinionId) {
    pMenu.addMenuItem("Refresh&nbsp;pillar...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "saltutil.refresh_pillar");
    }.bind(this));
  }
}
