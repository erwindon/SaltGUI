import {DropDownMenu} from "../DropDown.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {Utils} from "../Utils.js";

export class SchedulesRoute extends PageRoute {

  constructor (pRouter) {
    super("schedules", "Schedules", "page-schedules", "button-schedules", pRouter);

    this._handleSchedulesWheelKeyListAll = this._handleSchedulesWheelKeyListAll.bind(this);
    this.updateMinion = this.updateMinion.bind(this);

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement(), "schedules-search-button", "schedules-table");
    Utils.makeTableSearchable(this.getPageElement(), "schedules-search-button-jobs", "schedules-jobs-table");
  }

  onShow () {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localScheduleListPromise = this.router.api.getLocalScheduleList(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      myThis._handleSchedulesWheelKeyListAll(pWheelKeyListAllData);
      localScheduleListPromise.then((pLocalScheduleListData) => {
        myThis.updateMinions("schedules-table", pLocalScheduleListData);
      }, (pLocalBeaconsListMsg) => {
        const localScheduleListData = {"return":[{}]};
        for (const k of pWheelKeyListAllData.return[0].data.return.minions)
          localScheduleListData.return[0][k] = JSON.stringify(pLocalBeaconsListMsg);
        myThis.updateMinions("schedules-table", localScheduleListData);
      });
    }, (pWheelKeyListAllMsg) => {
      myThis._handleSchedulesWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      myThis.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
        myThis.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, (pRunnerJobsActiveMsg) => {
        myThis.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, (pRunnerJobsListJobsMsg) => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    });
  }

  // This one has some historic ballast:
  // Meta-data is returned on the same level as
  // the list of scheduled items
  static fixSchedulesMinion (pData) {
    if (typeof pData !== "object") {
      return pData;
    }

    const ret = {"enabled": true, "schedules": {}};

    for (const k in pData) {
      // "enabled" is always a boolean (when present)
      if (k === "enabled") {
        ret.enabled = pData.enabled;
        continue;
      }

      // correct for empty list that returns this dummy value
      if (k === "schedule" && JSON.stringify(pData[k]) === "{}") {
        continue;
      }

      ret.schedules[k] = pData[k];

      // Since 2019.02, splay is always added, even when not set
      // so remove it when it has an empty value
      if (ret.schedules[k]["splay"] === null) {
        delete ret.schedules[k]["splay"];
      }
    }

    return ret;
  }

  _handleSchedulesWheelKeyListAll (pWheelKeyListAllData) {
    const table = document.getElementById("schedules-table");

    const msgDiv = document.getElementById("schedules-msg");
    if (PageRoute.showErrorRowInstead(table, pWheelKeyListAllData, msgDiv)) {
      return;
    }

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(table, minionId, 1);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowSchedules(menu, minionId);

      minionTr.addEventListener("click", (pClickEvent) =>
        window.location.assign(config.NAV_URL + "/schedules-minion?minionid=" + encodeURIComponent(minionId))
      );
    }

    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  updateOfflineMinion (pContainer, pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pContainer, pMinionId, pMinionsDict);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route.createTd("scheduleinfo", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
  }

  updateMinion (pContainer, pMinionData, pMinionId, pAllMinionsGrains) {

    pMinionData = SchedulesRoute.fixSchedulesMinion(pMinionData);

    const minionTr = this.getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route.createTd("minion-id", pMinionId));

    const statusDiv = Route.createTd("status", "accepted");
    statusDiv.classList.add("accepted");
    minionTr.appendChild(statusDiv);

    let cnt;
    let scheduleinfo;
    if (typeof pMinionData === "object") {
      cnt = Object.keys(pMinionData.schedules).length;
      scheduleinfo = Utils.txtZeroOneMany(cnt,
        "no schedules", "{0} schedule", "{0} schedules");
      if (!pMinionData.enabled) {
        scheduleinfo += " (disabled)";
      }
    } else {
      cnt = -1;
      scheduleinfo = "";
    }

    const td = Route.createTd("scheduleinfo", scheduleinfo);
    if (typeof pMinionData !== "object") {
      Utils.addErrorToTableCell(td, pMinionData);
    }
    td.setAttribute("sorttable_customkey", cnt);
    minionTr.appendChild(td);

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowSchedules(menu, pMinionId);

    minionTr.addEventListener("click", (pClickEvent) =>
      window.location.assign(config.NAV_URL + "/schedules-minion?minionid=" + encodeURIComponent(pMinionId))
    );
  }

  _addMenuItemShowSchedules (pMenu, pMinionId) {
    pMenu.addMenuItem("Show&nbsp;schedules", (pClickEvent) => {
      window.location.assign(config.NAV_URL + "/schedules-minion?minionid=" + encodeURIComponent(pMinionId));
    });
  }
}
