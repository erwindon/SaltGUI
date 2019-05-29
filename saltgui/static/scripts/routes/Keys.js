import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class KeysRoute extends PageRoute {

  constructor(router) {
    super("^[\/]keys$", "Keys", "#page_keys", "#button_keys", router);

    this.fingerprintPattern = /^[0-9a-f:]+$/i;

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._handleWheelKeyFinger = this._handleWheelKeyFinger.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger();
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(data1 => {
      myThis._handleWheelKeyListAll(data1);
      wheelKeyFingerPromise.then(data => {
        myThis._handleWheelKeyFinger(data);
      }, data2 => {
        const data = {"return":[{"data":{"return":{"minions":{}}}}]};
        for(const k of data1.return[0].data.return.minions)
          data.return[0]["data"]["return"]["minions"][k] = JSON.stringify(data2);
        myThis._handleWheelKeyFinger(data);
      });
    }, data => {
      myThis._handleWheelKeyListAll(JSON.stringify(data));
    });

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      }, data => {
        myThis._handleRunnerJobsActive(JSON.stringify(data));
      });
    }, data => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(data));
    }); 
  }

  _handleWheelKeyFinger(data) {
    const keys = data.return[0].data.return;

    for(const property of Object.keys(keys)) {
      if(property === "local") continue;
      const hosts = keys[property];
      for(const hostname of Object.keys(hosts)) {
        const item = this.page_element.querySelector("#" + Utils.getIdFromMinionId(hostname) + " .os");
        if(item) {
          // remove td.os for known minions and add td.fingerprint
          item.classList.remove("os");
          item.classList.add("fingerprint");
        }

        // update td.fingerprint with fingerprint value
        const fingerprintElement = this.page_element.querySelector("#" + Utils.getIdFromMinionId(hostname) + " .fingerprint");
        const fingerprint = hosts[hostname];
        if(!fingerprintElement) continue;
        if(!fingerprint.match(this.fingerprintPattern)) {
          Utils.addErrorToTableCell(fingerprintElement, fingerprint);
          continue;
        }
        fingerprintElement.innerText = fingerprint;
      }
    }
  }

  _handleWheelKeyListAll(data) {
    const list = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(list, data)) return;

    const keys = data.return[0].data.return;

    // Unaccepted goes first because that is where the user must decide
    const hostnames_pre = keys.minions_pre.sort();
    for(const hostname of hostnames_pre) {
      this._addPreMinion(list, hostname);
    }

    const hostnames_accepted = keys.minions.sort();
    for(const hostname of hostnames_accepted) {
      this._addAcceptedMinion(list, hostname);
    }

    const hostnames_denied = keys.minions_denied.sort();
    for(const hostname of hostnames_denied) {
      this._addDeniedMinion(list, hostname);
    }

    const hostnames_rejected = keys.minions_rejected.sort();
    for(const hostname of hostnames_rejected) {
      this._addRejectedMinion(list, hostname);
    }

    this.updateTableSummary(list);

    Utils.addTableHelp(this.getPageElement(), "The content of this page is\nautomatically refreshed.");
    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());
  }

  updateTableSummary(list) {
    const cnt = { };
    cnt["unaccepted"] = 0;
    cnt["accepted"] = 0;
    cnt["denied"] = 0;
    cnt["rejected"] = 0;
    const tbody = list.querySelector("table tbody");
    for(const tr of tbody.children) {
      const statusText = tr.querySelector("td.status").innerText;  
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

    const msg = this.getPageElement().querySelector(".minion-list .msg");
    msg.innerText = summary;
  }

  _addAcceptedMinion(container, hostname) {
    this._addMinion(container, hostname, 1);

    // preliminary dropdown menu
    const element = container.querySelector("#" + Utils.getIdFromMinionId(hostname));
    const menu = new DropDownMenu(element);
    this._addMenuItemRejectKey(menu, hostname, " include_accepted=true");
    this._addMenuItemDeleteKey(menu, hostname, "");
  }

  _addRejectedMinion(container, hostname) {
    const element = this._getElement(container, Utils.getIdFromMinionId(hostname));

    element.appendChild(Route._createTd("hostname", hostname));

    const rejected = Route._createTd("status", "rejected");
    rejected.classList.add("rejected");
    element.appendChild(rejected);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    element.appendChild(Route._createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(element);
    this._addMenuItemDeleteKey(menu, hostname, "");
    this._addMenuItemAcceptKey(menu, hostname, " include_rejected=true");

    container.tBodies[0].appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    const element = this._getElement(container, Utils.getIdFromMinionId(hostname));

    element.appendChild(Route._createTd("hostname", hostname));

    const denied = Route._createTd("status", "denied");
    denied.classList.add("denied");
    element.appendChild(denied);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    element.appendChild(Route._createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(element);
    this._addMenuItemAcceptKey(menu, hostname, " include_denied=true");
    this._addMenuItemRejectKey(menu, hostname, " include_denied=true");
    this._addMenuItemDeleteKey(menu, hostname, "");

    container.tBodies[0].appendChild(element);
  }

  _addPreMinion(container, hostname) {
    const element = this._getElement(container, Utils.getIdFromMinionId(hostname));

    element.appendChild(Route._createTd("hostname", hostname));

    const pre = Route._createTd("status", "unaccepted");
    pre.classList.add("unaccepted");
    element.appendChild(pre);

    // force same columns on all rows
    // do not use class "fingerprint" yet
    element.appendChild(Route._createTd("os", "loading..."));

    // final dropdownmenu
    const menu = new DropDownMenu(element);
    this._addMenuItemAcceptKey(menu, hostname, "");
    this._addMenuItemRejectKey(menu, hostname, "");
    this._addMenuItemDeleteKey(menu, hostname, "");

    container.tBodies[0].appendChild(element);
  }

  _addMenuItemAcceptKey(menu, hostname, extra) {
    menu.addMenuItem("Accept&nbsp;key...", function(evt) {
      this._runCommand(evt, hostname, "wheel.key.accept" + extra);
    }.bind(this));
  }

  _addMenuItemRejectKey(menu, hostname, extra) {
    menu.addMenuItem("Reject&nbsp;key...", function(evt) {
      this._runCommand(evt, hostname, "wheel.key.reject" + extra);
    }.bind(this));
  }

  _addMenuItemDeleteKey(menu, hostname, extra) {
    menu.addMenuItem("Delete&nbsp;key...", function(evt) {
      this._runCommand(evt, hostname, "wheel.key.delete" + extra);
    }.bind(this));
  }

  handleSaltAuthEvent(tag, data) {
    const page = document.getElementById("page_keys");
    const list = page.querySelector("#minions");
    const tr = page.querySelector("table tr#" + Utils.getIdFromMinionId(data.id));
    if(tr) {
      const status = tr.querySelector(".status");
      // drop all other classes (accepted, rejected, etc)
      if(data.act === "accept") {
        status.className = "status";
        status.classList.add("accepted");
        status.innerText = "accepted";
      } else if(data.act === "reject") {
        status.className = "status";
        status.classList.add("rejected");
        status.innerText = "rejected";
      } else if(data.act === "pend") {
        status.className = "status";
        status.classList.add("unaccepted");
        status.innerText = "unaccepted";
      } else if(data.act === "delete") {
        // "-1" due to the <tr> for the header that is inside <thead>
        tr.parentNode.deleteRow(tr.rowIndex - 1);
      } else {
        // unknown status
        // do not update screen
      }
      // keep the fingerprint
    } else {
      if(data.act === "pend") {
        this._addPreMinion(list, data.id);
        Utils.tableReSort(this.getPageElement());
      } else if(data.act === "accept") {
        this._addAcceptedMinion(list, data.id);
        Utils.tableReSort(this.getPageElement());
      } else if(data.act === "reject") {
        this._addRejectedMinion(list, data.id);
        Utils.tableReSort(this.getPageElement());
      } else if(data.act === "delete") {
        // delete of an unknown minion, never mind
      } else {
        // unknown status
        // do not update screen
      }
      // we do not have the fingerprint yet
      // pre-fill with a dummy value and then retrieve the actual value
      const fingerprintSpan = page.querySelector("table tr#" + Utils.getIdFromMinionId(data.id) + " .fingerprint");
      if(fingerprintSpan) fingerprintSpan.innerText = "(refresh page for fingerprint)";
      const wheelKeyFingerPromise = this.router.api.getWheelKeyFinger(data.id);
      wheelKeyFingerPromise.then(this._handleWheelKeyFinger);
    }

    this.updateTableSummary(list);
  }

  handleSaltKeyEvent(tag, data) {
    this.handleSaltAuthEvent(tag, data);
  }
}
