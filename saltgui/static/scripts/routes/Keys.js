import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class KeysRoute extends PageRoute {

  constructor(router) {
    super("^[\/]keys$", "Keys", "#page_keys", "#button_keys", router);
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._handleWheelKeyFinger = this._handleWheelKeyFinger.bind(this);
  }

  onShow() {
    const keys = this;
    const p1 = keys.router.api.getWheelKeyListAll();
    const p2 = keys.router.api.getWheelKeyFinger();

    Promise.all([p1, p2])
      .then(function(data){
        // process result of 1st promise
        keys._handleWheelKeyListAll(data[0]);
        // process result of 2nd promise
        keys._handleWheelKeyFinger(data[1]);
      });
    return new Promise(function(resolve, reject) {
      keys.resolvePromise = resolve;
      if(keys.keysLoaded && keys.jobsLoaded) resolve();
      keys.router.api.getRunnerJobsListJobs().then(keys._handleRunnerJobsListJobs);
      keys.router.api.getRunnerJobsActive().then(keys._handleRunnerJobsActive);
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
        if(fingerprintElement) fingerprintElement.innerText = fingerprint;
      }
    }
  }

  _handleWheelKeyListAll(data) {
    const keys = data.return[0].data.return;
    const list = this.getPageElement().querySelector("#minions");

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
      this._addMenuItemReject(menu, hostname, " include_accepted=true");
      this._addMenuItemDelete(menu, hostname, "");
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

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("fingerprint", ""));

    const menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, hostname, " include_accepted=true");
    this._addMenuItemDelete(menu, hostname, "");
  }

  _addRejectedMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const rejected = Route._createTd("status", "rejected");
    rejected.classList.add("rejected");
    element.appendChild(rejected);

    // force same columns on all rows
    element.appendChild(Route._createTd("fingerprint", ""));

    const menu = new DropDownMenu(element);
    this._addMenuItemDelete(menu, hostname, "");
    this._addMenuItemAccept(menu, hostname, " include_rejected=true");

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

    const menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname, " include_denied=true");
    this._addMenuItemReject(menu, hostname, " include_denied=true");
    this._addMenuItemDelete(menu, hostname, "");

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

    const menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname, "");
    this._addMenuItemReject(menu, hostname, "");
    this._addMenuItemDelete(menu, hostname, "");

    container.tBodies[0].appendChild(element);
  }

  _addMenuItemAccept(menu, hostname, extra) {
    menu.addMenuItem("Accept&nbsp;key...", function(evt) {
      this._runCommand(evt, hostname, "wheel.key.accept" + extra);
    }.bind(this));
  }

  _addMenuItemReject(menu, hostname, extra) {
    menu.addMenuItem("Reject&nbsp;key...", function(evt) {
      this._runCommand(evt, hostname, "wheel.key.reject" + extra);
    }.bind(this));
  }

  _addMenuItemDelete(menu, hostname, extra) {
    menu.addMenuItem("Delete&nbsp;key...", function(evt) {
      this._runCommand(evt, hostname, "wheel.key.delete" + extra);
    }.bind(this));
  }
}
