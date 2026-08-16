/* global console */

import {Issues} from "./Issues.js";
import {Utils} from "../Utils.js";

export class NotConnectedIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "NOT-CONNECTED");

    const skipWheelMinionsConnected = Utils.getStorageItemBoolean("session", "skip_wheel_minions_connected", false);

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelMinionsConnectedPromise = skipWheelMinionsConnected ? null : this.api.getWheelMinionsConnected();

    wheelKeyListAllPromise.then((ok_WheelKeyListAll) => {
      this.removeCategory("not-connected");
      return ok_WheelKeyListAll;
    }, (_error_WheelKeyListAll) => {
      this.removeCategory("not-connected");
      this.setIssueMsg("not-connected", "retrieving-keys", "Could not retrieve list of keys");
      this.setIssueErr("not-connected", "retrieving-keys", _error_WheelKeyListAll);
      return false;
    });

    if (wheelMinionsConnectedPromise != null) {
      wheelMinionsConnectedPromise.then((ok_WheelMinionsConnected) => {
        this.removeCategory("not-connected");
        return ok_WheelMinionsConnected;
      }, (_error_WheelMinionsConnected) => {
        this.removeCategory("not-connected");
        this.setIssueMsg("not-connected", "retrieving-connected", "Could not retrieve list of connected minions");
        this.setIssueErr("not-connected", "retrieving-connected", _error_WheelMinionsConnected);
        return false;
      });
    }

    /* eslint-disable compat/compat */
    /* Promise.all() is not supported in op_mini all, IE 11  compat/compat */
    const allPromise = Promise.all([wheelKeyListAllPromise, wheelMinionsConnectedPromise]);
    /* eslint-enable compat/compat */
    allPromise.then((results) => {
      this.readyCategory(pPanel, "not-connected", msg);
      const wheelKeyListAllData = results[0];
      const wheelMinionsConnectedData = results[1];
      this._handleNotConnected(wheelKeyListAllData, wheelMinionsConnectedData);
    }, (error) => {
      this.readyCategory(pPanel, "not-connected", msg);
      /* eslint-disable no-console */
      console.error(error);
      /* eslint-enable no-console */
    });

    return allPromise;
  }

  _handleNotConnected (pWheelKeyListAllData, pWheelMinionsConnectedData) {
    if (pWheelMinionsConnectedData === null) {
      // with saltgui_skip_wheel_minions_connected=true
      return;
    }
    const allMinions = pWheelKeyListAllData.return[0].data.return.minions;
    const allConnected = pWheelMinionsConnectedData.return[0].data.return;
    for (const minionId of allMinions) {
      if (allConnected.includes(minionId)) {
        continue;
      }
      // no direct commands, we don't know any useful ones
      this.setIssueMsg("not-connected", minionId, "Minion '" + minionId + "' is not connected");
      this.addIssueNav("not-connected", minionId, "minions", {});
    }
  }
}
