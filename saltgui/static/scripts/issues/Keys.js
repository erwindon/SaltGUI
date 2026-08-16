/* global */

import {Issues} from "./Issues.js";

export class KeysIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "KEYS");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();

    wheelKeyListAllPromise.then((ok_WheelKeyListAll) => {
      this.removeCategory("unaccepted-key");
      this._handleKeysWheelKeyListAll(ok_WheelKeyListAll);
      this.readyCategory(pPanel, "unaccepted-key", msg);
      return true;
    }, (_error_WheelKeyListAll) => {
      this.removeCategory("unaccepted-key");
      this.setIssueMsg("unaccepted-key", "retrieving", "Could not retrieve list of unaccepted keys");
      this.setIssueErr("unaccepted-key", "retrieving", _error_WheelKeyListAll);
      this.readyCategory(pPanel, "unaccepted-key", msg);
      return false;
    });

    return wheelKeyListAllPromise;
  }

  _handleKeysWheelKeyListAll (pWheelKeyListAllData) {
    const allKeysDict = pWheelKeyListAllData.return[0].data.return;
    for (const minionId of allKeysDict.minions_pre) {
      // no direct commands
      // as multiple commands are applicable: accept, reject, delete
      // and for "accept", the fingerprint should be inspected first
      this.setIssueMsg("unaccepted-key", minionId, "Key for minion '" + minionId + "' is unaccepted");
      this.addIssueNav("unaccepted-key", minionId, "keys", {});
    }
  }
}
