/* global */

import {Issues} from "./Issues.js";

export class JobsRunningIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "JOBS-RUNNING");

    const runnerJobsActivePromise = this.api.getRunnerJobsActive();

    runnerJobsActivePromise.then((ok_RunnerJobsActive) => {
      this.removeCategory("active-jobs");
      this._handleRunnerJobsActive(ok_RunnerJobsActive);
      this.readyCategory(pPanel, "active-jobs", msg);
      return true;
    }, (_error_RunnerJobsActive) => {
      this.removeCategory("active-jobs");
      this.setIssueMsg("active-jobs", "retrieving", "Could not retrieve list of jobs");
      this.setIssueErr("active-jobs", "retrieving", _error_RunnerJobsActive);
      this.readyCategory(pPanel, "active-jobs", msg);
      return false;
    });

    return runnerJobsActivePromise;
  }

  _handleRunnerJobsActive (pRunnerJobsActiveJobsData) {
    const allJobsDict = pRunnerJobsActiveJobsData.return[0];
    const then = new Date();
    // ignore jobs that were started less than 60 seconds ago
    // so that we do not detect our own jobs; and
    // so that we do not complain about trivial stuff
    then.setTime(then.getTime() - 60000);
    let thenStr = then.
      toISOString().
      replace(/[-:.A-Z]/g, "").
      substring(0, 20);
    while (thenStr.length < 20) {
      thenStr += "0";
    }
    for (const jobId in allJobsDict) {
      if (jobId > thenStr) {
        continue;
      }
      const job = allJobsDict[jobId];
      this.setIssueMsg("active-jobs", jobId, "Job '" + jobId + "' (" + job.Function + ") is still running");
      this.addIssueNav("active-jobs", jobId, "job", {"id": jobId});
      this.addIssueCmd("active-jobs", jobId, "Terminate job", "*", ["saltutil.term_job", jobId]);
      this.addIssueCmd("active-jobs", jobId, "Kill job", "*", ["saltutil.kill_job", jobId]);
      this.addIssueCmd("active-jobs", jobId, "Signal job", "*", ["saltutil.signal_job", jobId, "signal=", "<signalnumber>"]);
    }
  }
}
