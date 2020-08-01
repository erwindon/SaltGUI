/* global config document window */

import {DropDownMenu} from "../DropDown.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {Utils} from "../Utils.js";

export class PillarsRoute extends PageRoute {

  constructor (pRouter) {
    super("pillars", "Pillars", "page-pillars", "button-pillars", pRouter);

    this._handlePillarsWheelKeyListAll = this._handlePillarsWheelKeyListAll.bind(this);
    this.updateMinion = this.updateMinion.bind(this);

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement(), "pillars-search-button", "pillars-table");
    Utils.makeTableSearchable(this.getPageElement(), "pillars-search-button-jobs", "pillars-jobs-table");
  }

  onShow () {
    const that = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localPillarObfuscatePromise = this.router.api.getLocalPillarObfuscate(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      that._handlePillarsWheelKeyListAll(pWheelKeyListAllData);
      localPillarObfuscatePromise.then((pLocalPillarObfuscateData) => {
        that.updateMinions("pillars-table", pLocalPillarObfuscateData);
      }, (pLocalPillarObfuscateMsg) => {
        const localPillarObfuscateData = {"return": [{}]};
        for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
          localPillarObfuscateData.return[0][minionId] = JSON.stringify(pLocalPillarObfuscateMsg);
        }
        that.updateMinions("pillars-table", localPillarObfuscateData);
      });
    }, (pWheelKeyListAllMsg) => {
      that._handlePillarsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      that.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
        that.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, (pRunnerJobsActiveMsg) => {
        that.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, (pRunnerJobsListJobsMsg) => {
      that.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    });
  }

  _handlePillarsWheelKeyListAll (pWheelKeyListAllData) {
    const table = document.getElementById("pillars-table");

    const msgDiv = document.getElementById("pillars-msg");
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
      this._addMenuItemShowPillars(menu, minionId);

      minionTr.addEventListener("click", () => {
        window.location.assign("pillars-minion?minionid=" + encodeURIComponent(minionId));
      });
    }

    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    msgDiv.innerText = txt;
  }

  updateOfflineMinion (pContainer, pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pContainer, pMinionId, pMinionsDict);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Route.createTd("pillarinfo", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
  }

  updateMinion (pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pContainer, null, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    let cnt;
    let pillarInfoText;
    if (typeof pMinionData === "object") {
      cnt = Object.keys(pMinionData).length;
      pillarInfoText = Utils.txtZeroOneMany(cnt,
        "no pillars", "{0} pillar", "{0} pillars");
    } else {
      cnt = -1;
      pillarInfoText = "";
    }
    const pillarInfoTd = Route.createTd("pillarinfo", pillarInfoText);
    pillarInfoTd.setAttribute("sorttable_customkey", cnt);
    if (typeof pMinionData !== "object") {
      Utils.addErrorToTableCell(pillarInfoTd, pMinionData);
    }
    minionTr.appendChild(pillarInfoTd);

    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowPillars(menu, pMinionId);

    minionTr.addEventListener("click", () => {
      window.location.assign(config.NAV_URL + "/pillars-minion?minionid=" + encodeURIComponent(pMinionId));
    });
  }

  _addMenuItemShowPillars (pMenu, pMinionId) {
    pMenu.addMenuItem("Show&nbsp;pillars", () => {
      window.location.assign(config.NAV_URL + "/pillars-minion?minionid=" + encodeURIComponent(pMinionId));
    });
  }
}
