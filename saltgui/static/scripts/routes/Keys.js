import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class KeysRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]keys$", "Keys", "#page-keys", "#button-keys", pRouter);

    this.fingerprintPattern = /^[0-9a-f:]+$/i;

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._handleWheelKeyFinger = this._handleWheelKeyFinger.bind(this);

    Utils.addTableHelp(this.getPageElement(), "The content of this page is\nautomatically refreshed");
    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pData1 => {
      myThis._handleWheelKeyListAll(pData1);
      wheelKeyFingerPromise.then(pData => {
        myThis._handleWheelKeyFinger(pData);
      }, pData2 => {
        const pData = {"return":[{"data":{"return":{"minions":{}}}}]};
        if(pData1)
          for(const k of pData1.return[0].data.return.minions)
            pData.return[0]["data"]["return"]["minions"][k] = JSON.stringify(pData2);
        myThis._handleWheelKeyFinger(pData);
      });
    }, pData => {
      myThis._handleWheelKeyListAll(JSON.stringify(pData));
    });

    runnerJobsListJobsPromise.then(pData => {
      myThis._handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis._handleRunnerJobsActive(pData);
      }, pData => {
        myThis._handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  _handleWheelKeyFinger(pData) {
    if(!pData) return;

    const allKeys = pData.return[0].data.return;

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

  _handleWheelKeyListAll(pData) {
    if(!pData) return;

    const table = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(table, pData)) return;

    const allKeys = pData.return[0].data.return;

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

    this.updateTableSummary(table);
  }

  updateTableSummary(pTable) {
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
    this._addMinion(pContainer, pMinionId, 1);

    // preliminary dropdown menu
    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemRejectKey(menu, pMinionId, " include_accepted=true");
    this._addMenuItemDeleteKey(menu, pMinionId, "");
  }

  _addRejectedMinion(pContainer, pMinionId) {
    const minionTr = this._getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const rejected = Route._createTd("status", "rejected");
    rejected.classList.add("rejected");
    minionTr.appendChild(rejected);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route._createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemDeleteKey(menu, pMinionId, "");
    this._addMenuItemAcceptKey(menu, pMinionId, " include_rejected=true");

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addDeniedMinion(pContainer, pMinionId) {
    const minionTr = this._getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const denied = Route._createTd("status", "denied");
    denied.classList.add("denied");
    minionTr.appendChild(denied);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route._createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemAcceptKey(menu, pMinionId, " include_denied=true");
    this._addMenuItemRejectKey(menu, pMinionId, " include_denied=true");
    this._addMenuItemDeleteKey(menu, pMinionId, "");

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addPreMinion(pContainer, pMinionId) {
    const minionTr = this._getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const pre = Route._createTd("status", "unaccepted");
    pre.classList.add("unaccepted");
    minionTr.appendChild(pre);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    minionTr.appendChild(Route._createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemAcceptKey(menu, pMinionId, "");
    this._addMenuItemRejectKey(menu, pMinionId, "");
    this._addMenuItemDeleteKey(menu, pMinionId, "");

    pContainer.tBodies[0].appendChild(minionTr);
  }

  _addMenuItemAcceptKey(pMenu, pMinionId, extra) {
    pMenu.addMenuItem("Accept&nbsp;key...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "wheel.key.accept" + extra);
    }.bind(this));
  }

  _addMenuItemRejectKey(pMenu, pMinionId, extra) {
    pMenu.addMenuItem("Reject&nbsp;key...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "wheel.key.reject" + extra);
    }.bind(this));
  }

  _addMenuItemDeleteKey(pMenu, pMinionId, extra) {
    pMenu.addMenuItem("Delete&nbsp;key...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "wheel.key.delete" + extra);
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
    } else {
      if(pData.act === "pend") {
        this._addPreMinion(table, pData.id);
        Utils.tableReSort(this.getPageElement());
      } else if(pData.act === "accept") {
        this._addAcceptedMinion(table, pData.id);
        Utils.tableReSort(this.getPageElement());
      } else if(pData.act === "reject") {
        this._addRejectedMinion(table, pData.id);
        Utils.tableReSort(this.getPageElement());
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
      wheelKeyFingerPromise.then(this._handleWheelKeyFinger, pData2 => {
        const pData3 = {"return":[{"data":{"return":{"minions":{}}}}]};
        pData3.return[0]["data"]["return"]["minions"][pData.id] = JSON.stringify(pData2);
        myThis._handleWheelKeyFinger(pData3);
      });
    }

    this.updateTableSummary(table);
  }

  handleSaltKeyEvent(pTag, pData) {
    this.handleSaltAuthEvent(pTag, pData);
  }
}
