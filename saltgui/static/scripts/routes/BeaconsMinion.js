import {BeaconsRoute} from './Beacons.js';
import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class BeaconsMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]beaconsminion$", "Beacons", "#page_beaconsminion", "#button_beacons", router);

    this._handleLocalBeaconsList = this._handleLocalBeaconsList.bind(this);

    this.page_element.querySelector("#button_close_beaconsminion").addEventListener("click", _ => {
      this.router.goTo("/beacons");
    });
  }

  onShow() {
    const myThis = this;

    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    const localBeaconsListPromise = this.router.api.getLocalBeaconsList(minion);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localBeaconsListPromise.then(data => {
      myThis._handleLocalBeaconsList(data, minion);
    }, data => {
      myThis._handleLocalBeaconsList(JSON.stringify(data), minion);
    });

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      }, data => {
        myThis._handleRunnerJobsActive(JSON.stringify(data));
      });
    }, data => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(data));
    }); 
  }

  _handleLocalBeaconsList(data, minion) {
    const page = document.getElementById("beaconsminion_page");
    const menu = new DropDownMenu(page);
    this._addMenuItemBeaconDisable(menu, minion);
    this._addMenuItemBeaconEnable(menu, minion);

    const container = document.getElementById("beaconsminion_list");

    // new menu's are always added at the bottom of the div
    // fix that by re-adding the minion list
    page.appendChild(container);

    if(PageRoute.showErrorRowInstead(container.tBodies[0], data)) return;

    const beacons0 = data.return[0][minion];

    const beacons = BeaconsRoute._fixMinion(beacons0);

    if(beacons === undefined) {
      const noBeaconsMsg = Route._createDiv("msg", "Unknown minion '" + minion + "'");
      container.tBodies[0].appendChild(noBeaconsMsg);
      return;
    }
    if(beacons === false) {
      const noBeaconsMsg = Route._createDiv("msg", "Minion '" + minion + "' did not answer");
      container.tBodies[0].appendChild(noBeaconsMsg);
      return;
    }

    const title = document.getElementById("beaconsminion_title");
    let txt = "Beacons on " + minion;
    if(beacons.enabled === false) txt += " (disabled)";
    title.innerText = txt;

    const keys = Object.keys(beacons.beacons).sort();
    for(const k of keys) {
      const tr = document.createElement('tr');

      const name = Route._createTd("beacon_name", k);
      tr.appendChild(name);

      const beacon = beacons.beacons[k];

      // simplify the beacon information
      if("name" in beacon)
        delete beacon.name;
      if(beacon.enabled === true)
        delete beacon.enabled;

      const menu = new DropDownMenu(tr);
      let cmd = "beacons.modify " + k;
      for(const key in beacon) {
        cmd = cmd + " " + key + "=" + JSON.stringify(beacon[key]);
      }
      this._addMenuItemBeaconDisableBeacon(menu, minion, k);
      this._addMenuItemBeaconEnableBeacon(menu, minion, k);

      // menu comes before this data on purpose
      const beacon_value = Output.formatObject(beacon);
      const value = Route._createTd("beacon_value", beacon_value);
      if(beacons.enabled === false) value.classList.add("disabled_beacon");
      if(beacon.enabled === false) value.classList.add("disabled_beacon");
      tr.appendChild(value);

      container.tBodies[0].appendChild(tr);

      // run the command with the original beacon definition
      tr.addEventListener("click", evt => this._runCommand(evt, minion, "beacons.modify " + k + " " + JSON.stringify(beacons0[k])));
    }

    Utils.showTableSortable(this.getPageElement(), "beacons");
    Utils.makeTableSearchable(this.getPageElement(), "beacons");

    if(!keys.length) {
      const noBeaconsMsg = Route._createTd("msg", "No beacons found");
      container.tBodies[0].appendChild(noBeaconsMsg);
    }
  }

  _addMenuItemBeaconDisable(menu, minion) {
    menu.addMenuItem("Disable&nbsp;beacons...", function(evt) {
      this._runCommand(evt, minion, "beacons.disable");
    }.bind(this));
  }

  _addMenuItemBeaconEnable(menu, minion) {
    menu.addMenuItem("Enable&nbsp;beacons...", function(evt) {
      this._runCommand(evt, minion, "beacons.enable");
    }.bind(this));
  }

  _addMenuItemBeaconDisableBeacon(menu, minion, key) {
    menu.addMenuItem("Disable&nbsp;beacon...", function(evt) {
      this._runCommand(evt, minion, "beacons.disable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconEnableBeacon(menu, minion, key) {
    menu.addMenuItem("Enable&nbsp;beacon...", function(evt) {
      this._runCommand(evt, minion, "beacons.enable_beacon " + key);
    }.bind(this));
  }
}
