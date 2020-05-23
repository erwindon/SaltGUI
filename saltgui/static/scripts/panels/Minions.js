/* global */

import {Character} from "../Character.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

// We only need to verify these 2 modules
// additional tools like salt-api, salt-cloud, salt-proxy, salt-syndic
// are all forced to the same version due to to the strict version
// dependency on salt-common
const MASTER = 1;
const MINION = 2;

export class MinionsPanel extends Panel {

  constructor () {
    super("minions");

    this.addTitle("Minions");
    this.addPanelMenu();
    this._addMenuItemStateApply(this.panelMenu, "*");
    this._addMenuItemStateApplyTest(this.panelMenu, "*");
    this.addSearchButton();
    this.addWarningField();
    this.addTable(["-menu-", "Minion", "Status", "Salt version", "OS version"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable("cmd");
    this.addMsg();
  }

  onShow () {
    this.nrMinions = 0;

    const useCacheGrains = Utils.getStorageItemBoolean("session", "use_cache_for_grains", false);
    this.setWarningText("info", useCacheGrains ? "the content of this screen is based on cached grains info, minion status or grain info may not be accurate" : "");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelMinionsConnectedPromise = this.api.getWheelMinionsConnected();
    const localGrainsItemsPromise = useCacheGrains ? this.api.getRunnerCacheGrains(null) : this.api.getLocalGrainsItems(null);

    const runnerManageVersionsPromise = this.api.getRunnerManageVersions();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleMinionsWheelKeyListAll(pWheelKeyListAllData);

      wheelMinionsConnectedPromise.then((pWheelMinionsConnectedData) => {
        this._handlewheelMinionsConnected(pWheelMinionsConnectedData, pWheelKeyListAllData);
        return true;
      }, (pWheelMinionsConnectedMsg) => {
        Utils.debug("pWheelMinionsConnectedMsg", pWheelMinionsConnectedMsg);
        return false;
      });

      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
        return true;
      }, (pLocalGrainsItemsMsg) => {
        const allMinionsErr = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, JSON.stringify(pLocalGrainsItemsMsg));
        this.updateMinions({"return": [allMinionsErr]});
        return false;
      });

