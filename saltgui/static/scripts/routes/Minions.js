/* global document */

import {DropDownMenu} from "../DropDown.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {Utils} from "../Utils.js";

export class MinionsRoute extends PageRoute {

  constructor (pRouter) {
    super("", "Minions", "page-minions", "button-minions", pRouter);

    this._handleMinionsWheelKeyListAll = this._handleMinionsWheelKeyListAll.bind(this);
    this._handleRunnerManageVersions = this._handleRunnerManageVersions.bind(this);

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement(), "minions-search-button", "minions-table");
    Utils.makeTableSearchable(this.getPageElement(), "minions-search-button-jobs", "minions-jobs-table");
  }

  onShow () {
    const that = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();
    const runnerManageVersionsPromise = this.router.api.getRunnerManageVersions();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      that._handleMinionsWheelKeyListAll(pWheelKeyListAllData);

      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        that.updateMinions("minions-table", pLocalGrainsItemsData);
      }, (pLocalGrainsItemsMsg) => {
        const localGrainsItemsData = {"return": [{}]};
        if (pWheelKeyListAllData) {
          for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
            localGrainsItemsData.return[0][minionId] = JSON.stringify(pLocalGrainsItemsMsg);
          }
        }
        that.updateMinions("minions-table", localGrainsItemsData);
      });

      runnerManageVersionsPromise.then((pRunnerManageVersionsData) => {
        that._handleRunnerManageVersions(pRunnerManageVersionsData);
      }, (pRunnerManageVersionsMsg) => {
        that._handleRunnerManageVersions(JSON.stringify(pRunnerManageVersionsMsg));
      });
    }, (pWheelKeyListAllMsg) => {
      that._handleMinionsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
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

  _handleMinionsWheelKeyListAll (pWheelKeyListAll) {
    const table = document.getElementById("minions-table");

    const msgDiv = document.getElementById("minions-msg");
    if (PageRoute.showErrorRowInstead(table, pWheelKeyListAll, msgDiv)) {
      return;
    }

    const keys = pWheelKeyListAll.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(table, minionId, 1);

      // preliminary dropdown menu
      const minionTr = table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        this.runCommand(pClickEvent, minionId, "state.apply");
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
    minionTr.appendChild(Route.createTd("saltversion", ""));
    minionTr.appendChild(Route.createTd("os", ""));
    minionTr.appendChild(Route.createTd("run-command-button", ""));
  }

  updateMinion (pContainer, pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pContainer, pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = pContainer.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemStateApply(menu, pMinionId);
    this._addMenuItemStateApplyTest(menu, pMinionId);

    minionTr.addEventListener("click", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "state.apply");
    });
  }

  _addMenuItemStateApply (pMenu, pMinionId) {
    pMenu.addMenuItem("Apply&nbsp;state...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "state.apply");
    });
  }

  _addMenuItemStateApplyTest (pMenu, pMinionId) {
    pMenu.addMenuItem("Test&nbsp;state...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "state.apply test=True");
    });
  }

  _isCveAffected (version) {
    // see https://community.saltstack.com/blog/critical-vulnerabilities-update-cve-2020-11651-and-cve-2020-11652/
    // and https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11651
    // and https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11652
    const items = version.split(".");
    /* eslint-disable curly */
    if (items[0] === "0") return "yes";
    if (items[0] === "2015") return "yes";
    if (items[0] === "2016") return "yes";
    if (items[0] === "2017") return "yes";
    if (items[0] === "2018") return "yes";

    if (items[0] === "2019") {
      // ok from 2019.2.4
      if (items[1] < "2") return "yes";
      if (items[2] < "4") return "yes";
      return "no";
    }

    if (items[0] === "3000") {
      // ok from 3000.2
      if (items[1] < "2") return "yes";
      return "no";
    }

    if (items[0] >= "3001") {
      return "no";
    }
    /* eslint-enable curly */

    // should be something newer than we know of
    return "unknown";
  }

  _handleRunnerManageVersions (pRunnerManageVersionsData) {

    // this is additional data
    const msgDiv = document.getElementById("minions-msg");
    const table = document.getElementById("minions-table");
    if (PageRoute.showErrorRowInstead(table, pRunnerManageVersionsData, msgDiv)) {
      return;
    }

    const versionList = pRunnerManageVersionsData.return[0];
    const masterVersion = versionList["Master"];
    const isMasterAffected = this._isCveAffected(masterVersion);

    for (const outcome in versionList) {

      // Master field is special, it is not even a dict
      if (outcome === "Master") {
        continue;
      }

      for (const minionId in versionList[outcome]) {

        const versionTd = table.querySelector("#" + Utils.getIdFromMinionId(minionId) + " .saltversion");
        if (!versionTd) {
          continue;
        }

        if (isMasterAffected === "yes") {
          versionTd.style.color = "red";
        } else if (isMasterAffected === "unknown") {
          versionTd.style.color = "orange";
        } else if (outcome === "Minion requires update") {
          versionTd.style.color = "orange";
        } else if (outcome === "Minion newer than master") {
          versionTd.style.color = "orange";
        }

        let txt = "";
        if (isMasterAffected === "yes") {
          txt += "\nThe salt-master is OLD (" + masterVersion + "),\nit is vulnerable for exploits CVE-2020-11651 and CVE-2020-11652";
        } else if (isMasterAffected === "unknown") {
          txt += "\nThe salt-master version is unknown (" + masterVersion + "),\nit may be vulnerable for exploits CVE-2020-11651 and CVE-2020-11652";
        }

        if (outcome === "Minion requires update") {
          txt += "\nThis salt-minion is older than the salt-master (" + masterVersion + ")";
        } else if (outcome === "Minion newer than salt-master") {
          txt += "\nThis salt-minion is newer than the salt-master (" + masterVersion + ")";
        }

        if (txt) {
          Utils.addToolTip(versionTd, txt.trim(), "bottom-left");
        }
      }
    }

  }
}
