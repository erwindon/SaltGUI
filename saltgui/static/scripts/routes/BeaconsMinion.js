import {BeaconsRoute} from './Beacons.js';
import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class BeaconsMinionRoute extends PageRoute {

  constructor(pRouter) {
    super("beacons-minion", "Beacons", "#page-beacons-minion", "#button-beacons", pRouter);

    this._handleLocalBeaconsList = this._handleLocalBeaconsList.bind(this);

    const closeButton = this.pageElement.querySelector("#beacons-minion-button-close");
    closeButton.addEventListener("click", pClickEvent =>
      this.router.goTo("/beacons")
    );

    Utils.addTableHelp(this.getPageElement(), "The content of column 'Value' is automatically refreshed\nNote that some beacons produce multiple values, e.g. one per disk.\nIn that case, effectively only one of the values is visible here.");
    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement(), "beacons-minion-search-button", "beacons-minion-table");
    Utils.makeTableSearchable(this.getPageElement(), "beacons-minion-search-button-jobs", "beacons-minion-jobs-table");
  }

  onShow() {
    const myThis = this;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    const localBeaconsListPromise = this.router.api.getLocalBeaconsList(minionId);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localBeaconsListPromise.then(pLocalBeaconsListData => {
      myThis._handleLocalBeaconsList(pLocalBeaconsListData, minionId);
    }, pLocalBeaconsListMsg => {
      myThis._handleLocalBeaconsList(JSON.stringify(pLocalBeaconsListMsg), minionId);
    });

    runnerJobsListJobsPromise.then(pRunnerJobsListJobsData => {
      myThis.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then(pRunnerJobsActiveData => {
        myThis.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, pRunnerJobsActiveMsg => {
        myThis.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, pRunnerJobsListJobsMsg => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    }); 
  }

  _handleLocalBeaconsList(pLocalBeaconsListData, pMinionId) {
    const panel = document.getElementById("beacons-minion-panel");

    const container = document.getElementById("beacons-minion-table");

    if(PageRoute.showErrorRowInstead(container.tBodies[0], pLocalBeaconsListData)) return;

    const beacons0 = pLocalBeaconsListData.return[0][pMinionId];

    const beacons = BeaconsRoute.fixBeaconsMinion(beacons0);

    const titleElement = document.getElementById("beacons-minion-title");
    let txt = "Beacons on " + pMinionId;
    if(beacons && beacons.enabled === false) txt += " (disabled)";
    titleElement.innerText = txt;

    if(beacons === undefined) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if(beacons === false) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Minion '" + pMinionId + "' did not answer";
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
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);

    const keys = Object.keys(beacons.beacons).sort();
    for(const k of keys) {
      const tr = document.createElement('tr');

      const nameTd = Route.createTd("beacon-name", k);
      tr.appendChild(nameTd);

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
      const beaconConfig = Output.formatObject(beacon);
      const beaconConfigTd = Route.createTd("beacon-config", beaconConfig);
      if(beacons.enabled === false) beaconConfigTd.classList.add("beacon-disabled");
      if(beacon.enabled === false) beaconConfigTd.classList.add("beacon-disabled");
      tr.appendChild(beaconConfigTd);

      const beaconValueTd = Route.createTd("beacon-value", "(waiting)");
      beaconValueTd.classList.add("beacon-waiting");
      tr.appendChild(beaconValueTd);

      container.tBodies[0].appendChild(tr);

      // run the command with the original beacon definition
      tr.addEventListener("click", pClickEvent =>
        this.runCommand(pClickEvent, pMinionId, "beacons.modify " + k + " " + JSON.stringify(beacons0[k]))
      );
    }

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    txt = Utils.txtZeroOneMany(keys.length,
      "No beacons", "{0} beacon", "{0} beacons");
    msgDiv.innerText = txt;
  }

  _addMenuItemBeaconsDisableWhenNeeded(pMenu, pMinionId, beacons) {
    if(beacons.enabled === false) return;
    pMenu.addMenuItem("Disable&nbsp;beacons...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.disable");
    }.bind(this));
  }

  _addMenuItemBeaconsEnableWhenNeeded(pMenu, pMinionId, beacons) {
    if(beacons.enabled !== false) return;
    pMenu.addMenuItem("Enable&nbsp;beacons...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.enable");
    }.bind(this));
  }

  _addMenuItemBeaconsAdd(pMenu, pMinionId) {
    pMenu.addMenuItem("Add&nbsp;beacon...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.add <name> <data>");
    }.bind(this));
  }

  _addMenuItemBeaconsReset(pMenu, pMinionId) {
    pMenu.addMenuItem("Reset&nbsp;beacons...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.reset");
    }.bind(this));
  }

  _addMenuItemBeaconsSave(pMenu, pMinionId) {
    pMenu.addMenuItem("Save&nbsp;beacons...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.save");
    }.bind(this));
  }

  _addMenuItemBeaconsDisableBeaconWhenNeeded(pMenu, pMinionId, key, beacon) {
    if(beacon.enabled === false) return;
    pMenu.addMenuItem("Disable&nbsp;beacon...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.disable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconsEnableBeaconWhenNeeded(pMenu, pMinionId, key, beacon) {
    if(beacon.enabled !== false) return;
    pMenu.addMenuItem("Enable&nbsp;beacon...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.enable_beacon " + key);
    }.bind(this));
  }

  _addMenuItemBeaconsDelete(pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;beacon...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "beacons.delete " + key);
    }.bind(this));
  }

  handleSaltBeaconEvent(pTag, pData) {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
    const prefix = "salt/beacon/" + minionId + "/";
    if(!pTag.startsWith(prefix)) return;
    const table = document.getElementById("beacons-minion-table");
    let beaconName = pTag.substring(prefix.length);
    beaconName = beaconName.replace(/[/].*/, "");
    for(const row of table.tBodies[0].rows) {
      if(row.getElementsByTagName("td")[0].innerText !== beaconName) continue;
      let txt = "";
      if(pData["_stamp"]) {
        txt += Output.dateTimeStr(pData["_stamp"]) + "\n";
        delete pData["_stamp"];
      }
      if(pTag !== prefix + beaconName + "/") {
        // Show the tag when it has extra information
        txt += pTag + "\n";
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
