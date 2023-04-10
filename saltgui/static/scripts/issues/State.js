/* global */

import {Issues} from "./Issues.js";
import {JobsPanel} from "../panels/Jobs.js";
import {Utils} from "../Utils.js";

// only consider this number of latest highstate jobs
const MAX_HIGHSTATE_JOBS = 10;

export class StateIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "STATE");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();

    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs(["state.apply", "state.highstate", "state.sls_id"]);

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
        Issues.removeCategory(pPanel, "state");
        this._handleLowstateRunnerJobsListJobs(pPanel, pRunnerJobsListJobsData, pWheelKeyListAllData, msg);
        return true;
      }, (pRunnerJobsListJobsMsg) => {
        Issues.removeCategory(pPanel, "state");
        const tr = Issues.addIssue(pPanel, "state", "retrieving");
        Issues.addIssueMsg(tr, "Could not retrieve list of jobs");
        Issues.addIssueErr(tr, pRunnerJobsListJobsMsg);
        Issues.readyCategory(pPanel, msg);
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      Utils.ignorePromise(runnerJobsListJobsPromise);
      Issues.removeCategory(pPanel, "state");
      const tr = Issues.addIssue(pPanel, "state", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of keys");
      Issues.addIssueErr(tr, pWheelKeyListAllMsg);
      Issues.readyCategory(pPanel, msg);
      return false;
    });

    /* eslint-disable compat/compat */
    /* Promise.all is not supported in op_mini all, IE 11 */
    return Promise.all([wheelKeyListAllPromise, runnerJobsListJobsPromise]);
    /* eslint-enable compat/compat */
  }

  _handleLowstateRunnerJobsListJobs (pPanel, pData, pKeys, pMsg) {
    // due to filter, all jobs are state.apply jobs

    pKeys = pKeys.return[0].data.return.minions;

    let jobs = JobsPanel._jobsToArray(pData.return[0]);
    JobsPanel._sortJobs(jobs);

    if (jobs.length > MAX_HIGHSTATE_JOBS) {
      jobs = jobs.slice(0, MAX_HIGHSTATE_JOBS);
    }

    this.jobs = jobs;
    // this is good only while "State" is the only issue-provider that uses play/pause
    pPanel.setPlayPauseButton(jobs.length === 0 ? "none" : "play");

    this._updateNextJob(pPanel, pMsg, pKeys);
  }

  _updateNextJob (pPanel, pMsg, pKeys) {
    if (!this.jobs) {
      return;
    }
    if (!this.jobs.length) {
      // this is good only while "State" is the only issue-provider
      pPanel.setPlayPauseButton("none");
      this.jobs = null;
      Issues.readyCategory(pPanel, pMsg);
      return;
    }

    if (pPanel.playOrPause !== "play") {
      window.setTimeout(() => {
        this._updateNextJob(pPanel, pMsg, pKeys);
      }, 1000);
      return;
    }

    const job = this.jobs.pop();

    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(job.id);

    runnerJobsListJobPromise.then((pRunnerJobsListJobData) => {
      StateIssues._handleJobRunnerJobsListJob(pPanel, pRunnerJobsListJobData, pKeys);
      window.setTimeout(() => {
        this._updateNextJob(pPanel, pMsg, pKeys);
      }, 100);
      return true;
    }, (pRunnerJobsListJobsMsg) => {
      const tr = Issues.addIssue(pPanel, "state", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve details of job " + job.id);
      Issues.addIssueErr(tr, pRunnerJobsListJobsMsg);
      return false;
    });
  }

  static _handleJobRunnerJobsListJob (pPanel, pJobData, pKeys) {
    const jobData = pJobData.return[0];

    for (const minionId in jobData.Result) {

      if (pKeys.indexOf(minionId) < 0) {
        // this is no longer a valid minion
        continue;
      }

      const minionData = jobData.Result[minionId];
      if (minionData.out !== "highstate") {
        // never mind
        continue;
      }

      // the complicating factor is that each state may have multiple tasks
      for (const stateName in minionData.return) {
        const stateData = minionData.return[stateName];
        if (typeof stateData !== "object") {
          // e.g. an error string
          continue;
        }
        const key = minionId + "-" + stateData.__sls__ + "-" + stateData.__id__ + "-" + stateData.__run_num__;
        if (stateData.result === true) {
          // problem solved in a later execution
          Issues.removeIssue(pPanel, "state", key);
          continue;
        }
        if (stateData.__sls__ && stateData.__id__ && stateData.__run_num__ !== undefined) {
          const tr = Issues.addIssue(pPanel, "state", key);
          Issues.addIssueMsg(tr, "State '" + stateData.__sls__ + "/" + stateData.__id__ + "/" + stateData.__run_num__ + "' on '" + minionId + "' failed");
          // note that all tasks from the state are applied again, not only the failed ones
          Issues.addIssueCmd(tr, "Apply state", minionId, ["state.sls_id", stateData.__id__, "mods=", stateData.__sls__]);
          Issues.addIssueNav(tr, "job", {"id": jobData.jid, "minionid": minionId});
        } else if (stateData.__id__) {
          // really old minions do not fill __sls__
          const tr = Issues.addIssue(pPanel, "state", key);
          Issues.addIssueMsg(tr, "State '" + stateData.__id__ + "' on '" + minionId + "' failed");
          Issues.addIssueNav(tr, "job", {"id": jobData.jid, "minionid": minionId});
        }
      }
    }
  }
}
