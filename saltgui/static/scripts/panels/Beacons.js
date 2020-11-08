/* global config window */

import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class BeaconsPanel extends Panel {

  constructor () {
    super("beacons");

    this.addTitle("Beacons");
    this.addSearchButton();
    this.addTable(["Minion", "Status", "Beacons", "-menu-"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localBeaconsListPromise = this.api.getLocalBeaconsList(null);

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleBeaconsWheelKeyListAll(pWheelKeyListAllData);
      localBeaconsListPromise.then((pLocalBeaconsListData) => {
        this.updateMinions(pLocalBeaconsListData);
        return true;
      }, (pLocalBeaconsListMsg) => {
        const localBeaconsListData = {"return": [{}]};
        for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
          localBeaconsListData.return[0][minionId] = JSON.stringify(pLocalBeaconsListMsg);
        }
        this.updateMinions(localBeaconsListData);
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleBeaconsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      return true;
    });
  }

  static fixBeaconsMinion (pData) {
    if (typeof pData !== "object") {
      return pData;
    }

    // the data is an array of objects
    // where each object has one key
    // re-create as a normal object

    const ret = {"beacons": {}, "enabled": true};

    for (const beaconName in pData) {
      // correct for empty list that returns this dummy value
      if (beaconName === "beacons" && JSON.stringify(pData[beaconName]) === "{}") {
        continue;
      }

      // "enabled" is always a boolean (when present)
      if (beaconName === "enabled") {
        ret.enabled = pData.enabled;
        continue;
      }

      // make one object from the settings
      // eliminates one layer in the datamodel
      // and looks much better
      const newData = {};
      for (const elem of pData[beaconName]) {
        for (const valueKey in elem) {
          newData[valueKey] = elem[valueKey];
        }
      }
      ret.beacons[beaconName] = newData;
    }

    return ret;
  }

  _handleBeaconsWheelKeyListAll (pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelKeyListAllData)) {
      return;
    }

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(minionId, 1);

      // preliminary dropdown menu
      const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      BeaconsPanel._addMenuItemShowBeacons(menu, minionId);

      minionTr.addEventListener("click", () => {
        window.location.assign(config.NAV_URL + "/beacons-minion?minionid=" + encodeURIComponent(minionId));
      });
    }

    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    this.setMsg(txt);
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("beaconinfo", ""));
    minionTr.appendChild(Utils.createTd("run-command-button", ""));
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {

    pMinionData = BeaconsPanel.fixBeaconsMinion(pMinionData);

    super.updateMinion(null, pMinionId, pAllMinionsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    if (typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData.beacons).length;
      let beaconInfoText = Utils.txtZeroOneMany(cnt,
        "no beacons", "{0} beacon", "{0} beacons");
      if (!pMinionData.enabled) {
        beaconInfoText += " (disabled)";
      }
      const beaconInfoTd = Utils.createTd("beaconinfo", beaconInfoText);
      beaconInfoTd.setAttribute("sorttable_customkey", cnt);
      minionTr.appendChild(beaconInfoTd);
    } else {
      const beaconInfoTd = Utils.createTd("", "");
      Utils.addErrorToTableCell(beaconInfoTd, pMinionData);
      minionTr.appendChild(beaconInfoTd);
    }

    const menu = new DropDownMenu(minionTr);
    BeaconsPanel._addMenuItemShowBeacons(menu, pMinionId);

    minionTr.addEventListener("click", () => {
      window.location.assign(config.NAV_URL + "/beacons-minion?minionid=" + encodeURIComponent(pMinionId));
    });
  }

  static _addMenuItemShowBeacons (pMenu, pMinionId) {
    pMenu.addMenuItem("Show beacons", () => {
      window.location.assign(config.NAV_URL + "/beacons-minion?minionid=" + encodeURIComponent(pMinionId));
    });
  }
}
