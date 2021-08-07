/* global */

import {Issues} from "./Issues.js";

export class BeaconsIssues extends Issues {

  onGetIssues (pPanel, pMsg) {

    const localBeaconsListPromise = this.api.getLocalBeaconsList(null);

    localBeaconsListPromise.then((pLocalBeaconsListData) => {
      Issues.removeCategory(pPanel, "disabled-beacons");
      Issues.removeCategory(pPanel, "disabled-beacon");
      BeaconsIssues._handleLocalBeaconsList(pPanel, pLocalBeaconsListData);
      pMsg.parentElement.removeChild(pMsg);
      return true;
    }, (pLocalBeaconsListMsg) => {
      Issues.removeCategory(pPanel, "disabled-beacons");
      const tr1 = Issues.addIssue(pPanel, "disabled-beacons", "retrieving");
      Issues.addIssueMsg(tr1, "Could not retrieve list of beacons");
      Issues.addIssueErr(tr1, pLocalBeaconsListMsg);
      Issues.removeCategory(pPanel, "disabled-beacon");
      const tr2 = Issues.addIssue(pPanel, "disabled-beacon", "retrieving");
      Issues.addIssueMsg(tr2, "Could not retrieve list of beacon");
      Issues.addIssueErr(tr2, pLocalBeaconsListMsg);
      pMsg.parentElement.removeChild(pMsg);
      return false;
    });

    return localBeaconsListPromise;
  }

  static simplify (beaconData) {
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
      for (const beaconName in minionData) {
        if (beaconName === "enabled") {
          // beacons flag
          if (minionData.enabled === false) {
            const tr = Issues.addIssue(pPanel, "disabled-beacons", minionId);
            Issues.addIssueMsg(tr, "Beacons on minion '" + minionId + "' are disabled");
            Issues.addIssueCmd(tr, "Enable beacons", minionId, ["beacons.enable"]);
            Issues.addIssueNav(tr, "beacons-minion", {"minionid": minionId});
          }
        } else {
          const beaconData = BeaconsIssues.simplify(minionData[beaconName]);
          if (beaconData.enabled === false) {
            const tr = Issues.addIssue(pPanel, "disabled-beacon", minionId + "-" + beaconName);
            Issues.addIssueMsg(tr, "Beacon '" + beaconName + "' on '" + minionId + "' is disabled");
            Issues.addIssueCmd(tr, "Enable beacon", minionId, ["beacons.enable_beacon", beaconName]);
            Issues.addIssueNav(tr, "beacons-minion", {"minionid": minionId});
          }
        }
      }
    }
  }
}
