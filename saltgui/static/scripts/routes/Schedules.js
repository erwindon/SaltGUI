import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class SchedulesRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedules$", "Schedules", "#page_schedules", "#button_schedules", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localScheduleListPromise = this.router.api.getLocalScheduleList(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(data1 => {
      myThis._handleWheelKeyListAll(data1);
      localScheduleListPromise.then(data => {
        myThis._updateMinions(data);
      }, data2 => {
        const data = {"return":[{}]};
        for(const k of data1.return[0].data.return.minions)
          data.return[0][k] = JSON.stringify(data2);
        myThis._updateMinions(data);
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

  // This one has some historic ballast:
  // Meta-data is returned on the same level as
  // the list of scheduled items
  static _fixMinion(data) {
    if(typeof data !== "object") return data;
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
    const list = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(list, data)) return;

    const keys = data.return[0].data.return;

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

    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const statusDiv = Route._createTd("status", "accepted");
    statusDiv.classList.add("accepted");
    element.appendChild(statusDiv);

    let cnt;
    let scheduleinfo;
    if(typeof minion === "object") {
      cnt = Object.keys(minion.schedules).length;
      scheduleinfo = cnt + " schedule" + (cnt === 1 ? "" : "s");
      if(!minion.enabled)
        scheduleinfo += " (disabled)";
    } else {
      cnt = -1;
      scheduleinfo = "";
    }

    const td = Route._createTd("scheduleinfo", scheduleinfo);
    if(typeof minion !== "object") {
      Utils.addErrorToTableCell(td, minion);
    }
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
