/* global document */

import {BeaconsPanel} from "./Beacons.js";
import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class BeaconsMinionPanel extends Panel {

  constructor () {
    super("beacons-minion");

    this.addTitle("Beacons on ...");
    this.addPanelMenu();
    this.addSearchButton();
    this.addHelpButton("The content of column 'Value' is automatically refreshed\nNote that some beacons produce multiple values, e.g. one per disk.\nIn that case, effectively only one of the values is visible here.");
    this.addCloseButton();
    this.addTable(["Name", "Config", "Value", "-val-"]);
    this.setTableSortable("Name", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    // preliminary title
    this.updateTitle("Beacons on " + minionId);

    const localBeaconsListPromise = this.api.getLocalBeaconsList(minionId);

    localBeaconsListPromise.then((pLocalBeaconsListData) => {
      this._handleLocalBeaconsList(pLocalBeaconsListData, minionId);
      return true;
    }, (pLocalBeaconsListMsg) => {
      this._handleLocalBeaconsList(JSON.stringify(pLocalBeaconsListMsg), minionId);
      return false;
    });
  }

  _handleLocalBeaconsList (pLocalBeaconsListData, pMinionId) {
    if (this.showErrorRowInstead(pLocalBeaconsListData)) {
      return;
    }

    const beacons0 = pLocalBeaconsListData.return[0][pMinionId];

    const beacons = BeaconsPanel.fixBeaconsMinion(beacons0);

    if (beacons && beacons.enabled === false) {
      this.updateTitle("Beacons on " + pMinionId + " (disabled)");
    }

    if (beacons === undefined) {
      this.setMsg("Unknown minion '" + pMinionId + "'");
      return;
    }
    if (beacons === false) {
      this.setMsg("Minion '" + pMinionId + "' did not answer");
      return;
    }

    this._addMenuItemBeaconsDisableWhenNeeded(pMinionId, beacons);
    this._addMenuItemBeaconsEnableWhenNeeded(pMinionId, beacons);
    this._addMenuItemBeaconsAdd(pMinionId);
    this._addMenuItemBeaconsReset(pMinionId);
    this._addMenuItemBeaconsSave(pMinionId);

    const keys = Object.keys(beacons.beacons).sort();
    for (const beaconName of keys) {
      const tr = document.createElement("tr");

      const nameTd = Utils.createTd("beacon-name", beaconName);
      tr.appendChild(nameTd);

      const beacon = beacons.beacons[beaconName];

      // simplify the beacon information
      if ("name" in beacon) {
        delete beacon.name;
      }
      if (beacon.enabled === true) {
        delete beacon.enabled;
      }

      const beaconMenu = new DropDownMenu(tr);
      let cmd = "beacons.modify " + beaconName;
      for (const key in beacon) {
        cmd = cmd + " " + key + "=" + JSON.stringify(beacon[key]);
      }
      this._addMenuItemBeaconsDisableBeaconWhenNeeded(beaconMenu, pMinionId, beaconName, beacon);
      this._addMenuItemBeaconsEnableBeaconWhenNeeded(beaconMenu, pMinionId, beaconName, beacon);
      this._addMenuItemBeaconsDelete(beaconMenu, pMinionId, beaconName);

      // menu comes before this data on purpose
      const beaconConfig = Output.formatObject(beacon);
      const beaconConfigTd = Utils.createTd("beacon-config", beaconConfig);
      if (beacons.enabled === false) {
        beaconConfigTd.classList.add("beacon-disabled");
      } else if (beacon.enabled === false) {
        beaconConfigTd.classList.add("beacon-disabled");
      }
      tr.appendChild(beaconConfigTd);

      const beaconValueTd = Utils.createTd("beacon-value", "(waiting)");
      beaconValueTd.classList.add("beacon-waiting");
      tr.appendChild(beaconValueTd);

      const tbody = this.table.tBodies[0];
      tbody.appendChild(tr);

      // run the command with the original beacon definition
      tr.addEventListener("click", (pClickEvent) => {
        this.runCommand(pClickEvent, pMinionId, "beacons.modify " + beaconName + " " + JSON.stringify(beacons0[beaconName]));
      });
    }

    const txt = Utils.txtZeroOneMany(keys.length,
      "No beacons", "{0} beacon", "{0} beacons");
    this.setMsg(txt);
  }

  _addMenuItemBeaconsDisableWhenNeeded (pMinionId, beacons) {
    if (beacons.enabled === false) {
      return;
    }
    this.panelMenu.addMenuItem("Disable&nbsp;beacons...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.disable");
    });
  }

  _addMenuItemBeaconsEnableWhenNeeded (pMinionId, beacons) {
    if (beacons.enabled !== false) {
      return;
    }
    this.panelMenu.addMenuItem("Enable&nbsp;beacons...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.enable");
    });
  }

  _addMenuItemBeaconsAdd (pMinionId) {
    this.panelMenu.addMenuItem("Add&nbsp;beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.add <name> <data>");
    });
  }

  _addMenuItemBeaconsReset (pMinionId) {
    this.panelMenu.addMenuItem("Reset&nbsp;beacons...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.reset");
    });
  }

  _addMenuItemBeaconsSave (pMinionId) {
    this.panelMenu.addMenuItem("Save&nbsp;beacons...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.save");
    });
  }

  _addMenuItemBeaconsDisableBeaconWhenNeeded (pMenu, pMinionId, key, beacon) {
    if (beacon.enabled === false) {
      return;
    }
    pMenu.addMenuItem("Disable&nbsp;beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.disable_beacon " + key);
    });
  }

  _addMenuItemBeaconsEnableBeaconWhenNeeded (pMenu, pMinionId, key, beacon) {
    if (beacon.enabled !== false) {
      return;
    }
    pMenu.addMenuItem("Enable&nbsp;beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.enable_beacon " + key);
    });
  }

  _addMenuItemBeaconsDelete (pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "beacons.delete " + key);
    });
  }

  handleSaltBeaconEvent (pTag, pData) {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
    const prefix = "salt/beacon/" + minionId + "/";
    if (!pTag.startsWith(prefix)) {
      return;
    }
    let beaconName = pTag.substring(prefix.length);
    beaconName = beaconName.replace(/[/].*/, "");
    for (const row of this.table.tBodies[0].rows) {
      if (row.getElementsByTagName("td")[0].innerText !== beaconName) {
        continue;
      }
      let txt = "";
      if (pData["_stamp"]) {
        txt += Output.dateTimeStr(pData["_stamp"]) + "\n";
        delete pData["_stamp"];
      }
      if (pTag !== prefix + beaconName + "/") {
        // Show the tag when it has extra information
        txt += pTag + "\n";
      }
      if (pData["id"] === minionId) {
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
