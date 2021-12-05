/* global window */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
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
    this.addPlayPauseButton("play");
    this.addHelpButton([
      "The content of this page is",
      "automatically refreshed"
    ]);
    this.addTable(["Minion", "Status", "-menu-", "Fingerprint"], "data-list-keys");
    this.setTableSortable("Status", "asc");
    this.addMsg();

    this.fingerprintPattern = /^[0-9a-f:]+$/i;
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.api.getWheelKeyFinger();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleKeysWheelKeyListAll(pWheelKeyListAllData);
      wheelKeyFingerPromise.then((pWheelKeyFingerData) => {
        this._handleWheelKeyFinger(pWheelKeyFingerData);
        return true;
      }, (pWheelKeyFingerMsg) => {
        const allMinionsErr = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, JSON.stringify(pWheelKeyFingerMsg));
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
        const fingerprintElement = fingerprintTr.querySelector(".fingerprint");
        const fingerprint = hosts[minionId];
        if (!fingerprintElement) {
          continue;
        }
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

    const minionsDict = JSON.parse(Utils.getStorageItem("session", "minions-txt"));

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

    Utils.setStorageItem("session", "minions_pre_length", allKeys.minions_pre.length);

    this.updateFooter();

    this.panelMenu.verifyAll();
  }

  updateFooter () {
    const cnt = {};
    cnt["unaccepted"] = 0;
    cnt["accepted"] = 0;
    cnt["denied"] = 0;
    cnt["rejected"] = 0;
    // cnt["missing"] = 0;
    const tbody = this.table.tBodies[0];
    for (const tr of tbody.children) {
      const statusText = tr.dataset.status;
      if (cnt[statusText] === undefined) {
        cnt[statusText] = 0;
      }
      cnt[statusText] += 1;
    }

    let txt = "";
    for (const key of Object.keys(cnt).sort()) {
      txt += ", " + Utils.txtZeroOneMany(cnt[key],
        "no " + key + " keys",
        "{0} " + key + " key",
        "{0} " + key + " keys");
    }

    // remove the first comma
    txt = txt.replace(/^, /, "");
    // capitalize the first word (can only be "no")
    txt = txt.replace(/^no/, "No");

    if (this.playOrPause === "pause") {
      txt += ", press " + Character.buttonInText(Character.CH_PLAY) + " to continue";
    }

    KeysPanel.cntUnaccepted = cnt["unaccepted"];
    KeysPanel.cntAccepted = cnt["accepted"];
    KeysPanel.cntDenied = cnt["denied"];
    KeysPanel.cntRejected = cnt["rejected"];

    this.setMsg(txt, true);
  }

  static _flagMinion (pMinionId, pMinionTr, pMinionsDict) {
    let isBold = false;
    let color = "";
    let txt = "";

    if (!Object.keys(pMinionsDict).length) {
      // list of well-known minion is empty
      // assume we actually don't known
      // Arrays.includes() is only available from ES7/2016
    } else if (Object.keys(pMinionsDict).indexOf(pMinionId) >= 0) {
      // this is a known minion
    } else {
      const status = pMinionTr.dataset.status;
      switch (status) {
      case "accepted":
        txt = "Unexpected entry\nThis entry may need to be rejected!";
        color = "red";
        break;
      case "rejected":
        txt = "Unexpected entry\nBut it is already rejected";
        color = "red";
        break;
      case "denied":
        txt = "Unexpected entry\nBut it is already denied";
        color = "red";
        break;
      case "unaccepted":
        txt = "Unexpected entry\nDo not accept this entry without proper verification!";
        color = "red";
        isBold = true;
        break;
      case "missing":
        txt = "Entry is missing\nIs the host running and is the salt-minion installed and started?";
        color = "red";
        break;
      default:
        txt = "Unknown status '" + status + "'";
        color = "red";
        isBold = true;
      }
    }

    const minionIdSpan = pMinionTr.querySelector("td span");

    if (txt) {
      Utils.addToolTip(
        minionIdSpan,
        txt + "\nUpdate file 'minions.txt' when needed",
        "bottom-left");
    } else {
      Utils.addToolTip(minionIdSpan, null);
    }

    minionIdSpan.style.color = color;

    minionIdSpan.style.fontWeight = isBold ? "bold" : "";
  }

  _addAcceptedMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.dataset.status = "accepted";
    minionTr.appendChild(minionIdTd);
    KeysPanel._flagMinion(pMinionId, minionTr, pMinionsDict);

    const accepted = Utils.createTd("status", "accepted");
    accepted.setAttribute("sorttable_customkey", 2);
    accepted.classList.add("accepted");
    minionTr.appendChild(accepted);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading..."));
  }

  _addRejectedMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.dataset.status = "rejected";
    minionTr.appendChild(minionIdTd);
    KeysPanel._flagMinion(pMinionId, minionTr, pMinionsDict);

    const rejected = Utils.createTd("status", "rejected");
    rejected.setAttribute("sorttable_customkey", 4);
    rejected.classList.add("rejected");
    minionTr.appendChild(rejected);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading..."));

    const tbody = this.table.tBodies[0];
    tbody.appendChild(minionTr);
  }

  _addDeniedMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.dataset.status = "denied";
    minionTr.appendChild(minionIdTd);
    KeysPanel._flagMinion(pMinionId, minionTr, pMinionsDict);

    const denied = Utils.createTd("status", "denied");
    denied.setAttribute("sorttable_customkey", 3);
    denied.classList.add("denied");
    minionTr.appendChild(denied);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading..."));

    const tbody = this.table.tBodies[0];
    tbody.appendChild(minionTr);
  }

  _addPreMinion (pMinionId, pMinionsDict, pInsertAtTop = false) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Utils.createTd();
    const minionIdSpan = Utils.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    minionTr.dataset.status = "unaccepted";
    minionTr.appendChild(minionIdTd);
    KeysPanel._flagMinion(pMinionId, minionTr, pMinionsDict);

    const pre = Utils.createTd("status", "unaccepted");
    // unaccepted comes first because user action is needed
    // all others have the same order as in 'salt-key'
    pre.setAttribute("sorttable_customkey", 1);
    pre.classList.add("unaccepted");
    minionTr.appendChild(pre);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Utils.createTd("os", "loading..."));

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
    minionTr.dataset.status = "missing";
    minionTr.appendChild(minionIdTd);
    KeysPanel._flagMinion(pMinionId, minionTr, pMinionsDict);

    const missing = Utils.createTd("status", "missing");
    missing.setAttribute("sorttable_customkey", 5);
    missing.classList.add("missing");
    minionTr.appendChild(missing);

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    minionTr.appendChild(Utils.createTd("fingerprint", ""));
  }

  _addDropDownMenu (pMinionTr, pMinionId) {
    // final dropdownmenu
    const menu = new DropDownMenu(pMinionTr, true);
    this._addMenuItemWheelKeyAccept1(menu, pMinionId, pMinionTr);
    this._addMenuItemWheelKeyReject(menu, pMinionId, pMinionTr);
    this._addMenuItemWheelKeyDelete(menu, pMinionId, pMinionTr);
    this._addMenuItemWheelKeyAccept2(menu, pMinionId, pMinionTr);
    pMinionTr.saltguidropdownmenu = menu;
  }

  _addMenuItemWheelKeyAccept1 (pMenu, pMinionId, pMinionTr) {
    pMenu.addMenuItem(() => {
      const status = pMinionTr.dataset.status;
      if (status === "denied" || status === "unaccepted") {
        return "Accept key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      const status = pMinionTr.dataset.status;
      if (status === "denied") {
        cmdArr.push("include_denied=", true);
      } else if (status === "rejected") {
        cmdArr.push("include_rejected=", true);
      }
      this.runCommand(pMinionId, cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnaccepted () {
    this.panelMenu.addMenuItem(() => {
      if (KeysPanel.cntUnaccepted > 0) {
        return "Accept all unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      this.runCommand("*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedRejected () {
    this.panelMenu.addMenuItem(() => {
      if (!KeysPanel.cntRejected) {
        return null;
      }
      if (KeysPanel.cntUnaccepted > 0) {
        return "Accept all unaccepted+rejected keys...";
      }
      return "Accept all rejected keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_rejected=", true];
      this.runCommand("*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!KeysPanel.cntDenied) {
        return null;
      }
      if (KeysPanel.cntUnaccepted > 0) {
        return "Accept all unaccepted+denied keys...";
      }
      return "Accept all denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_denied=", true];
      this.runCommand("*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyAcceptAllUnacceptedRejectedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!KeysPanel.cntRejected || !KeysPanel.cntDenied) {
        return null;
      }
      if (KeysPanel.cntUnaccepted > 0) {
        return "Accept all unaccepted+denied+rejected keys...";
      }
      return "Accept all denied+rejected keys...";
    }, () => {
      const cmdArr = ["wheel.key.accept", "include_denied=", true, "include_rejected=", true];
      this.runCommand("*", cmdArr);
    });
  }

  _addMenuItemWheelKeyAccept2 (pMenu, pMinionId, pMinionTr) {
    pMenu.addMenuItem(() => {
      const status = pMinionTr.dataset.status;
      if (status === "rejected") {
        return "Accept key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.accept"];
      const status = pMinionTr.dataset.status;
      if (status === "denied") {
        cmdArr.push("include_denied=", true);
      } else if (status === "rejected") {
        cmdArr.push("include_rejected=", true);
      }
      this.runCommand(pMinionId, cmdArr);
    });
  }

  _addMenuItemWheelKeyReject (pMenu, pMinionId, pMinionTr) {
    pMenu.addMenuItem(() => {
      const status = pMinionTr.dataset.status;
      if (status === "accepted" || status === "denied" || status === "unaccepted") {
        return "Reject key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.reject"];
      const status = pMinionTr.dataset.status;
      if (status === "accepted") {
        cmdArr.push("include_accepted=", true);
      } else if (status === "denied") {
        cmdArr.push("include_denied=", true);
      }
      this.runCommand(pMinionId, cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnaccepted () {
    this.panelMenu.addMenuItem(() => {
      if (KeysPanel.cntUnaccepted > 0) {
        return "Reject all unaccepted keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.reject"];
      this.runCommand("*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedAccepted () {
    this.panelMenu.addMenuItem(() => {
      if (!KeysPanel.cntAccepted) {
        return null;
      }
      if (KeysPanel.cntUnaccepted > 0) {
        return "Reject all unaccepted+accepted keys...";
      }
      return "Reject all accepted keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_accepted=", true];
      this.runCommand("*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!KeysPanel.cntDenied) {
        return null;
      }
      if (KeysPanel.cntUnaccepted > 0) {
        return "Reject all unaccepted+denied keys...";
      }
      return "Reject all denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_denied=", true];
      this.runCommand("*", cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyRejectAllUnacceptedAcceptedDenied () {
    this.panelMenu.addMenuItem(() => {
      if (!KeysPanel.cntAccepted || !KeysPanel.cntDenied) {
        return null;
      }
      if (KeysPanel.cntUnaccepted > 0) {
        return "Reject all unaccepted+accepted+denied keys...";
      }
      return "Reject all accepted+denied keys...";
    }, () => {
      const cmdArr = ["wheel.key.reject", "include_accepted=", true, "include_denied=", true];
      this.runCommand("*", cmdArr);
    });
  }

  _addMenuItemWheelKeyDelete (pMenu, pMinionId, pMinionTr) {
    pMenu.addMenuItem(() => {
      const status = pMinionTr.dataset.status;
      if (status === "accepted" || status === "rejected" || status === "unaccepted" || status === "denied") {
        return "Delete key...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.delete"];
      this.runCommand(pMinionId, cmdArr);
    });
  }

  _addPanelMenuItemWheelKeyDeleteAll () {
    this.panelMenu.addMenuItem(() => {
      if (KeysPanel.cntAccepted > 0 || KeysPanel.cntUnaccepted > 0 || KeysPanel.cntRejected > 0 || KeysPanel.cntDenied > 0) {
        return "Delete all keys...";
      }
      return null;
    }, () => {
      const cmdArr = ["wheel.key.delete"];
      this.runCommand("*", cmdArr);
    });
  }

  handleSaltAuthEvent (pData) {

    if (this.playOrPause !== "play") {
      return;
    }

    const tr = this.table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));
    const minionsDict = JSON.parse(window.sessionStorage.getItem("minions-txt"));
    if (tr) {
      const statusTd = tr.querySelector(".status");
      // drop all other classes (accepted, rejected, etc)
      // do not update screen when nothing changed; that keeps any search highlight
      if (pData.act === "accept") {
        statusTd.className = "status";
        statusTd.classList.add("accepted");
        if (tr.dataset.status !== "accepted") {
          tr.dataset.status = "accepted";
          statusTd.innerText = "accepted";
          KeysPanel._flagMinion(pData.id, tr, minionsDict);
        }
      } else if (pData.act === "reject") {
        statusTd.className = "status";
        statusTd.classList.add("rejected");
        if (tr.dataset.status !== "rejected") {
          tr.dataset.status = "rejected";
          statusTd.innerText = "rejected";
          KeysPanel._flagMinion(pData.id, tr, minionsDict);
        }
      } else if (pData.act === "pend") {
        statusTd.className = "status";
        statusTd.classList.add("unaccepted");
        if (tr.dataset.status !== "unaccepted") {
          tr.dataset.status = "unaccepted";
          statusTd.innerText = "unaccepted";
          KeysPanel._flagMinion(pData.id, tr, minionsDict);
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
      tr.saltguidropdownmenu.verifyAll();
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
}
