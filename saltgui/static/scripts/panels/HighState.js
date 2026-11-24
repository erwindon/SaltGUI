/* global */

import {Character} from "../Character.js";
import {JobPanel} from "./Job.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";


export class HighStatePanel extends Panel {

  constructor () {
    super("highstate", ["select_minions"]);

    // only consider this number of latest highstate jobs
    this._maxShowHighstates = Utils.getStorageItem("session", "max_show_highstates", 10);
    // more than this number of states switches to summary
    this._maxHighstateStates = Utils.getStorageItem("session", "max_highstate_states", 20);

    this.addTitle("HighState");
    this.addPanelMenu();
    this._addMenuItemStateApply(this.panelMenu, "*");
    this._addMenuItemStateApplyTest(this.panelMenu, "*");
    this.addSettingsMenu();
    this._addMenuItemUseStateHighstate();
    this._addMenuItemUseStateApply();
    this.addSearchButton();
    this.addFilterButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "This panel shows the latest state.highstate or state.apply job for each minion.",
      "Only the latest " + this._maxShowHighstates + " jobs are verified.",
      "With more than " + this._maxHighstateStates + " states, a summary is shown instead.",
      "Click on an individual state to re-apply only that state."
    ]);
    this.addWarningField();
    this.addTable(["-select-", "-menu-", "Minion", "State", "Latest JID", "Target", "Function", "Start Time", "States"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable("cmd");
    this.addMsg();

    // collect the list of hidden/shown environments
    this._showSaltEnvs = Utils.getStorageItemList("session", "show_saltenvs");
    this._hideSaltEnvs = Utils.getStorageItemList("session", "hide_saltenvs");
  }

  onShow () {
    super.onShow();

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();

    this.nrMinions = 0;

    const cmdList = [];
    if (Utils.getStorageItem("local", "use_state_highstate", "true") === "true") {
      cmdList.push("state.highstate");
    }
    if (Utils.getStorageItem("local", "use_state_apply", "true") === "true") {
      cmdList.push("state.apply");
    }

    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs(cmdList);

    // remove the previous warning, if any
    // and show this while loading more info
    super.setWarningText("info", "loading" + Character.HORIZONTAL_ELLIPSIS);

    wheelKeyListAllPromise.then((ok_WheelKeyListAll) => {
      this._handleMinionsWheelKeyListAll(ok_WheelKeyListAll);
      if (cmdList.length === 0) {
        this._handleHighstateRunnerJobsListJobs({"return": [{}]});
      } else {
        runnerJobsListJobsPromise.then((ok_RunnerJobsListJobs) => {
          this._handleHighstateRunnerJobsListJobs(ok_RunnerJobsListJobs);
          return true;
        }, (_error_RunnerJobsListJobs) => {
          this._handleHighstateRunnerJobsListJobs(JSON.stringify(_error_RunnerJobsListJobs));
          return false;
        });
      }
      return true;
    }, (_error_WheelKeyListAll) => {
      this._handleMinionsWheelKeyListAll(JSON.stringify(_error_WheelKeyListAll));
      Utils.ignorePromise(runnerJobsListJobsPromise);
      return false;
    });
  }

  _addMenuItemStateApply (pMenu, pMinionId) {
    pMenu.addMenuItemCmd("Apply state...", () => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr, ["select_minions"]);
    });
  }

  _addMenuItemStateApplyTest (pMenu, pMinionId) {
    pMenu.addMenuItemCmd("Test state...", () => {
      const cmdArr = ["state.apply", "test=", true];
      this.runCommand("", pMinionId, cmdArr, ["select_minions"]);
    });
  }

  _addMenuItemUseStateHighstate () {
    this.settingsMenu.addMenuItemCmd(
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
    this.settingsMenu.addMenuItemCmd(
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
    this.nrMinions = minionIds.length;
    this.nrUnaccepted = keys.minions_pre.length;

    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId);

      // preliminary dropdown menu
      this._addMenuItemStateApply(minionTr.dropdownmenu, minionId);
      this._addMenuItemStateApplyTest(minionTr.dropdownmenu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        const functionField = minionTr.querySelector(".function");
        if (functionField?.cmd) {
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

  _handleHighstateRunnerJobsListJobs (pData) {
    if (this.showErrorRowInstead(pData)) {
      const tbody = this.table.tBodies[0];
      for (const tr of tbody.rows) {
        const osField = tr.querySelector(".os");
        Utils.addErrorToTableCell(osField, pData);
      }
      return;
    }

    // due to filter, all jobs are state.apply and/or state.highstate jobs

    let jobs = JobsPanel.jobsToArray(pData.return[0]);
    JobsPanel.sortJobs(jobs);

    if (jobs.length > this._maxShowHighstates) {
      jobs = jobs.slice(0, this._maxShowHighstates);
    }

    this.jobs = jobs;
    this.jobsCnt = jobs.length;

    this.startLoop(this, 1000);
  }

  loopInit () {
    return this.jobs;
  }

  loopItem (pJob) {
    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(pJob.id);

    return runnerJobsListJobPromise.then((ok_RunnerJobsListJob) => {
      this._handleJobsRunnerJobsListJob(pJob.id, ok_RunnerJobsListJob);
      // stop when all minions have a most recent job
      return !this._allMinionsHaveJob();
    }, (_error_RunnerJobsListJob) => {
      this._handleJobsRunnerJobsListJob(pJob.id, JSON.stringify(_error_RunnerJobsListJob));
      // the remaining jobs will fail just the same
      return false;
    });
  }

  _allMinionsHaveJob () {
    const tbody = this.table.tBodies[0];
    for (const tr of tbody.rows) {
      if (tr.jid === undefined) {
        return false;
      }
    }
    return true;
  }

  loopEnd () {
    const tbody = this.table.tBodies[0];

    let foundMinionWithoutJob = false;
    for (const tr of tbody.rows) {
      if (tr.jid) {
        // this row already populated
        continue;
      }
      const jidField = tr.querySelector(".os");
      jidField.innerText = "(no job)";
      jidField.classList.add("no-job-details");
      foundMinionWithoutJob = true;
    }

    if (!foundMinionWithoutJob) {
      // every row has data
      super.setWarningText();
    } else if (this.jobsCnt === 0) {
      super.setWarningText("info", "no jobs were found");
    } else if (this.jobsCnt === 1) {
      super.setWarningText("info", "only 1 job was found and some minions did not have results in that job");
    } else if (this.jobsCnt < this._maxShowHighstates) {
      super.setWarningText("info", "only " + this.jobsCnt + " jobs were found and some minions did not have results in any of these jobs");
    } else {
      super.setWarningText("info", "the latest " + this._maxShowHighstates + " jobs were inspected and some minions did not have results in any of these jobs");
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
      this._markUnpopulatedMinionsAsError(pJobData);
      return;
    }

    const jobData = pJobData.return[0];

    if (!this._shouldProcessJob(jobData)) {
      return;
    }

    for (const minionId in jobData.Result) {
      this._processMinionResult(pJobId, jobData, minionId);
    }
  }

  _markUnpopulatedMinionsAsError (pJobData) {
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
  }

  _shouldProcessJob (pJobData) {
    // user may have changed the preference while this was loaded in the background
    // ignore when no longer applicable
    if (pJobData.Function === "state.highstate" && Utils.getStorageItem("local", "use_state_highstate", "true") !== "true") {
      return false;
    }
    if (pJobData.Function === "state.apply" && Utils.getStorageItem("local", "use_state_apply", "true") !== "true") {
      return false;
    }

    const saltEnv = HighStatePanel._getJobNamedParam("saltenv", pJobData, "default");
    if (!Utils.isIncluded(saltEnv, this._showSaltEnvs, this._hideSaltEnvs)) {
      return false;
    }

    return true;
  }

  _processMinionResult (pJobId, pJobData, pMinionId) {
    const trId = Utils.getIdFromMinionId(pMinionId);

    // only use known minions
    const minionTr = this.table.querySelector("#" + trId);
    if (minionTr === null) {
      return;
    }

    if (minionTr.jid) {
      // already found a more recent job
      return;
    }

    const obj = pJobData.Result[pMinionId].return;
    if (typeof obj !== "object" || Array.isArray(obj)) {
      // not an object, not a valid state answer
      return;
    }

    // we already have the TR
    // but this function also clears the row
    this.getElement(trId, "select_minions", pMinionId);

    // mark the TR as populated
    minionTr.jid = pJobId;

    this._addBasicMinionCells(minionTr, pMinionId, pJobId, pJobData);
    this._addMinionMenuItems(minionTr, pJobData, pMinionId);
    this._addTaskCells(minionTr, pJobData, pMinionId, pJobId);
  }

  _addBasicMinionCells (pMinionTr, pMinionId, pJobId, pJobData) {
    pMinionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const minionTd = Utils.createTd(["status", "accepted"], "accepted");
    pMinionTr.appendChild(minionTd);

    const jobIdTd = Utils.createTd();
    const jobIdSpan = Utils.createSpan("tooltip", pJobId);
    jobIdSpan.addEventListener("click", (pClickEvent) => {
      this.router.goTo("job", {"id": pJobId, "minionid": pMinionId}, undefined, pClickEvent);
      pClickEvent.stopPropagation();
    });
    jobIdTd.appendChild(jobIdSpan);
    pMinionTr.appendChild(jobIdTd);

    pMinionTr.appendChild(HighStatePanel._createTargetCell(pJobData));
    pMinionTr.appendChild(HighStatePanel._createFunctionCell(pJobData));
    pMinionTr.appendChild(HighStatePanel._createStartTimeCell(pJobData));
  }

  static _createTargetCell (pJobData) {
    let targetText = TargetType.makeTargetText(pJobData);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
    }
    return Utils.createTd("target", targetText);
  }

  static _createFunctionCell (pJobData) {
    const maxTextLength = 50;
    const argumentsText = JobPanel.decodeArgumentsArray(pJobData.Arguments);
    let functionText = pJobData.Function + argumentsText;
    if (functionText.length > maxTextLength) {
      // prevent column becoming too wide
      functionText = functionText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
    }
    const functionField = Utils.createTd("function", functionText);
    functionField.cmd = pJobData.Function + argumentsText;
    return functionField;
  }

  static _createStartTimeCell (pJobData) {
    const startTimeTd = Utils.createTd();
    const startTimeSpan = Utils.createSpan("starttime");
    Output.dateTimeStr(pJobData.StartTime, startTimeSpan);
    startTimeTd.appendChild(startTimeSpan);
    return startTimeTd;
  }

  _addMinionMenuItems (pMinionTr, pJobData, pMinionId) {
    this._addMenuItemStateApply(pMinionTr.dropdownmenu, pMinionId);
    this._addMenuItemStateApplyTest(pMinionTr.dropdownmenu, pMinionId);
    this._addJobsMenuItemShowDetails(pMinionTr.dropdownmenu, pJobData, pMinionId);
  }

  _addTaskCells (pMinionTr, pJobData, pMinionId, pJobId) {
    const minionResult = pJobData.Result[pMinionId];
    const tasksTd = Utils.createTd("tasks");

    if (typeof minionResult.return !== "object" || Array.isArray(minionResult.return)) {
      Utils.addErrorToTableCell(tasksTd, minionResult.return);
      pMinionTr.appendChild(tasksTd);
      return;
    }

    const keys = Object.keys(minionResult.return);
    const stats = {};

    this._populateTaskSpans(tasksTd, keys, minionResult.return, pMinionId, stats);
    this._addTaskSummary(tasksTd, stats, pJobId, pMinionId);

    pMinionTr.appendChild(tasksTd);
  }

  _populateTaskSpans (pTasksTd, pKeys, pReturnData, pMinionId, pStats) {
    for (const key of pKeys) {
      const data = pReturnData[key];
      if (typeof data !== "object") {
        continue;
      }

      data.___key___ = key;

      // always create the span for the state
      // we may use it for presentation (pKeys.length <= this._maxHighstateStates); or
      // for information (pKeys.length > this._maxHighstateStates)

      const span = Utils.createSpan("task");
      span.style.backgroundColor = "black";

      // this also sets the span's class(es)
      Output.setTaskToolTip(span, data);

      // add class here again, because it gets lost in setTaskToolTip
      span.classList.add("task");

      if (pKeys.length > this._maxHighstateStates) {
        HighStatePanel._recordTaskInStats(data, pStats);
        continue;
      }

      span.addEventListener("click", (pClickEvent) => {
        const cmdArr = ["state.sls_id", data.__id__, "mods=", data.__sls__];
        this.runCommand("", pMinionId, cmdArr);
        pClickEvent.stopPropagation();
      });

      pTasksTd.append(span);
    }
  }

  static _recordTaskInStats (pData, pStats) {
    const taskClass = Output.getTaskClass(pData);
    const taskChar = Output.getTaskCharacter(pData);

    // priority must always be a 2-digit value (i.e. 10..99)
    // taskClass is to be sorted on its priority (low to high)
    const priority = HighStatePanel._getTaskPriority(taskClass);

    // allow keys to be sortable
    const statKey = priority + taskClass + taskChar;

    if (statKey in pStats) {
      pStats[statKey] += 1;
    } else {
      pStats[statKey] = 1;
    }
  }

  static _getTaskPriority (pTaskClass) {
    switch (pTaskClass) {
    case "task-success":
      return 41;
    case "task-success-changes":
      return 40;
    case "task-skipped":
      return 31;
    case "task-skipped-changes":
      return 30;
    case "task-failure":
      return 21;
    case "task-failure-changes":
      return 20;
    default:
      return 11;
    }
  }

  _addTaskSummary (pTasksTd, pStats, pJobId, pMinionId) {
    if (Object.keys(pStats).length === 0) {
      return;
    }

    const summarySpan = Utils.createSpan("tooltip");

    let sep = "";

    // show the summary when one was build up
    for (const statKey of Object.keys(pStats).sort(Utils.mySortFunction)) {
      const character = statKey.substring(statKey.length - 1);
      const className = statKey.substring(2, statKey.length - 1);
      const sepSpan = Utils.createSpan("", sep + pStats[statKey] + Character.MULTIPLICATION_SIGN);
      summarySpan.append(sepSpan);
      sep = " ";

      // remove the priority indicator from the key
      const itemSpan = Utils.createSpan(["tasksummary", className], character);
      itemSpan.style.backgroundColor = "black";
      summarySpan.append(itemSpan);
      Utils.addToolTip(itemSpan, className.replace("task-", "").replace("-", " with "));
    }

    // allow similar navigation, but just only to the job level
    summarySpan.addEventListener("click", (pClickEvent) => {
      this.router.goTo("job", {"id": pJobId, "minionid": pMinionId}, undefined, pClickEvent);
      pClickEvent.stopPropagation();
    });

    pTasksTd.append(summarySpan);
  }

  _addJobsMenuItemShowDetails (pMenu, pJob, pMinionId) {
    pMenu.addMenuItemCmd("Show details", (pClickEvent) => {
      this.router.goTo("job", {"id": pJob.jid, "minionid": pMinionId}, undefined, pClickEvent);
    });
  }
}
