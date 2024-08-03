/* global */

import {Character} from "../Character.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class KeysPanel extends Panel {

  constructor () {
    super("keys");

    this.addTitle("Keys");
    this.addPanelMenu();
    this._addPanelMenuItemWheelKeyAcceptAllUnaccepted();
    this._addPanelMenuItemWheelKeyAcceptAllUnacceptedRejected();
    this._addPanelMenuItemWheelKeyAcceptAllUnacceptedDenied();
    this._addPanelMenuItemWheelKeyAcceptAllUnacceptedRejectedDenied();
    this._addPanelMenuItemWheelKeyRejectAllUnaccepted();
    this._addPanelMenuItemWheelKeyRejectAllUnacceptedAccepted();
    this._addPanelMenuItemWheelKeyRejectAllUnacceptedDenied();
    this._addPanelMenuItemWheelKeyRejectAllUnacceptedAcceptedDenied();
    this._addPanelMenuItemWheelKeyDeleteAll();
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "The content of this page is",
      "automatically refreshed."
    ]);
    this.addWarningField();
    this.addTable(["-menu-", "Minion", "Status", "Fingerprint"], "data-list-keys");
    this.setTableSortable("Status", "asc");
    this.addMsg();

    this.fingerprintPattern = /^[0-9a-f:]+$/i;

    this.setPlayPauseButton("play");
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.api.getWheelKeyFinger();

    this.nrUnaccepted = 0;
    this.nrAccepted = 0;
    this.nrDenied = 0;
    this.nrRejected = 0;

    this.showSyndicInfo(false);

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleKeysWheelKeyListAll(pWheelKeyListAllData);
      wheelKeyFingerPromise.then((pWheelKeyFingerData) => {
        this._handleWheelKeyFinger(pWheelKeyFingerData);
        return true;
      }, (pWheelKeyFingerMsg) => {
        const msg = JSON.stringify(pWheelKeyFingerMsg);
        const allMinionsErr1 = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, msg);
        const allMinionsErr2 = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions_pre, msg);
        const allMinionsErr3 = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions_rejected, msg);
        const allMinionsErr4 = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions_denied, msg);
        /* eslint-disable prefer-object-spread */
        const allMinionsErr = Object.assign({}, allMinionsErr1, allMinionsErr2, allMinionsErr3, allMinionsErr4);
        /* eslint-enable prefer-object-spread */
        this._handleWheelKeyFinger({"return": [{"data": {"return": {"minions": allMinionsErr}}}]});
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleKeysWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      Utils.ignorePromise(wheelKeyFingerPromise);
      return false;
    });
  }

  showSyndicInfo (pSyndicEventFound) {
    const syndicMaster = Utils.getStorageItem("session", "syndic_master", "");
    const orderMasters = Utils.getStorageItemBoolean("session", "order_masters");

    let warningText = "";

    if (syndicMaster !== "" && syndicMaster !== "masterofmasters") {
      warningText += " The syndic-master of this salt-master is '" + syndicMaster + "'.";
    }

    if (orderMasters) {
      warningText += " This salt-master is ready to work with salt-syndic nodes.";
    }

    if (pSyndicEventFound) {
      warningText += " Events related to salt-syndic are seen in the salt-event-bus.";
    }

    if (warningText === "") {
      this.setWarningText();
    } else {
      warningText += " This overview contains only the keys of minions that are connected to this salt-master.";
      warningText += " Keys for minions that are connected to other salt-masters are not always shown in this SaltGUI.";
      warningText += " Commands issued from this salt-master may involve minions that are not listed in SaltGUI.";
      this.setWarningText("info", warningText.trim());
    }
  }

  _handleWheelKeyFinger (pWheelKeyFingerData) {
    if (this.showErrorRowInstead(pWheelKeyFingerData)) {
      return;
    }

    const allKeys = pWheelKeyFingerData.return[0].data.return;

    for (const property of Object.keys(allKeys)) {
      if (property === "local") {
        continue;
      }
      const hosts = allKeys[property];
      for (const minionId of Object.keys(hosts)) {
        const item = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId) + " .os");
        if (item) {
          // remove td.os for known minions and add td.fingerprint
          item.classList.remove("os");
          item.classList.add("fingerprint");
        }

        // update td.fingerprint with fingerprint value
        const fingerprintTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
        if (!fingerprintTr) {
          continue;
        }
        const fingerprintElement = fingerprintTr.querySelector(".fingerprint");
        if (!fingerprintElement) {
          continue;
        }
        const fingerprint = hosts[minionId];
        if (!fingerprint.match(this.fingerprintPattern)) {
          item.classList.remove("fingerprint");
          Utils.addErrorToTableCell(fingerprintElement, fingerprint);
          continue;
        }
        fingerprintTr.dataset.fingerprintKnown = true;
        fingerprintElement.innerText = fingerprint;
      }
    }
  }

  _handleKeysWheelKeyListAll (pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelKeyListAllData)) {
      this.setPlayPauseButton("none");
      return;
    }

    const allKeys = pWheelKeyListAllData.return[0].data.return;

    const minionsDict = Utils.getStorageItemObject("session", "minions_txt");

    // Unaccepted goes first because that is where the user must decide
    const minionIdsPre = allKeys.minions_pre.sort();
    for (const minionId of minionIdsPre) {
      this._addPreMinion(minionId, minionsDict);
    }

    const minionIdsAccepted = allKeys.minions.sort();
    for (const minionId of minionIdsAccepted) {
      this._addAcceptedMinion(minionId, minionsDict);
    }

    const minionIdsDenied = allKeys.minions_denied.sort();
    for (const minionId of minionIdsDenied) {
      this._addDeniedMinion(minionId, minionsDict);
    }

    const minionIdsRejected = allKeys.minions_rejected.sort();
    for (const minionId of minionIdsRejected) {
      this._addRejectedMinion(minionId, minionsDict);
    }

    for (const minionId of Object.keys(minionsDict)) {
      if (this.table.querySelector("#" + Utils.getIdFromMinionId(minionId))) {
        continue;
      }
      this._addMissingMinion(minionId, minionsDict);
    }

    this.updateFooter();

    this.panelMenu.verifyAll();
  }

  updateFooter () {
    const cnt = {};

    let txt = "";

    if (this.table) {
      const tbody = this.table.tBodies[0];
      for (const tr of tbody.children) {
        const statusTd = tr.querySelector(".status");
        const statusText = statusTd.innerText;
        if (cnt[statusText] === undefined) {
          cnt[statusText] = 0;
        }
        cnt[statusText] += 1;
      }

      for (const key of Object.keys(cnt).sort()) {
        txt += ", " + Utils.txtZeroOneMany(cnt[key],
          "no " + key + " keys",
          "{0} " + key + " key",
          "{0} " + key + " keys");
      }
    }

    if (Object.keys(cnt).length === 0) {
      txt += ", no keys";
    }

    // remove the first comma
    txt = txt.replace(/^, /, "");
    // capitalize the first word (can only be "no")
    txt = txt.replace(/^no/, "No");

    this.nrUnaccepted = cnt["unaccepted"];
    this.nrAccepted = cnt["accepted"];
    this.nrDenied = cnt["denied"];
    this.nrRejected = cnt["rejected"];

    super.updateFooter(txt);
  }

  static _flagMinion (pMinionId, pStatusField, pMinionTr, pMinionsDict, pIsMissing = false) {
    let txt = "";

    if (!Object.keys(pMinionsDict).length) {
      // list of well-known minion is empty
      // assume we actually don't known

      // Arrays.includes() is only available from ES7/2016
    } else if (!pIsMissing && Object.keys(pMinionsDict).indexOf(pMinionId) >= 0) {
      // this is a known minion
    } else {
      // this is an unknown minion
      const status = pStatusField.innerText;
      switch (status) {
      case "accepted":
        txt = "Unexpected entry\nThis entry may need to be rejected!";
        break;
      case "rejected":
        txt = "Unexpected entry\nBut it is already rejected";
        break;
      case "denied":
        txt = "Unexpected entry\nBut it is already denied";
        break;
      case "unaccepted":
        txt = "Unexpected entry\nDo not accept this entry without proper verification!";
        break;
      case "missing":
        txt = "Entry is missing\nIs the host running and is the salt-minion installed and started?";
        break;
      default:
        txt = "Unknown status '" + status + "'";
      }
    }

    const minionIdTd = pMinionTr.querySelectorAll("td")[1];
    const minionIdSpan = minionIdTd.querySelector("span");

    if (txt) {
      minionIdTd.setAttribute("sorttable_customkey", pMinionId);
      minionIdSpan.innerText = pMinionId;
      Panel.addPrefixIcon(minionIdSpan, Character.WARNING_SIGN);
      Utils.addToolTip(
        minionIdSpan,
        txt + "\nUpdate file 'minions.txt' when needed",
        "bottom-left");
    } else {
      // this also removes any tooltip
      minionIdSpan.innerText = pMinionId;
    }
  }

  _addAcceptedMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.appendChild(minionIdTd);

    const accepted = Utils.createTd(["status", "accepted"], "accepted");
    accepted.setAttribute("sorttable_customkey", 2);
    minionTr.appendChild(accepted);

    KeysPanel._flagMinion(pMinionId, accepted, minionTr, pMinionsDict);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId, accepted);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading" + Character.HORIZONTAL_ELLIPSIS));
  }

  _addRejectedMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.appendChild(minionIdTd);

    const rejected = Utils.createTd(["status", "rejected"], "rejected");
    rejected.setAttribute("sorttable_customkey", 4);
    minionTr.appendChild(rejected);

    KeysPanel._flagMinion(pMinionId, rejected, minionTr, pMinionsDict);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId, rejected);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading" + Character.HORIZONTAL_ELLIPSIS));

    const tbody = this.table.tBodies[0];
    tbody.appendChild(minionTr);
  }

  _addDeniedMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.appendChild(minionIdTd);

    const denied = Utils.createTd(["status", "denied"], "denied");
    denied.setAttribute("sorttable_customkey", 3);
    minionTr.appendChild(denied);

    KeysPanel._flagMinion(pMinionId, denied, minionTr, pMinionsDict);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId, denied);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading" + Character.HORIZONTAL_ELLIPSIS));

    const tbody = this.table.tBodies[0];
    tbody.appendChild(minionTr);
  }

  _addPreMinion (pMinionId, pMinionsDict, pInsertAtTop = false) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.appendChild(minionIdTd);

    const pre = Utils.createTd(["status", "unaccepted"], "unaccepted");
    // unaccepted comes first because user action is needed
    // all others have the same order as in 'salt-key'
    pre.setAttribute("sorttable_customkey", 1);
    minionTr.appendChild(pre);

    KeysPanel._flagMinion(pMinionId, pre, minionTr, pMinionsDict);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId, pre);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading" + Character.HORIZONTAL_ELLIPSIS));

    const tbody = this.table.tBodies[0];
    if (pInsertAtTop) {
      // used for event based additions
      tbody.insertBefore(minionTr, tbody.firstChild);
    } else {
      // used for query based additions (when building page)
      tbody.appendChild(minionTr);
    }
  }

  _addMissingMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId), "UNKNOWN");

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.appendChild(minionIdTd);

    const missing = Utils.createTd(["status", "missing"], "missing");
    missing.setAttribute("sorttable_customkey", 5);
    minionTr.appendChild(missing);

    KeysPanel._flagMinion(pMinionId, missing, minionTr, pMinionsDict, true);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId, missing);

    minionTr.appendChild(Utils.createTd("fingerprint", ""));
  }

  _addDropDownMenu (pMinionTr, pMinionId, pStatusField) {
    // final dropdownmenu
    this._addMenuItemWheelKeyAccept1(pMinionTr.dropdownmenu, pMinionId, pStatusField);
    this._addMenuItemWheelKeyReject(pMinionTr.dropdownmenu, pMinionId, pStatusField);
    this._addMenuItemWheelKeyDelete(pMinionTr.dropdownmenu, pMinionId, pStatusField);
    this._addMenuItemWheelKeyAccept2(pMinionTr.dropdownmenu, pMinionId, pStatusField);
  }

  _addMenuItemWheelKeyAccept1 (pMenu, pMinionId, pStatusField) {
    pMenu.addMenuItem(() => {
      const status = pStatusField.innerText;
      if (status === "denied" || status === "unaccepted") {
        return "Accept key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      const status = pStatusField.innerText;
      if (status === "denied") {
        cmdArr.push("include_denied=", true);
      } else if (status === "rejected") {
        cmdArr.push("include_rejected=", true);
      }
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnaccepted () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnaccepted > 0) {
        return "Accept all unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedRejected () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrRejected) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Accept all unaccepted+rejected keys...";
      }
      return "Accept all rejected keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_rejected=", true];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrDenied) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Accept all unaccepted+denied keys...";
      }
      return "Accept all denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_denied=", true];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedRejectedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrRejected || !this.nrDenied) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Accept all unaccepted+denied+rejected keys...";
      }
      return "Accept all denied+rejected keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_denied=", true, "include_rejected=", true];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addMenuItemWheelKeyAccept2 (pMenu, pMinionId, pStatusField) {
    pMenu.addMenuItem(() => {
      const status = pStatusField.innerText;
      if (status === "rejected") {
        return "Accept key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      const status = pStatusField.innerText;
      if (status === "denied") {
        cmdArr.push("include_denied=", true);
      } else if (status === "rejected") {
        cmdArr.push("include_rejected=", true);
      }
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemWheelKeyReject (pMenu, pMinionId, pStatusField) {
    pMenu.addMenuItem(() => {
      const status = pStatusField.innerText;
      if (status === "accepted" || status === "denied" || status === "unaccepted") {
        return "Reject key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.reject"];
      const status = pStatusField.innerText;
      if (status === "accepted") {
        cmdArr.push("include_accepted=", true);
      } else if (status === "denied") {
        cmdArr.push("include_denied=", true);
      }
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnaccepted () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnaccepted > 0) {
        return "Reject all unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.reject"];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedAccepted () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrAccepted) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Reject all unaccepted+accepted keys...";
      }
      return "Reject all accepted keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_accepted=", true];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrDenied) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Reject all unaccepted+denied keys...";
      }
      return "Reject all denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_denied=", true];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedAcceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrAccepted || !this.nrDenied) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Reject all unaccepted+accepted+denied keys...";
      }
      return "Reject all accepted+denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_accepted=", true, "include_denied=", true];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addMenuItemWheelKeyDelete (pMenu, pMinionId, pStatusField) {
    pMenu.addMenuItem(() => {
      const status = pStatusField.innerText;
      if (status === "accepted" || status === "rejected" || status === "unaccepted" || status === "denied") {
        return "Delete key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.delete"];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyDeleteAll () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrAccepted > 0 || this.nrUnaccepted > 0 || this.nrRejected > 0 || this.nrDenied > 0) {
        return "Delete all keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.delete"];
      this.runCommand("", "*", cmdArr);
    });
  }

  handleSaltAuthEvent (pData) {

    if (this.playOrPause !== "play") {
      return;
    }

    const tr = this.table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));
    const minionsDict = Utils.getStorageItemObject("session", "minions_txt");
    if (tr) {
      const statusTd = tr.querySelector(".status");
      // drop all other classes (accepted, rejected, etc)
      // do not update screen when nothing changed; that keeps any search highlight
      if (pData.act === "accept") {
        statusTd.className = "status";
        statusTd.classList.add("accepted");
        if (statusTd.innerText !== "accepted") {
          statusTd.innerText = "accepted";
          KeysPanel._flagMinion(pData.id, statusTd, tr, minionsDict);
        }
      } else if (pData.act === "reject") {
        statusTd.className = "status";
        statusTd.classList.add("rejected");
        if (statusTd.innerText !== "rejected") {
          statusTd.innerText = "rejected";
          KeysPanel._flagMinion(pData.id, statusTd, tr, minionsDict);
        }
      } else if (pData.act === "pend") {
        statusTd.className = "status";
        statusTd.classList.add("unaccepted");
        if (statusTd.innerText !== "unaccepted") {
          statusTd.innerText = "unaccepted";
          KeysPanel._flagMinion(pData.id, statusTd, tr, minionsDict);
        }
      } else if (pData.act === "delete") {
        // "-1" due to the <tr> for the header that is inside <thead>
        tr.parentNode.deleteRow(tr.rowIndex - 1);
        if (pData.id in minionsDict) {
          this._addMissingMinion(pData.id, minionsDict);
        }
      } else {
        // unknown status
        // do not update screen
      }
      // keep the fingerprint
      // update the menu because it may be in a hidden state
      tr.dropdownmenu.verifyAll();
      this.panelMenu.verifyAll();
    } else if (this.table.querySelector("tr") === null) {
      // only when the full list is already available
      // this prevents a random set of records from appearing
      // at the top of the table that happen to be received
      // before the full list was received
      return;
    } else {
      // new items will be added at the bottom of the table
      // except new pending keys, which come at the top.
      // so that it gets the proper attention.
      /* eslint-disable no-lonely-if */
      if (pData.act === "pend") {
        this._addPreMinion(pData.id, minionsDict, true);
      } else if (pData.act === "accept") {
        this._addAcceptedMinion(pData.id, minionsDict);
      } else if (pData.act === "reject") {
        this._addRejectedMinion(pData.id, minionsDict);
      } else if (pData.act === "delete") {
        // delete of an unknown minion, never mind
      } else {
        // unknown status
        // do not update screen
      }
      /* eslint-enable no-lonely-if */
    }

    const searchBlock = this.div.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, this.table, "refresh");

    this.updateFooter();

    // we do not have the fingerprint yet
    // pre-fill with a dummy value and then retrieve the actual value
    const tr2 = this.table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));
    if (!tr2) {
      return;
    }
    let fingerprintSpan = tr2.querySelector("td.fingerprint");
    if (!fingerprintSpan) {
      // on startup, the field is still classed "os" instead of "fingerprint"
      fingerprintSpan = tr2.querySelector("td.os");
    }
    if (!tr2.dataset.fingerprintKnown) {
      fingerprintSpan.innerText = "(refresh page for fingerprint)";
      const wheelKeyFingerPromise = this.api.getWheelKeyFinger(pData.id);
      wheelKeyFingerPromise.then((pWheelKeyFingerData) => {
        this._handleWheelKeyFinger(pWheelKeyFingerData);
        return true;
      }, (pWheelKeyFingerMsg) => {
        const wheelKeyFingerData = {"return": [{"data": {"return": {"minions": {}}}}]};
        wheelKeyFingerData.return[0]["data"]["return"]["minions"][pData.id] = JSON.stringify(pWheelKeyFingerMsg);
        this._handleWheelKeyFinger(wheelKeyFingerData);
        return false;
      });
    }
  }

  handleSaltKeyEvent (pData) {
    this.handleSaltAuthEvent(pData);
  }

  handleSyndicEvent () {
    this.showSyndicInfo(true);
  }
}
