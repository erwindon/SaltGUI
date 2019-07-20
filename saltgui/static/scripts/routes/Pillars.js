import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class PillarsRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]pillars$", "Pillars", "#page-pillars", "#button-pillars", pRouter);

    this._handlePillarsWheelKeyListAll = this._handlePillarsWheelKeyListAll.bind(this);
    this.updateMinion = this.updateMinion.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localPillarObfuscatePromise = this.router.api.getLocalPillarObfuscate(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(pData1 => {
      myThis._handlePillarsWheelKeyListAll(pData1);
      localPillarObfuscatePromise.then(pData => {
        myThis.updateMinions(pData);
      }, pData2 => {
        const pData = {"return":[{}]};
        for(const k of pData1.return[0].data.return.minions)
          pData.return[0][k] = JSON.stringify(pData2);
        myThis.updateMinions(pData);
      });
    }, pData => {
      myThis._handlePillarsWheelKeyListAll(JSON.stringify(pData));
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

  _handlePillarsWheelKeyListAll(pData) {
    const table = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(table, pData)) return;

    const keys = pData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for(const minionId of minionIds) {
      this.addMinion(table, minionId, 1);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowPillars(menu, minionId);

      minionTr.addEventListener("click", pClickEvent =>
        window.location.assign("pillarsminion?minionid=" + encodeURIComponent(minionId))
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
    minionTr.appendChild(Route.createTd("pillarinfo", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
  }

  updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pContainer, null, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    let cnt;
    let pillarInfoText;
    if(typeof pMinionData === "object") {
      cnt = Object.keys(pMinionData).length;
      pillarInfoText = Utils.txtZeroOneMany(cnt,
        "no pillars", "{0} pillar", "{0} pillars");
    } else {
      cnt = -1;
      pillarInfoText = "";
    }
    const pillarInfoTd = Route.createTd("pillarinfo", pillarInfoText);
    pillarInfoTd.setAttribute("sorttable_customkey", cnt);
    if(typeof pMinionData !== "object") {
      Utils.addErrorToTableCell(pillarInfoTd, pMinionData);
    }
    minionTr.appendChild(pillarInfoTd);

    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowPillars(menu, pMinionId);

    minionTr.addEventListener("click", pClickEvent =>
      window.location.assign("pillarsminion?minionid=" + encodeURIComponent(pMinionId))
    );
  }

  _addMenuItemShowPillars(pMenu, pMinionId) {
    pMenu.addMenuItem("Show&nbsp;pillars", function(pClickEvent) {
      window.location.assign("pillarsminion?minionid=" + encodeURIComponent(pMinionId));
    }.bind(this));
  }
}
