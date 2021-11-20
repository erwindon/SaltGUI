/* global window */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {JobPanel} from "./Job.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

export class HighStatePanel extends Panel {

  constructor () {
    super("highstate");

    this.addTitle("HighState");
    this.addPanelMenu();
    this._addMenuItemStateApply(this.panelMenu, "*");
    this._addMenuItemStateApplyTest(this.panelMenu, "*");
    this.addSearchButton();
    this.addPlayPauseButton("none");
    this.addTable(["Minion", "State", "Latest JID", "Target", "Function", "Start Time", "-menu-", "Tasks"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs("state.apply");

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleMinionsWheelKeyListAll(pWheelKeyListAllData);
      runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
        this._handleHighstateRunnerJobsListJobs(pRunnerJobsListJobsData);
        return true;
      }, (pRunnerJobsListJobsMsg) => {
        this._handleHighstateRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleMinionsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      return false;
    });
  }

  _addMenuItemStateApply (pMenu, pMinionId) {
    pMenu.addMenuItem("Apply state...", () => {
      this.runCommand(pMinionId, ["state.apply"]);
    });
  }

  _addMenuItemStateApplyTest (pMenu, pMinionId) {
    pMenu.addMenuItem("Test state...", () => {
      this.runCommand(pMinionId, ["state.apply", "test=", true]);
    });
  }

  _handleMinionsWheelKeyListAll (pWheelKeyListAll) {
    if (this.showErrorRowInstead(pWheelKeyListAll)) {
      return;
    }

    const keys = pWheelKeyListAll.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(minionId, 2);

      // preliminary dropdown menu
      const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);

      minionTr.appendChild(Utils.createTd("", ""));

      minionTr.addEventListener("click", (pClickEvent) => {
        const functionField = minionTr.querySelector(".function");
        if (functionField) {
          this.runCommand(minionId, functionField.cmd);
        } else {
          this.runCommand(minionId, ["state.apply"]);
        }
        pClickEvent.stopPropagation();
      });
    }

    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    this.setMsg(txt);
  }

  _handleHighstateRunnerJobsListJobs (pData) {
    if (this.showErrorRowInstead(pData)) {
      return;
    }

    // due to filter, all jobs are state.apply jobs

    let jobs = JobsPanel._jobsToArray(pData.return[0]);
    JobsPanel._sortJobs(jobs);

    const maxJobs = 10;
    if (jobs.length > maxJobs) {
      jobs = jobs.slice(0, maxJobs);
    }

    this.jobs = jobs;

    this.setPlayPauseButton("play");

    this._updateNextJob();
  }

  _updateNextJob () {

    if (!this.jobs) {
      // no more work
      return;
    }

    // user can decide to halt screen updates
    // system can decide to remove the play/pause button
    if (this.playOrPause !== "play") {
      window.setTimeout(() => {
        this._updateNextJob();
      }, 1000);
      return;
    }

    const job = this.jobs.shift();
    this._handleJob(job);

    window.setTimeout(() => {
      this._updateNextJob();
    }, 1000);
  }

  _handleJob (pJob) {
    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(pJob.id);

    runnerJobsListJobPromise.then((pRunnerJobsListJobData) => {
      this._handleJobsRunnerJobsListJob(pJob.id, pRunnerJobsListJobData);
      return true;
    }, (pRunnerJobsListJobMsg) => {
      this._handleJobsRunnerJobsListJob(pJob.id, JSON.stringify(pRunnerJobsListJobMsg));
      this.jobs = undefined;
      return false;
    });
  }

  _handleJobsRunnerJobsListJob (pJobId, pJobData) {
    const jobData = pJobData.return[0];

    for (const minionId in jobData.Result) {
      const trId = Utils.getIdFromMinionId(minionId);

      // only use known minions
      const minionTr = this.table.querySelector("#" + trId);
      if (minionTr === null) {
        continue;
      }

      if (minionTr.jid) {
        // already found a more recent job
        continue;
      }

      // we already have the TR
      // but this function also clears the row
      this.getElement(trId);

      // mark the TR as populated
      minionTr.jid = pJobId;

      minionTr.appendChild(Utils.createTd("minion-id", minionId));

      const minionTd = Utils.createTd("status", "accepted");
      minionTd.classList.add("accepted");
      minionTr.appendChild(minionTd);

      minionTr.appendChild(Utils.createTd("", pJobId));

      let targetText = TargetType.makeTargetText(jobData);
      const maxTextLength = 50;
      if (targetText.length > maxTextLength) {
        // prevent column becoming too wide
        targetText = targetText.substring(0, maxTextLength) + "...";
      }
      minionTr.appendChild(Utils.createTd("target", targetText));

      const argumentsText = JobPanel.decodeArgumentsText(jobData.Arguments);
      let functionText = jobData.Function + argumentsText;
      if (functionText.length > maxTextLength) {
        // prevent column becoming too wide
        functionText = functionText.substring(0, maxTextLength) + "...";
      }
      const functionField = Utils.createTd("function", functionText);
      minionTr.appendChild(functionField);

      const cmd = [jobData.Function];

      // take the parameters from the original command
      // usually only "test=true"
      /* eslint-disable max-depth */
      for (const arg of jobData.Arguments) {
        if (typeof arg === "object") {
          for (const key in arg) {
            if (key === "__kwarg__") {
              continue;
            }
            cmd.push(key + "=", arg[key]);
          }
        } else {
          cmd.push(arg);
        }
      }
      /* eslint-enable max-depth */
      functionField.cmd = cmd;

      const startTimeText = Output.dateTimeStr(jobData.StartTime);
      minionTr.appendChild(Utils.createTd("starttime", startTimeText));

      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);
      this._addJobsMenuItemShowDetails(menu, jobData, minionId);

      const tasksTd = Utils.createTd("tasks", "");
      const minionResult = jobData.Result[minionId];
      const keys = Object.keys(minionResult.return);
      for (const key of keys) {
        const span = Utils.createSpan("", Character.BLACK_CIRCLE);
        span.style.backgroundColor = "black";

        span.addEventListener("click", (pClickEvent) => {
          this.runCommand(minionId, cmd);
          pClickEvent.stopPropagation();
        });

        Output._setTaskTooltip(span, minionResult.return[key]);
        tasksTd.append(span);
      }

      minionTr.appendChild(tasksTd);
    }

    let cnt = 0;
    const tbody = this.table.tBodies[0];
    for (const tr of tbody.rows) {
      if (tr.jid === undefined) {
        cnt += 1;
      }
    }
    if (cnt === 0) {
      // all minions have a most recent job
      this.jobs = [];
    }

    if (this.jobs.length !== 0) {
      // more work later
      return;
    }

    // cause timer to stop
    this.jobs = undefined;
    this.setPlayPauseButton("none");

    for (const tr of tbody.rows) {
      if (tr.jid) {
        // this row already populated
        continue;
      }
      const jidField = tr.querySelector(".os");
      jidField.innerText = "(no job)";
      jidField.classList.add("no-job-details");
    }
  }

  _addJobsMenuItemShowDetails (pMenu, pJob, pMinionId) {
    pMenu.addMenuItem("Show details", () => {
      this.router.goTo("job", {"id": pJob.jid, "minionid": pMinionId});
    });
  }
}
