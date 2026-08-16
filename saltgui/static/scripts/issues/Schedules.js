/* global */

import {Issues} from "./Issues.js";

export class SchedulesIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "SCHEDULES");

    const localScheduleListPromise = this.api.getLocalScheduleList(null);

    localScheduleListPromise.then((ok_LocalScheduleList) => {
      this.removeCategory("disabled-schedulers");
      this.removeCategory("disabled-schedules");
      this.removeCategory("offline");
      this._handleLocalScheduleList(ok_LocalScheduleList);
      this.readyCategory(pPanel, "disabled-schedulers", msg);
      this.readyCategory(pPanel, "disabled-schedules", msg);
      this.readyCategory(pPanel, "offline", msg);
      return true;
    }, (_error_LocalScheduleList) => {
      this.removeCategory("disabled-schedulers");
      this.setIssueMsg("disabled-schedulers", "retrieving", "Could not retrieve list of schedulers");
      this.setIssueErr("disabled-schedulers", "retrieving", _error_LocalScheduleList);
      this.removeCategory("disabled-schedules");
      this.setIssueMsg("disabled-schedules", "retrieving", "Could not retrieve list of schedules");
      this.setIssueErr("disabled-schedules", "retrieving", _error_LocalScheduleList);
      this.readyCategory(pPanel, "disabled-schedulers", msg);
      this.readyCategory(pPanel, "disabled-schedules", msg);
      return false;
    });

    return localScheduleListPromise;
  }

  _handleLocalScheduleList (pLocalScheduleListData) {

    const allSchedules = pLocalScheduleListData.return[0];

    for (const minionId in allSchedules) {
      const minionData = allSchedules[minionId];

      if (!minionData) {
        this._handleOfflineMinion(minionId);
        continue;
      }

      this._handleMinionSchedules(minionId, minionData);
    }
  }

  _handleOfflineMinion (pMinionId) {
    this.setIssueMsg("offline", pMinionId, "Minion '" + pMinionId + "' is offline");
  }

  _handleMinionSchedules (pMinionId, pMinionData) {
    for (const key in pMinionData) {
      if (key === "enabled") {
        // scheduler flag
        this._handleDisabledScheduler(pMinionId, pMinionData);
      } else {
        this._handleDisabledSchedule(pMinionId, key, pMinionData);
      }
    }
  }

  _handleDisabledScheduler (pMinionId, pMinionData) {
    if (pMinionData.enabled === false) {
      this.setIssueMsg("disabled-schedulers", pMinionId, "Scheduler on '" + pMinionId + "' is disabled");
      this.addIssueCmd("disabled-schedulers", pMinionId, "Enable scheduler", pMinionId, ["schedule.enable"]);
      this.addIssueNav("disabled-schedulers", pMinionId, "schedules-minion", {"minionid": pMinionId});
    }
  }

  _handleDisabledSchedule (pMinionId, pJobKey, pMinionData) {
    const jobData = pMinionData[pJobKey];
    if (jobData.enabled === false) {
      const issueId = pMinionId + "-" + pJobKey;
      this.setIssueMsg("disabled-schedules", issueId, "Schedule '" + pJobKey + "' on '" + pMinionId + "' is disabled");
      this.addIssueCmd("disabled-schedules", issueId, "Enable schedule", pMinionId, ["schedule.enable_job", pJobKey]);
      this.addIssueCmd("disabled-schedules", issueId, "Delete schedule", pMinionId, ["schedule.delete", pJobKey]);
      this.addIssueNav("disabled-schedules", issueId, "schedules-minion", {"minionid": pMinionId});
    }
  }
}
