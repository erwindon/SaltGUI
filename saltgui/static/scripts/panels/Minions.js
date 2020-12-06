/* global */

import {DropDownMenu} from "../DropDown.js";
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
    this.addTable(["Minion", "Status", "Salt version", "OS version", "-menu-"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.api.getLocalGrainsItems(null);
    const runnerManageVersionsPromise = this.api.getRunnerManageVersions();

    this.loadMinionsTxt();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleMinionsWheelKeyListAll(pWheelKeyListAllData);

      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
        return true;
      }, (pLocalGrainsItemsMsg) => {
        const localGrainsItemsData = {"return": [{}]};
        if (pWheelKeyListAllData) {
          for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
            localGrainsItemsData.return[0][minionId] = JSON.stringify(pLocalGrainsItemsMsg);
          }
        }
        this.updateMinions(localGrainsItemsData);
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
      return false;
    });
  }

  _handleMinionsWheelKeyListAll (pWheelKeyListAll) {
    if (this.showErrorRowInstead(pWheelKeyListAll)) {
      return;
    }

    const keys = pWheelKeyListAll.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(minionId, 1);

      // preliminary dropdown menu
      const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        this.runCommand(pClickEvent, minionId, "state.apply");
      });
    }

    const txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");
    this.setMsg(txt);
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("saltversion"));
    minionTr.appendChild(Utils.createTd("os"));
    minionTr.appendChild(Utils.createTd("run-command-button"));
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    const menu = new DropDownMenu(minionTr);
    this._addMenuItemStateApply(menu, pMinionId);
    this._addMenuItemStateApplyTest(menu, pMinionId);
  }

  _addMenuItemStateApply (pMenu, pMinionId) {
    pMenu.addMenuItem("Apply state...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "state.apply");
    });
  }

  _addMenuItemStateApplyTest (pMenu, pMinionId) {
    pMenu.addMenuItem("Test state...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "state.apply test=True");
    });
  }

  static _getCveData () {
    // See https://docs.saltstack.com/en/master/topics/releases/version_numbers.html
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
      ["CVE-2020-11651", MASTER, ["3000", null]],
      ["CVE-2020-11651", MASTER, ["3000", "[0-1]"]],

      ["CVE-2020-11652", MASTER, ["0"]],
      ["CVE-2020-11652", MASTER, ["201[4-8]"]],
      ["CVE-2020-11652", MASTER, ["2019", "[0-1]"]],
      ["CVE-2020-11652", MASTER, ["2019", "2", "[0-3]"]],
      ["CVE-2020-11652", MASTER, ["3000", null]],
      ["CVE-2020-11652", MASTER, ["3000", "[0-1]"]],

      ["CVE-2020-16846", MASTER + MINION, ["0"]],
      ["CVE-2020-16846", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-16846", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-16846", MASTER + MINION, ["3002", null]],

      ["CVE-2020-17490", MASTER + MINION, ["0"]],
      ["CVE-2020-17490", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-17490", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-17490", MASTER + MINION, ["3002", null]],

      ["CVE-2020-25592", MASTER + MINION, ["0"]],
      ["CVE-2020-25592", MASTER + MINION, ["201[4-9]"]],
      ["CVE-2020-25592", MASTER + MINION, ["300[0-1]"]],
      ["CVE-2020-25592", MASTER + MINION, ["3002", null]]
    ];
  }

  static _getCveBugs (pVersion, pNodeType) {
    const found = {};

    if (!pVersion) {
      // minion somehow did not report its version
      return found;
    }

    const items = pVersion.split(".");

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

  static _addCveList (pName, pVersion, pBugs) {
    let txt = "";
    if (!Object.keys(pBugs).length) {
      return txt;
    }
    txt += "\nThe " + pName + " has version " + pVersion + " and is VULNERABLE\nfor exploit";
    const bugs = Object.keys(pBugs).sort();
    if (bugs.length > 1) {
      txt += "s";
    }
    let cnt = 0;
    for (const bug of bugs) {
      if (bugs.length > 1 && bug === bugs[bugs.length - 1]) {
        txt += " and";
      } else if (bug !== bugs[0]) {
        txt += ",";
      }
      if (cnt === 5) {
        txt += "\n";
        cnt = 0;
      } else {
        txt += " ";
      }
      txt += bug;
      cnt += 1;
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
        const minionBugs = MinionsPanel._getCveBugs(minionVersion, MINION);

        if (Object.keys(masterBugs).length) {
          versionSpan.style.color = "red";
        } else if (Object.keys(minionBugs).length) {
          versionSpan.style.color = "red";
        } else if (outcome === "Minion requires update") {
          versionSpan.style.color = "orange";
        } else if (outcome === "Minion newer than master") {
          versionSpan.style.color = "orange";
        } else if (outcome === "Up to date") {
          // VOID
        }

        let txt = "";
        txt += MinionsPanel._addCveList("salt-master", masterVersion, masterBugs);
        txt += MinionsPanel._addCveList("salt-minion", minionVersion, minionBugs);

        if (outcome === "Minion requires update") {
          txt += "\nThis salt-minion (" + minionVersion + ") is older than the salt-master (" + masterVersion + ")";
        } else if (outcome === "Minion newer than master") {
          txt += "\nThis salt-minion (" + minionVersion + ") is newer than the salt-master (" + masterVersion + ")";
        }

        if (txt) {
          txt += "\nUpgrade is highly recommended!";
          versionSpan.onclick = (pClickEvent) => {
            window.open("https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=saltstack");
            // prevent the click to open the run-dialog
            pClickEvent.stopPropagation();
          };
          Utils.addToolTip(versionSpan, txt.trim(), "error-bottom-left");
        }
      }
    }
  }
}
