import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class SchedulesRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedules$", "Schedules", "#page_schedules", "#button_schedules", router);
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const myThis = this;

    return new Promise(function(resolve, reject) {
      myThis.resolvePromise = resolve;
      if(myThis.keysLoaded && myThis.jobsLoaded) resolve();
      myThis.router.api.getLocalScheduleList(null)
        .then(myThis._updateMinions, myThis._updateMinions);
      myThis.router.api.getWheelKeyListAll().then(myThis._handleWheelKeyListAll);
      myThis.router.api.getRunnerJobsListJobs().then(myThis._handleRunnerJobsListJobs);
      myThis.router.api.getRunnerJobsActive().then(myThis._handleRunnerJobsActive);
    });
  }

  // This one has some historic ballast:
  // Meta-data is returned on the same level as
  // the list of scheduled items
  static _fixMinion(data) {
    const ret = { "schedules": {}, "enabled": true };
    for(const k in data) {
      if(k === "enabled") {
        ret.enabled = data.enabled;
        continue;
      }
      if(k === "schedule" && JSON.stringify(data[k]) === "{}") {
        continue;
      }
      ret.schedules[k] = data[k];
    }
    return ret;
  }

  _handleWheelKeyListAll(data) {
    const keys = data.return[0].data.return;

    const list = this.getPageElement().querySelector('#minions');

    const hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname, 1);

      // preliminary dropdown menu
      const element = document.getElementById(hostname);
      const menu = new DropDownMenu(element);
      this._addMenuItemShowSchedules(menu, hostname);

      element.addEventListener("click", evt => window.location.assign("schedulesminion?minion=" + encodeURIComponent(hostname)));
    }

    Utils.showTableSortable(this.getPageElement(), "minions");

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("scheduleinfo", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname, allMinions) {

    minion = SchedulesRoute._fixMinion(minion);

    const cnt = Object.keys(minion.schedules).length;
    let scheduleinfo = cnt + " schedule" + (cnt === 1 ? "" : "s");
    if(!minion.enabled)
      scheduleinfo += " (disabled)";

    let element = document.getElementById(hostname);
    if(element === null) {
      // offline minion not found on screen...
      // construct a basic element that can be updated here
      element = document.createElement('tr');
      element.id = hostname;
      container.appendChild(element);
    }
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    element.appendChild(Route._createTd("hostname", hostname));

    const statusDiv = Route._createTd("status", "accepted");
    statusDiv.classList.add("accepted");
    element.appendChild(statusDiv);

    const td = Route._createTd("scheduleinfo", scheduleinfo);
    td.setAttribute("sorttable_customkey", cnt);
    element.appendChild(td);

    const menu = new DropDownMenu(element);
    this._addMenuItemShowSchedules(menu, hostname);

    element.addEventListener("click", evt => window.location.assign("schedulesminion?minion=" + encodeURIComponent(hostname)));
  }

  _addMenuItemShowSchedules(menu, hostname) {
    menu.addMenuItem("Show&nbsp;schedules", function(evt) {
      window.location.assign("schedulesminion?minion=" + encodeURIComponent(hostname));
    }.bind(this));
  }
}
