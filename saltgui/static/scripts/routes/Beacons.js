import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class BeaconsRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]beacons$", "Beacons", "#page-beacons", "#button-beacons", pRouter);

    this._handleBeaconsWheelKeyListAll = this._handleBeaconsWheelKeyListAll.bind(this);
    this.updateMinion = this.updateMinion.bind(this);

    // The new columns are not yet sortable, make sure they are.
    // First detroy all the default sorting handlers.
    // A (deep)copy of an element does not copy its handlers.
    const oldHead = this.pageElement.querySelector("#page-beacons table thead");
    const newHead = oldHead.cloneNode(true);
    oldHead.parentNode.replaceChild(newHead, oldHead);
    // Now re-start sorting logic.
    sorttable.makeSortable(this.pageElement.querySelector("#page-beacons table"));
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localBeaconsListPromise = this.router.api.getLocalBeaconsList(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pData1 => {
      myThis._handleBeaconsWheelKeyListAll(pData1);
      localBeaconsListPromise.then(pData => {
        myThis.updateMinions(pData);
      }, pData2 => {
        const pData = {"return":[{}]};
        for(const k of pData1.return[0].data.return.minions)
          pData.return[0][k] = JSON.stringify(pData2);
        myThis.updateMinions(pData);
      });
    }, pData => {
      myThis._handleBeaconsWheelKeyListAll(JSON.stringify(pData));
    });

    runnerJobsListJobsPromise.then(pData => {
      myThis.handleRunnerJobsListJobs(pData);
      runnerJobsActivePromise.then(pData => {
        myThis.handleRunnerJobsActive(pData);
      }, pData => {
        myThis.handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis.handleRunnerJobsListJobs(JSON.stringify(pData));
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

  _handleBeaconsWheelKeyListAll(pData) {
    const table = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(table, pData)) return;

    const keys = pData.return[0].data.return;

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

    Utils.showTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement());

    const msgDiv = this.pageElement.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  updateOfflineMinion(pContainer, pMinionId) {
    super.updateOfflineMinion(pContainer, pMinionId);

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
