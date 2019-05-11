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
        const item = this.page_element.querySelector("#" + hostname + " .os");
        if(item) {
          // remove td.os for accepted minions and add td.fingerprint
          item.parentElement.insertBefore(Route._createTd("fingerprint", ""), item);
          item.parentElement.removeChild(item);
        }

        // update td.fingerprint with fingerprint value
        const fingerprintElement = this.page_element.querySelector("#" + hostname + " .fingerprint");
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
      this._addMinion(list, hostname, 1);

      // preliminary dropdown menu
      const element = document.getElementById(hostname);
      const menu = new DropDownMenu(element);
      this._addMenuItemRejectKey(menu, hostname, " include_accepted=true");
      this._addMenuItemDeleteKey(menu, hostname, "");
    }

    const hostnames_denied = keys.minions_denied.sort();
    for(const hostname of hostnames_denied) {
      this._addDeniedMinion(list, hostname);
    }

    const hostnames_rejected = keys.minions_rejected.sort();
    for(const hostname of hostnames_rejected) {
      this._addRejectedMinion(list, hostname);
    }

    let summary = "";
    if(hostnames_pre.length === 0)
      summary += ", no unaccepted keys";
    if(hostnames_accepted.length === 0)
      summary += ", no accepted keys";
    if(hostnames_denied.length === 0)
      summary += ", no denied keys";
    if(hostnames_rejected.length === 0)
      summary += ", no rejected keys";
    if(summary) {
      // remove the first comma and capitalize the first word
      const div = Route._createDiv("msg", summary.replace(/, no/, "No"));
      this.getPageElement().querySelector(".minion-list").appendChild(div);
    }

    Utils.showTableSortable(this.getPageElement(), "minions");
    Utils.makeTableSearchable(this.getPageElement(), "minions");
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("fingerprint", ""));

    // final dropdownmenu
    const menu = new DropDownMenu(element);
    this._addMenuItemRejectKey(menu, hostname, " include_accepted=true");
    this._addMenuItemDeleteKey(menu, hostname, "");
  }

  _addRejectedMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const rejected = Route._createTd("status", "rejected");
    rejected.classList.add("rejected");
    element.appendChild(rejected);

    // force same columns on all rows
    element.appendChild(Route._createTd("fingerprint", ""));

    // final dropdownmenu
    const menu = new DropDownMenu(element);
    this._addMenuItemDeleteKey(menu, hostname, "");
    this._addMenuItemAcceptKey(menu, hostname, " include_rejected=true");

    container.tBodies[0].appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const denied = Route._createTd("status", "denied");
    denied.classList.add("denied");
    element.appendChild(denied);

    // force same columns on all rows
    element.appendChild(Route._createTd("fingerprint", ""));

    // final dropdownmenu
    const menu = new DropDownMenu(element);
    this._addMenuItemAcceptKey(menu, hostname, " include_denied=true");
    this._addMenuItemRejectKey(menu, hostname, " include_denied=true");
    this._addMenuItemDeleteKey(menu, hostname, "");

    container.tBodies[0].appendChild(element);
  }

  _addPreMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const pre = Route._createTd("status", "unaccepted");
    pre.classList.add("unaccepted");
    element.appendChild(pre);

    // force same columns on all rows
    element.appendChild(Route._createTd("fingerprint", ""));

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
}
