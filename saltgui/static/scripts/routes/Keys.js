import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class KeysRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]keys$", "Keys", "#page-keys", "#button-keys", pRouter);

    this.fingerprintPattern = /^[0-9a-f:]+$/i;

    this._handleKeysWheelKeyListAll = this._handleKeysWheelKeyListAll.bind(this);
    this._handleWheelKeyFinger = this._handleWheelKeyFinger.bind(this);

    Utils.addTableHelp(this.getPageElement(), "The content of this page is\nautomatically refreshed");
    Utils.makeTableSortable(this.getPageElement(), false, 1);
    Utils.makeTableSearchable(this.getPageElement());
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then(pWheelKeyListAllData => {
      myThis._handleKeysWheelKeyListAll(pWheelKeyListAllData);
      wheelKeyFingerPromise.then(pWheelKeyFingerData => {
        myThis._handleWheelKeyFinger(pWheelKeyFingerData);
      }, pWheelKeyFingerMsg => {
        const wheelKeyFingerData = {"return":[{"data":{"return":{"minions":{}}}}]};
        if(pWheelKeyListAllData)
          for(const k of pWheelKeyListAllData.return[0].data.return.minions)
            wheelKeyFingerData.return[0]["data"]["return"]["minions"][k] = JSON.stringify(pWheelKeyFingerMsg);
        myThis._handleWheelKeyFinger(wheelKeyFingerData);
      });
    }, pWheelKeyListAllMsg => {
      myThis._handleKeysWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });

    runnerJobsListJobsPromise.then(pRunnerJobsListJobsData => {
      myThis.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then(pRunnerJobsActiveData => {
        myThis.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, pRunnerJobsActiveMsg => {
        myThis.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, pRunnerJobsListJobsMsg => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    }); 
  }

  _handleWheelKeyFinger(pWheelKeyFingerData) {
    if(!pWheelKeyFingerData) return;

    const allKeys = pWheelKeyFingerData.return[0].data.return;

    for(const property of Object.keys(allKeys)) {
      if(property === "local") continue;
      const hosts = allKeys[property];
      for(const minionId of Object.keys(hosts)) {
        const item = this.pageElement.querySelector("#" + Utils.getIdFromMinionId(minionId) + " .os");
        if(item) {
          // remove td.os for known minions and add td.fingerprint
          item.classList.remove("os");
          item.classList.add("fingerprint");
        }

        // update td.fingerprint with fingerprint value
        const fingerprintElement = this.pageElement.querySelector("#" + Utils.getIdFromMinionId(minionId) + " .fingerprint");
        const fingerprint = hosts[minionId];
        if(!fingerprintElement) continue;
        if(!fingerprint.match(this.fingerprintPattern)) {
          fingerprintElement.innerText = "";
          Utils.addErrorToTableCell(fingerprintElement, fingerprint);
          continue;
        }
        fingerprintElement.innerText = fingerprint;
      }
    }
  }

  _handleKeysWheelKeyListAll(pWheelKeyListAllData) {
    if(!pWheelKeyListAllData) return;

    const table = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(table, pWheelKeyListAllData)) return;

    const allKeys = pWheelKeyListAllData.return[0].data.return;

    const minionsDict = JSON.parse(window.sessionStorage.getItem("minions-txt"));

    // Unaccepted goes first because that is where the user must decide
    const minionIds_pre = allKeys.minions_pre.sort();
    for(const minionId of minionIds_pre) {
      this._addPreMinion(table, minionId, minionsDict);
    }

    const minionIds_accepted = allKeys.minions.sort();
    for(const minionId of minionIds_accepted) {
      this._addAcceptedMinion(table, minionId, minionsDict);
    }

    const minionIds_denied = allKeys.minions_denied.sort();
    for(const minionId of minionIds_denied) {
      this._addDeniedMinion(table, minionId, minionsDict);
    }

    const minionIds_rejected = allKeys.minions_rejected.sort();
    for(const minionId of minionIds_rejected) {
      this._addRejectedMinion(table, minionId, minionsDict);
    }

    for(const minionId of Object.keys(minionsDict)) {
      if(table.querySelector("#" + Utils.getIdFromMinionId(minionId))) continue;
      const minionTr = this.getElement(table, Utils.getIdFromMinionId(minionId), "UNKNOWN");

      const minionIdTd = Route.createTd("", "");
      const minionIdSpan = Route.createSpan("minion-id", minionId);
      minionIdTd.appendChild(minionIdSpan);
      Utils.addToolTip(minionIdSpan, "Entry is missing\nIs the host running and is the salt-minion installed and started?\nUpdate file 'minions.txt' when needed", "bottom-left");
      minionIdTd.style.color = "red";
      minionTr.appendChild(minionIdTd);

      const unknown = Route.createTd("status", "unknown");
      unknown.setAttribute("sorttable_customkey", 5);
      unknown.classList.add("unknown");
      minionTr.appendChild(unknown);

      minionTr.appendChild(Route.createTd("os", ""));

      minionTr.appendChild(Route.createTd("", ""));
    }

    this._updateTableSummary(table);
  }

  _updateTableSummary(pTable) {
    const cnt = { };
    cnt["unaccepted"] = 0;
    cnt["accepted"] = 0;
    cnt["denied"] = 0;
    cnt["rejected"] = 0;
    const tbody = pTable.querySelector("table tbody");
    for(const tr of tbody.children) {
      const statusField = tr.querySelector("td.status");
      const statusText = statusField.innerText;  
      if(cnt[statusText] === undefined) cnt[statusText] = 0;
      cnt[statusText]++;
    }

    let summary = "";
    for(const key of Object.keys(cnt).sort()) {
      summary += ", " + Utils.txtZeroOneMany(cnt[key],
        "no " + key + " keys",
        "{0} " + key + " key",
        "{0} " + key + " keys");
    }

    // remove the first comma
    summary = summary.replace(/^, /, "");
    // capitalize the first word (can only be "no")
    summary = summary.replace(/^no/, "No");

    const msgDiv = this.getPageElement().querySelector(".minion-list .msg");
    msgDiv.innerText = summary;
  }

  _addAcceptedMinion(pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if(Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
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

  _addRejectedMinion(pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if(Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
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

  _addDeniedMinion(pContainer, pMinionId, pMinionsDict) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if(Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
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

  _addPreMinion(pContainer, pMinionId, pMinionsDict, pInsertAtTop=false) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    const minionIdTd = Route.createTd("", "");
    const minionIdSpan = Route.createSpan("minion-id", pMinionId);
    minionIdTd.appendChild(minionIdSpan);
    if(Object.keys(pMinionsDict).length && !Object.keys(pMinionsDict).includes(pMinionId)) {
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

    if(pInsertAtTop) {
      // used for event based additions
      pContainer.tBodies[0].insertBefore(minionTr, pContainer.tBodies[0].firstChild);
    } else {
      // used for query based additions (when building page)
      pContainer.tBodies[0].appendChild(minionTr);
    }
  }

  _addDropDownMenu(pMinionTr, pMinionId) {
    // final dropdownmenu
    const menu = new DropDownMenu(pMinionTr);
    this._addMenuItemWheelKeyAccept1(menu, pMinionId);
    this._addMenuItemWheelKeyReject(menu, pMinionId);
    this._addMenuItemWheelKeyDelete(menu, pMinionId);
    this._addMenuItemWheelKeyAccept2(menu, pMinionId);
    pMinionTr.setAttribute("dropdownmenu", menu);
  }

  _addMenuItemWheelKeyAccept1(pMenu, pMinionId) {
    pMenu.addMenuItem(function(pMenuItem) {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "denied" || status === "unaccepted";
      pMenuItem.innerHTML = "Accept&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }.bind(this), function(pClickEvent) {
      let cmd = "wheel.key.accept";
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      if(status === "denied")
        cmd += " include_denied=true";
      else if(status === "rejected")
        cmd += " include_rejected=true"
      this.runCommand(pClickEvent, pMinionId, cmd);
    }.bind(this));
  }

  _addMenuItemWheelKeyAccept2(pMenu, pMinionId) {
    pMenu.addMenuItem(function(pMenuItem) {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "rejected";
      pMenuItem.innerHTML = "Accept&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }.bind(this), function(pClickEvent) {
      let cmd = "wheel.key.accept";
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      if(status === "denied")
        cmd += " include_denied=true";
      else if(status === "rejected")
        cmd += " include_rejected=true";
      this.runCommand(pClickEvent, pMinionId, cmd);
    }.bind(this));
  }

  _addMenuItemWheelKeyReject(pMenu, pMinionId) {
    pMenu.addMenuItem(function(pMenuItem) {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "accepted" || status === "denied" || status === "unaccepted";
      pMenuItem.innerHTML = "Reject&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }.bind(this), function(pClickEvent) {
      let cmd = "wheel.key.reject";
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      if(status === "accepted")
        cmd += " include_accepted=true";
      else if(status === "denied")
        cmd += " include_denied=true";
      this.runCommand(pClickEvent, pMinionId, cmd);
    }.bind(this));
  }

  _addMenuItemWheelKeyDelete(pMenu, pMinionId) {
    pMenu.addMenuItem(function(pMenuItem) {
      const minionTr = pMenu.menuDropdown.parentElement.parentElement;
      const status = minionTr.querySelector(".status").innerText;
      const shown = status === "accepted" || status === "rejected" || status === "unaccepted" || status === "denied";
      pMenuItem.innerHTML = "Delete&nbsp;key...";
      pMenuItem.style.display = shown ? "inline-block" : "none";
    }.bind(this), function(pClickEvent) {
      let cmd = "wheel.key.delete";
      this.runCommand(pClickEvent, pMinionId, cmd);
    }.bind(this));
  }

  handleSaltAuthEvent(pTag, pData) {
    const page = document.getElementById("page-keys");
    const table = page.querySelector("#minions");
    const tr = page.querySelector("table tr#" + Utils.getIdFromMinionId(pData.id));
    const minionsDict = JSON.parse(window.sessionStorage.getItem("minions-txt"));
    if(tr) {
      const statusTd = tr.querySelector(".status");
      // drop all other classes (accepted, rejected, etc)
      // do not update screen when nothing changed; that keeps any search highlight
      if(pData.act === "accept") {
        statusTd.className = "status";
        statusTd.classList.add("accepted");
        if(statusTd.innerText !== "accepted") statusTd.innerText = "accepted";
      } else if(pData.act === "reject") {
        statusTd.className = "status";
        statusTd.classList.add("rejected");
        if(statusTd.innerText !== "rejected") statusTd.innerText = "rejected";
      } else if(pData.act === "pend") {
        statusTd.className = "status";
        statusTd.classList.add("unaccepted");
        if(statusTd.innerText !== "unaccepted") statusTd.innerText = "unaccepted";
      } else if(pData.act === "delete") {
        // "-1" due to the <tr> for the header that is inside <thead>
        tr.parentNode.deleteRow(tr.rowIndex - 1);
      } else {
        // unknown status
        // do not update screen
      }
      // keep the fingerprint
    } else if(page.querySelector("table tr") === null) {
      // only when the full list is already available
      // this prevents a random set of records from appearing
      // at the top of the table that happen to be received
      // before the full list was received
      return;
    } else {
      // new items will be added at the bottom of the table
      // except new pending keys, which come at the top.
      // so that it gets the proper attention.
      if(pData.act === "pend") {
        this._addPreMinion(table, pData.id, minionsDict, true);
      } else if(pData.act === "accept") {
        this._addAcceptedMinion(table, pData.id, minionsDict);
      } else if(pData.act === "reject") {
        this._addRejectedMinion(table, pData.id, minionsDict);
      } else if(pData.act === "delete") {
        // delete of an unknown minion, never mind
      } else {
        // unknown status
        // do not update screen
      }
      // we do not have the fingerprint yet
      // pre-fill with a dummy value and then retrieve the actual value
      const fingerprintSpan = page.querySelector("table tr#" + Utils.getIdFromMinionId(pData.id) + " .fingerprint");
      if(fingerprintSpan) fingerprintSpan.innerText = "(refresh page for fingerprint)";
      const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger(pData.id);
      const myThis = this;
      wheelKeyFingerPromise.then(this._handleWheelKeyFinger, pWheelKeyFingerMsg => {
        const wheelKeyFingerData = {"return":[{"data":{"return":{"minions":{}}}}]};
        wheelKeyFingerData.return[0]["data"]["return"]["minions"][pData.id] = JSON.stringify(pWheelKeyFingerMsg);
        myThis._handleWheelKeyFinger(wheelKeyFingerData);
      });
    }

    this._updateTableSummary(table);
  }

  handleSaltKeyEvent(pTag, pData) {
    this.handleSaltAuthEvent(pTag, pData);
  }
}
