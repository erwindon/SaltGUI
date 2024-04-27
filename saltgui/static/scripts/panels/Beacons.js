/* global */

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

    this.nrMinions = 0;

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleBeaconsWheelKeyListAll(pWheelKeyListAllData);
      localBeaconsListPromise.then((pLocalBeaconsListData) => {
        this.updateMinions(pLocalBeaconsListData);
        return true;
      }, (pLocalBeaconsListMsg) => {
        const allMinionsErr = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, JSON.stringify(pLocalBeaconsListMsg));
        this.updateMinions({"return": [allMinionsErr]});
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleBeaconsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      Utils.ignorePromise(localBeaconsListPromise);
      return false;
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
    this.nrMinions = keys.minions.length;
    this.nrUnaccepted = keys.minions_pre.length;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId, 1);

      // preliminary dropdown menu
      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemShowBeacons(menu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        this.router.goTo("beacons-minion", {"minionid": minionId}, undefined, pClickEvent);
        pClickEvent.stopPropagation();
      });
    }

    this.updateFooter();
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("beaconinfo"));
    minionTr.appendChild(Utils.createTd("run-command-button"));
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
      const beaconInfoTd = Utils.createTd();
      Utils.addErrorToTableCell(beaconInfoTd, pMinionData);
      minionTr.appendChild(beaconInfoTd);
    }

    const menu = new DropDownMenu(minionTr, true);
    this._addMenuItemShowBeacons(menu, pMinionId);
  }

  _addMenuItemShowBeacons (pMenu, pMinionId) {
    pMenu.addMenuItem("Show beacons", () => {
      this.router.goTo("beacons-minion", {"minionid": pMinionId});
    });
  }
}
