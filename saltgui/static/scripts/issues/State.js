/* global */

import {Issues} from "./Issues.js";
import {JobsPanel} from "../panels/Jobs.js";

const MAX_HIGHSTATE_JOBS = 10;

export class StateIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "STATE");

    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs(["state.apply", "state.highstate", "state.sls_id"]);

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      Issues.removeCategory(pPanel, "state");
      this._handleLowstateRunnerJobsListJobs(pPanel, pRunnerJobsListJobsData, msg);
      return true;
    }, (pRunnerJobsListJobsMsg) => {
      Issues.removeCategory(pPanel, "state");
      const tr = Issues.addIssue(pPanel, "state", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of jobs");
      Issues.addIssueErr(tr, pRunnerJobsListJobsMsg);
      Issues.readyCategory(pPanel, msg);
      return false;
    });
  }

  _handleLowstateRunnerJobsListJobs (pPanel, pData, pMsg) {
    // due to filter, all jobs are state.apply jobs

    let jobs = JobsPanel._jobsToArray(pData.return[0]);
    JobsPanel._sortJobs(jobs);

    if (jobs.length > MAX_HIGHSTATE_JOBS) {
      jobs = jobs.slice(0, MAX_HIGHSTATE_JOBS);
    }

    this.jobs = jobs;
    pPanel.setPlayPauseButton("play");

    this._updateNextJob(pPanel, pMsg);
  }

  _updateNextJob (pPanel, pMsg) {
    if (!this.jobs) {
      return;
    }
    if (!this.jobs.length) {
      pPanel.setPlayPauseButton("none");
      this.jobs = null;
      Issues.readyCategory(pPanel, pMsg);
      return;
    }
    const job = this.jobs.pop();

    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(job.id);

    runnerJobsListJobPromise.then((pRunnerJobsListJobData) => {
      StateIssues._handleJobRunnerJobsListJob(pPanel, pRunnerJobsListJobData);
      window.setTimeout(() => {
        this._updateNextJob(pPanel, pMsg);
      }, 100);
      return true;
    }, (pRunnerJobsListJobsMsg) => {
      const tr = Issues.addIssue(pPanel, "state", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve details of job " + job.id);
      Issues.addIssueErr(tr, pRunnerJobsListJobsMsg);
      return false;
    });
  }

  static _handleJobRunnerJobsListJob (pPanel, pJobData) {
    const jobData = pJobData.return[0];

    for (const minionId in jobData.Result) {
      const minionData = jobData.Result[minionId];
      if (minionData.out !== "highstate") {
        // never mind
        continue;
      }
      for (const stateName in minionData.return) {
        const stateData = minionData.return[stateName];
        const key = minionId + "-" + stateData.__sls__ + "-" + stateData.__id__;
        if (stateData.result === true) {
          // problem solved in a later execution
          Issues.removeIssue(pPanel, "state", key);
          continue;
        }
        const tr = Issues.addIssue(pPanel, "state", key);
        Issues.addIssueMsg(tr, "State '" + stateData.__sls__ + "/" + stateData.__id__ + "' on '" + minionId + "' failed");
        Issues.addIssueCmd(tr, "Apply state", minionId, ["state.sls_id", stateData.__id__, "mods=", stateData.__sls__]);
        Issues.addIssueNav(tr, "job", {"id": jobData.jid, "minionid": minionId});
      }
    }
  }
}
