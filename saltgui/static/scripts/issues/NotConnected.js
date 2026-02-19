/* global */

import {Issues} from "./Issues.js";

export class NotConnectedIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "NOT-CONNECTED");

    const skipWheelMinionsConnected = Utils.getStorageItemBoolean("session", "skip_wheel_minions_connected", false);

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelMinionsConnectedPromise = skipWheelMinionsConnected ? null : this.api.getWheelMinionsConnected();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      Issues.removeCategory(pPanel, "not-connected");
      return pWheelKeyListAllData;
    }, (pWheelKeyListAllMsg) => {
      Issues.removeCategory(pPanel, "not-connected");
      const tr = Issues.addIssue(pPanel, "not-connected", "retrieving-keys");
      Issues.addIssueMsg(tr, "Could not retrieve list of keys");
      Issues.addIssueErr(tr, pWheelKeyListAllMsg);
      return false;
    });

    if (wheelMinionsConnectedPromise != null) {
      wheelMinionsConnectedPromise.then((pWheelMinionsConnectedData) => {
        Issues.removeCategory(pPanel, "not-connected");
        return pWheelMinionsConnectedData;
      }, (pWheelMinionsConnectedMsg) => {
        Issues.removeCategory(pPanel, "not-connected");
        const tr = Issues.addIssue(pPanel, "not-connected", "retrieving-connected");
        Issues.addIssueMsg(tr, "Could not retrieve list of connected minions");
        Issues.addIssueErr(tr, pWheelMinionsConnectedMsg);
        return false;
      });
    }

    /* eslint-disable compat/compat */
    /* Promise.all() is not supported in op_mini all, IE 11  compat/compat */
    const allPromise = Promise.all([wheelKeyListAllPromise, wheelMinionsConnectedPromise]);
    /* eslint-enable compat/compat */
    allPromise.then((results) => {
      Issues.readyCategory(pPanel, msg);
      const wheelKeyListAllData = results[0];
      const wheelMinionsConnectedData = results[1];
      NotConnectedIssues._handleNotConnected(pPanel, wheelKeyListAllData, wheelMinionsConnectedData);
    }, (error) => {
      Issues.readyCategory(pPanel, msg);
      /* eslint-disable no-console */
      console.error(error);
      /* eslint-enable no-console */
    });

    return allPromise;
  }

  static _handleNotConnected (pPanel, pWheelKeyListAllData, pWheelMinionsConnectedData) {
    const allMinions = pWheelKeyListAllData.return[0].data.return.minions;
    const allConnected = pWheelMinionsConnectedData.return[0].data.return;
    for (const minionId of allMinions) {
      if (allConnected.includes(minionId)) {
        continue;
      }
      // no direct commands, we don't know any useful ones
      const tr = Issues.addIssue(pPanel, "not-connected", minionId);
      Issues.addIssueMsg(tr, "Minion '" + minionId + "' is not connected");
      Issues.addIssueNav(tr, "minions", {});
    }
  }
}
