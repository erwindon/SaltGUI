import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {SchedulesRoute} from './Schedules.js';
import {Utils} from '../Utils.js';

export class SchedulesMinionRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedulesminion$", "Schedules", "#page_schedulesminion", "#button_schedules", router);

    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._showSchedules = this._showSchedules.bind(this);

    this.page_element.querySelector("#button_close_schedulesminion").addEventListener("click", _ => {
      this.router.goTo("/schedules");
    });
  }

  onShow() {
    const minions = this;

    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    // preliminary title
    const title = document.getElementById("schedulesminion_title");
    title.innerText = "Schedules on " + minion;

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getLocalScheduleList(minion).then(minions._showSchedules);
      minions.router.api.getRunnerJobsListJobs().then(minions._updateJobs);
      minions.router.api.getRunnerJobsActive().then(minions._runningJobs);
    });
  }

  _showSchedules(data) {
    const minion = decodeURIComponent(Utils.getQueryParam("minion"));

    let schedules = data.return[0][minion];
    schedules = SchedulesRoute._fixMinion(schedules);

    const title = document.getElementById("schedulesminion_title");
    let txt = "Schedules on " + minion;
    if(!schedules.enabled) txt += " (disabled)";
    title.innerText = txt;

    const page = document.getElementById("schedulesminion_page");

    const menu = new DropDownMenu(page);
    menu.addMenuItem("Enable&nbsp;scheduler...", function(evt) {
      this._runCommand(evt, minion, "schedule.enable");
    }.bind(this));
    menu.addMenuItem("Disable&nbsp;scheduler...", function(evt) {
      this._runCommand(evt, minion, "schedule.disable");
    }.bind(this));

    const container = document.getElementById("schedulesminion_list");
    page.append(container);

    while(container.tBodies[0].rows.length > 0) {
      container.tBodies[0].deleteRow(0);
    }


    if(!schedules) return;

    const keys = Object.keys(schedules.schedules).sort();
    for(const k of keys) {

      const schedule = schedules.schedules[k];

      // simplify the schedule information
      if("name" in schedule)
        delete schedule.name;
      if("enabled" in schedule && schedule.enabled)
        delete schedule.enabled;
      if("jid_include" in schedule && schedule.jid_include)
        delete schedule.jid_include;
      if("maxrunning" in schedule && schedule.maxrunning === 1)
        delete schedule.maxrunning;

      const tr = document.createElement('tr');

      const name = Route._createTd("schedule_name", k);
      tr.appendChild(name);

      const isJobDisabled = schedule.hasOwnProperty("enabled") && !schedule.enabled;

      const menu = new DropDownMenu(tr);
      let cmd = "schedule.modify " + k;
      for(const key in schedule) {
        cmd = cmd + " " + key + "=" + JSON.stringify(schedule[key]);
      }
      menu.addMenuItem("Modify&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, cmd);
      }.bind(this));
      menu.addMenuItem("Enable&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, "schedule.enable_job " + k);
      }.bind(this));
      menu.addMenuItem("Disable&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, "schedule.disable_job " + k);
      }.bind(this));
      menu.addMenuItem("Delete&nbsp;job...", function(evt) {
        this._runCommand(evt, minion, "schedule.delete " + k);
      }.bind(this));
      menu.addMenuItem("Run&nbsp;job...", function(evt) {
        let cmd = "schedule.run_job";
        if(isJobDisabled) cmd += " force=true";
        cmd += " " + k;
        this._runCommand(evt, minion, cmd);
      }.bind(this));

      // menu comes before this data on purpose
      const schedule_value = Output.formatObject(schedule);
      const value = Route._createTd("schedule_value", schedule_value);
      if(isJobDisabled) value.classList.add("disabled_schedule");
      tr.appendChild(value);

      container.tBodies[0].appendChild(tr);

      tr.addEventListener("click", evt => this._runCommand(evt, minion, cmd));
    }

    if(!keys.length) {
      const noSchedulesMsg = Route._createDiv("msg", "No schedules found");
      container.tBodies[0].appendChild(noSchedulesMsg);
    }
  }
}
