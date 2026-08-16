/* global */

import {Issues} from "./Issues.js";

export class BeaconsIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "BEACONS");

    const localBeaconsListPromise = this.api.getLocalBeaconsList(null);

    localBeaconsListPromise.then((ok_LocalBeaconsList) => {
      Issues.removeCategory(pPanel, "disabled-beacons");
      Issues.removeCategory(pPanel, "disabled-beacon");
      BeaconsIssues._handleLocalBeaconsList(pPanel, ok_LocalBeaconsList);
      Issues.readyCategory(pPanel, msg);
      return true;
    }, (_error_LocalBeaconsList) => {
      Issues.removeCategory(pPanel, "disabled-beacons");
      const tr1 = Issues.addIssue(pPanel, "disabled-beacons", "retrieving");
      Issues.addIssueMsg(tr1, "Could not retrieve list of beacon schedulers");
      Issues.addIssueErr(tr1, _error_LocalBeaconsList);
      Issues.removeCategory(pPanel, "disabled-beacon");
      const tr2 = Issues.addIssue(pPanel, "disabled-beacon", "retrieving");
      Issues.addIssueMsg(tr2, "Could not retrieve list of beacons");
      Issues.addIssueErr(tr2, _error_LocalBeaconsList);
      Issues.readyCategory(pPanel, msg);
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

  static _handleLocalBeaconsList (pPanel, pLocalBeaconsListData) {
    const allBeacons = pLocalBeaconsListData.return[0];
    for (const minionId in allBeacons) {
      const minionData = allBeacons[minionId];

      if (!minionData) {
        BeaconsIssues._handleOfflineMinion(pPanel, minionId);
        continue;
      }

      BeaconsIssues._handleMinionBeacons(pPanel, minionId, minionData);
    }
  }

  static _handleOfflineMinion (pPanel, pMinionId) {
    const tr = Issues.addIssue(pPanel, "offline", pMinionId);
    Issues.addIssueMsg(tr, "Minion '" + pMinionId + "' is offline");
  }

  static _handleMinionBeacons (pPanel, pMinionId, pMinionData) {
    for (const beaconName in pMinionData) {
      if (beaconName === "enabled") {
        // beacons flag
        BeaconsIssues._handleDisabledBeacons(pPanel, pMinionId, pMinionData);
      } else {
        BeaconsIssues._handleDisabledBeacon(pPanel, pMinionId, beaconName, pMinionData);
      }
    }
  }

  static _handleDisabledBeacons (pPanel, pMinionId, pMinionData) {
    if (pMinionData.enabled === false) {
      const tr = Issues.addIssue(pPanel, "disabled-beacons", pMinionId);
      Issues.addIssueMsg(tr, "Beacons on minion '" + pMinionId + "' are disabled");
      Issues.addIssueCmd(tr, "Enable beacons", pMinionId, ["beacons.enable"]);
      Issues.addIssueNav(tr, "beacons-minion", {"minionid": pMinionId});
    }
  }

  static _handleDisabledBeacon (pPanel, pMinionId, pBeaconName, pMinionData) {
    const beaconData = BeaconsIssues._simplify(pMinionData[pBeaconName]);
    if (beaconData.enabled === false) {
      const tr = Issues.addIssue(pPanel, "disabled-beacon", pMinionId + "-" + pBeaconName);
      Issues.addIssueMsg(tr, "Beacon '" + pBeaconName + "' on '" + pMinionId + "' is disabled");
      Issues.addIssueCmd(tr, "Enable beacon", pMinionId, ["beacons.enable_beacon", pBeaconName]);
      Issues.addIssueCmd(tr, "Delete beacon", pMinionId, ["beacons.delete", pBeaconName]);
      Issues.addIssueNav(tr, "beacons-minion", {"minionid": pMinionId});
    }
  }
}
