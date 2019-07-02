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
    closeButton.addEventListener("click", _ => {
      this.router.goTo("/pillars");
    });
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
      myThis._handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis._handleRunnerJobsActive(pData);
      }, pData => {
        myThis._handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  _handleLocalPillarItems(pData, pMinionId) {
    const panel = document.getElementById("pillars-minion-panel");
    const menu = new DropDownMenu(panel);
    this._addMenuItemRefreshPillar(menu, pMinionId);

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
    let public_pillars = JSON.parse(publicPillarsText);
    if(!Array.isArray(public_pillars)) public_pillars = [ ];
    for(let i = 0; i < public_pillars.length; i++) {
      try {
        public_pillars[i] = new RegExp(public_pillars[i]);
      }
      catch(err) {
        // most likely a syntax error in the RE
        public_pillars[i] = null;
      }
    }

    const keys = Object.keys(pillars).sort();
    for(const k of keys) {
      const pillar = document.createElement('tr');

      const nameTd = Route._createTd("pillar-name", k);
      pillar.appendChild(nameTd);

      // menu comes before this data if there was any

      const pillarValueTd = Route._createTd("", "");

      // 25CF = BLACK CIRCLE, 8 of these
      const value_hidden = "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF";
      const pillar_hidden = Route._createDiv("pillar-hidden", value_hidden);
      pillar_hidden.style.display = "inline-block";
      Utils.addToolTip(pillar_hidden, "Click to show");
      // initially use the hidden view
      pillarValueTd.appendChild(pillar_hidden);

      const value_shown = Output.formatObject(pillars[k]);
      const pillar_shown = Route._createDiv("pillar-shown", value_shown);
      // initially hide the normal view
      pillar_shown.style.display = "none";
      Utils.addToolTip(pillar_shown, "Click to hide");
      // add the non-masked representation, not shown yet
      pillarValueTd.appendChild(pillar_shown);

      // show public pillars immediatelly
      for(let i = 0; i < public_pillars.length; i++) {
        if(public_pillars[i] && public_pillars[i].test(k)) {
          // same code as when clicking the hidden value
          pillar_hidden.style.display = "none";
          pillar_shown.style.display = "inline-block";
          break;
        }
      }

      pillar.appendChild(pillarValueTd);

      pillar_hidden.addEventListener("click", function(pClickEvent) {
        pillar_hidden.style.display = "none";
        pillar_shown.style.display = "inline-block";
      });

      pillar_shown.addEventListener("click", function(pClickEvent) {
        pillar_shown.style.display = "none";
        pillar_hidden.style.display = "inline-block";
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

  _addMenuItemRefreshPillar(pMenu, pMinionId) {
    pMenu.addMenuItem("Refresh&nbsp;pillar...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "saltutil.refresh_pillar");
    }.bind(this));
  }
}
