/* global console */

import {Character} from "../Character.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class JobsPanel extends Panel {

  onShow (cnt) {
    // collect the list of hidden/shown functions
    this._showJobs = Utils.getStorageItemList("session", "show_jobs");
    this._hideJobs = Utils.getStorageItemList("session", "hide_jobs");

    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.api.getRunnerJobsActive();

    runnerJobsListJobsPromise.then((ok_RunnerJobsListJobs) => {
      this._handleRunnerJobsListJobs(ok_RunnerJobsListJobs, cnt);
      runnerJobsActivePromise.then((ok_RunnerJobsActive) => {
        this._handleRunnerJobsActive(ok_RunnerJobsActive);
        return true;
      }, (_error_RunnerJobsActive) => {
        this._handleRunnerJobsActive(JSON.stringify(_error_RunnerJobsActive));
        return false;
      });
      return true;
    }, (_error_RunnerJobsListJobs) => {
      this._handleRunnerJobsListJobs(JSON.stringify(_error_RunnerJobsListJobs));
      Utils.ignorePromise(runnerJobsActivePromise);
      return false;
    });
  }

  startRunningJobs () {
    const runnerJobsActivePromise = this.api.getRunnerJobsActive();

    runnerJobsActivePromise.then((ok_RunnerJobsActive) => {
      this._handleRunnerJobsActive(ok_RunnerJobsActive);
      return true;
    }, (_error_RunnerJobsActive) => {
      this._handleRunnerJobsActive(JSON.stringify(_error_RunnerJobsActive));
      return false;
    });
  }

  _handleRunnerJobsActive (pData) {
    if (!pData) {
      return;
    }

    if (typeof pData !== "object") {
      this._markAllJobsWithError(pData);
      return;
    }

    const jobs = pData.return[0];
    this._updateRunningJobs(jobs);
    this._updateFinishedJobs();
  }

  _markAllJobsWithError (pData) {
    // update all jobs (page) with the error message
    const tbody = this.table.tBodies[0];
    for (const tr of tbody.rows) {
      const statusField = tr.querySelector("span.no-job-status");
      if (!statusField) {
        continue;
      }
      Utils.addErrorToTableCell(statusField.parentElement, pData);
    }
  }

  _updateRunningJobs (pJobs) {
    // update all running jobs
    for (const jobId in pJobs) {
      const job = pJobs[jobId];
      const targetField = this.table.querySelector("tr#" + Utils.getIdFromJobId(jobId) + " span.job-status");

      // the field may not (yet) be on the screen
      if (!targetField) {
        continue;
      }

      const targetText = JobsPanel._buildJobStatusText(job);
      JobsPanel._updateJobStatusField(targetField, jobId, targetText);
    }
  }

  static _buildJobStatusText (pJob) {
    let targetText = "";
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      // yes, the addition of running/returned may again make
      // the string longer than 50 characters, we accept that
      targetText = targetText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
    }
    // then add the operational statistics
    if (pJob.Running && pJob.Running.length > 0) {
      targetText += pJob.Running.length + " running";
    }
    if (pJob.Returned && pJob.Returned.length > 0) {
      targetText += ", " + pJob.Returned.length + " returned";
    }
    return targetText;
  }

  static _updateJobStatusField (pTargetField, pJobId, pTargetText) {
    pTargetField.classList.remove("no-job-status");
    pTargetField.innerText = pTargetText;
    pTargetField.insertBefore(Utils.createJobStatusSpan(pJobId, true), pTargetField.firstChild);
    Utils.addToolTip(pTargetField, "Click to refresh column");
  }

  _updateFinishedJobs () {
    // update all finished jobs (page)
    const tbody = this.table.tBodies[0];
    for (const tr of tbody.rows) {
      const statusField = tr.querySelector("span.no-job-status");
      if (!statusField) {
        continue;
      }
      JobsPanel._markJobAsFinished(statusField);
      JobsPanel._removeRefreshButton(tr);
    }
  }

  static _markJobAsFinished (pStatusField) {
    pStatusField.classList.remove("no-job-status");
    pStatusField.innerText = "done";
    // we show the tooltip here so that the user is invited to click on this
    // the user then sees other rows being updated without becoming invisible
    Utils.addToolTip(pStatusField, "Click to refresh column");
  }

  static _removeRefreshButton (pTr) {
    // remove the refresh button when it is still there
    // needed when not all minions have reported their status
    // but also there are no jobs running anymore
    const detailsField = pTr.querySelector("#status" + pTr.dataset.jobid);
    if (detailsField) {
      detailsField.remove();
    }
  }

  _handleRunnerJobsListJobs (pData, pMaxNumberOfJobs = 7) {
    if (this.showErrorRowInstead(pData)) {
      return;
    }

    const jobs = JobsPanel.jobsToArray(pData.return[0]);
    JobsPanel.sortJobs(jobs);

    // These jobs are likely started by the SaltGUI
    // do not display them
    this._hideJobs.push(
      "beacons.add",
      "beacons.delete",
      "beacons.disable",
      "beacons.disable_beacon",
      "beacons.enable",
      "beacons.enable_beacon",
      "beacons.list",
      "beacons.list_available",
      "beacons.modify",
      "beacons.reset",
      "beacons.save",
      "grains.append",
      "grains.delkey",
      "grains.delval",
      "grains.items",
      "grains.setval",
      "mine.delete",
      "mine.flush",
      "mine.get",
      "mine.update",
      "mine.valid",
      "pillar.items",
      "pillar.obfuscate",
      "ps.kill_pid",
      "ps.proc_info",
      "test.providers",
      "test.version",
      "saltutil.find_job",
      "saltutil.kill_job",
      "saltutil.refresh_grains",
      "saltutil.refresh_pillar",
      "saltutil.running",
      "saltutil.signal_job",
      "saltutil.term_job",
      "schedule.add",
      "schedule.delete",
      "schedule.disable",
      "schedule.disable_job",
      "schedule.enable",
      "schedule.enable_job",
      "schedule.list",
      "schedule.modify",
      "schedule.run_job",
      "sys.doc",
      // runner jobs
      // do not hide "runner.state.orchestrate"
      "runner.cache.grains",
      "runner.cache.pillar",
      "runner.doc.runner",
      "runner.doc.wheel",
      "runner.jobs.active",
      "runner.jobs.list_job",
      "runner.jobs.list_jobs",
      "runner.manage.versions",
      "runner.state.orchestrate_show_sls",
      // wheel jobs
      "wheel.config.values",
      "wheel.key.accept",
      "wheel.key.delete",
      "wheel.key.finger",
      "wheel.key.list_all",
      "wheel.key.reject",
      "wheel.minions.connected"
    );

    let numberOfJobsShown = 0;
    let numberOfJobsEligible = 0;
    const numberOfJobsPresent = jobs.length;
    for (const job of jobs) {

      if (Utils.isIncluded(job.Function, this._showJobs, this._hideJobs)) {
        numberOfJobsEligible += 1;
      } else if (pMaxNumberOfJobs !== 99999) {
        continue;
      }

      // Add only <pMaxNumberOfJobs> most recent jobs
      if (numberOfJobsShown >= pMaxNumberOfJobs) {
        continue;
      }

      // Note that "addJob" has a specialized version
      // in each of the subclasses
      this.addJob(job);

      numberOfJobsShown += 1;
    }

    this.numberOfJobsShown = numberOfJobsShown;
    this.numberOfJobsEligible = numberOfJobsEligible;
    this.numberOfJobsPresent = numberOfJobsPresent;

    this.setPlayPauseButton(numberOfJobsShown === 0 ? "none" : "play");

    this.updateFooter();

    this.jobsListIsReady();
  }

  updateFooter () {
    let txt = Utils.txtZeroOneMany(this.numberOfJobsShown,
      "No jobs shown", "{0} job shown", "{0} jobs shown");
    if (this.numberOfJobsEligible > 0 && this.numberOfJobsEligible > this.numberOfJobsShown) {
      txt += Utils.txtZeroOneMany(this.numberOfJobsEligible,
        "", ", {0} job eligible", ", {0} jobs eligible");
    }
    txt += Utils.txtZeroOneMany(this.numberOfJobsPresent,
      "", ", {0} job present", ", {0} jobs present");
    this.setMsgTxt(txt);
  }

  static jobsToArray (jobs) {
    if (typeof jobs === "string") {
      // typically when special returner is misconfigured
      // the warning may help solve that too
      /* eslint-disable no-console */
      console.warn(jobs);
      /* eslint-enable no-console */
      return [];
    }
    const keys = Object.keys(jobs);
    const newArray = [];

    for (const key of keys) {
      const job = jobs[key];
      job.id = key;
      newArray.push(job);
    }

    return newArray;
  }

  static sortJobs (jobs) {
    jobs.sort((aa, bb) => {
      // The id is already a string value based on the date,
      // let's use it to sort the jobs
      /* eslint-disable curly */
      if (aa.id < bb.id) return 1;
      if (aa.id > bb.id) return -1;
      /* eslint-enable curly */
      return 0;
    });
  }

  handleSaltJobRetEvent (pData) {

    // ignore the most common events until someone complains
    if (pData.fun === "saltutil.find_job") {
      return;
    }
    if (pData.fun === "saltutil.running") {
      return;
    }

    // { fun_args: […], jid: "20190704194624366796", return: true, retcode: 0, success: true, cmd: "_return", fun: "test.rand_sleep", id: "autobuild-it-4092", _stamp: "2019-07-04T17:46:28.448689" }
    const jid = pData.jid;
    if (!jid) {
      return;
    }

    let newLevel = 0;
    if (pData.success === true && pData.retcode === 0) {
      newLevel = 1;
    } else if (pData.success === true) {
      newLevel = 2;
    } else {
      newLevel = 3;
    }

    // This element only exists when the user happens to look at the output of that jobId.
    const spans = this.div.querySelectorAll("#status" + jid);
    for (const span of spans) {
      let oldLevel = span.dataset.level;
      if (oldLevel === undefined) {
        oldLevel = 0;
      }
      if (newLevel > oldLevel) {
        span.dataset.level = newLevel;
        if (newLevel === 1) {
          span.style.color = "green";
        } else if (newLevel === 2) {
          span.style.color = "orange";
        } else if (newLevel === 3) {
          span.style.color = "red";
        }
      }
      span.style.removeProperty("display");
    }
  }
}
