import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {SchedulesRoute} from './Schedules.js';
import {Utils} from '../Utils.js';

export class SchedulesMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedulesminion$", "Schedules", "#page_schedulesminion", "#button_schedules", router);

    this._handleLocalScheduleList = this._handleLocalScheduleList.bind(this);

    this.page_element.querySelector("#button_close_schedulesminion").addEventListener("click", _ => {
      this.router.goTo("/schedules");
    });
  }

  onShow() {
    const myThis = this;

    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    // preliminary title
    const title = document.getElementById("schedulesminion_title");
    title.innerText = "Schedules on " + minion;

    const localScheduleListPromise = this.router.api.getLocalScheduleList(minion);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localScheduleListPromise.then(data => {
      myThis._handleLocalScheduleList(data, minion);
    }, data => {
      myThis._handleLocalScheduleList(JSON.stringify(data), minion);
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

  _handleLocalScheduleList(data, minion) {
    const page = document.getElementById("schedulesminion_page");

    const container = document.getElementById("schedulesminion_list");

    if(PageRoute.showErrorRowInstead(container.tBodies[0], data)) return;

    let schedules = data.return[0][minion];
    schedules = SchedulesRoute._fixMinion(schedules);

    if(schedules === undefined) {
      const noSchedulesMsg = Route._createDiv("msg", "Unknown minion '" + minion + "'");
      container.tBodies[0].appendChild(noSchedulesMsg);
      return;
    }
    if(schedules === false) {
      const noSchedulesMsg = Route._createDiv("msg", "Minion '" + minion + "' did not answer");
      container.tBodies[0].appendChild(noSchedulesMsg);
      return;
    }

    const title = document.getElementById("schedulesminion_title");
    let txt = "Schedules on " + minion;
    if(schedules.enabled === false) txt += " (disabled)";
    title.innerText = txt;

    const menu = new DropDownMenu(page);
    this._addMenuItemEnableSchedulerWhenNeeded(menu, minion, schedules);
    this._addMenuItemDisableSchedulerWhenNeeded(menu, minion, schedules);
    // new menu's are always added at the bottom of the div
    // fix that by re-adding the minion list
    page.appendChild(container);

    const keys = Object.keys(schedules.schedules).sort();
    for(const k of keys) {

      const schedule = schedules.schedules[k];

      // simplify the schedule information
      if("name" in schedule)
        delete schedule.name;
      if(schedule.enabled === true)
        delete schedule.enabled;
      if(schedule.jid_include === true)
        delete schedule.jid_include;
      if(schedule.maxrunning === 1)
        delete schedule.maxrunning;

      const tr = document.createElement('tr');

      const name = Route._createTd("schedule_name", k);
      tr.appendChild(name);

      const menu = new DropDownMenu(tr);
      let scheduleModifyCmd = "schedule.modify " + k;
      for(const key in schedule) {
        scheduleModifyCmd += " " + key + "=" + JSON.stringify(schedule[key]);
      }
      this._addMenuItemModifyJob(menu, minion, scheduleModifyCmd);
      this._addMenuItemEnableJobWhenNeeded(menu, minion, k, schedule);
      this._addMenuItemDisableJobWhenNeeded(menu, minion, k, schedule);
      this._addMenuItemDeleteJob(menu, minion, k);
      this._addMenuItemRunJob(menu, minion, k, schedule);

      // menu comes before this data on purpose
      const schedule_value = Output.formatObject(schedule);
      const value = Route._createTd("schedule_value", schedule_value);
      if(schedule.enabled === false) value.classList.add("disabled_schedule");
      if(schedules.enabled === false) value.classList.add("disabled_schedule");
      tr.appendChild(value);

      container.tBodies[0].appendChild(tr);

      tr.addEventListener("click", evt => this._runCommand(evt, minion, scheduleModifyCmd));
    }

    Utils.showTableSortable(this.getPageElement(), "schedules");
    Utils.makeTableSearchable(this.getPageElement(), "schedules");

    if(!keys.length) {
      const noSchedulesMsg = Route._createDiv("msg", "No schedules found");
      container.tBodies[0].appendChild(noSchedulesMsg);
    }
  }

  _addMenuItemEnableSchedulerWhenNeeded(menu, minion, schedules) {
    if(schedules.enabled !== false) return;
    menu.addMenuItem("Enable&nbsp;scheduler...", function(evt) {
      this._runCommand(evt, minion, "schedule.enable");
    }.bind(this));
  }

  _addMenuItemDisableSchedulerWhenNeeded(menu, minion, schedules) {
    if(schedules.enabled === false) return;
    menu.addMenuItem("Disable&nbsp;scheduler...", function(evt) {
      this._runCommand(evt, minion, "schedule.disable");
    }.bind(this));
  }

  _addMenuItemModifyJob(menu, minion, scheduleModifyCmd) {
    menu.addMenuItem("Modify&nbsp;job...", function(evt) {
      this._runCommand(evt, minion, scheduleModifyCmd);
    }.bind(this));
  }

  _addMenuItemEnableJobWhenNeeded(menu, minion, name, schedule) {
    if(schedule.enabled !== false) return;
    menu.addMenuItem("Enable&nbsp;job...", function(evt) {
      this._runCommand(evt, minion, "schedule.enable_job " + name);
    }.bind(this));
  }

  _addMenuItemDisableJobWhenNeeded(menu, minion, name, schedule) {
    if(schedule.enabled === false) return;
    menu.addMenuItem("Disable&nbsp;job...", function(evt) {
      this._runCommand(evt, minion, "schedule.disable_job " + name);
    }.bind(this));
  }

  _addMenuItemDeleteJob(menu, minion, name) {
    menu.addMenuItem("Delete&nbsp;job...", function(evt) {
      this._runCommand(evt, minion, "schedule.delete " + name);
    }.bind(this));
  }

  _addMenuItemRunJob(menu, minion, name, schedule) {
    menu.addMenuItem("Run&nbsp;job...", function(evt) {
      let scheduleRunJobCmd = "schedule.run_job";
      if(schedule.enabled === false) scheduleRunJobCmd += " force=true";
      scheduleRunJobCmd += " " + name;
      this._runCommand(evt, minion, scheduleRunJobCmd);
    }.bind(this));
  }
}
