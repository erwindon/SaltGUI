/* global */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {SchedulesPanel} from "./Schedules.js";
import {Utils} from "../Utils.js";

export class SchedulesMinionPanel extends Panel {

  constructor () {
    super("schedules-minion");

    this.addTitle("Schedules on " + Character.HORIZONTAL_ELLIPSIS);
    this.addPanelMenu();
    this._addPanelMenuItemScheduleEnableWhenNeeded();
    this._addPanelMenuItemScheduleDisableWhenNeeded();
    this._addPanelMenuItemScheduleAddInterval();
    this._addPanelMenuItemScheduleAddCron();
    this._addPanelMenuItemScheduleAddOnce();
    this.addSearchButton();
    if (Utils.getQueryParam("popup") !== "true") {
      this.addCloseButton();
    }
    this.addTable(["Name", "-menu-", "Details"]);
    this.setTableSortable("Name", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    // preliminary title
    this.updateTitle("Schedules on " + minionId);

    const localScheduleListPromise = this.api.getLocalScheduleList(minionId);

    localScheduleListPromise.then((pLocalScheduleListData) => {
      this._handleLocalScheduleList(pLocalScheduleListData, minionId);
      return true;
    }, (pLocalScheduleListMsg) => {
      this._handleLocalScheduleList(JSON.stringify(pLocalScheduleListMsg), minionId);
      return false;
    });
  }

  _handleLocalScheduleList (pLocalScheduleList, pMinionId) {
    if (this.showErrorRowInstead(pLocalScheduleList)) {
      return;
    }

    let schedules = pLocalScheduleList.return[0][pMinionId];
    // because some really old minion do not fully support schedules
    if (this.showErrorRowInstead(schedules)) {
      return;
    }

    schedules = SchedulesPanel.fixSchedulesMinion(schedules);

    this.schedulesEnabled = schedules.enabled;

    if (schedules && schedules.enabled === false) {
      this.updateTitle("Schedules on " + pMinionId + " (disabled)");
    }

    if (schedules === undefined) {
      this.setMsg("Unknown minion '" + pMinionId + "'");
      return;
    }
    if (schedules === false) {
      this.setMsg("Minion '" + pMinionId + "' did not answer");
      return;
    }

    const keys = Object.keys(schedules.schedules).sort();
    for (const scheduleName of keys) {

      const schedule = schedules.schedules[scheduleName];

      // simplify the schedule information
      if ("name" in schedule) {
        delete schedule.name;
      }
      if (schedule.enabled === true) {
        delete schedule.enabled;
      }
      if (schedule.jid_include === true) {
        delete schedule.jid_include;
      }
      if (schedule.maxrunning === 1) {
        delete schedule.maxrunning;
      }

      const tr = Utils.createTr();

      const nameTd = Utils.createTd("schedule-name", scheduleName);
      tr.appendChild(nameTd);

      const scheduleMenu = new DropDownMenu(tr, true);
      const scheduleModifyCmdArr = ["schedule.modify", scheduleName];
      for (const key in schedule) {
        const value = schedule[key];
        scheduleModifyCmdArr.push(key + "=", value);
      }
      this._addMenuItemModifyJob(scheduleMenu, pMinionId, scheduleModifyCmdArr);
      this._addMenuItemScheduleEnableJobWhenNeeded(scheduleMenu, pMinionId, scheduleName, schedule);
      this._addMenuItemScheduleDisableJobWhenNeeded(scheduleMenu, pMinionId, scheduleName, schedule);
      this._addMenuItemScheduleDeleteJob(scheduleMenu, pMinionId, scheduleName);
      this._addMenuItemScheduleRunJob(scheduleMenu, pMinionId, scheduleName, schedule);

      // menu comes before this data on purpose
      const scheduleValue = Output.formatObject(schedule);
      const scheduleValueTd = Utils.createTd("schedule-value", scheduleValue);
      if (schedule.enabled === false || schedules.enabled === false) {
        scheduleValueTd.classList.add("schedule-disabled");
      }
      tr.appendChild(scheduleValueTd);

      const tbody = this.table.tBodies[0];
      tbody.appendChild(tr);

      tr.addEventListener("click", (pClickEvent) => {
        this.runCommand("", pMinionId, scheduleModifyCmdArr);
        pClickEvent.stopPropagation();
      });
    }

    const txt = Utils.txtZeroOneMany(keys.length,
      "No schedules", "{0} schedule", "{0} schedules");
    this.setMsg(txt);
  }

  _addPanelMenuItemScheduleEnableWhenNeeded () {
    this.panelMenu.addMenuItem(() => {
      if (this.schedulesEnabled) {
        return null;
      }
      return "Enable scheduler...";
    }, () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["schedule.enable"];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addPanelMenuItemScheduleDisableWhenNeeded () {
    this.panelMenu.addMenuItem(() => {
      if (!this.schedulesEnabled) {
        return null;
      }
      return "Disable scheduler...";
    }, () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["schedule.disable"];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addPanelMenuItemScheduleAddInterval () {
    this.panelMenu.addMenuItem("Add interval schedule...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = [
        "schedule.add",
        "<name>",
        "function=", "<function>",
        "seconds=", "<seconds>",
        "minutes=", "<minutes>",
        "hours=", "<hours>",
        "days=", "<days>"
      ];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addPanelMenuItemScheduleAddCron () {
    this.panelMenu.addMenuItem("Add cron schedule...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = [
        "schedule.add",
        "<name>",
        "function=", "<function>",
        "cron=", "*/15 * * * *"
      ];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addPanelMenuItemScheduleAddOnce () {
    this.panelMenu.addMenuItem("Add once schedule...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = [
        "schedule.add",
        "<name>",
        "function=", "<function>",
        "once=", new Date().toISOString().
          replace(/[.].*/, ""),
        "once_format=", "%Y-%m-%dT%H:%M:%S"
      ];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addMenuItemModifyJob (pMenu, pMinionId, scheduleModifyCmdArr) {
    pMenu.addMenuItem("Modify job...", () => {
      this.runCommand("", pMinionId, scheduleModifyCmdArr);
    });
  }

  _addMenuItemScheduleEnableJobWhenNeeded (pMenu, pMinionId, pJobName, schedule) {
    if (schedule.enabled !== false) {
      return;
    }
    pMenu.addMenuItem("Enable job...", () => {
      const cmdArr = ["schedule.enable_job", pJobName];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemScheduleDisableJobWhenNeeded (pMenu, pMinionId, pJobName, schedule) {
    if (schedule.enabled === false) {
      return;
    }
    pMenu.addMenuItem("Disable job...", () => {
      const cmdArr = ["schedule.disable_job", pJobName];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemScheduleDeleteJob (pMenu, pMinionId, pJobName) {
    pMenu.addMenuItem("Delete job...", () => {
      const cmdArr = ["schedule.delete", pJobName];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemScheduleRunJob (pMenu, pMinionId, pJobName, schedule) {
    pMenu.addMenuItem("Run job...", () => {
      const scheduleRunJobCmdArr = ["schedule.run_job"];
      if (schedule.enabled === false) {
        scheduleRunJobCmdArr.push("force=", true);
      }
      scheduleRunJobCmdArr.push(pJobName);
      this.runCommand("", pMinionId, scheduleRunJobCmdArr);
    });
  }
}
