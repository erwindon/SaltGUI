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

    const container = document.getElementById("beaconsminion_list");

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

    const menu = new DropDownMenu(page);
    this._addMenuItemBeaconsDisableWhenNeeded(menu, minion, beacons);
    this._addMenuItemBeaconsEnableWhenNeeded(menu, minion, beacons);
    this._addMenuItemBeaconsAdd(menu, minion);
    this._addMenuItemBeaconsReset(menu, minion);
    this._addMenuItemBeaconsSave(menu, minion);

    // new menu's are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    page.insertBefore(menu.menuDropdown, title.nextSibling);

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
      this._addMenuItemBeaconsDisableBeaconWhenNeeded(menu, minion, k, beacon);
      this._addMenuItemBeaconsEnableBeaconWhenNeeded(menu, minion, k, beacon);
      this._addMenuItemBeaconsDelete(menu, minion, k);

      // menu comes before this data on purpose
      const beacon_config = Output.formatObject(beacon);
      const value = Route._createTd("beacon_config", beacon_config);
      if(beacons.enabled === false) value.classList.add("disabled_beacon");
      if(beacon.enabled === false) value.classList.add("disabled_beacon");
      tr.appendChild(value);

      const beacon_value = Route._createTd("beacon_value", "(waiting)");
      beacon_value.classList.add("waiting");
      tr.appendChild(beacon_value);

      container.tBodies[0].appendChild(tr);

      // run the command with the original beacon definition
      tr.addEventListener("click", evt => this._runCommand(evt, minion, "beacons.modify " + k + " " + JSON.stringify(beacons0[k])));
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msg = this.page_element.querySelector("div.minion-list .msg");
    txt = Utils.txtZeroOneMany(keys.length,
      "No beacons", "{0} beacon", "{0} beacons");
    msg.innerText = txt;
  }

  _addMenuItemBeaconsDisableWhenNeeded(menu, minion, beacons) {
    if(beacons.enabled === false) return;
    menu.addMenuItem("Disable&nbsp;beacons...", function(evt) {
      this._runCommand(evt, minion, "beacons.disable");
    }.bind(this));
  }

  _addMenuItemBeaconsEnableWhenNeeded(menu, minion, beacons) {
    if(beacons.enabled !== false) return;
    menu.addMenuItem("Enable&nbsp;beacons...", function(evt) {
      this._runCommand(evt, minion, "beacons.enable");
    }.bind(this));
  }

  _addMenuItemBeaconsAdd(menu, minion) {
    menu.addMenuItem("Add&nbsp;beacon...", function(evt) {
      this._runCommand(evt, minion, "beacons.add <name> <data>");
    }.bind(this));
  }

  _addMenuItemBeaconsReset(menu, minion) {
    menu.addMenuItem("Reset&nbsp;beacons...", function(evt) {
      this._runCommand(evt, minion, "beacons.reset");
    }.bind(this));
  }

  _addMenuItemBeaconsSave(menu, minion) {
    menu.addMenuItem("Save&nbsp;beacons...", function(evt) {
      this._runCommand(evt, minion, "beacons.save");
    }.bind(this));
  }

  _addMenuItemBeaconsDisableBeaconWhenNeeded(menu, minion, key, beacon) {
    if(beacon.enabled === false) return;
    menu.addMenuItem("Disable&nbsp;beacon...", function(evt) {
      this._runCommand(evt, minion, "beacons.disable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconsEnableBeaconWhenNeeded(menu, minion, key, beacon) {
    if(beacon.enabled !== false) return;
    menu.addMenuItem("Enable&nbsp;beacon...", function(evt) {
      this._runCommand(evt, minion, "beacons.enable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconsDelete(menu, minion, key) {
    menu.addMenuItem("Delete&nbsp;beacon...", function(evt) {
      this._runCommand(evt, minion, "beacons.delete " + key);
    }.bind(this));
  }

  handleSaltBeaconEvent(tag, data) {
    const minion = decodeURIComponent(Utils.getQueryParam("minion"));
    const prefix = "salt/beacon/" + minion + "/";
    if(!tag.startsWith(prefix)) return;
    const table = document.getElementById("beaconsminion_list");
    let name = tag.substring(prefix.length);
    if(name.endsWith("/")) name = name.substring(0, name.length-1);
    for(const row of table.tBodies[0].rows) {
      if(row.getElementsByTagName("td")[0].innerText !== name) continue;
      let txt = "";
      if(data["_stamp"]) {
        txt += Output.dateTimeStr(data["_stamp"]) + "\n";
        delete data["_stamp"];
      }
      if(data["id"] === minion) {
        delete data["id"];
      }
      txt += Output.formatObject(data);
      const td = row.getElementsByTagName("td")[3];
      td.classList.remove("waiting");
      td.innerText = txt;
      break;
    }
  }
}
