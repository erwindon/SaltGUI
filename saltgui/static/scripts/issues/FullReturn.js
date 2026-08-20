/* global */

import {Issues} from "./Issues.js";
import {Utils} from "../Utils.js";

export class FullReturnIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "FULL-RETURN");

    const fullReturn = Utils.getStorageItemBoolean("session", "full_return");

    /* eslint-disable compat/compat */
    const fullReturnPromise = Promise.resolve();
    /* eslint-enable compat/compat */

    fullReturnPromise.then(() => {
      this.removeCategory("full-return");
      if (!fullReturn) {
        this.setIssueMsg("full-return", "full-return", "Configuration option 'saltgui_full_return' is not 'true'; configure it permanently in the 'master' file or set it in the Options page for this session only");
        this.addIssueNav("full-return", "full-return", "options", {}, "option-full-return-name");
        this.addIssueUrl("full-return", "full-return", "API documentation", "https://docs.saltproject.io/en/master/ref/clients/index.html#salt.client.LocalClient.cmd");
      }
      this.readyCategory(pPanel, "full-return", msg);
      return true;
    });

    return fullReturnPromise;
  }
}
