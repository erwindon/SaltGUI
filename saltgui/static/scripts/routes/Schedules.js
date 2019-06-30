import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class SchedulesRoute extends PageRoute {

  constructor(router) {
    super("^[\/]schedules$", "Schedules", "#page-schedules", "#button-schedules", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localScheduleListPromise = this.router.api.getLocalScheduleList(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pData1 => {
      myThis._handleWheelKeyListAll(pData1);
      localScheduleListPromise.then(pData => {
        myThis._updateMinions(pData);
      }, pData2 => {
        const pData = {"return":[{}]};
        for(const k of pData1.return[0].data.return.minions)
          pData.return[0][k] = JSON.stringify(pData2);
        myThis._updateMinions(pData);
      });
    }, pData => {
      myThis._handleWheelKeyListAll(JSON.stringify(pData));
    });

    runnerJobsListJobsPromise.then(pData => {
      myThis._handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis._handleRunnerJobsActive(pData);
      }, pData => {
        myThis._handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  // This one has some historic ballast:
  // Meta-data is returned on the same level as
  // the list of scheduled items
  static _fixMinion(pData) {
    if(typeof pData !== "object") return pData;

    const ret = { "schedules": {}, "enabled": true };

    for(const k in pData) {
      // "enabled" is always a boolean (when present)
      if(k === "enabled") {
        ret.enabled = pData.enabled;
        continue;
      }

      // correct for empty list that returns this dummy value
      if(k === "schedule" && JSON.stringify(pData[k]) === "{}") {
        continue;
      }

      ret.schedules[k] = pData[k];

      // Since 2019.02, splay is always added, even when not set
      // so remove it when it has an empty value
      if(ret.schedules[k]["splay"] === null)
        delete ret.schedules[k]["splay"];
    }

    return ret;
  }

  _handleWheelKeyListAll(pData) {
    const list = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(list, pData)) return;

    const keys = pData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this._addMinion(list, minionId, 1);

      // preliminary dropdown menu
      const minionTr = list.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowSchedules(menu, minionId);

      minionTr.addEventListener("click", evt =>
        window.location.assign("schedulesminion?minionid=" + encodeURIComponent(minionId))
      );
    }

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msg = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msg.innerText = txt;
  }

  _updateOfflineMinion(pContainer, pMinionId) {
    super._updateOfflineMinion(pContainer, pMinionId);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route._createTd("scheduleinfo", ""));
    minionTr.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {

    pMinionData = SchedulesRoute._fixMinion(pMinionData);

    const minionTr = this._getElement(pContainer, Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Route._createTd("minion-id", pMinionId));

    const statusDiv = Route._createTd("status", "accepted");
    statusDiv.classList.add("accepted");
    minionTr.appendChild(statusDiv);

    let cnt;
    let scheduleinfo;
    if(typeof pMinionData === "object") {
      cnt = Object.keys(pMinionData.schedules).length;
      scheduleinfo = Utils.txtZeroOneMany(cnt,
        "no schedules", "{0} schedule", "{0} schedules");
      if(!pMinionData.enabled)
        scheduleinfo += " (disabled)";
    } else {
      cnt = -1;
      scheduleinfo = "";
    }

    const td = Route._createTd("scheduleinfo", scheduleinfo);
    if(typeof pMinionData !== "object") {
      Utils.addErrorToTableCell(td, pMinionData);
    }
    td.setAttribute("sorttable_customkey", cnt);
    minionTr.appendChild(td);

    // final dropdownmenu
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowSchedules(menu, pMinionId);

    minionTr.addEventListener("click", evt => window.location.assign("schedulesminion?minionid=" + encodeURIComponent(pMinionId)));
  }

  _addMenuItemShowSchedules(pMenu, pMinionId) {
    pMenu.addMenuItem("Show&nbsp;schedules", function(evt) {
      window.location.assign("schedulesminion?minionid=" + encodeURIComponent(pMinionId));
    }.bind(this));
  }
}
