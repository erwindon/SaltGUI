/* global */

import {Issues} from "./Issues.js";

export class JobsRunningIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "JOBS-RUNNING");

    const runnerJobsActivePromise = this.api.getRunnerJobsActive();

    runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
      Issues.removeCategory(pPanel, "active-jobs");
      JobsRunningIssues._handleRunnerJobsActive(pPanel, pRunnerJobsActiveData);
      Issues.readyCategory(pPanel, msg);
      return true;
    }, (pRunnerJobsActiveMsg) => {
      Issues.removeCategory(pPanel, "active-jobs");
      const tr = Issues.addIssue(pPanel, "active-jobs", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of jobs");
      Issues.addIssueErr(tr, pRunnerJobsActiveMsg);
      Issues.readyCategory(pPanel, msg);
      return false;
    });

    return runnerJobsActivePromise;
  }

  static _handleRunnerJobsActive (pPanel, pRunnerJobsActiveJobsData) {
    const allJobsDict = pRunnerJobsActiveJobsData.return[0];
    for (const jobId in allJobsDict) {
      const tr = Issues.addIssue(pPanel, "active-jobs", jobId);
      Issues.addIssueMsg(tr, "Job '" + jobId + "' is still running");
      Issues.addIssueNav(tr, "job", {"id": jobId});
      Issues.addIssueCmd(tr, "Terminate job", "*", ["saltutil.term_job", jobId]);
      Issues.addIssueCmd(tr, "Kill job", "*", ["saltutil.kill_job", jobId]);
      Issues.addIssueCmd(tr, "Signal job", "*", ["saltutil.signal_job", jobId, "signal=", "<signalnumber>"]);
    }
  }
}
