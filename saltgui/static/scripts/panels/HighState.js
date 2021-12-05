/* global window */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {JobPanel} from "./Job.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

const MAX_HIGHSTATE_JOBS = 10;

export class HighStatePanel extends Panel {

  constructor () {
    super("highstate");

    this.addTitle("HighState");
    this.addPanelMenu();
    this._addMenuItemStateApply(this.panelMenu, "*");
    this._addMenuItemStateApplyTest(this.panelMenu, "*");
    this.addSearchButton();
    this.addPlayPauseButton("none");
    this.addHelpButton([
      "This panel shows the latest state.highstate or state.apply job for each minion.",
      "Only the latest " + MAX_HIGHSTATE_JOBS + " jobs are verified.",
      "Click on an individual state to re-apply only that state."
    ]);
    this.addTable(["Minion", "State", "Latest JID", "Target", "Function", "Start Time", "-menu-", "States"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs(["state.apply", "state.highstate"]);

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
      Utils.ignorePromise(runnerJobsListJobsPromise);
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
        if (functionField && functionField.cmd) {
          this.runFullCommand("", minionId, functionField.cmd);
        } else {
          this.runCommand(minionId, ["state.apply"]);
        }
        pClickEvent.stopPropagation();
      });
    }

    this.updateFooter();
  }

  updateFooter () {
    const tbody = this.table.tBodies[0];
    let txt = Utils.txtZeroOneMany(tbody.rows.length,
      "No minions", "{0} minion", "{0} minions");

    if (this.playOrPause === "pause") {
      txt += ", press " + Character.buttonInText(Character.CH_PLAY) + " to continue";
    }
    this.setMsg(txt, true);
  }

  _handleHighstateRunnerJobsListJobs (pData) {
    if (this.showErrorRowInstead(pData)) {
      const tbody = this.table.tBodies[0];
      for (const tr of tbody.rows) {
        const osField = tr.querySelector(".os");
        Utils.addErrorToTableCell(osField, pData);
      }
      return;
    }

    // due to filter, all jobs are state.apply jobs

    let jobs = JobsPanel._jobsToArray(pData.return[0]);
    JobsPanel._sortJobs(jobs);

    if (jobs.length > MAX_HIGHSTATE_JOBS) {
      jobs = jobs.slice(0, MAX_HIGHSTATE_JOBS);
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

    // we might have no relevant jobs
    if (this.jobs.length === 0) {
      this._afterJob();
      return;
    }

    // user can decide to halt screen updates
    // system can decide to remove the play/pause button
    if (this.playOrPause === "play") {
      const job = this.jobs.shift();
      this._handleJob(job);
    }

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

  _afterJob () {
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

    if (this.jobs && this.jobs.length !== 0) {
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

  _handleJobsRunnerJobsListJob (pJobId, pJobData) {

    if (this.showErrorRowInstead(pJobData)) {
      // when we do noty have the job data, it cannot be
      // determined which minions were involved
      // therefore mark all remaining minions as in-errror
      const tbody = this.table.tBodies[0];
      for (const tr of tbody.rows) {
        if (tr.jid) {
          continue;
        }
        const osField = tr.querySelector(".os");
        Utils.addErrorToTableCell(osField, pJobData, "bottom-left");
        // prevent further updates
        tr.jid = "error";
      }
      return;
    }

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

      const jobIdTd = Utils.createTd();
      const jobIdSpan = Utils.createSpan("tooltip", pJobId);
      jobIdSpan.addEventListener("click", (pClickEvent) => {
        this.router.goTo("job", {"id": pJobId, "minionid": minionId});
        pClickEvent.stopPropagation();
      });
      jobIdTd.appendChild(jobIdSpan);
      minionTr.appendChild(jobIdTd);

      let targetText = TargetType.makeTargetText(jobData);
      const maxTextLength = 50;
      if (targetText.length > maxTextLength) {
        // prevent column becoming too wide
        targetText = targetText.substring(0, maxTextLength) + "...";
      }
      minionTr.appendChild(Utils.createTd("target", targetText));

      const argumentsText = JobPanel.decodeArgumentsArray(jobData.Arguments);
      let functionText = jobData.Function + argumentsText;
      if (functionText.length > maxTextLength) {
        // prevent column becoming too wide
        functionText = functionText.substring(0, maxTextLength) + "...";
      }
      const functionField = Utils.createTd("function", functionText);
      functionField.cmd = functionText;
      minionTr.appendChild(functionField);

      /* eslint-enable max-depth */

      const startTimeText = Output.dateTimeStr(jobData.StartTime);
      minionTr.appendChild(Utils.createTd("starttime", startTimeText));

      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);
      this._addJobsMenuItemShowDetails(menu, jobData, minionId);

      const minionResult = jobData.Result[minionId];
      const tasksTd = Utils.createTd("tasks", "");

      if (typeof minionResult.return !== "object" || Array.isArray(minionResult.return)) {
        Utils.addErrorToTableCell(tasksTd, JSON.stringify(minionResult.return));
      } else {
        const keys = Object.keys(minionResult.return);
        for (const key of keys) {
          const span = Utils.createSpan("", Character.BLACK_CIRCLE);
          span.style.backgroundColor = "black";

          const data = minionResult.return[key];
          if (typeof data !== "object") {
            continue;
          }
          span.addEventListener("click", (pClickEvent) => {
            this.runCommand(minionId, ["state.sls_id", data.__id__, "mods=", data.__sls__]);
            pClickEvent.stopPropagation();
          });
          Output._setTaskToolTip(span, data);
          tasksTd.append(span);
        }
      }

      minionTr.appendChild(tasksTd);
    }

    this._afterJob();
  }

  _addJobsMenuItemShowDetails (pMenu, pJob, pMinionId) {
    pMenu.addMenuItem("Show details", () => {
      this.router.goTo("job", {"id": pJob.jid, "minionid": pMinionId});
    });
  }
}
