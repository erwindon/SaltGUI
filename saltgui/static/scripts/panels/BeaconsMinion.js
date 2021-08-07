/* global document */

import {BeaconsPanel} from "./Beacons.js";
import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class BeaconsMinionPanel extends Panel {

  constructor () {
    super("beacons-minion");

    this.addTitle("Beacons on ...");
    this.addPanelMenu();
    this._addPanelMenuItemBeaconsDisableWhenNeeded();
    this._addPanelMenuItemBeaconsEnableWhenNeeded();
    this._addPanelMenuItemBeaconsAdd();
    this._addPanelMenuItemBeaconsReset();
    this._addPanelMenuItemBeaconsSave();
    this.addSearchButton();
    this.addPlayPauseButton("play");
    this.addCloseButton();
    this.addHelpButton([
      "The content of column 'Value' is automatically refreshed",
      "The content of column 'Config' is simplified to reduce its formatted size",
      "Note that some beacons produce multiple values, e.g. one per disk",
      "In that case, effectively only one of the values is visible here"
    ]);
    this.addTable(["Name", "-menu-", "Config", "Value", "-help-"]);
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

    const beaconsListAvailable = Utils.getStorageItem("session", "beacons_list_available");
    if (!beaconsListAvailable) {
      // yes, we want the list from *all* minions
      const localBeaconsListAvailablePromise = this.api.getLocalBeaconsListAvailable(null);

      localBeaconsListAvailablePromise.then((pLocalBeaconsListAvailableData) => {
        BeaconsMinionPanel._handleBeaconsListAvailable(pLocalBeaconsListAvailableData);
        return true;
      }, (pLocalBeaconsListAvailableMsg) => {
        // pretend nothing is available
        console.log("cannot retrieve beacons.list_available:", pLocalBeaconsListAvailableMsg);
        Utils.setStorageItem("session", "beacons_list_available", "{cnt: 0}");
        return false;
      });
    }
  }

  static _handleBeaconsListAvailable (pLocalBeaconsListAvailableData) {
    const allBeacons = {"_cnt": 0, "_offline": 0};
    const localBeaconsListAvailableData = pLocalBeaconsListAvailableData.return[0];
    // pretend that there is only one list of known beacons
    for (const minionId in localBeaconsListAvailableData) {
      if (typeof localBeaconsListAvailableData[minionId] !== "object") {
        // unavailable minions result in "false"
        allBeacons["_offline"] += 1;
        continue;
      }
      allBeacons["_cnt"] += 1;
      for (const beaconId of localBeaconsListAvailableData[minionId]) {
        if (beaconId in allBeacons) {
          allBeacons[beaconId] += 1;
        } else {
          allBeacons[beaconId] = 1;
        }
      }
    }
    const allBeaconsStr = JSON.stringify(allBeacons);
    Utils.setStorageItem("session", "beacons_list_available", allBeaconsStr);
  }

  updateFooter () {
    // update the footer
    const tbody = this.table.tBodies[0];
    let txt = Utils.txtZeroOneMany(tbody.rows.length,
      "No beacons", "{0} beacon", "{0} beacons");

    if (this.playOrPause === "pause") {
      txt += ", press '" + Character.CH_PLAY_MONO + "' to continue";
    }

    this.setMsg(txt, true);
  }

  _handleLocalBeaconsList (pLocalBeaconsListData, pMinionId) {
    if (this.showErrorRowInstead(pLocalBeaconsListData, pMinionId)) {
      return;
    }

    const beacons0 = pLocalBeaconsListData.return[0][pMinionId];

    const beacons = BeaconsPanel.fixBeaconsMinion(beacons0);

    this.beaconsEnabled = beacons.enabled;

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

    const keys = Object.keys(beacons.beacons).sort();
    for (const beaconName of keys) {
      const tr = document.createElement("tr");
      tr.id = "beacon-" + beaconName;

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
      this._addMenuItemBeaconsDisableBeaconWhenNeeded(beaconMenu, pMinionId, beaconName, beacon);
      this._addMenuItemBeaconsEnableBeaconWhenNeeded(beaconMenu, pMinionId, beaconName, beacon);
      this._addMenuItemBeaconsDelete(beaconMenu, pMinionId, beaconName);

      // menu comes before this data on purpose
      const beaconConfig = Output.formatObject(beacon);
      const beaconConfigTd = Utils.createTd("beacon-config", beaconConfig);
      let initialValue = "";
      if (beacons.enabled === false) {
        beaconConfigTd.classList.add("beacon-disabled");
        initialValue += "\n(beacons" + Character.NO_BREAK_SPACE + "disabled)";
      }
      if (beacon.enabled === false) {
        beaconConfigTd.classList.add("beacon-disabled");
        initialValue += "\n(beacon" + Character.NO_BREAK_SPACE + "disabled)";
      }
      tr.appendChild(beaconConfigTd);

      if (initialValue === "") {
        initialValue = "(waiting)";
      }
      initialValue = initialValue.trim();
      const beaconValueTd = Utils.createTd("beacon-value", initialValue);
      beaconValueTd.classList.add("beacon-waiting");
      tr.appendChild(beaconValueTd);

      const tbody = this.table.tBodies[0];
      tbody.appendChild(tr);

      // run the command with the original beacon definition
      tr.addEventListener("click", (pClickEvent) => {
        const beacon0 = beacons0[beaconName];
        this.runCommand(pClickEvent, pMinionId, ["beacons.modify", beaconName, beacon0]);
      });

      const helpButtonTd = Utils.createTd("help-button");
      const helpButtonSpan = Utils.createSpan("nearly-visible-button", "", this.key + "-" + beaconName + "-help-button");
      helpButtonSpan.innerText = Character.WARNING_SIGN;
      helpButtonSpan.style.display = "none";
      helpButtonSpan.style.cursor = "help";
      helpButtonTd.appendChild(helpButtonSpan);
      tr.helpButtonSpan = helpButtonSpan;
      tr.appendChild(helpButtonTd);
    }

    this.updateFooter();
  }

  _addPanelMenuItemBeaconsDisableWhenNeeded () {
    this.panelMenu.addMenuItem(() => {
      if (!this.beaconsEnabled) {
        return null;
      }
      return "Disable beacons...";
    }, (pClickEvent) => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      this.runCommand(pClickEvent, minionId, ["beacons.disable"]);
    });
  }

  _addPanelMenuItemBeaconsEnableWhenNeeded () {
    this.panelMenu.addMenuItem(() => {
      if (this.beaconsEnabled) {
        return null;
      }
      return "Enable beacons...";
    }, (pClickEvent) => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      this.runCommand(pClickEvent, minionId, ["beacons.enable"]);
    });
  }

  _addPanelMenuItemBeaconsAdd () {
    this.panelMenu.addMenuItem("Add beacon...", (pClickEvent) => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      this.runCommand(pClickEvent, minionId, ["beacons.add", "<name>", "<data>"]);
    });
  }

  _addPanelMenuItemBeaconsReset () {
    this.panelMenu.addMenuItem("Reset beacons...", (pClickEvent) => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      this.runCommand(pClickEvent, minionId, ["beacons.reset"]);
    });
  }

  _addPanelMenuItemBeaconsSave () {
    this.panelMenu.addMenuItem("Save beacons...", (pClickEvent) => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      this.runCommand(pClickEvent, minionId, ["beacons.save"]);
    });
  }

  _addMenuItemBeaconsDisableBeaconWhenNeeded (pMenu, pMinionId, key, beacon) {
    if (beacon.enabled === false) {
      return;
    }
    pMenu.addMenuItem("Disable beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, ["beacons.disable_beacon", key]);
    });
  }

  _addMenuItemBeaconsEnableBeaconWhenNeeded (pMenu, pMinionId, key, beacon) {
    if (beacon.enabled !== false) {
      return;
    }
    pMenu.addMenuItem("Enable beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, ["beacons.enable_beacon", key]);
    });
  }

  _addMenuItemBeaconsDelete (pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete beacon...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, ["beacons.delete", key]);
    });
  }

  handleSaltBeaconEvent (pTag, pData) {
    if (this.playOrPause !== "play") {
      return;
    }

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
    const prefix = "salt/beacon/" + minionId + "/";
    if (!pTag.startsWith(prefix)) {
      return;
    }
    let beaconName = pTag.substring(prefix.length);
    beaconName = beaconName.replace(/[/].*/, "");

    const tr = document.getElementById("beacon-" + beaconName);
    if (tr === null) {
      // beacon was unknown when the screen was created
      return;
    }

    let txt = "";
    let stamp = "";
    if (pData["_stamp"]) {
      // keep timestamp for further logic
      stamp = pData["_stamp"];
      txt += Output.dateTimeStr(stamp) + "\n";
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
    const td = tr.getElementsByTagName("td")[3];
    td.classList.remove("beacon-waiting");

    // round down to 0.1 second
    // secondary events are close, but rarely exact on the same time
    // original: yyyy-mm-ddThh:mm:ss.ssssss
    stamp = stamp.substr(0, 21);

    // when the warning-line has been shown, then from then on,
    // show an empty line when there is no warning.
    // this prevents a jumpy screen, while preserving space with
    // tags that are never affected.
    // See also: https://github.com/saltstack/salt/issues/57174
    let helpText = null;
    if (td.prevStamp && td.prevStamp !== stamp) {
      // event has a different timestamp
      // normal situation, no reason for panic
    } else if (td.prevTag && td.prevTag !== pTag) {
      helpText = "Multiple events seen with same timestamp, but different tag\nThis usually means that there is more data than can be seen here\nThere may e.g. be more than one disk or networkinterface\nBut only the most recently reported one is actually shown";
    } else if (td.prevData && td.prevData !== pData) {
      helpText = "Multiple events seen with same timestamp, same tag, but different data\nThis usually means that there is more data than can be seen here\nThere may e.g. be more than one disk or networkinterface\nBut only the most recently reported one is actually shown";
    } else {
      // duplicate of previous event, never mind for now
    }

    const searchBlock = this.div.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, this.table, "refresh");

    if (helpText) {
      Utils.addToolTip(tr.helpButtonSpan, helpText, "bottom-right");
      tr.helpButtonSpan.style.display = "";
    } else {
      tr.helpButtonSpan.style.display = "none";
    }

    td.innerText = txt;

    td.prevStamp = stamp;
    td.prevTag = pTag;
    td.prevData = pData;
  }
}
