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

    // Unaccepted goes first because that is where the user must decide
    const minionIds_pre = allKeys.minions_pre.sort();
    for(const minionId of minionIds_pre) {
      this._addPreMinion(table, minionId);
    }

    const minionIds_accepted = allKeys.minions.sort();
    for(const minionId of minionIds_accepted) {
      this._addAcceptedMinion(table, minionId);
    }

    const minionIds_denied = allKeys.minions_denied.sort();
    for(const minionId of minionIds_denied) {
      this._addDeniedMinion(table, minionId);
    }

    const minionIds_rejected = allKeys.minions_rejected.sort();
    for(const minionId of minionIds_rejected) {
      this._addRejectedMinion(table, minionId);
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

  _addAcceptedMinion(pContainer, pMinionId) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const accepted = Route.createTd("status", "accepted");
    accepted.setAttribute("sorttable_customkey", 2);
    accepted.classList.add("accepted");
    minionTr.appendChild(accepted);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // preliminary dropdown menu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemWheelKeyReject(menu, pMinionId, " include_accepted=true");
    this._addMenuItemWheelKeyDelete(menu, pMinionId, "");
  }

  _addRejectedMinion(pContainer, pMinionId) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const rejected = Route.createTd("status", "rejected");
    rejected.setAttribute("sorttable_customkey", 4);
    rejected.classList.add("rejected");
    minionTr.appendChild(rejected);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemWheelKeyDelete(menu, pMinionId, "");
    this._addMenuItemWheelKeyAccept(menu, pMinionId, " include_rejected=true");

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addDeniedMinion(pContainer, pMinionId) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const denied = Route.createTd("status", "denied");
    denied.setAttribute("sorttable_customkey", 3);
    denied.classList.add("denied");
    minionTr.appendChild(denied);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemWheelKeyAccept(menu, pMinionId, " include_denied=true");
    this._addMenuItemWheelKeyReject(menu, pMinionId, " include_denied=true");
    this._addMenuItemWheelKeyDelete(menu, pMinionId, "");

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addPreMinion(pContainer, pMinionId, pInsertAtTop=false) {
    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const pre = Route.createTd("status", "unaccepted");
    // unaccepted comes first because user action is needed
    // all others have the same order as in 'salt-key'
    pre.setAttribute("sorttable_customkey", 1);
    pre.classList.add("unaccepted");
    minionTr.appendChild(pre);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route.createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemWheelKeyAccept(menu, pMinionId, "");
    this._addMenuItemWheelKeyReject(menu, pMinionId, "");
    this._addMenuItemWheelKeyDelete(menu, pMinionId, "");

    if(pInsertAtTop) {
      // used for event based additions
      pContainer.tBodies[0].insertBefore(minionTr, pContainer.tBodies[0].firstChild);
    } else {
      // used for query based additions (when building page)
      pContainer.tBodies[0].appendChild(minionTr);
    }
  }

  _addMenuItemWheelKeyAccept(pMenu, pMinionId, extra) {
    pMenu.addMenuItem("Accept&nbsp;key...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "wheel.key.accept" + extra);
    }.bind(this));
  }

  _addMenuItemWheelKeyReject(pMenu, pMinionId, extra) {
    pMenu.addMenuItem("Reject&nbsp;key...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "wheel.key.reject" + extra);
    }.bind(this));
  }

  _addMenuItemWheelKeyDelete(pMenu, pMinionId, extra) {
    pMenu.addMenuItem("Delete&nbsp;key...", function(pClickEvent) {
      this.runCommand(pClickEvent, pMinionId, "wheel.key.delete" + extra);
    }.bind(this));
  }

  handleSaltAuthEvent(pTag, pData) {
    const page = document.getElementById("page-keys");
    const table = page.querySelector("#minions");
    const tr = page.querySelector("table tr#" + Utils.getIdFromMinionId(pData.id));
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
        this._addPreMinion(table, pData.id, true);
      } else if(pData.act === "accept") {
        this._addAcceptedMinion(table, pData.id);
      } else if(pData.act === "reject") {
        this._addRejectedMinion(table, pData.id);
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
