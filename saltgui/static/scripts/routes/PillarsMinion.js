import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class PillarsMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]pillarsminion$", "Pillars", "#page_pillarsminion", "#button_pillars", router);

    this._handleLocalPillarItems = this._handleLocalPillarItems.bind(this);

    this.page_element.querySelector("#button_close_pillarsminion").addEventListener("click", _ => {
      this.router.goTo("/pillars");
    });
  }

  onShow() {
    const myThis = this;

    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    const title = document.getElementById("pillarsminion_title");
    title.innerText = "Pillars on " + minion;

    const localPillarItemsPromise = this.router.api.getLocalPillarItems(minion);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localPillarItemsPromise.then(myThis._handleLocalPillarItems);

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      });
    }); 
  }

  _handleLocalPillarItems(data) {
    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    const pillars = data.return[0][minion];

    const pmp = document.getElementById("pillarsminion_page");
    const menu = new DropDownMenu(pmp);
    this._addMenuItemRefreshPillar(menu, minion);

    const container = document.getElementById("pillarsminion_list");

    // new menu's are always added at the bottom of the div
    // fix that by re-adding the minion list
    pmp.appendChild(container);

    while(container.tBodies[0].rows.length > 0) {
      container.tBodies[0].deleteRow(0);
    }

    if(!pillars) return;

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

      const name = Route._createTd("pillar_name", k);
      pillar.appendChild(name);

      // menu comes before this data if there was any

      const pillar_value = Route._createTd("", "");

      // 8 bullet characters
      const value_hidden = "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF";
      const pillar_hidden = Route._createDiv("pillar_hidden", value_hidden);
      pillar_hidden.style.display = "inline-block";
      Utils.addToolTip(pillar_hidden, "Click to show");
      // initially use the hidden view
      pillar_value.appendChild(pillar_hidden);

      const value_shown = Output.formatObject(pillars[k]);
      const pillar_shown = Route._createDiv("pillar_shown", value_shown);
      // initially hide the normal view
      pillar_shown.style.display = "none";
      Utils.addToolTip(pillar_shown, "Click to hide");
      // add the non-masked representation, not shown yet
      pillar_value.appendChild(pillar_shown);

      // show public pillars immediatelly
      for(let i = 0; i < public_pillars.length; i++) {
        if(public_pillars[i] && public_pillars[i].test(k)) {
          // same code as when clicking the hidden value
          pillar_hidden.style.display = "none";
          pillar_shown.style.display = "inline-block";
          break;
        }
      }

      pillar.appendChild(pillar_value);

      pillar_hidden.addEventListener("click", function(evt) {
        pillar_hidden.style.display = "none";
        pillar_shown.style.display = "inline-block";
      });

      pillar_shown.addEventListener("click", function(evt) {
        pillar_shown.style.display = "none";
        pillar_hidden.style.display = "inline-block";
      });

      container.tBodies[0].appendChild(pillar);
    }

    Utils.showTableSortable(this.getPageElement(), "pillars");

    if(!keys.length) {
      const noPillarsMsg = Route._createTd("msg", "No pillars found");
      container.tBodies[0].appendChild(noPillarsMsg);
    }
  }

  _addMenuItemRefreshPillar(menu, hostname) {
    menu.addMenuItem("Refresh&nbsp;pillar...", function(evt) {
      this._runCommand(evt, hostname, "saltutil.refresh_pillar");
    }.bind(this));
  }
}
