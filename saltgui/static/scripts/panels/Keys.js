/* global */

import {Character} from "../Character.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class KeysPanel extends Panel {

  constructor () {
    super("keys", ["select_keys"]);

    this.addTitle("Keys");
    this.addPanelMenu();
    this._addPanelMenuItemWheelKeyAcceptAllUnaccepted();
    this._addPanelMenuItemWheelKeyAcceptSelectedUnaccepted();
    this._addPanelMenuItemWheelKeyAcceptAllUnacceptedRejected();
    this._addPanelMenuItemWheelKeyAcceptSelectedUnacceptedRejected();
    this._addPanelMenuItemWheelKeyAcceptAllUnacceptedDenied();
    this._addPanelMenuItemWheelKeyAcceptSelectedUnacceptedDenied();
    this._addPanelMenuItemWheelKeyAcceptAllUnacceptedRejectedDenied();
    this._addPanelMenuItemWheelKeyAcceptSelectedUnacceptedRejectedDenied();
    this._addPanelMenuItemWheelKeyRejectAllUnaccepted();
    this._addPanelMenuItemWheelKeyRejectSelectedUnaccepted();
    this._addPanelMenuItemWheelKeyRejectAllUnacceptedAccepted();
    this._addPanelMenuItemWheelKeyRejectSelectedUnacceptedAccepted();
    this._addPanelMenuItemWheelKeyRejectAllUnacceptedDenied();
    this._addPanelMenuItemWheelKeyRejectSelectedUnacceptedDenied();
    this._addPanelMenuItemWheelKeyRejectAllUnacceptedAcceptedDenied();
    this._addPanelMenuItemWheelKeyRejectSelectedUnacceptedAcceptedDenied();
    this._addPanelMenuItemWheelKeyDeleteAll();
    this._addPanelMenuItemWheelKeyDeleteSelected();
    this.addSearchButton();
    this.addFilterButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "The content of this page is",
      "automatically refreshed."
    ]);
    this.addWarningField();
    this.addTable(["-select-", "-menu-", "Minion", "Status", "Fingerprint"], "data-list-keys");
    this.setTableSortable("Status", "asc");
    this.addMsg();

    this.fingerprintPattern = /^[0-9a-f:]+$/i;

    this.setPlayPauseButton("play");
  }

  onShow () {
    super.onShow();

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.api.getWheelKeyFinger();

    this.nrUnaccepted = 0;
    this.nrUnacceptedSelected = 0;
    this.nrAccepted = 0;
    this.nrAcceptedSelected = 0;
    this.nrDenied = 0;
    this.nrDeniedSelected = 0;
    this.nrRejected = 0;
    this.nrRejectedSelected = 0;

    this._showSyndicInfo(false);
    this._showClusterInfo();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((ok_WheelKeyListAll) => {
      this._handleKeysWheelKeyListAll(ok_WheelKeyListAll);
      wheelKeyFingerPromise.then((ok_WheelKeyFinger) => {
        this._handleWheelKeyFinger(ok_WheelKeyFinger);
        return true;
      }, (_error_WheelKeyFinger) => {
        const msg = JSON.stringify(_error_WheelKeyFinger);
        const allMinionsErr1 = Utils.msgPerMinion(ok_WheelKeyListAll.return[0].data.return.minions, msg);
        const allMinionsErr2 = Utils.msgPerMinion(ok_WheelKeyListAll.return[0].data.return.minions_pre, msg);
        const allMinionsErr3 = Utils.msgPerMinion(ok_WheelKeyListAll.return[0].data.return.minions_rejected, msg);
        const allMinionsErr4 = Utils.msgPerMinion(ok_WheelKeyListAll.return[0].data.return.minions_denied, msg);
        /* eslint-disable prefer-object-spread */
        const allMinionsErr = Object.assign({}, allMinionsErr1, allMinionsErr2, allMinionsErr3, allMinionsErr4);
        /* eslint-enable prefer-object-spread */
        this._handleWheelKeyFinger({"return": [{"data": {"return": {"minions": allMinionsErr}}}]});
        return false;
      });
      return true;
    }, (_error_WheelKeyListAll) => {
      this._handleKeysWheelKeyListAll(JSON.stringify(_error_WheelKeyListAll));
      Utils.ignorePromise(wheelKeyFingerPromise);
      return false;
    });
  }

  _showSyndicInfo (pSyndicEventFound) {
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

  _showClusterInfo () {
    const clusterInfo = Utils.getStorageItem("session", "cluster_info");
    if (clusterInfo) {
      this.setWarningText("info", clusterInfo);
    }
  }

  _handleWheelKeyFinger (pWheelKeyFingerData) {
    if (this.showErrorRowInstead(pWheelKeyFingerData)) {
      return;
    }

    const allKeys = pWheelKeyFingerData.return[0].data.return;

    for (const [property, hosts] of Object.entries(allKeys)) {
      if (property === "local") {
        continue;
      }
      this._processMinionFingerprints(hosts);
    }
  }

  _processMinionFingerprints (pHosts) {
    for (const minionId of Object.keys(pHosts)) {
      this._updateMinionFingerprint(minionId, pHosts[minionId]);
    }
  }

  _updateMinionFingerprint (pMinionId, pFingerprint) {
    const osElement = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId) + " .os");
    if (osElement) {
      // remove td.os for known minions and add td.fingerprint
      osElement.classList.remove("os");
      osElement.classList.add("fingerprint");
    }

    // update td.fingerprint with fingerprint value
    const fingerprintTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    if (!fingerprintTr) {
      return;
    }

    const fingerprintElement = fingerprintTr.querySelector(".fingerprint");
    if (!fingerprintElement) {
      return;
    }

    if (!this.fingerprintPattern.test(pFingerprint)) {
      KeysPanel._handleInvalidFingerprint(osElement, fingerprintElement, pFingerprint);
      return;
    }

    KeysPanel._handleValidFingerprint(fingerprintTr, fingerprintElement, pFingerprint);
  }

  static _handleInvalidFingerprint (pOsElement, pFingerprintElement, pFingerprint) {
    if (pOsElement) {
      pOsElement.classList.remove("fingerprint");
    }
    Utils.addErrorToTableCell(pFingerprintElement, pFingerprint);
  }

  static _handleValidFingerprint (pFingerprintTr, pFingerprintElement, pFingerprint) {
    pFingerprintTr.dataset.fingerprintKnown = true;
    pFingerprintElement.innerText = pFingerprint;
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
    const cnt = this._countKeyStatuses();
    let txt = KeysPanel._buildStatusText(cnt);
    txt = KeysPanel._cleanupText(txt);
    this._updateKeyCountProperties(cnt);
    super.updateFooter(txt, false);
  }

  _countKeyStatuses () {
    const cnt = {};

    if (!this.table) {
      return cnt;
    }

    const tbody = this.table.tBodies[0];
    KeysPanel._countAllStatuses(tbody, cnt);
    KeysPanel._countSelectedStatuses(tbody, cnt);

    return cnt;
  }

  static _countAllStatuses (pTbody, pCnt) {
    for (const tr of pTbody.children) {
      const statusTd = tr.querySelector(".status");
      const statusText = statusTd.innerText;
      if (pCnt[statusText] === undefined) {
        pCnt[statusText] = 0;
      }
      pCnt[statusText] += 1;
    }
  }

  static _countSelectedStatuses (pTbody, pCnt) {
    const selectVisible = Utils.getStorageItemBoolean("session", "select_visible", false);
    if (!selectVisible) {
      return;
    }

    for (const tr of pTbody.children) {
      if (tr.firstChild.innerText !== Character.BALLOT_BOX_WITH_CHECK) {
        continue;
      }
      const statusTd = tr.querySelector(".status");
      const statusText = statusTd.innerText + "-selected";
      if (pCnt[statusText] === undefined) {
        pCnt[statusText] = 0;
      }
      pCnt[statusText] += 1;
    }
  }

  static _buildStatusText (pCnt) {
    let txt = "";

    for (const key of Object.keys(pCnt).sort(Utils.mySortFunction)) {
      txt += ", " + Utils.txtZeroOneMany(pCnt[key],
        "no " + key + " keys",
        "{0} " + key + " key",
        "{0} " + key + " keys");
    }

    if (Object.keys(pCnt).length === 0) {
      txt += ", no keys";
    }

    return txt;
  }

  static _cleanupText (pTxt) {
    // remove the first comma
    let txt = pTxt.replace(/^, /, "");
    // capitalize the first word (can only be "no")
    txt = txt.replace(/^no/, "No");
    return txt;
  }

  _updateKeyCountProperties (pCnt) {
    this.nrUnaccepted = pCnt["unaccepted"];
    this.nrUnacceptedSelected = pCnt["unaccepted-selected"];
    this.nrAccepted = pCnt["accepted"];
    this.nrAcceptedSelected = pCnt["accepted-selected"];
    this.nrDenied = pCnt["denied"];
    this.nrDeniedSelected = pCnt["denied-selected"];
    this.nrRejected = pCnt["rejected"];
    this.nrRejectedSelected = pCnt["rejected-selected"];
  }

  static _flagMinion (pMinionId, pStatusField, pMinionTr, pMinionsDict, pIsMissing = false) {
    let txt = "";

    if (!Object.keys(pMinionsDict).length) {
      // list of well-known minion is empty
      // assume we actually don't known
    } else if (!pIsMissing && Object.keys(pMinionsDict).includes(pMinionId)) {
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

    // td[0]=select, td[1]=menu, td[2]=name
    const minionIdTd = pMinionTr.querySelectorAll("td")[2];
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
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId), "select_keys", pMinionId);
    minionTr.dataset.sessionKey = "select_keys";
    minionTr.dataset.selectKey = pMinionId;

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
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId), "select_keys", pMinionId);
    minionTr.dataset.sessionKey = "select_keys";
    minionTr.dataset.selectKey = pMinionId;

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
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId), "select_keys", pMinionId);
    minionTr.dataset.sessionKey = "select_keys";
    minionTr.dataset.selectKey = pMinionId;

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
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId), "select_keys", pMinionId);
    minionTr.dataset.sessionKey = "select_keys";
    minionTr.dataset.selectKey = pMinionId;

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
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId), "select_keys", pMinionId);
    minionTr.dataset.sessionKey = "select_keys";
    minionTr.dataset.selectKey = pMinionId;

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
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Accept all unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptSelectedUnaccepted () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected > 0) {
        return "Accept selected unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedRejected () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
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

  _addPanelMenuItemWheelKeyAcceptSelectedUnacceptedRejected () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrRejectedSelected) {
        return null;
      }
      if (this.nrUnacceptedSelected > 0) {
        return "Accept selected unaccepted+rejected keys...";
      }
      return "Accept selected rejected keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_rejected=", true];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
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

  _addPanelMenuItemWheelKeyAcceptSelectedUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrDeniedSelected) {
        return null;
      }
      if (this.nrUnacceptedSelected > 0) {
        return "Accept selected unaccepted+denied keys...";
      }
      return "Accept selected denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_denied=", true];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedRejectedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
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

  _addPanelMenuItemWheelKeyAcceptSelectedUnacceptedRejectedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrRejectedSelected || !this.nrDeniedSelected) {
        return null;
      }
      if (this.nrUnacceptedSelected > 0) {
        return "Accept selected unaccepted+denied+rejected keys...";
      }
      return "Accept selected denied+rejected keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_denied=", true, "include_rejected=", true];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
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
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
      if (this.nrUnaccepted > 0) {
        return "Reject all unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.reject"];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectSelectedUnaccepted () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelectd > 0) {
        return "Reject selected unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.reject"];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedAccepted () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
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

  _addPanelMenuItemWheelKeyRejectSelectedUnacceptedAccepted () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrAcceptedSelected) {
        return null;
      }
      if (this.nrUnacceptedSelected > 0) {
        return "Reject selected unaccepted+accepted keys...";
      }
      return "Reject selected accepted keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_accepted=", true];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
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

  _addPanelMenuItemWheelKeyRejectSelectedUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrDeniedSelected) {
        return null;
      }
      if (this.nrUnacceptedSelected > 0) {
        return "Reject selected unaccepted+denied keys...";
      }
      return "Reject selected denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_denied=", true];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedAcceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
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

  _addPanelMenuItemWheelKeyRejectSelectedUnacceptedAcceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!this.nrAcceptedSelected || !this.nrDeniedSelected) {
        return null;
      }
      if (this.nrUnacceptedSelected > 0) {
        return "Reject selected unaccepted+accepted+denied keys...";
      }
      return "Reject selected accepted+denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_accepted=", true, "include_denied=", true];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
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
      if (this.nrUnacceptedSelected || this.nrAcceptedSelected || this.nrDeniedSelected || this.nrRejectedSelected) {
        return null;
      }
      if (this.nrAccepted > 0 || this.nrUnaccepted > 0 || this.nrRejected > 0 || this.nrDenied > 0) {
        return "Delete all keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.delete"];
      this.runCommand("", "*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyDeleteSelected () {
    this.panelMenu.addMenuItem(() => {
      if (this.nrAcceptedSelected > 0 || this.nrUnacceptedSelected > 0 || this.nrRejectedSelected > 0 || this.nrDeniedSelected > 0) {
        return "Delete selected keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.delete"];
      this.runCommand("", "*", cmdArr, ["select_keys"]);
    });
  }

  handleSaltAuthEvent (pData) {
    if (this.playOrPause !== "play") {
      return;
    }

    const minionsDict = Utils.getStorageItemObject("session", "minions_txt");
    const tr = this.table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));

    if (tr) {
      this._handleExistingMinion(tr, pData, minionsDict);
    } else if (this.table.querySelector("tr") === null) {
      // only when the full list is already available
      // this prevents a random set of records from appearing
      // at the top of the table that happen to be received
      // before the full list was received
      return;
    } else {
      this._handleNewMinion(pData, minionsDict);
    }

    const searchBlock = this.div.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, this.table, "refresh");

    this.updateFooter();
    this._updateFingerprintIfNeeded(pData);
  }

  _handleExistingMinion (pTr, pData, pMinionsDict) {
    const statusTd = pTr.querySelector(".status");
    // drop all other classes (accepted, rejected, etc)
    // do not update screen when nothing changed; that keeps any search highlight
    this._updateMinionStatus(statusTd, pData, pTr, pMinionsDict);

    if (pData.act === "delete") {
      // "-1" due to the <tr> for the header that is inside <thead>
      pTr.parentNode.deleteRow(pTr.rowIndex - 1);
      if (pData.id in pMinionsDict) {
        this._addMissingMinion(pData.id, pMinionsDict);
      }
      return;
    }

    // keep the fingerprint
    // update the menu because it may be in a hidden state
    pTr.dropdownmenu.verifyAll();
    this.panelMenu.verifyAll();
  }

  _updateMinionStatus (pStatusTd, pData, pTr, pMinionsDict) {
    const newStatus = this._getNewStatus(pData.act);
    if (!newStatus) {
      // unknown status
      // do not update screen
      return;
    }

    pStatusTd.className = "status";
    pStatusTd.classList.add(newStatus);
    if (pStatusTd.innerText !== newStatus) {
      pStatusTd.innerText = newStatus;
      KeysPanel._flagMinion(pData.id, pStatusTd, pTr, pMinionsDict);
    }
  }

  static _getNewStatus (pAction) {
    switch (pAction) {
    case "accept":
      return "accepted";
    case "reject":
      return "rejected";
    case "pend":
      return "unaccepted";
    default:
      return null;
    }
  }

  _handleNewMinion (pData, pMinionsDict) {
    // new items will be added at the bottom of the table
    // except new pending keys, which come at the top.
    // so that it gets the proper attention.
    switch (pData.act) {
    case "pend":
      this._addPreMinion(pData.id, pMinionsDict, true);
      break;
    case "accept":
      this._addAcceptedMinion(pData.id, pMinionsDict);
      break;
    case "reject":
      this._addRejectedMinion(pData.id, pMinionsDict);
      break;
    case "delete":
      // delete of an unknown minion, never mind
      break;
    default:
      // unknown status
      // do not update screen
      break;
    }
  }

  _updateFingerprintIfNeeded (pData) {
    // we do not have the fingerprint yet
    // pre-fill with a dummy value and then retrieve the actual value
    const tr = this.table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));
    if (!tr) {
      return;
    }

    let fingerprintSpan = tr.querySelector("td.fingerprint");
    if (!fingerprintSpan) {
      // on startup, the field is still classed "os" instead of "fingerprint"
      fingerprintSpan = tr.querySelector("td.os");
    }

    if (!tr.dataset.fingerprintKnown) {
      this._fetchAndUpdateFingerprint(pData.id, fingerprintSpan);
    }
  }

  _fetchAndUpdateFingerprint (pMinionId, pFingerprintSpan) {
    pFingerprintSpan.innerText = "(refresh page for fingerprint)";
    const wheelKeyFingerPromise = this.api.getWheelKeyFinger(pMinionId);
    wheelKeyFingerPromise.then((ok_WheelKeyFinger) => {
      this._handleWheelKeyFinger(ok_WheelKeyFinger);
      return true;
    }, (_error_WheelKeyFinger) => {
      const wheelKeyFingerData = {"return": [{"data": {"return": {"minions": {}}}}]};
      wheelKeyFingerData.return[0]["data"]["return"]["minions"][pMinionId] = JSON.stringify(_error_WheelKeyFinger);
      this._handleWheelKeyFinger(wheelKeyFingerData);
      return false;
    });
  }

  handleSaltKeyEvent (pData) {
    this.handleSaltAuthEvent(pData);
  }

  handleSyndicEvent () {
    this._showSyndicInfo(true);
  }
}
