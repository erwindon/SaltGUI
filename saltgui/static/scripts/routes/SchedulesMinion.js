import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {SchedulesRoute} from './Schedules.js';
import {Utils} from '../Utils.js';

export class SchedulesMinionRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]schedulesminion$", "Schedules", "#page-schedules-minion", "#button-schedules", pRouter);

    this._handleLocalScheduleList = this._handleLocalScheduleList.bind(this);

    const closeButton = this.pageElement.querySelector("#schedules-minion-button-close");
    closeButton.addEventListener("click", _ => {
      this.router.goTo("/schedules");
    });
  }

  onShow() {
    const myThis = this;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    // preliminary title
    const titleElement = document.getElementById("schedules-minion-title");
    titleElement.innerText = "Schedules on " + minionId;

    const localScheduleListPromise = this.router.api.getLocalScheduleList(minionId);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localScheduleListPromise.then(pData => {
      myThis._handleLocalScheduleList(pData, minionId);
    }, pData => {
      myThis._handleLocalScheduleList(JSON.stringify(pData), minionId);
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

  _handleLocalScheduleList(pData, pMinionId) {
    const panel = document.getElementById("schedules-minion-panel");

    const container = document.getElementById("schedules-minion-list");

    if(PageRoute.showErrorRowInstead(container.tBodies[0], pData)) return;

    let schedules = pData.return[0][pMinionId];
    schedules = SchedulesRoute._fixMinion(schedules);

    const titleElement = document.getElementById("schedules-minion-title");
    let txt = "Schedules on " + pMinionId;
    if(schedules && schedules.enabled === false) txt += " (disabled)";
    titleElement.innerText = txt;

    if(schedules === undefined) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if(schedules === false) {
      const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
      msgDiv.innerText = "Minion '" + pMinionId + "' did not answer";
      return;
    }

    const menu = new DropDownMenu(panel);
    this._addMenuItemEnableSchedulerWhenNeeded(menu, pMinionId, schedules);
    this._addMenuItemDisableSchedulerWhenNeeded(menu, pMinionId, schedules);

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);

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

      const nameTd = Route._createTd("schedule-name", k);
      tr.appendChild(nameTd);

      const menu = new DropDownMenu(tr);
      let scheduleModifyCmd = "schedule.modify " + k;
      for(const key in schedule) {
        if(key === "args")
          scheduleModifyCmd += " " + "job_args";
        else if(key === "kwargs")
          scheduleModifyCmd += " " + "job_kwargs";
        else
          scheduleModifyCmd += " " + key;
        scheduleModifyCmd += "=" + JSON.stringify(schedule[key]);
      }
      this._addMenuItemModifyJob(menu, pMinionId, scheduleModifyCmd);
      this._addMenuItemEnableJobWhenNeeded(menu, pMinionId, k, schedule);
      this._addMenuItemDisableJobWhenNeeded(menu, pMinionId, k, schedule);
      this._addMenuItemDeleteJob(menu, pMinionId, k);
      this._addMenuItemRunJob(menu, pMinionId, k, schedule);

      // menu comes before this data on purpose
      const scheduleValue = Output.formatObject(schedule);
      const scheduleValueTd = Route._createTd("schedule-value", scheduleValue);
      if(schedule.enabled === false) scheduleValueTd.classList.add("schedule-disabled");
      if(schedules.enabled === false) scheduleValueTd.classList.add("schedule-disabled");
      tr.appendChild(scheduleValueTd);

      container.tBodies[0].appendChild(tr);

      tr.addEventListener("click", pClickEvent =>
        this._runCommand(pClickEvent, pMinionId, scheduleModifyCmd)
      );
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    txt = Utils.txtZeroOneMany(keys.length,
      "No schedules", "{0} schedule", "{0} schedules");
    msgDiv.innerText = txt;
  }

  _addMenuItemEnableSchedulerWhenNeeded(pMenu, pMinionId, schedules) {
    if(schedules.enabled !== false) return;
    pMenu.addMenuItem("Enable&nbsp;scheduler...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "schedule.enable");
    }.bind(this));
  }

  _addMenuItemDisableSchedulerWhenNeeded(pMenu, pMinionId, schedules) {
    if(schedules.enabled === false) return;
    pMenu.addMenuItem("Disable&nbsp;scheduler...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "schedule.disable");
    }.bind(this));
  }

  _addMenuItemModifyJob(pMenu, pMinionId, scheduleModifyCmd) {
    pMenu.addMenuItem("Modify&nbsp;job...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, scheduleModifyCmd);
    }.bind(this));
  }

  _addMenuItemEnableJobWhenNeeded(pMenu, pMinionId, pJobName, schedule) {
    if(schedule.enabled !== false) return;
    pMenu.addMenuItem("Enable&nbsp;job...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "schedule.enable_job " + pJobName);
    }.bind(this));
  }

  _addMenuItemDisableJobWhenNeeded(pMenu, pMinionId, pJobName, schedule) {
    if(schedule.enabled === false) return;
    pMenu.addMenuItem("Disable&nbsp;job...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "schedule.disable_job " + pJobName);
    }.bind(this));
  }

  _addMenuItemDeleteJob(pMenu, pMinionId, pJobName) {
    pMenu.addMenuItem("Delete&nbsp;job...", function(pClickEvent) {
      this._runCommand(pClickEvent, pMinionId, "schedule.delete " + pJobName);
    }.bind(this));
  }

  _addMenuItemRunJob(pMenu, pMinionId, pJobName, schedule) {
    pMenu.addMenuItem("Run&nbsp;job...", function(pClickEvent) {
      let scheduleRunJobCmd = "schedule.run_job";
      if(schedule.enabled === false) scheduleRunJobCmd += " force=true";
      scheduleRunJobCmd += " " + pJobName;
      this._runCommand(pClickEvent, pMinionId, scheduleRunJobCmd);
    }.bind(this));
  }
}
