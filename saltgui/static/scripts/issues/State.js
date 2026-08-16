/* global */

import {Issues} from "./Issues.js";
import {JobsPanel} from "../panels/Jobs.js";
import {Utils} from "../Utils.js";

// only consider this number of latest highstate jobs
const MAX_HIGHSTATE_JOBS = 10;

// note:
// we cannot distinguish between:
// * data from minions that have already been deleted; and
// * data from minions that are actually behind a salt-syndic
// therefore both are ignored

export class StateIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "STATE");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();

    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs(["state.apply", "state.highstate", "state.sls_id"]);

    wheelKeyListAllPromise.then((ok_WheelKeyListAll) => {
      runnerJobsListJobsPromise.then((ok_RunnerJobsListJobs) => {
        Issues.removeCategory(pPanel, "state");
        this._handleLowstateRunnerJobsListJobs(pPanel, ok_RunnerJobsListJobs, ok_WheelKeyListAll, msg);
        return true;
      }, (_error_RunnerJobsListJobs) => {
        Issues.removeCategory(pPanel, "state");
        const tr = Issues.addIssue(pPanel, "state", "retrieving");
        Issues.addIssueMsg(tr, "Could not retrieve list of jobs");
        Issues.addIssueErr(tr, _error_RunnerJobsListJobs);
        Issues.readyCategory(pPanel, msg);
        return false;
      });
      return true;
    }, (_error_WheelKeyListAll) => {
      Utils.ignorePromise(runnerJobsListJobsPromise);
      Issues.removeCategory(pPanel, "state");
      const tr = Issues.addIssue(pPanel, "state", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of keys");
      Issues.addIssueErr(tr, _error_WheelKeyListAll);
      Issues.readyCategory(pPanel, msg);
      return false;
    });

    /* eslint-disable compat/compat */
    /* Promise.all is not supported in op_mini all, IE 11 */
    return Promise.all([wheelKeyListAllPromise, runnerJobsListJobsPromise]);
    /* eslint-enable compat/compat */
  }

  _handleLowstateRunnerJobsListJobs (pPanel, pData, pKeys, pMsg) {
    // due to filter, all jobs are state jobs

    pKeys = pKeys.return[0].data.return.minions;

    let jobs = JobsPanel.jobsToArray(pData.return[0]);
    JobsPanel.sortJobs(jobs);

    if (jobs.length > MAX_HIGHSTATE_JOBS) {
      jobs = jobs.slice(0, MAX_HIGHSTATE_JOBS);
    }

    // the jobs are sorted newest-first, but they must be handled
    // oldest-first, so that a problem that was solved in a later
    // job is removed again from the list of issues
    jobs.reverse();

    this.panel = pPanel;
    this.jobs = jobs;
    this.msg = pMsg;
    this.keys = pKeys;

    // this is good only while "State" is the only issue-provider that uses play/pause
    pPanel.startLoop(this, 100);
  }

  loopInit () {
    return this.jobs;
  }

  loopItem (pJob) {
    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(pJob.id);

    return runnerJobsListJobPromise.then((ok_RunnerJobsListJob) => {
      StateIssues._handleJobRunnerJobsListJob(this.panel, ok_RunnerJobsListJob, this.keys);
      return true;
    }, (_error_RunnerJobsListJobs) => {
      const tr = Issues.addIssue(this.panel, "state", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve details of job " + pJob.id);
      Issues.addIssueErr(tr, _error_RunnerJobsListJobs);
      // the remaining jobs will fail just the same
      return false;
    });
  }

  loopEnd () {
    Issues.readyCategory(this.panel, this.msg);
  }

  static _handleJobRunnerJobsListJob (pPanel, pJobData, pKeys) {
    const jobData = pJobData.return[0];

    for (const minionId in jobData.Result) {

      if (!pKeys.includes(minionId)) {
        // this is no longer a valid minion
        continue;
      }

      const minionData = jobData.Result[minionId];
      StateIssues._handleMinionStates(pPanel, jobData, minionId, minionData);
    }
  }

  static _handleMinionStates (pPanel, pJobData, pMinionId, pMinionData) {
    if (pMinionData.out !== "highstate") {
      // never mind
      return;
    }

    // the complicating factor is that each state may have multiple tasks
    for (const stateName in pMinionData.return) {
      const stateData = pMinionData.return[stateName];
      if (typeof stateData !== "object") {
        // e.g. an error string
        continue;
      }
      const key = pMinionId + "-" + stateData.__sls__ + "-" + stateData.__id__ + "-" + stateData.__run_num__;
      StateIssues._handleStateIssue(pPanel, pJobData, pMinionId, stateData, key);
    }
  }

  static _handleStateIssue (pPanel, pJobData, pMinionId, pStateData, pKey) {
    if (pStateData.result === true) {
      // problem solved in a later execution
      Issues.removeIssue(pPanel, "state", pKey);
      return;
    }

    if (pStateData.__sls__ && pStateData.__id__ && pStateData.__run_num__ !== undefined) {
      const tr = Issues.addIssue(pPanel, "state", pKey);
      Issues.addIssueMsg(tr, "State '" + pStateData.__sls__ + "/" + pStateData.__id__ + "/" + pStateData.__run_num__ + "' on '" + pMinionId + "' failed");
      // note that all tasks from the state are applied again, not only the failed ones
      Issues.addIssueCmd(tr, "Apply state", pMinionId, ["state.sls_id", pStateData.__id__, "mods=", pStateData.__sls__]);
      Issues.addIssueNav(tr, "job", {"id": pJobData.jid, "minionid": pMinionId});
    } else if (pStateData.__id__) {
      // really old minions do not fill __sls__
      const tr = Issues.addIssue(pPanel, "state", pKey);
      Issues.addIssueMsg(tr, "State '" + pStateData.__id__ + "' on '" + pMinionId + "' failed");
      Issues.addIssueNav(tr, "job", {"id": pJobData.jid, "minionid": pMinionId});
    }
  }
}
