/* global */

import {Issues} from "./Issues.js";

export class SchedulesIssues extends Issues {

  onGetIssues (pPanel, pMsg) {

    const localScheduleListPromise = this.api.getLocalScheduleList(null);

    localScheduleListPromise.then((pLocalScheduleListData) => {
      Issues.removeCategory(pPanel, "disabled-schedulers");
      Issues.removeCategory(pPanel, "disabled-schedules");
      SchedulesIssues._handleLocalScheduleList(pPanel, pLocalScheduleListData);
      pMsg.parentElement.removeChild(pMsg);
      return true;
    }, (pLocalScheduleListMsg) => {
      Issues.removeCategory(pPanel, "disabled-schedulers");
      const tr1 = Issues.addIssue(pPanel, "disabled-schedulers", "retrieving");
      Issues.addIssueMsg(tr1, "Could not retrieve list of schedulers");
      Issues.addIssueErr(tr1, pLocalScheduleListMsg);
      Issues.removeCategory(pPanel, "disabled-schedules");
      const tr2 = Issues.addIssue(pPanel, "disabled-schedules", "retrieving");
      Issues.addIssueMsg(tr2, "Could not retrieve list of schedules");
      Issues.addIssueErr(tr2, pLocalScheduleListMsg);
      pMsg.parentElement.removeChild(pMsg);
      return false;
    });

    return localScheduleListPromise;
  }

  static _handleLocalScheduleList (pPanel, pLocalScheduleListData) {

    const allSchedules = pLocalScheduleListData.return[0];

    for (const minionId in allSchedules) {
      const minionData = allSchedules[minionId];
      for (const key in minionData) {
        if (key === "enabled") {
          // scheduler flag
          if (minionData.enabled === false) {
            const tr = Issues.addIssue(pPanel, "disabled-schedulers", minionId);
            Issues.addIssueMsg(tr, "Scheduler on '" + minionId + "' is disabled");
            Issues.addIssueCmd(tr, "Enable scheduler", minionId, ["schedule.enable"]);
            Issues.addIssueNav(tr, "schedules-minion", {"minionid": minionId});
          }
        } else {
          const jobData = minionData[key];
          if (jobData.enabled === false) {
            const tr = Issues.addIssue(pPanel, "disabled-schedules", minionId + "-" + key);
            Issues.addIssueMsg(tr, "Schedule '" + key + "' on '" + minionId + "' is disabled");
            Issues.addIssueCmd(tr, "Enable schedule", minionId, ["schedule.enable_job", key]);
            Issues.addIssueNav(tr, "schedules-minion", {"minionid": minionId});
          }
        }
      }
    }
  }
}
