/* global */

import {Issues} from "./Issues.js";

export class SchedulesIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "SCHEDULES");

    const localScheduleListPromise = this.api.getLocalScheduleList(null);

    localScheduleListPromise.then((ok_LocalScheduleList) => {
      Issues.removeCategory(pPanel, "disabled-schedulers");
      Issues.removeCategory(pPanel, "disabled-schedules");
      SchedulesIssues._handleLocalScheduleList(pPanel, ok_LocalScheduleList);
      Issues.readyCategory(pPanel, msg);
      return true;
    }, (_error_LocalScheduleList) => {
      Issues.removeCategory(pPanel, "disabled-schedulers");
      const tr1 = Issues.addIssue(pPanel, "disabled-schedulers", "retrieving");
      Issues.addIssueMsg(tr1, "Could not retrieve list of schedulers");
      Issues.addIssueErr(tr1, _error_LocalScheduleList);
      Issues.removeCategory(pPanel, "disabled-schedules");
      const tr2 = Issues.addIssue(pPanel, "disabled-schedules", "retrieving");
      Issues.addIssueMsg(tr2, "Could not retrieve list of schedules");
      Issues.addIssueErr(tr2, _error_LocalScheduleList);
      Issues.readyCategory(pPanel, msg);
      return false;
    });

    return localScheduleListPromise;
  }

  static _handleLocalScheduleList (pPanel, pLocalScheduleListData) {

    const allSchedules = pLocalScheduleListData.return[0];

    for (const minionId in allSchedules) {
      const minionData = allSchedules[minionId];

      if (!minionData) {
        SchedulesIssues._handleOfflineMinion(pPanel, minionId);
        continue;
      }

      SchedulesIssues._handleMinionSchedules(pPanel, minionId, minionData);
    }
  }

  static _handleOfflineMinion (pPanel, pMinionId) {
    const tr = Issues.addIssue(pPanel, "offline", pMinionId);
    Issues.addIssueMsg(tr, "Minion '" + pMinionId + "' is offline");
  }

  static _handleMinionSchedules (pPanel, pMinionId, pMinionData) {
    for (const key in pMinionData) {
      if (key === "enabled") {
        // scheduler flag
        SchedulesIssues._handleDisabledScheduler(pPanel, pMinionId, pMinionData);
      } else {
        SchedulesIssues._handleDisabledSchedule(pPanel, pMinionId, key, pMinionData);
      }
    }
  }

  static _handleDisabledScheduler (pPanel, pMinionId, pMinionData) {
    if (pMinionData.enabled === false) {
      const tr = Issues.addIssue(pPanel, "disabled-schedulers", pMinionId);
      Issues.addIssueMsg(tr, "Scheduler on '" + pMinionId + "' is disabled");
      Issues.addIssueCmd(tr, "Enable scheduler", pMinionId, ["schedule.enable"]);
      Issues.addIssueNav(tr, "schedules-minion", {"minionid": pMinionId});
    }
  }

  static _handleDisabledSchedule (pPanel, pMinionId, pJobKey, pMinionData) {
    const jobData = pMinionData[pJobKey];
    if (jobData.enabled === false) {
      const tr = Issues.addIssue(pPanel, "disabled-schedules", pMinionId + "-" + pJobKey);
      Issues.addIssueMsg(tr, "Schedule '" + pJobKey + "' on '" + pMinionId + "' is disabled");
      Issues.addIssueCmd(tr, "Enable schedule", pMinionId, ["schedule.enable_job", pJobKey]);
      Issues.addIssueCmd(tr, "Delete schedule", pMinionId, ["schedule.delete", pJobKey]);
      Issues.addIssueNav(tr, "schedules-minion", {"minionid": pMinionId});
    }
  }
}
