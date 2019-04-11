import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class PillarsMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]pillarsminion$", "Pillars", "#page_pillarsminion", "#button_pillars", router);

    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._handleLocalPillarItems = this._handleLocalPillarItems.bind(this);

    this.page_element.querySelector("#button_close_pillarsminion").addEventListener("click", _ => {
      this.router.goTo("/pillars");
    });
  }

  onShow() {
    const minions = this;

    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    const title = document.getElementById("pillarsminion_title");
    title.innerText = "Pillars on " + minion;

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getLocalPillarItems(minion).then(minions._handleLocalPillarItems);
      minions.router.api.getRunnerJobsListJobs().then(minions._handleRunnerJobsListJobs);
      minions.router.api.getRunnerJobsActive().then(minions._handleRunnerJobsActive);
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

      // 8 bullet characters
      const value_hidden = "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF";
      const pillar_hidden = Route._createTd("pillar_hidden", value_hidden);
      // initially use the hidden view
      pillar.appendChild(pillar_hidden);

      const value_shown = Output.formatObject(pillars[k]);
      const pillar_shown = Route._createTd("pillar_shown", value_shown);
      // initially hide the normal view
      pillar_shown.style.display = "none";
      // add the non-masked representation, not shown yet
      pillar.appendChild(pillar_shown);

      // show public pillars immediatelly
      for(let i = 0; i < public_pillars.length; i++) {
        if(public_pillars[i] && public_pillars[i].test(k)) {
          // same code as when clicking the hidden value
          pillar_hidden.style.display = "none";
          pillar_shown.style.display = "";
          break;
        }
      }

      pillar_hidden.addEventListener("click", function(evt) {
        pillar_hidden.style.display = "none";
        pillar_shown.style.display = "";
      });

      pillar_shown.addEventListener("click", function(evt) {
        pillar_shown.style.display = "none";
        pillar_hidden.style.display = "";
      });

      container.tBodies[0].appendChild(pillar);
    }

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
