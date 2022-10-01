/* global */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {JobPanel} from "./Job.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

// only consider this number of latest highstate jobs
const MAX_HIGHSTATE_JOBS = 10;

// more than this number of states switches to summary
const MAX_HIGHSTATE_STATES = 20;

export class HighStatePanel extends Panel {

  constructor () {
    super("highstate");

    this.addTitle("HighState");
    this.addPanelMenu();
    this._addMenuItemStateApply(this.panelMenu, "*");
    this._addMenuItemStateApplyTest(this.panelMenu, "*");
    this.addSettingsMenu();
    this._addMenuItemUseStateHighstate();
    this._addMenuItemUseStateApply();
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "This panel shows the latest state.highstate or state.apply job for each minion.",
      "Only the latest " + MAX_HIGHSTATE_JOBS + " jobs are verified.",
      "With more than " + MAX_HIGHSTATE_STATES + " states, a summary is shown instead.",
      "Click on an individual state to re-apply only that state."
    ]);
    this.addTable(["Minion", "State", "Latest JID", "Target", "Function", "Start Time", "-menu-", "States"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();

    // collect the list of hidden/shown environments
    this._showSaltEnvs = Utils.getStorageItemList("session", "show_saltenvs");
    this._hideSaltEnvs = Utils.getStorageItemList("session", "hide_saltenvs");
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();

    const cmdList = [];
    if (Utils.getStorageItem("local", "use_state_highstate", "true") === "true") {
      cmdList.push("state.highstate");
    }
    if (Utils.getStorageItem("local", "use_state_apply", "true") === "true") {
      cmdList.push("state.apply");
    }

    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs(cmdList);

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleMinionsWheelKeyListAll(pWheelKeyListAllData);
      if (cmdList.length === 0) {
        this._handleHighstateRunnerJobsListJobs({"return": [{}]});
      } else {
        runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
          this._handleHighstateRunnerJobsListJobs(pRunnerJobsListJobsData);
          return true;
        }, (pRunnerJobsListJobsMsg) => {
          this._handleHighstateRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
          return false;
        });
      }
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleMinionsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      Utils.ignorePromise(runnerJobsListJobsPromise);
      return false;
    });
  }

  _addMenuItemStateApply (pMenu, pMinionId) {
    pMenu.addMenuItem("Apply state...", () => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemStateApplyTest (pMenu, pMinionId) {
    pMenu.addMenuItem("Test state...", () => {
      const cmdArr = ["state.apply", "test=", true];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemUseStateHighstate () {
    this.settingsMenu.addMenuItem(
      () => {
        const stateHighstateFlag = Utils.getStorageItem("local", "use_state_highstate", "true");
        return (stateHighstateFlag === "true" ? Character.HEAVY_CHECK_MARK + Character.NO_BREAK_SPACE : "") + "Include state.highstate";
      }, () => {
        const stateHighstateFlag = Utils.getStorageItem("local", "use_state_highstate", "true");
        Utils.setStorageItem("local", "use_state_highstate", stateHighstateFlag === "false" ? "true" : "false");
        this.clearPanel();
        this.onShow();
      });
  }

  _addMenuItemUseStateApply () {
    this.settingsMenu.addMenuItem(
      () => {
        const stateApplyFlag = Utils.getStorageItem("local", "use_state_apply", "true");
        return (stateApplyFlag === "true" ? Character.HEAVY_CHECK_MARK + Character.NO_BREAK_SPACE : "") + "Include state.apply";
      }, () => {
        const stateApplyFlag = Utils.getStorageItem("local", "use_state_apply", "true");
        Utils.setStorageItem("local", "use_state_apply", stateApplyFlag === "false" ? "true" : "false");
        this.clearPanel();
        this.onShow();
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

      minionTr.appendChild(Utils.createTd());

      minionTr.addEventListener("click", (pClickEvent) => {
        const functionField = minionTr.querySelector(".function");
        if (functionField && functionField.cmd) {
          this.runCommand("", minionId, functionField.cmd);
        } else {
          const cmdArr = ["state.apply"];
          this.runCommand("", minionId, cmdArr);
        }
        pClickEvent.stopPropagation();
      });
    }

    this.updateFooter();
  }

  updateFooter () {
    const tbody = this.table.tBodies[0];
    const txt = Utils.txtZeroOneMany(tbody.rows.length,
      "No minions", "{0} minion", "{0} minions");
    this.setMsg(txt);
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

    this.setPlayPauseButton(jobs.length === 0 ? "none" : "play");

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

  static _getJobNamedParam (pParamName, pJobData, pDefaultValue) {
    const args = pJobData.Arguments;
    if (!args) {
      return pDefaultValue;
    }
    for (const arg of args) {
      // for jobs that were started using 'salt-call'
      if (typeof arg === "string" && arg.startsWith(pParamName + "=")) {
        return arg.replace(/^[^=]*=/, "");
      }
      // for jobs that were started using 'salt'
      if (typeof arg !== "object" || Array.isArray(arg)) {
        continue;
      }
      if (arg.__kwarg__ !== true) {
        continue;
      }
      if (arg[pParamName] !== undefined) {
        return arg[pParamName];
      }
    }
    return pDefaultValue;
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

    const saltEnv = HighStatePanel._getJobNamedParam("saltenv", jobData, "default");
    if (!Utils.isIncluded(saltEnv, this._showSaltEnvs, this._hideSaltEnvs)) {
      this._afterJob();
      return;
    }

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

      const obj = jobData.Result[minionId].return;
      if (typeof obj !== "object" || Array.isArray(obj)) {
        // not an object, not a valid state answer
        continue;
      }

      // we already have the TR
      // but this function also clears the row
      this.getElement(trId);

      // mark the TR as populated
      minionTr.jid = pJobId;

      minionTr.appendChild(Utils.createTd("minion-id", minionId));

      const minionTd = Utils.createTd(["status", "accepted"], "accepted");
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
      functionField.cmd = jobData.Function + argumentsText;
      minionTr.appendChild(functionField);

      /* eslint-enable max-depth */

      const startTimeTd = Utils.createTd();
      const startTimeSpan = Utils.createSpan("starttime");
      Output.dateTimeStr(jobData.StartTime, startTimeSpan);
      startTimeTd.appendChild(startTimeSpan);
      minionTr.appendChild(startTimeTd);

      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);
      this._addJobsMenuItemShowDetails(menu, jobData, minionId);

      const minionResult = jobData.Result[minionId];
      const tasksTd = Utils.createTd("tasks");

      if (typeof minionResult.return !== "object" || Array.isArray(minionResult.return)) {
        Utils.addErrorToTableCell(tasksTd, minionResult.return);
        minionTr.appendChild(tasksTd);
        this._afterJob();
        return;
      }

      const keys = Object.keys(minionResult.return);

      const stats = {};
      for (const key of keys) {

        const data = minionResult.return[key];
        if (typeof data !== "object") {
          continue;
        }

        data.___key___ = key;

        // always create the span for the state
        // we may use it for presentation (keys.length <= MAX_HIGHSTATE_STATES); or
        // for information (keys.length > MAX_HIGHSTATE_STATES)

        const span = Utils.createSpan("task", Character.BLACK_CIRCLE);
        span.style.backgroundColor = "black";

        // this also sets the span's class(es)
        Output._setTaskToolTip(span, data);

        // add class here again, because it gets lost in _setTaskToolTip
        span.classList.add("task");

        if (keys.length > MAX_HIGHSTATE_STATES) {
          let statKey = "";
          let prio = 0;

          // statkeys are sortable on their priority
          if (span.classList.contains("task-skipped")) {
            statKey = "task-skipped";
            prio = 31;
          } else if (span.classList.contains("task-success")) {
            statKey = "task-success";
            prio = 41;
          } else if (span.classList.contains("task-failure")) {
            statKey = "task-failure";
            prio = 21;
          } else {
            statKey = "task-unknown";
            prio = 11;
          }

          if (span.classList.contains("task-changes")) {
            prio -= 1;
            statKey += " task-changes";
          }

          // allow keys to be sortable
          statKey = prio + statKey;

          if (statKey in stats) {
            stats[statKey] += 1;
          } else {
            stats[statKey] = 1;
          }

          continue;
        }

        span.addEventListener("click", (pClickEvent) => {
          const cmdArr = ["state.sls_id", data.__id__, "mods=", data.__sls__];
          this.runCommand("", minionId, cmdArr);
          pClickEvent.stopPropagation();
        });

        tasksTd.append(span);
      }

      if (Object.keys(stats).length > 0) {

        const summarySpan = Utils.createSpan("tooltip");

        let sep = "";

        // show the summary when one was build up
        for (const statKey of Object.keys(stats).sort()) {
          const sepSpan = Utils.createSpan("", sep + stats[statKey] + Character.MULTIPLICATION_SIGN);
          summarySpan.append(sepSpan);
          sep = " ";

          // remove the priority indicator from the key
          const itemSpan = Utils.createSpan(["tasksummary", statKey.substring(2)], Character.BLACK_CIRCLE);
          itemSpan.style.backgroundColor = "black";
          summarySpan.append(itemSpan);
        }

        // allow similar navigation, but just only to the job level
        summarySpan.addEventListener("click", (pClickEvent) => {
          this.router.goTo("job", {"id": pJobId, "minionid": minionId});
          pClickEvent.stopPropagation();
        });

        tasksTd.append(summarySpan);
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