      runnerManageVersionsPromise.then((pRunnerManageVersionsData) => {
        this._handleRunnerManageVersions(pRunnerManageVersionsData);
        return true;
      }, (pRunnerManageVersionsMsg) => {
        this._handleRunnerManageVersions(JSON.stringify(pRunnerManageVersionsMsg));
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleMinionsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      Utils.ignorePromise(wheelMinionsConnectedPromise);
      Utils.ignorePromise(localGrainsItemsPromise);
      Utils.ignorePromise(runnerManageVersionsPromise);
      return false;
    });
  }

  _handleMinionsWheelKeyListAll (pWheelKeyListAll) {
    if (this.showErrorRowInstead(pWheelKeyListAll)) {
      return;
    }

    const keys = pWheelKeyListAll.return[0].data.return;
    this.nrMinions = keys.minions.length;
    this.nrUnaccepted = keys.minions_pre.length;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId);

      // preliminary dropdown menu
      this._addMenuItemStateApply(minionTr.dropdownmenu, minionId);
      this._addMenuItemStateApplyTest(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowGrains(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowPillars(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowSchedules(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowBeacons(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowMine(minionTr.dropdownmenu, minionId);
    }

    this.updateFooter();
  }

  static _getShortestTargetClause (pWheelMinionsConnectedData, pWheelKeyListAllData) {
    const connectedMinionIds = pWheelMinionsConnectedData.return[0].data.return;
    const wheelKeyListMinionIds = pWheelKeyListAllData.return[0].data.return.minions;

    // construct a target string of connected minions
    if (connectedMinionIds.length === wheelKeyListMinionIds.length) {
      return "*";
    }

    connectedMinionIds.sort();
    wheelKeyListMinionIds.sort();

    if (connectedMinionIds.length < wheelKeyListMinionIds.length / 2) {
      // majority of minions are disconnected
      // make it a simple list of the connected minions
      let connectedStr = "";
      for (const minionId of connectedMinionIds) {
        connectedStr += "," + minionId;
      }
      return connectedStr.replace(/^,/, "");
    }

    // majority of minions are connected
    // make it a compound
    let notConnectedStr = "";
    for (const minionId of wheelKeyListMinionIds) {
      if (!connectedMinionIds.includes(minionId)) {
        notConnectedStr += "," + minionId;
      }
    }
    if (notConnectedStr.includes(",")) {
      // make it a list in compound notation
      notConnectedStr = "L@" + notConnectedStr.replace(/^,/, "");
    } else {
      // no need for list
      notConnectedStr = notConnectedStr.substring(2);
    }
    return "* and not " + notConnectedStr;
  }

  _handlewheelMinionsConnected (pWheelMinionsConnectedData, pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelMinionsConnectedData)) {
      return;
    }

    const connectedStr = MinionsPanel._getShortestTargetClause(pWheelMinionsConnectedData, pWheelKeyListAllData);
    Utils.setStorageItem("session", "connected", connectedStr);

    const minionIds = pWheelMinionsConnectedData.return[0].data.return;

    for (const tr of this.table.tBodies[0].childNodes) {
      tr.dataset.isConnected = minionIds.indexOf(tr.dataset.minionId) >= 0;

      if (tr.dataset.isConnected) {
        // skip the connected minions
        continue;
      }
      const statusTd = tr.querySelector("td.status");
      if (!statusTd) {
        continue;
      }
      // this is the initial warning only
      // it will potentially be replaced by a less aggressive warning
      // when the grains information is returned
      statusTd.innerText = "offline";
      statusTd.classList.add("offline");
    }
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("saltversion"));
    minionTr.appendChild(Utils.createTd("os"));
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    this._addMenuItemStateApply(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemStateApplyTest(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowGrains(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowPillars(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowSchedules(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowBeacons(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowMine(minionTr.dropdownmenu, pMinionId);

    minionTr.addEventListener("click", (pClickEvent) => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr);
      pClickEvent.stopPropagation();
    });
  }

  _addMenuItemStateApply (pMenu, pMinionId) {
    pMenu.addMenuItem("Apply state...", () => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemStateApplyTest (pMenu, pMinionId) {
    pMenu.addMenuItem("Test state...", () => {
      const cmdArr = ["state.apply", "test=", true];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemShowGrains (pMenu, pMinionId) {
    pMenu.addMenuItem("Show grains", (pClickEvent) => {
      this.router.goTo("grains-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }

  _addMenuItemShowSchedules (pMenu, pMinionId) {
    pMenu.addMenuItem("Show schedules", (pClickEvent) => {
      this.router.goTo("schedules-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }

  _addMenuItemShowPillars (pMenu, pMinionId) {
    pMenu.addMenuItem("Show pillars", (pClickEvent) => {
      this.router.goTo("pillars-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }

  _addMenuItemShowBeacons (pMenu, pMinionId) {
    pMenu.addMenuItem("Show beacons", (pClickEvent) => {
      this.router.goTo("beacons-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }

  _addMenuItemShowMine (pMenu, pMinionId) {
    pMenu.addMenuItem("Show mine", (pClickEvent) => {
      this.router.goTo("mine-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }

  static _getCveData () {
    // See https://docs.saltproject.io/en/master/topics/releases/version_numbers.html
    // See https://cve.mitre.org/cve/search_cve_list.html
    // See e.g. https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11652
    // We do not distinguish between different tools like master/minion/api
    // We compare only the master and minion version and also
    // the master vs. minion version
    // Version numbers are 0.x.y, 201[456789].x.y and 300[0-9](.x)

    // The table below contains the patterns for version numbers that are found
    // to be vulnerable. each version number is validated agains as many levels
    // of conditions as there are available. Remaining parts of the actual
    // version number do not matter.

    // items are marked MASTER+MINION unless it is very clear that only one
    // of the two is involved. feel free to request corrections here.
    return [
      ["CVE-2013-2228", MASTER + MINION, ["0", "1[4-5]"]],

      ["CVE-2013-4435", MASTER + MINION, ["0", "1[5-7]"]],

      ["CVE-2013-4436", MASTER + MINION, ["0", "17", "0"]],

      ["CVE-2013-4437", MASTER + MINION, ["0", "17", "0"]],

      ["CVE-2013-4438", MASTER + MINION, ["0", "[0-9]"]],
      ["CVE-2013-4438", MASTER + MINION, ["0", "1[0-6]"]],
      ["CVE-2013-4438", MASTER + MINION, ["0", "17", "0"]],

      ["CVE-2013-4439", MASTER + MINION, ["0", "1[5-7]"]],

      ["CVE-2013-6617", MASTER, ["0", "1[1-7]"]],

      ["CVE-2014-3563", MASTER + MINION, ["0"]],
      ["CVE-2014-3563", MASTER + MINION, ["2014", "0"]],
      ["CVE-2014-3563", MASTER + MINION, ["2014", "1", "[0-9]"]],

      ["CVE-2015-1838", MASTER + MINION, ["0"]],
      ["CVE-2015-1838", MASTER + MINION, ["2014", "[0-6]"]],
      ["CVE-2015-1838", MASTER + MINION, ["2014", "7", "[0-3]"]],

      ["CVE-2015-1839", MASTER + MINION, ["0"]],
      ["CVE-2015-1839", MASTER + MINION, ["2014", "[0-6]"]],
      ["CVE-2015-1839", MASTER + MINION, ["2014", "7", "[0-3]"]],

      ["CVE-2015-4017", MASTER + MINION, ["0"]],
      ["CVE-2015-4017", MASTER + MINION, ["2014", "[0-6]"]],
      ["CVE-2015-4017", MASTER + MINION, ["2014", "7", "[0-5]"]],

      ["CVE-2015-6918", MASTER + MINION, ["0"]],
      ["CVE-2015-6918", MASTER + MINION, ["2014"]],
      ["CVE-2015-6918", MASTER + MINION, ["2015", "[0-4]"]],
      ["CVE-2015-6918", MASTER + MINION, ["2015", "5", "[0-4]"]],

      ["CVE-2015-6941", MASTER + MINION, ["0"]],
      ["CVE-2015-6941", MASTER + MINION, ["2014"]],
      ["CVE-2015-6941", MASTER + MINION, ["2015", "[0-4]"]],
      ["CVE-2015-6941", MASTER + MINION, ["2015", "5", "[0-5]"]],
      ["CVE-2015-6941", MASTER + MINION, ["2015", "8", "0"]],

      ["CVE-2015-8034", MASTER + MINION, ["0"]],
      ["CVE-2015-8034", MASTER + MINION, ["2014"]],
      ["CVE-2015-8034", MASTER + MINION, ["2015", "[0-7]"]],
      ["CVE-2015-8034", MASTER + MINION, ["2015", "8", "[0-2]"]],

      ["CVE-2016-1866", MINION, ["0"]],
      ["CVE-2016-1866", MINION, ["2014"]],
      ["CVE-2016-1866", MINION, ["2015", "[0-7]"]],
      ["CVE-2016-1866", MINION, ["2015", "8", "[0-3]"]],

      ["CVE-2016-3176", MASTER + MINION, ["0"]],
      ["CVE-2016-3176", MASTER + MINION, ["2014"]],
      ["CVE-2016-3176", MASTER + MINION, ["2015", "[0-4]"]],
      ["CVE-2016-3176", MASTER + MINION, ["2015", "5", "[0-9]"]],
      ["CVE-2016-3176", MASTER + MINION, ["2015", "8", "[0-7]"]],

      ["CVE-2016-9639", MASTER + MINION, ["0"]],
      ["CVE-2016-9639", MASTER + MINION, ["2014"]],
      ["CVE-2016-9639", MASTER + MINION, ["2015", "[0-7]"]],
      ["CVE-2016-9639", MASTER + MINION, ["2015", "8", "[0-9]"]],
      ["CVE-2016-9639", MASTER + MINION, ["2015", "8", "10"]],

      ["CVE-2017-5192", MASTER + MINION, ["0"]],
      ["CVE-2017-5192", MASTER + MINION, ["2014"]],
      ["CVE-2017-5192", MASTER + MINION, ["2015", "[0-7]"]],
      ["CVE-2017-5192", MASTER + MINION, ["2015", "8", "[0-9]"]],
      ["CVE-2017-5192", MASTER + MINION, ["2015", "8", "1[0-2]"]],
      ["CVE-2017-5192", MASTER + MINION, ["2016", "[0-2]"]],
      ["CVE-2017-5192", MASTER + MINION, ["2016", "3", "[0-4]"]],
      ["CVE-2017-5192", MASTER + MINION, ["2016", "11", "[0-1]"]],

      ["CVE-2017-5200", MASTER + MINION, ["0"]],
      ["CVE-2017-5200", MASTER + MINION, ["2014"]],
      ["CVE-2017-5200", MASTER + MINION, ["2015", "[0-7]"]],
      ["CVE-2017-5200", MASTER + MINION, ["2015", "8", "[0-9]"]],
      ["CVE-2017-5200", MASTER + MINION, ["2015", "8", "1[0-2]"]],
      ["CVE-2017-5200", MASTER + MINION, ["2016", "[0-2]"]],
      ["CVE-2017-5200", MASTER + MINION, ["2016", "3", "[0-4]"]],
      ["CVE-2017-5200", MASTER + MINION, ["2016", "11", "[0-1]"]],

      ["CVE-2017-7893", MASTER + MINION, ["0"]],
      ["CVE-2017-7893", MASTER + MINION, ["201[4-5]"]],
      ["CVE-2017-7893", MASTER + MINION, ["2016", "[0-2]"]],
      ["CVE-2017-7893", MASTER + MINION, ["2016", "3", "[0-5]"]],

      ["CVE-2017-8109", MASTER + MINION, ["0"]],
      ["CVE-2017-8109", MASTER + MINION, ["201[4-5]"]],
      ["CVE-2017-8109", MASTER + MINION, ["2016", "11", "[0-3]"]],

      ["CVE-2017-12791", MASTER + MINION, ["0"]],
      ["CVE-2017-12791", MASTER + MINION, ["201[4-5]"]],
      ["CVE-2017-12791", MASTER + MINION, ["2016", "11", "[0-7]"]],
      ["CVE-2017-12791", MASTER + MINION, ["2017", "[0-6]"]],
      ["CVE-2017-12791", MASTER + MINION, ["2017", "7", "0"]],

      ["CVE-2017-14695", MASTER + MINION, ["0"]],
      ["CVE-2017-14695", MASTER + MINION, ["201[4-5]"]],
      ["CVE-2017-14695", MASTER + MINION, ["2016", "[0-2]"]],
      ["CVE-2017-14695", MASTER + MINION, ["2016", "3", "[0-7]"]],
      ["CVE-2017-14695", MASTER + MINION, ["2016", "11", "[0-7]"]],
      ["CVE-2017-14695", MASTER + MINION, ["2017", "[0-6]"]],
      ["CVE-2017-14695", MASTER + MINION, ["2017", "7", "[0-1]"]],

      ["CVE-2017-14696", MASTER + MINION, ["0"]],
      ["CVE-2017-14696", MASTER + MINION, ["201[4-5]"]],
      ["CVE-2017-14696", MASTER + MINION, ["2016", "[0-2]"]],
      ["CVE-2017-14696", MASTER + MINION, ["2016", "3", "[0-7]"]],
      ["CVE-2017-14696", MASTER + MINION, ["2016", "11", "[0-7]"]],
      ["CVE-2017-14696", MASTER + MINION, ["2017", "[0-6]"]],
      ["CVE-2017-14696", MASTER + MINION, ["2017", "7", "[0-1]"]],

      ["CVE-2018-15750", MASTER, ["0"]],
      ["CVE-2018-15750", MASTER, ["201[4-6]"]],
      ["CVE-2018-15750", MASTER, ["2017", "[0-6]"]],
      ["CVE-2018-15750", MASTER, ["2017", "7", "[0-7]"]],
      ["CVE-2018-15750", MASTER, ["2018", "[0-2]"]],
      ["CVE-2018-15750", MASTER, ["2018", "3", "[0-2]"]],

      ["CVE-2018-15751", MASTER, ["0"]],
      ["CVE-2018-15751", MASTER, ["201[4-6]"]],
      ["CVE-2018-15751", MASTER, ["2017", "[0-6]"]],
      ["CVE-2018-15751", MASTER, ["2017", "7", "[0-7]"]],
      ["CVE-2018-15751", MASTER, ["2018", "[0-2]"]],
      ["CVE-2018-15751", MASTER, ["2018", "3", "[0-2]"]],

      ["CVE-2019-17361", MASTER + MINION, ["0"]],
      ["CVE-2019-17361", MASTER + MINION, ["201[4-8]"]],
      ["CVE-2019-17361", MASTER + MINION, ["2019", "[0-1]"]],
      ["CVE-2019-17361", MASTER + MINION, ["2019", "2", "0"]],

      ["CVE-2019-1010259", MASTER + MINION, ["2018", "3", "[0-3]"]],
      ["CVE-2019-1010259", MASTER + MINION, ["2019", "2"]],

      ["CVE-2020-11651", MASTER, ["0"]],
      ["CVE-2020-11651", MASTER, ["201[4-8]"]],
      ["CVE-2020-11651", MASTER, ["2019", "[0-1]"]],
      ["CVE-2020-11651", MASTER, ["2019", "2", "[0-3]"]],
      ["CVE-2020-11651", MASTER, ["3000", "[0-1]"]],

      ["CVE-2020-11652", MASTER, ["0"]],
      ["CVE-2020-11652", MASTER, ["201[4-8]"]],
      ["CVE-2020-11652", MASTER, ["2019", "[0-1]"]],
      ["CVE-2020-11652", MASTER, ["2019", "2", "[0-3]"]],
      ["CVE-2020-11652", MASTER, ["3000", "[0-1]"]],

      ["CVE-2020-16846", MASTER + MINION, ["0"]],
      ["CVE-2020-16846", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-16846", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-16846", MASTER + MINION, ["3002", "0"]],

      ["CVE-2020-17490", MASTER + MINION, ["0"]],
      ["CVE-2020-17490", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-17490", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-17490", MASTER + MINION, ["3002", "0"]],

      ["CVE-2020-25592", MASTER + MINION, ["0"]],
      ["CVE-2020-25592", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-25592", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-25592", MASTER + MINION, ["3002", "0"]],

      ["CVE-2020-28243", MINION, ["0"]],
      ["CVE-2020-28243", MINION, ["201[4-9]"]],
      ["CVE-2020-28243", MINION, ["300[0-1]"]],
      // CVE mentions "before 3002.5", but the fix was hardened in 3002.6
      ["CVE-2020-28243", MINION, ["3002", "[0-5]"]],

      ["CVE-2020-28972", MASTER + MINION, ["0"]],
      ["CVE-2020-28972", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-28972", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-28972", MASTER + MINION, ["3002", "[0-4]"]],

      ["CVE-2020-35662", MASTER + MINION, ["0"]],
      ["CVE-2020-35662", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-35662", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-35662", MASTER + MINION, ["3002", "[0-4]"]],

      ["CVE-2021-3144", MASTER, ["0"]],
      ["CVE-2021-3144", MASTER, ["201[4-9]"]],
      ["CVE-2021-3144", MASTER, ["300[0-1]"]],
      ["CVE-2021-3144", MASTER, ["3002", "[0-4]"]],

      ["CVE-2021-3148", MASTER, ["0"]],
      ["CVE-2021-3148", MASTER, ["201[4-9]"]],
      ["CVE-2021-3148", MASTER, ["300[0-1]"]],
      ["CVE-2021-3148", MASTER, ["3002", "[0-4]"]],

      ["CVE-2021-3197", MASTER + MINION, ["0"]],
      ["CVE-2021-3197", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2021-3197", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2021-3197", MASTER + MINION, ["3002", "[0-4]"]],

      ["CVE-2021-21996", MINION, ["0"]],
      ["CVE-2021-21996", MINION, ["201[4-9]"]],
      ["CVE-2021-21996", MINION, ["300[0-2]"]],
      ["CVE-2021-21996", MINION, ["3003", "[0-2]"]],

      ["CVE-2021-22004", MINION, ["0"]],
      ["CVE-2021-22004", MINION, ["201[4-9]"]],
      ["CVE-2021-22004", MINION, ["300[0-2]"]],
      ["CVE-2021-22004", MINION, ["3003", "[0-2]"]],

      ["CVE-2021-25281", MASTER, ["0"]],
      ["CVE-2021-25281", MASTER, ["201[4-9]"]],
      ["CVE-2021-25281", MASTER, ["300[0-1]"]],
      ["CVE-2021-25281", MASTER, ["3002", "[0-4]"]],

      ["CVE-2021-25282", MASTER + MINION, ["0"]],
      ["CVE-2021-25282", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2021-25282", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2021-25282", MASTER + MINION, ["3002", "[0-4]"]],

      ["CVE-2021-25283", MASTER + MINION, ["0"]],
      ["CVE-2021-25283", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2021-25283", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2021-25283", MASTER + MINION, ["3002", "[0-4]"]],

      ["CVE-2021-25284", MASTER + MINION, ["0"]],
      ["CVE-2021-25284", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2021-25284", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2021-25284", MASTER + MINION, ["3002", "[0-4]"]],

      // only for SUSE + openSUSE
      // unclear whether 20xx versions are also affected
      // never mind, there are enough other warnings for those
      ["CVE-2021-25315", MASTER + MINION, ["300[01]"]],
      ["CVE-2021-25315", MASTER + MINION, ["3002", "[0-2]"]],

      ["CVE-2021-31607", MASTER + MINION, ["2016", "9"]],
      ["CVE-2021-31607", MASTER + MINION, ["2016", "1[0-9]"]],
      ["CVE-2021-31607", MASTER + MINION, ["201[789]"]],
      ["CVE-2021-31607", MASTER + MINION, ["300[01]"]],
      ["CVE-2021-31607", MASTER + MINION, ["3002", "[0-6]"]],

      ["CVE-2022-22934", MASTER, ["201[4-9]"]],
      ["CVE-2022-22934", MASTER, ["300[01]"]],
      ["CVE-2022-22934", MASTER, ["3002", "[0-7]"]],
      ["CVE-2022-22934", MASTER, ["3003", "[0-3]"]],
      ["CVE-2022-22934", MASTER, ["3004", "[0]"]],

      ["CVE-2022-22935", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2022-22935", MASTER + MINION, ["300[01]"]],
      ["CVE-2022-22935", MASTER + MINION, ["3002", "[0-7]"]],
      ["CVE-2022-22935", MASTER + MINION, ["3003", "[0-3]"]],
      ["CVE-2022-22935", MASTER + MINION, ["3004", "[0]"]],

      ["CVE-2022-22936", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2022-22936", MASTER + MINION, ["300[01]"]],
      ["CVE-2022-22936", MASTER + MINION, ["3002", "[0-7]"]],
      ["CVE-2022-22936", MASTER + MINION, ["3003", "[0-3]"]],
      ["CVE-2022-22936", MASTER + MINION, ["3004", "[0]"]],

      ["CVE-2022-22941", MASTER, ["201[4-9]"]],
      ["CVE-2022-22941", MASTER, ["300[01]"]],
      ["CVE-2022-22941", MASTER, ["3002", "[0-7]"]],
      ["CVE-2022-22941", MASTER, ["3003", "[0-3]"]],
      ["CVE-2022-22941", MASTER, ["3004", "[0]"]],

      ["CVE-2022-22967", MASTER, ["201[4-9]"]],
      ["CVE-2022-22967", MASTER, ["300[01]"]],
      ["CVE-2022-22967", MASTER, ["3002", "[0-8]"]],
      ["CVE-2022-22967", MASTER, ["3003", "[0-4]"]],
      ["CVE-2022-22967", MASTER, ["3004", "[0-1]"]],

      // unclear for which older saltstack versions also
      // but e.g. CVE-2024-22231 already warns for several older ones anyway
      ["CVE-2023-50782", MASTER + MINION, ["3006", "[67]"]],

      // unclear for which older saltstack versions also
      ["CVE-2024-0727", MASTER + MINION, ["3006", "7"]],
      ["CVE-2024-3772", MASTER + MINION, ["3007", "0"]],

      ["CVE-2024-22231", MASTER + MINION, ["2"]],
      ["CVE-2024-22231", MASTER + MINION, ["300[0-4]"]],
      ["CVE-2024-22231", MASTER + MINION, ["3005", "[0-4]"]],
      ["CVE-2024-22231", MASTER + MINION, ["3006", "[0-5]"]],

      ["CVE-2024-22232", MASTER + MINION, ["2"]],
      ["CVE-2024-22232", MASTER + MINION, ["300[0-4]"]],
      ["CVE-2024-22232", MASTER + MINION, ["3005", "[0-4]"]],
      ["CVE-2024-22232", MASTER + MINION, ["3006", "[0-5]"]],

      // unclear for which older saltstack versions also
      ["CVE-2024-26130", MASTER + MINION, ["3006", "7"]],

      ["CVE-2024-27306", MASTER + MINION, ["3006", "7"]],

      ["CVE-2024-34064", MASTER + MINION, ["3006", "[0-8]"]],
      ["CVE-2024-34064", MASTER + MINION, ["3007", "0"]],

      ["CVE-2024-37088", MASTER + MINION, ["3006", "[0-8]"]],

      ["CVE-2024-38822", MASTER, ["3006", "[0-9]"]],
      ["CVE-2024-38822", MASTER, ["3006", "1[0-1]"]],
      ["CVE-2024-38822", MASTER, ["3007", "[0-3]"]],

      ["CVE-2024-38823", MASTER + MINION, ["3006", "[0-9]"]],
      ["CVE-2024-38823", MASTER + MINION, ["3006", "1[0-1]"]],
      ["CVE-2024-38823", MASTER + MINION, ["3007", "[0-3]"]],

      ["CVE-2024-38824", MASTER, ["3006", "[0-9]"]],
      ["CVE-2024-38824", MASTER, ["3006", "1[0-1]"]],
      ["CVE-2024-38824", MASTER, ["3007", "[0-3]"]],

      ["CVE-2024-38825", MASTER + MINION, ["3006", "[0-9]"]],
      ["CVE-2024-38825", MASTER + MINION, ["3006", "1[0-1]"]],
      ["CVE-2024-38825", MASTER + MINION, ["3007", "[0-3]"]],

      ["CVE-2025-22236", MINION, ["3006", "[0-9]"]],
      ["CVE-2025-22236", MINION, ["3006", "1[0-1]"]],
      ["CVE-2025-22236", MINION, ["3007", "[0-3]"]],

      ["CVE-2025-22237", MASTER + MINION, ["3006", "[0-9]"]],
      ["CVE-2025-22237", MASTER + MINION, ["3006", "1[0-1]"]],
      ["CVE-2025-22237", MASTER + MINION, ["3007", "[0-3]"]],

      ["CVE-2025-22238", MASTER + MINION, ["3006", "[0-9]"]],
      ["CVE-2025-22238", MASTER + MINION, ["3006", "1[0-1]"]],
      ["CVE-2025-22238", MASTER + MINION, ["3007", "[0-3]"]],

      ["CVE-2025-22239", MASTER, ["3006", "[0-9]"]],
      ["CVE-2025-22239", MASTER, ["3006", "1[0-1]"]],
      ["CVE-2025-22239", MASTER, ["3007", "[0-3]"]],

      ["CVE-2025-22240", MASTER, ["3006", "[0-9]"]],
      ["CVE-2025-22240", MASTER, ["3006", "1[0-1]"]],
      ["CVE-2025-22240", MASTER, ["3007", "[0-3]"]],

      ["CVE-2025-22241", MASTER + MINION, ["3006", "[0-9]"]],
      ["CVE-2025-22241", MASTER + MINION, ["3006", "1[0-1]"]],
      ["CVE-2025-22241", MASTER + MINION, ["3007", "[0-3]"]],
    ];

    // the above table is up-to-date until (including) 3006.13 and 3007.5
  }

  static _getCveBugs (pVersion, pNodeType) {
    const found = {};

    if (!pVersion) {
      // minion somehow did not report its version
      return found;
    }

    const items = pVersion.split(".");

    if (items.length === 1 && items[0].startsWith("30")) {
      // pretend that the main release of the 30xx series
      // is actually patch "0"
      items.push("0");
    }

    // ["CVE-2020-25592", MASTER+MINION, ["3002", null] ],
    const entries = MinionsPanel._getCveData();

    for (const entry of entries) {
      const id = entry[0];
      const nodeType = entry[1];
      const patterns = entry[2];

      /* eslint-disable no-bitwise */
      if ((nodeType & pNodeType) !== pNodeType) {
        // no, this CVE not valid for this (master/minion)
        continue;
      }
      /* eslint-enable no-bitwise */

      let fnd = true;
      for (let i = 0; i < patterns.length; i++) {
        if (typeof patterns[i] === "string") {
          patterns[i] = new RegExp("^" + patterns[i] + "$");
        }
        if (patterns[i] === null && items[i] === undefined) {
          continue;
        }
        if (patterns[i] === null) {
          fnd = false;
          break;
        }
        if (patterns[i].test(items[i])) {
          continue;
        }
        fnd = false;
        break;
      }
      if (fnd) {
        found[id] = true;
      }
    }

    return found;
  }

  static _addCveList (pName, pVersion, pBugs, pAllCveKeys) {
    let txt = "";
    if (!Object.keys(pBugs).length) {
      return txt;
    }
    txt += "\n" + Character.WARNING_SIGN + pName + " has version " + pVersion + " and is VULNERABLE\nfor exploit";
    const bugs = Object.keys(pBugs).sort();
    if (bugs.length > 1) {
      txt += "s";
    }
    // initial line only has 3 entries due to some initial text on same line
    let cnt = 3;
    for (const bug of bugs) {
      if (bugs.length > 1 && bug === bugs[bugs.length - 1]) {
        txt += " and";
      } else if (bug !== bugs[0]) {
        txt += ",";
      }
      if (cnt <= 0) {
        // start a new line with a maximum of 4 entries
        txt += "\n";
        cnt = 4;
      } else {
        txt += " ";
      }
      txt += bug;
      cnt -= 1;
      if (pAllCveKeys.indexOf(bug) < 0) {
        pAllCveKeys.push(bug);
      }
    }
    return txt;
  }

  _handleRunnerManageVersions (pRunnerManageVersionsData) {
    // this is additional data
    if (this.showErrorRowInstead(pRunnerManageVersionsData)) {
      return;
    }

    const versionList = pRunnerManageVersionsData.return[0];
    const masterVersion = versionList["Master"];
    const masterBugs = MinionsPanel._getCveBugs(masterVersion, MASTER);

    for (const outcome in versionList) {

      // Master field is special, it is not even a dict
      if (outcome === "Master") {
        continue;
      }

      for (const minionId in versionList[outcome]) {

        const versionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
        if (!versionTr) {
          continue;
        }
        const versionSpan = versionTr.querySelector(".saltversion");
        if (!versionSpan) {
          continue;
        }

        const minionVersion = versionTr.dataset.saltversion;
        if (!minionVersion) {
          // no response for this minion
          continue;
        }
        const minionBugs = MinionsPanel._getCveBugs(minionVersion, MINION);

        if (Object.keys(masterBugs).length) {
          Panel.addPrefixIcon(versionSpan, Character.WARNING_SIGN);
        } else if (Object.keys(minionBugs).length) {
          Panel.addPrefixIcon(versionSpan, Character.WARNING_SIGN);
        } else if (outcome === "Minion requires update") {
          Panel.addPrefixIcon(versionSpan, Character.WARNING_SIGN);
        } else if (outcome === "Minion newer than master") {
          Panel.addPrefixIcon(versionSpan, Character.WARNING_SIGN);
        } else if (outcome === "Up to date") {
          // VOID
        }

        const allCveKeys = Object.keys(masterBugs);
        let txt = "";
        txt += MinionsPanel._addCveList("The salt-master", masterVersion, masterBugs, allCveKeys);
        txt += MinionsPanel._addCveList("This salt-minion", minionVersion, minionBugs, allCveKeys);

        if (outcome === "Minion requires update") {
          txt += "\n" + Character.WARNING_SIGN + "This salt-minion (" + minionVersion + ") is older than the salt-master (" + masterVersion + ")";
        } else if (outcome === "Minion newer than master") {
          txt += "\n" + Character.WARNING_SIGN + "This salt-minion (" + minionVersion + ") is newer than the salt-master (" + masterVersion + ")";
        }

        if (txt) {
          txt += "\nUpgrade is highly recommended!";
          if (allCveKeys.length > 0) {
            txt += "\nClick to show these CVEs on cve.mitre.org";
            versionSpan.addEventListener("click", (pClickEvent) => {
              let url = "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=";
              for (let i = 0; i < allCveKeys.length; i++) {
                url += (i === 0 ? "" : "%20") + allCveKeys[i];
              }
              window.open(url);
              // prevent the click to open the run-dialog
              pClickEvent.stopPropagation();
            });
          }
          Utils.addToolTip(versionSpan, txt.trim(), "error-bottom-left");
        }
      }
    }
  }
}
