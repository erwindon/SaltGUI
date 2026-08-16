/* global */

import {Issues} from "./Issues.js";

export class BeaconsIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "BEACONS");

    const localBeaconsListPromise = this.api.getLocalBeaconsList(null);

    localBeaconsListPromise.then((ok_LocalBeaconsList) => {
      this.removeCategory("disabled-beacons");
      this.removeCategory("disabled-beacon");
      this.removeCategory("offline");
      this._handleLocalBeaconsList(ok_LocalBeaconsList);
      this.readyCategory(pPanel, "disabled-beacons", msg);
      this.readyCategory(pPanel, "disabled-beacon", msg);
      this.readyCategory(pPanel, "offline", msg);
      return true;
    }, (_error_LocalBeaconsList) => {
      this.removeCategory("disabled-beacons");
      this.setIssueMsg("disabled-beacons", "retrieving", "Could not retrieve list of beacon schedulers");
      this.setIssueErr("disabled-beacons", "retrieving", _error_LocalBeaconsList);
      this.removeCategory("disabled-beacon");
      this.setIssueMsg("disabled-beacon", "retrieving", "Could not retrieve list of beacons");
      this.setIssueErr("disabled-beacon", "retrieving", _error_LocalBeaconsList);
      this.readyCategory(pPanel, "disabled-beacons", msg);
      this.readyCategory(pPanel, "disabled-beacon", msg);
      return false;
    });

    return localBeaconsListPromise;
  }

  static _simplify (beaconData) {
    if (typeof beaconData === "object" && Array.isArray(beaconData)) {
      // beacon data is strange
      // it comes in an array of objects
      let newBeaconData = {};
      for (const beaconDataItem of beaconData) {
        newBeaconData = Object.assign(newBeaconData, beaconDataItem);
      }
      return newBeaconData;
    }
    return beaconData;
  }

  _handleLocalBeaconsList (pLocalBeaconsListData) {
    const allBeacons = pLocalBeaconsListData.return[0];
    for (const minionId in allBeacons) {
      const minionData = allBeacons[minionId];

      if (!minionData) {
        this._handleOfflineMinion(minionId);
        continue;
      }

      this._handleMinionBeacons(minionId, minionData);
    }
  }

  _handleOfflineMinion (pMinionId) {
    this.setIssueMsg("offline", pMinionId, "Minion '" + pMinionId + "' is offline");
  }

  _handleMinionBeacons (pMinionId, pMinionData) {
    for (const beaconName in pMinionData) {
      if (beaconName === "enabled") {
        // beacons flag
        this._handleDisabledBeacons(pMinionId, pMinionData);
      } else {
        this._handleDisabledBeacon(pMinionId, beaconName, pMinionData);
      }
    }
  }

  _handleDisabledBeacons (pMinionId, pMinionData) {
    if (pMinionData.enabled === false) {
      this.setIssueMsg("disabled-beacons", pMinionId, "Beacons on minion '" + pMinionId + "' are disabled");
      this.addIssueCmd("disabled-beacons", pMinionId, "Enable beacons", pMinionId, ["beacons.enable"]);
      this.addIssueNav("disabled-beacons", pMinionId, "beacons-minion", {"minionid": pMinionId});
    }
  }

  _handleDisabledBeacon (pMinionId, pBeaconName, pMinionData) {
    const beaconData = BeaconsIssues._simplify(pMinionData[pBeaconName]);
    if (beaconData.enabled === false) {
      const issueId = pMinionId + "-" + pBeaconName;
      this.setIssueMsg("disabled-beacon", issueId, "Beacon '" + pBeaconName + "' on '" + pMinionId + "' is disabled");
      this.addIssueCmd("disabled-beacon", issueId, "Enable beacon", pMinionId, ["beacons.enable_beacon", pBeaconName]);
      this.addIssueCmd("disabled-beacon", issueId, "Delete beacon", pMinionId, ["beacons.delete", pBeaconName]);
      this.addIssueNav("disabled-beacon", issueId, "beacons-minion", {"minionid": pMinionId});
    }
  }
}
