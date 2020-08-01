/* global document window */

import {DropDownMenu} from "../DropDown.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {Utils} from "../Utils.js";

export class KeysRoute extends PageRoute {

  constructor (pRouter) {
    super("keys", "Keys", "page-keys", "button-keys", pRouter);

    this.fingerprintPattern = /^[0-9a-f:]+$/i;

    this._handleKeysWheelKeyListAll = this._handleKeysWheelKeyListAll.bind(this);
    this._handleWheelKeyFinger = this._handleWheelKeyFinger.bind(this);

    Utils.addTableHelp(this.getPageElement(), "The content of this page is\nautomatically refreshed");
    Utils.makeTableSortable(this.getPageElement(), false, 1);
    Utils.makeTableSearchable(this.getPageElement(), "keys-search-button", "keys-table");
    Utils.makeTableSearchable(this.getPageElement(), "keys-search-button-jobs", "keys-jobs-table");
  }

  onShow () {
    const that = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      that._handleKeysWheelKeyListAll(pWheelKeyListAllData);
      wheelKeyFingerPromise.then((pWheelKeyFingerData) => {
        that._handleWheelKeyFinger(pWheelKeyFingerData);
      }, (pWheelKeyFingerMsg) => {
        const wheelKeyFingerData = {"return": [{"data": {"return": {"minions": {}}}}]};
        if (pWheelKeyListAllData) {
          for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
            wheelKeyFingerData.return[0]["data"]["return"]["minions"][minionId] = JSON.stringify(pWheelKeyFingerMsg);
          }
        }
        that._handleWheelKeyFinger(wheelKeyFingerData);
      });
    }, (pWheelKeyListAllMsg) => {
      that._handleKeysWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      that.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
        that.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, (pRunnerJobsActiveMsg) => {
        that.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, (pRunnerJobsListJobsMsg) => {
      that.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    });
  }

  _handleWheelKeyFinger (pWheelKeyFingerData) {
    if (!pWheelKeyFingerData) {
      return;
    }

    const allKeys = pWheelKeyFingerData.return[0].data.return;

    for (const property of Object.keys(allKeys)) {
      if (property === "local") {
        continue;
      }
      const hosts = allKeys[property];
      for (const minionId of Object.keys(hosts)) {
        const item = this.pageElement.querySelector("#" + Utils.getIdFromMinionId(minionId) + " .os");
        if (item) {
          // remove td.os for known minions and add td.fingerprint
          item.classList.remove("os");
          item.classList.add("fingerprint");
        }

        // update td.fingerprint with fingerprint value
        const fingerprintElement = this.pageElement.querySelector("#" + Utils.getIdFromMinionId(minionId) + " .fingerprint");
        const fingerprint = hosts[minionId];
        if (!fingerprintElement) {
          continue;
        }
        if (!fingerprint.match(this.fingerprintPattern)) {
          fingerprintElement.innerText = "";
          Utils.addErrorToTableCell(fingerprintElement, fingerprint);
          continue;
        }
        fingerprintElement.innerText = fingerprint;
      }
    }
  }

  _handleKeysWheelKeyListAll (pWheelKeyListAllData) {
    if (!pWheelKeyListAllData) {
      return;
    }

    const table = document.getElementById("keys-table");

    const msgDiv = document.getElementById("keys-msg");
    if (PageRoute.showErrorRowInstead(table, pWheelKeyListAllData, msgDiv)) {
      return;
    }

    const allKeys = pWheelKeyListAllData.return[0].data.return;

    const minionsDict = JSON.parse(Utils.getStorageItem("session", "minions-txt"));

    // Unaccepted goes first because that is where the user must decide
    const minionIdsPre = allKeys.minions_pre.sort();
    for (const minionId of minionIdsPre) {
      this._addPreMinion(table, minionId, minionsDict);
    }

    const minionIdsAccepted = allKeys.minions.sort();
    for (const minionId of minionIdsAccepted) {
      this._addAcceptedMinion(table, minionId, minionsDict);
    }

    const minionIdsDenied = allKeys.minions_denied.sort();
    for (const minionId of minionIdsDenied) {
      this._addDeniedMinion(table, minionId, minionsDict);
    }

    const minionIdsRejected = allKeys.minions_rejected.sort();
    for (const minionId of minionIdsRejected) {
      this._addRejectedMinion(table, minionId, minionsDict);
    }

    for (const minionId of Object.keys(minionsDict)) {
      if (table.querySelector("#" + Utils.getIdFromMinionId(minionId))) {
        continue;
      }
      this._addMissingMinion(table, minionId);
    }

    this._updateTableSummary();
  }

  _updateTableSummary () {
    const cnt = {};
    cnt["unaccepted"] = 0;
    cnt["accepted"] = 0;
    cnt["denied"] = 0;
    cnt["rejected"] = 0;
    // cnt["missing"] = 0;
    const tbody = document.getElementById("keys-table-body");
    for (const tr of tbody.children) {
      const statusField = tr.querySelector("td.status");
      const statusText = statusField.innerText;
      if (cnt[statusText] === undefined) {
        cnt[statusText] = 0;
      }
      cnt[statusText] += 1;
    }

    let summary = "";
    for (const key of Object.keys(cnt).sort()) {
      summary += ", " + Utils.txtZeroOneMany(cnt[key],
        "no " + key + " keys",
        "{0} " + key + " key",
        "{0} " + key + " keys");
    }

    // remove the first comma
    summary = summary.replace(/^, /, "");
    // capitalize the first word (can only be "no")
    summary = summary.replace(/^no/, "No");

    const msgDiv = document.getElementById("keys-msg");
    msgDiv.innerText = summary;
  }

  _addAcceptedMinion (pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if (Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
      Utils.addToolTip(minionIdSpan, "Unexpected entry\nThis entry may need to be rejected!\nUpdate file 'minions.txt' when needed", "bottom-left");
      minionIdTd.style.color = "red";
      minionIdTd.style.fontWeight = "bold";
    }
    minionTr.appendChild(minionIdTd);

    const accepted = Route.createTd("status", "accepted");
    accepted.setAttribute("sorttable_customkey", 2);
    accepted.classList.add("accepted");
    minionTr.appendChild(accepted);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);
  }

  _addRejectedMinion (pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if (Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
      Utils.addToolTip(minionIdSpan, "Unexpected entry\nBut it is already rejected\nUpdate file 'minions.txt' when needed", "bottom-left");
      minionIdTd.style.color = "red";
    }
    minionTr.appendChild(minionIdTd);

    const rejected = Route.createTd("status", "rejected");
    rejected.setAttribute("sorttable_customkey", 4);
    rejected.classList.add("rejected");
    minionTr.appendChild(rejected);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addDeniedMinion (pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if (Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
      Utils.addToolTip(minionIdSpan, "Unexpected entry\nBut it is already denied\nUpdate file 'minions.txt' when needed", "bottom-left");
      minionIdTd.style.color = "red";
    }
    minionTr.appendChild(minionIdTd);

    const denied = Route.createTd("status", "denied");
    denied.setAttribute("sorttable_customkey", 3);
    denied.classList.add("denied");
    minionTr.appendChild(denied);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addPreMinion (pContainer, pMinionId, pMinionsDict, pInsertAtTop = false) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if (Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
      Utils.addToolTip(minionIdSpan, "Unexpected entry\nDo not accept this entry without proper verification!\nUpdate file 'minions.txt' when needed", "bottom-left");
      minionIdTd.style.color = "red";
      minionIdTd.style.fontWeight = "bold";
    }
    minionTr.appendChild(minionIdTd);

    const pre = Route.createTd("status", "unaccepted");
    // unaccepted comes first because user action is needed
    // all others have the same order as in 'salt-key'
    pre.setAttribute("sorttable_customkey", 1);
    pre.classList.add("unaccepted");
    minionTr.appendChild(pre);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);

    if (pInsertAtTop) {
      // used for event based additions
      pContainer.tBodies[0].insertBefore(minionTr, pContainer.tBodies[0].firstChild);
    } else {
      // used for query based additions (when building page)
      pContainer.tBodies[0].appendChild(minionTr);
    }
  }

  _addMissingMinion (pContainer, pMinionId) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId), "UNKNOWN");

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    Utils.addToolTip(minionIdSpan, "Entry is missing\nIs the host running and is the salt-minion installed and started?\nUpdate file 'minions.txt' when needed", "bottom-left");
    minionIdTd.style.color = "red";
    minionTr.appendChild(minionIdTd);

    const missing = Route.createTd("status", "missing");
    missing.setAttribute("sorttable_customkey", 5);
    missing.classList.add("missing");
    minionTr.appendChild(missing);

    minionTr.appendChild(Route.createTd("fingerprint", ""));

    // drop down menu
    this._addDropDownMenu(minionTr, pMinionId);
  }

  _addDropDownMenu (pMinionTr, pMinionId) {
    // final dropdownmenu
    const menu = new DropDownMenu(pMinionTr);
    this._addMenuItemWheelKeyAccept1(menu, pMinionId);
    this._addMenuItemWheelKeyReject(menu, pMinionId);
    this._addMenuItemWheelKeyDelete(menu, pMinionId);
    this._addMenuItemWheelKeyAccept2(menu, pMinionId);
    pMinionTr.saltguidropdownmenu = menu;
  }

  _addMenuItemWheelKeyAccept1 (pMenu, pMinionId) {
    pMenu.addMenuItem((pMenuItem) => {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "denied" || status === "unaccepted";
      pMenuItem.innerHTML = "Accept&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }, (pClickEvent) => {
      let cmd = "wheel.key.accept";
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      if (status === "denied") {
        cmd += " include_denied=true";
      } else if (status === "rejected") {
        cmd += " include_rejected=true";
      }
      this.runCommand(pClickEvent, pMinionId, cmd);
    });
  }

  _addMenuItemWheelKeyAccept2 (pMenu, pMinionId) {
    pMenu.addMenuItem((pMenuItem) => {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "rejected";
      pMenuItem.innerHTML = "Accept&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }, (pClickEvent) => {
      let cmd = "wheel.key.accept";
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      if (status === "denied") {
        cmd += " include_denied=true";
      } else if (status === "rejected") {
        cmd += " include_rejected=true";
      }
      this.runCommand(pClickEvent, pMinionId, cmd);
    });
  }

  _addMenuItemWheelKeyReject (pMenu, pMinionId) {
    pMenu.addMenuItem((pMenuItem) => {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "accepted" || status === "denied" || status === "unaccepted";
      pMenuItem.innerHTML = "Reject&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }, (pClickEvent) => {
      let cmd = "wheel.key.reject";
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      if (status === "accepted") {
        cmd += " include_accepted=true";
      } else if (status === "denied") {
        cmd += " include_denied=true";
      }
      this.runCommand(pClickEvent, pMinionId, cmd);
    });
  }

  _addMenuItemWheelKeyDelete (pMenu, pMinionId) {
    pMenu.addMenuItem((pMenuItem) => {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "accepted" || status === "rejected" || status === "unaccepted" || status === "denied";
      pMenuItem.innerHTML = "Delete&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }, (pClickEvent) => {
      const cmd = "wheel.key.delete";
      this.runCommand(pClickEvent, pMinionId, cmd);
    });
  }

  handleSaltAuthEvent (pTag, pData) {
    const table = document.getElementById("keys-table");
    const tr = table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));
    const minionsDict = JSON.parse(window.sessionStorage.getItem("minions-txt"));
    if (tr) {
      const statusTd = tr.querySelector(".status");
      // drop all other classes (accepted, rejected, etc)
      // do not update screen when nothing changed; that keeps any search highlight
      if (pData.act === "accept") {
        statusTd.className = "status";
        statusTd.classList.add("accepted");
        if (statusTd.innerText !== "accepted") {
          statusTd.innerText = "accepted";
        }
      } else if (pData.act === "reject") {
        statusTd.className = "status";
        statusTd.classList.add("rejected");
        if (statusTd.innerText !== "rejected") {
          statusTd.innerText = "rejected";
        }
      } else if (pData.act === "pend") {
        statusTd.className = "status";
        statusTd.classList.add("unaccepted");
        if (statusTd.innerText !== "unaccepted") {
          statusTd.innerText = "unaccepted";
        }
      } else if (pData.act === "delete") {
        // "-1" due to the <tr> for the header that is inside <thead>
        tr.parentNode.deleteRow(tr.rowIndex - 1);
        if (pData.id in minionsDict) {
          this._addMissingMinion(table, pData.id);
        }
      } else {
        // unknown status
        // do not update screen
      }
      // keep the fingerprint
      // update the menu because it may be in a hidden state
      tr.saltguidropdownmenu.verifyAll();
    } else if (table.querySelector("tr") === null) {
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
        this._addPreMinion(table, pData.id, minionsDict, true);
      } else if (pData.act === "accept") {
        this._addAcceptedMinion(table, pData.id, minionsDict);
      } else if (pData.act === "reject") {
        this._addRejectedMinion(table, pData.id, minionsDict);
      } else if (pData.act === "delete") {
        // delete of an unknown minion, never mind
      } else {
        // unknown status
        // do not update screen
      }
      /* eslint-enable no-lonely-if */
    }

    // we do not have the fingerprint yet
    // pre-fill with a dummy value and then retrieve the actual value
    const tr2 = table.querySelector("tr#" + Utils.getIdFromMinionId(pData.id));
    if (!tr2) {
      return;
    }
    // at this stage, the field is still classed "os" instead of "fingerprint"
    const fingerprintSpan = tr2.querySelector("td.os");
    if (fingerprintSpan && (fingerprintSpan.innerText === "" || fingerprintSpan.innerText === "loading...")) {
      fingerprintSpan.innerText = "(refresh page for fingerprint)";
      const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger(pData.id);
      const that = this;
      wheelKeyFingerPromise.then(this._handleWheelKeyFinger, (pWheelKeyFingerMsg) => {
        const wheelKeyFingerData = {"return": [{"data": {"return": {"minions": {}}}}]};
        wheelKeyFingerData.return[0]["data"]["return"]["minions"][pData.id] = JSON.stringify(pWheelKeyFingerMsg);
        that._handleWheelKeyFinger(wheelKeyFingerData);
      });
    }

    this._updateTableSummary();
  }

  handleSaltKeyEvent (pTag, pData) {
    this.handleSaltAuthEvent(pTag, pData);
  }
}
