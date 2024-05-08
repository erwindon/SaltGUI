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
    super("highstate");

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
    this.addPlayPauseButton();
    this.addHelpButton([
      "This panel shows the latest state.highstate or state.apply job for each minion.",
      "Only the latest " + this._maxShowHighstates + " jobs are verified.",
      "With more than " + this._maxHighstateStates + " states, a summary is shown instead.",
      "Click on an individual state to re-apply only that state."
    ]);
    this.addWarningField();
    this.addTable(["-menu-", "Minion", "State", "Latest JID", "Target", "Function", "Start Time", "States"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable("cmd");
    this.addMsg();

    // collect the list of hidden/shown environments
    this._showSaltEnvs = Utils.getStorageItemList("session", "show_saltenvs");
    this._hideSaltEnvs = Utils.getStorageItemList("session", "hide_saltenvs");
  }

  onShow () {
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
    this.nrMinions = minionIds.length;
    this.nrUnaccepted = keys.minions_pre.length;

    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId);

      // preliminary dropdown menu
      this._addMenuItemStateApply(minionTr.dropdownmenu, minionId);
      this._addMenuItemStateApplyTest(minionTr.dropdownmenu, minionId);

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

    let jobs = JobsPanel._jobsToArray(pData.return[0]);
    JobsPanel._sortJobs(jobs);

    if (jobs.length > this._maxShowHighstates) {
      jobs = jobs.slice(0, this._maxShowHighstates);
    }

    this.jobs = jobs;
    this.jobsCnt = jobs.length;

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

    // user may have changed the preference while this was loaded in the background
    // ignore when no longer applicable
    if (jobData.Function === "state.highstate" && Utils.getStorageItem("local", "use_state_highstate", "true") !== "true") {
      return;
    }
    if (jobData.Function === "state.apply" && Utils.getStorageItem("local", "use_state_apply", "true") !== "true") {
      return;
    }

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
        this.router.goTo("job", {"id": pJobId, "minionid": minionId}, undefined, pClickEvent);
        pClickEvent.stopPropagation();
      });
      jobIdTd.appendChild(jobIdSpan);
      minionTr.appendChild(jobIdTd);

      let targetText = TargetType.makeTargetText(jobData);
      const maxTextLength = 50;
      if (targetText.length > maxTextLength) {
        // prevent column becoming too wide
        targetText = targetText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
      }
      minionTr.appendChild(Utils.createTd("target", targetText));

      const argumentsText = JobPanel.decodeArgumentsArray(jobData.Arguments);
      let functionText = jobData.Function + argumentsText;
      if (functionText.length > maxTextLength) {
        // prevent column becoming too wide
        functionText = functionText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
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

      this._addMenuItemStateApply(minionTr.dropdownmenu, minionId);
      this._addMenuItemStateApplyTest(minionTr.dropdownmenu, minionId);
      this._addJobsMenuItemShowDetails(minionTr.dropdownmenu, jobData, minionId);

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
        // we may use it for presentation (keys.length <= this._maxHighstateStates); or
        // for information (keys.length > this._maxHighstateStates)

        const span = Utils.createSpan("task", Character.BLACK_CIRCLE);
        span.style.backgroundColor = "black";

        // this also sets the span's class(es)
        Output._setTaskToolTip(span, data);

        // add class here again, because it gets lost in _setTaskToolTip
        span.classList.add("task");

        if (keys.length > this._maxHighstateStates) {
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
            span.innerText = Character.BLACK_CIRCLE_WITH_OUTLINE;
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
          const itemSpan = Utils.createSpan(["tasksummary", "taskcircle"], Character.BLACK_CIRCLE);
          itemSpan.classList.add(...statKey.substring(2).split(" "));
          if(itemSpan.classList.contains("task-changes")) {
            itemSpan.innerText = Character.BLACK_CIRCLE_WITH_OUTLINE;
          }
          itemSpan.style.backgroundColor = "black";
          summarySpan.append(itemSpan);
        }

        // allow similar navigation, but just only to the job level
        summarySpan.addEventListener("click", (pClickEvent) => {
          this.router.goTo("job", {"id": pJobId, "minionid": minionId}, undefined, pClickEvent);
          pClickEvent.stopPropagation();
        });

        tasksTd.append(summarySpan);
      }

      minionTr.appendChild(tasksTd);
    }

    this._afterJob();
  }

  _addJobsMenuItemShowDetails (pMenu, pJob, pMinionId) {
    pMenu.addMenuItem("Show details", (pClickEvent) => {
      this.router.goTo("job", {"id": pJob.jid, "minionid": pMinionId}, undefined, pClickEvent);
    });
  }
}
