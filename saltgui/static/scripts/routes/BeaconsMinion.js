import {BeaconsRoute} from './Beacons.js';
import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class BeaconsMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]beaconsminion$", "Beacons", "#page-beacons-minion", "#button-beacons", router);

    this._handleLocalBeaconsList = this._handleLocalBeaconsList.bind(this);

    this.pageElement.querySelector("#beacons-minion-button-close").addEventListener("click", _ => {
      this.router.goTo("/beacons");
    });
  }

  onShow() {
    const myThis = this;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    const localBeaconsListPromise = this.router.api.getLocalBeaconsList(minionId);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localBeaconsListPromise.then(pData => {
      myThis._handleLocalBeaconsList(pData, minionId);
    }, pData => {
      myThis._handleLocalBeaconsList(JSON.stringify(pData), minionId);
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

  _handleLocalBeaconsList(pData, pMinionId) {
    const panel = document.getElementById("beacons-minion-panel");

    const container = document.getElementById("beacons-minion-list");

    if(PageRoute.showErrorRowInstead(container.tBodies[0], pData)) return;

    const beacons0 = pData.return[0][pMinionId];

    const beacons = BeaconsRoute._fixMinion(beacons0);

    const title = document.getElementById("beacons-minion-title");
    let txt = "Beacons on " + pMinionId;
    if(beacons && beacons.enabled === false) txt += " (disabled)";
    title.innerText = txt;

    if(beacons === undefined) {
      const msg = this.pageElement.querySelector("div.minion-list .msg");
      msg.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if(beacons === false) {
      const msg = this.pageElement.querySelector("div.minion-list .msg");
      msg.innerText = "Minion '" + pMinionId + "' did not answer";
      return;
    }

    const menu = new DropDownMenu(panel);
    this._addMenuItemBeaconsDisableWhenNeeded(menu, pMinionId, beacons);
    this._addMenuItemBeaconsEnableWhenNeeded(menu, pMinionId, beacons);
    this._addMenuItemBeaconsAdd(menu, pMinionId);
    this._addMenuItemBeaconsReset(menu, pMinionId);
    this._addMenuItemBeaconsSave(menu, pMinionId);

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    panel.insertBefore(menu.menuDropdown, title.nextSibling);

    const keys = Object.keys(beacons.beacons).sort();
    for(const k of keys) {
      const tr = document.createElement('tr');

      const name = Route._createTd("beacon-name", k);
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
      this._addMenuItemBeaconsDisableBeaconWhenNeeded(menu, pMinionId, k, beacon);
      this._addMenuItemBeaconsEnableBeaconWhenNeeded(menu, pMinionId, k, beacon);
      this._addMenuItemBeaconsDelete(menu, pMinionId, k);

      // menu comes before this data on purpose
      const beacon_config = Output.formatObject(beacon);
      const beaconValueTd = Route._createTd("beacon-config", beacon_config);
      if(beacons.enabled === false) beaconValueTd.classList.add("beacon-disabled");
      if(beacon.enabled === false) beaconValueTd.classList.add("beacon-disabled");
      tr.appendChild(beaconValueTd);

      const beacon_value = Route._createTd("beacon-value", "(waiting)");
      beacon_value.classList.add("beacon-waiting");
      tr.appendChild(beacon_value);

      container.tBodies[0].appendChild(tr);

      // run the command with the original beacon definition
      tr.addEventListener("click", evt => this._runCommand(evt, pMinionId, "beacons.modify " + k + " " + JSON.stringify(beacons0[k])));
    }

    Utils.addTableHelp(this.getPageElement(), "The content of column 'Value'\nis automatically refreshed");
    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msg = this.pageElement.querySelector("div.minion-list .msg");
    txt = Utils.txtZeroOneMany(keys.length,
      "No beacons", "{0} beacon", "{0} beacons");
    msg.innerText = txt;
  }

  _addMenuItemBeaconsDisableWhenNeeded(pMenu, pMinionId, beacons) {
    if(beacons.enabled === false) return;
    pMenu.addMenuItem("Disable&nbsp;beacons...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.disable");
    }.bind(this));
  }

  _addMenuItemBeaconsEnableWhenNeeded(pMenu, pMinionId, beacons) {
    if(beacons.enabled !== false) return;
    pMenu.addMenuItem("Enable&nbsp;beacons...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.enable");
    }.bind(this));
  }

  _addMenuItemBeaconsAdd(pMenu, pMinionId) {
    pMenu.addMenuItem("Add&nbsp;beacon...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.add <name> <data>");
    }.bind(this));
  }

  _addMenuItemBeaconsReset(pMenu, pMinionId) {
    pMenu.addMenuItem("Reset&nbsp;beacons...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.reset");
    }.bind(this));
  }

  _addMenuItemBeaconsSave(pMenu, pMinionId) {
    pMenu.addMenuItem("Save&nbsp;beacons...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.save");
    }.bind(this));
  }

  _addMenuItemBeaconsDisableBeaconWhenNeeded(pMenu, pMinionId, key, beacon) {
    if(beacon.enabled === false) return;
    pMenu.addMenuItem("Disable&nbsp;beacon...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.disable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconsEnableBeaconWhenNeeded(pMenu, pMinionId, key, beacon) {
    if(beacon.enabled !== false) return;
    pMenu.addMenuItem("Enable&nbsp;beacon...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.enable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconsDelete(pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;beacon...", function(evt) {
      this._runCommand(evt, pMinionId, "beacons.delete " + key);
    }.bind(this));
  }

  handleSaltBeaconEvent(pTag, pData) {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
    const prefix = "salt/beacon/" + minionId + "/";
    if(!pTag.startsWith(prefix)) return;
    const table = document.getElementById("beacons-minion-list");
    let name = pTag.substring(prefix.length);
    if(name.endsWith("/")) name = name.substring(0, name.length-1);
    for(const row of table.tBodies[0].rows) {
      if(row.getElementsByTagName("td")[0].innerText !== name) continue;
      let txt = "";
      if(pData["_stamp"]) {
        txt += Output.dateTimeStr(pData["_stamp"]) + "\n";
        delete pData["_stamp"];
      }
      if(pData["id"] === minionId) {
        delete pData["id"];
      }
      txt += Output.formatObject(pData);
      const td = row.getElementsByTagName("td")[3];
      td.classList.remove("beacon-waiting");
      td.innerText = txt;
      break;
    }
  }
}
