/* global */

import {Issues} from "./Issues.js";

export class KeysIssues extends Issues {

  onGetIssues (pPanel, pMsg) {

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      Issues.removeCategory(pPanel, "unaccepted-key");
      KeysIssues._handleKeysWheelKeyListAll(pPanel, pWheelKeyListAllData);
      pMsg.parentElement.removeChild(pMsg);
      return true;
    }, (pWheelKeyListAllMsg) => {
      Issues.removeCategory(pPanel, "unaccepted-key");
      const tr = Issues.addIssue(pPanel, "unaccepted-key", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of unaccepted keys");
      Issues.addIssueErr(tr, pWheelKeyListAllMsg);
      pMsg.parentElement.removeChild(pMsg);
      return false;
    });

    return wheelKeyListAllPromise;
  }

  static _handleKeysWheelKeyListAll (pPanel, pWheelKeyListAllData) {
    const allKeysDict = pWheelKeyListAllData.return[0].data.return;
    for (const minionId of allKeysDict.minions_pre) {
      // no direct commands
      // as multiple commands are applicable: accept, reject, delete
      // and for "accept", the fingerprint should be inspected first
      const tr = Issues.addIssue(pPanel, "unaccepted-key", minionId);
      Issues.addIssueMsg(tr, "Key for minion '" + minionId + "' is unaccepted");
      Issues.addIssueNav(tr, "keys", {});
    }
  }
}
