import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class BeaconsRoute extends PageRoute {

  constructor(pRouter) {
    super("beacons", "Beacons", "#page-beacons", "#button-beacons", pRouter);

    this._handleBeaconsWheelKeyListAll = this._handleBeaconsWheelKeyListAll.bind(this);
    this.updateMinion = this.updateMinion.bind(this);

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localBeaconsListPromise = this.router.api.getLocalBeaconsList(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pWheelKeyListAllData => {
      myThis._handleBeaconsWheelKeyListAll(pWheelKeyListAllData);
      localBeaconsListPromise.then(pLocalBeaconsListData => {
        myThis.updateMinions(pLocalBeaconsListData);
      }, pLocalBeaconsListMsg => {
        const localBeaconsListData = {"return":[{}]};
        for(const k of pWheelKeyListAllData.return[0].data.return.minions)
          localBeaconsListData.return[0][k] = JSON.stringify(pLocalBeaconsListMsg);
        myThis.updateMinions(localBeaconsListData);
      });
    }, pWheelKeyListAllMsg => {
      myThis._handleBeaconsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });

    runnerJobsListJobsPromise.then(pRunnerJobsListJobsData => {
      myThis.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then(pRunnerJobsActiveData => {
        myThis.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, pRunnerJobsActiveMsg => {
        myThis.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, pRunnerJobsListJobsMsg => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    }); 
  }

  static fixBeaconsMinion(pData) {
    if(typeof pData !== "object") return pData;

    // the data is an array of objects
    // where each object has one key
    // re-create as a normal object

    const ret = { "beacons": {}, "enabled": true };

    for(const k in pData) {
      // correct for empty list that returns this dummy value
      if(k === "beacons" && JSON.stringify(pData[k]) === "{}") {
        continue;
      }

      // "enabled" is always a boolean (when present)
      if(k === "enabled") {
        ret.enabled = pData.enabled;
        continue;
      }

      // make one object from the settings
      // eliminates one layer in the datamodel
      // and looks much better
      const newData = { };
      for(const elem of pData[k])
        for(const p in elem)
          newData[p] = elem[p];
      ret.beacons[k] = newData;
    }

    return ret;
  }

  _handleBeaconsWheelKeyListAll(pWheelKeyListAllData) {
    const table = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(table, pWheelKeyListAllData)) return;

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this.addMinion(table, minionId, 1);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowBeacons(menu, minionId);

      minionTr.addEventListener("click", pClickEvent =>
        window.location.assign("beaconsminion?minionid=" + encodeURIComponent(minionId))
      );
    }

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  updateOfflineMinion(pContainer, pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pContainer, pMinionId, pMinionsDict);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route.createTd("beaconinfo", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
  }

  updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {

    pMinionData = BeaconsRoute.fixBeaconsMinion(pMinionData);

    super.updateMinion(pContainer, null, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    if(typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData.beacons).length;
      let beaconInfoText = Utils.txtZeroOneMany(cnt,
        "no beacons", "{0} beacon", "{0} beacons");
      if(!pMinionData.enabled)
        beaconInfoText += " (disabled)";
      const beaconInfoTd = Route.createTd("beaconinfo", beaconInfoText);
      beaconInfoTd.setAttribute("sorttable_customkey", cnt);
      minionTr.appendChild(beaconInfoTd);
    } else {
      const beaconInfoTd = Route.createTd("", "");
      Utils.addErrorToTableCell(beaconInfoTd, pMinionData);
      minionTr.appendChild(beaconInfoTd);
    }

    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowBeacons(menu, pMinionId);

    minionTr.addEventListener("click", pClickEvent =>
      window.location.assign("beaconsminion?minionid=" + encodeURIComponent(pMinionId))
    );
  }

  _addMenuItemShowBeacons(pMenu, pMinionId) {
    pMenu.addMenuItem("Show&nbsp;beacons", function(pClickEvent) {
      window.location.assign("beaconsminion?minionid=" + encodeURIComponent(pMinionId));
    }.bind(this));
  }
}
