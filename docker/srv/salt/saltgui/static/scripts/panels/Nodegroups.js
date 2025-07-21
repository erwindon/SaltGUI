/* global */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class NodegroupsPanel extends Panel {

  constructor () {
    super("nodegroups");

    this.addTitle("Nodegroups");
    this.addPanelMenu();
    this._addMenuItemStateApplyMinion(this.panelMenu, "*");
    this._addMenuItemStateApplyTestMinion(this.panelMenu, "*");
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addWarningField();
    this.addTable(["-menu-", "Minion", "Status", "Salt version", "OS version"]);
    this.setTableClickable("cmd");
    this.addMsg();
  }

  onShow () {
    this.nrMinions = 0;

    const useCacheGrains = Utils.getStorageItemBoolean("session", "use_cache_for_grains", false);
    this.setWarningText("info", useCacheGrains ? "the content of this screen is based on cached grains info, minion status or grain info may not be accurate" : "");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localGrainsItemsPromise = useCacheGrains ? this.api.getRunnerCacheGrains(null) : this.api.getLocalGrainsItems(null);

    this.loadMinionsTxt();

    this._addNodegroupsRows();
    this.updateFooter();

    this.setPlayPauseButton("play");

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleNodegroupsWheelKeyListAll(pWheelKeyListAllData);

      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
        this.nodeGroupTimeout = window.setTimeout(() => {
          this.nodeGroupTimeout = null;
          this._handleStep(pWheelKeyListAllData.return[0].data.return);
        }, 100);
        return true;
      }, (pLocalGrainsItemsMsg) => {
        const allNodegroupsErr = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, JSON.stringify(pLocalGrainsItemsMsg));
        this.updateMinions({"return": [allNodegroupsErr]});
        return false;
      });

      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleNodegroupsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      Utils.ignorePromise(localGrainsItemsPromise);
      return false;
    });
  }

  onHide () {
    if (this.nodeGroupTimeout) {
      // stop the timer when nobody is looking
      window.clearTimeout(this.nodeGroupTimeout);
      this.nodeGroupTimeout = null;
    }
  }

  updateFooter () {
    const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    const txt = ", " + Utils.txtZeroOneMany(Object.keys(nodegroups).length,
      "no nodegroups", "{0} nodegroup", "{0} nodegroups");

    super.updateFooter(txt);
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("saltversion"));
    minionTr.appendChild(Utils.createTd("os"));

    minionTr.offline = true;
  }

  _moveMinionToNodegroup (pMinionId, pNodegroup, pWheelKeyListAllSimpleData) {
    const minionTrId = Utils.getIdFromMinionId(pMinionId);
    let minionTr = this.table.querySelector("#" + minionTrId);
    const nodegroupTrId = "ng-" + pNodegroup;
    const nodegroupTr = this.table.querySelector("#" + nodegroupTrId);

    if (minionTr === null) {
      // unknown minion is probably not in accepted state
      // or totally unknown and still included in the nodegroup
      const minionSpan = Utils.createSpan("minion-id", pMinionId);
      const minionTd = Utils.createTd();
      minionTd.appendChild(minionSpan);
      let status;
      if (pWheelKeyListAllSimpleData.minions.indexOf(pMinionId) >= 0) {
        // strange, should have found this TR
        status = Utils.createTd(["status", "error"], "error");
      } else if (pWheelKeyListAllSimpleData.minions_pre.indexOf(pMinionId) >= 0) {
        status = Utils.createTd(["status", "unaccepted"], "unaccepted");
        this.unaccepted += 1;
      } else if (pWheelKeyListAllSimpleData.minions_rejected.indexOf(pMinionId) >= 0) {
        status = Utils.createTd(["status", "rejected"], "rejected");
        this.rejected += 1;
      } else if (pWheelKeyListAllSimpleData.minions_denied.indexOf(pMinionId) >= 0) {
        status = Utils.createTd(["status", "denied"], "denied");
        this.denied += 1;
      } else {
        status = Utils.createTd(["status", "keyunknown"], "unknown");
        Panel.addPrefixIcon(minionSpan, Character.WARNING_SIGN);
        Utils.addToolTip(minionSpan, "This minion is listed for this nodegroup,\nbut the minion is unknown", "bottom-left");
        this.unknown += 1;
      }
      minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));
      minionTr.appendChild(minionTd);
      minionTr.appendChild(status);
      minionTr.appendChild(Utils.createTd());
      minionTr.appendChild(Utils.createTd());
      this._addMenuItemShowKeys(minionTr.dropdownmenu);
      minionTr.offline = true;
    }

    if (minionTr.dataset.moved) {
      // this minion is already part of a group
      // duplicate it to put it in its 2nd (3rd,etc) group
      const minionTr2 = minionTr.cloneNode(true);
      nodegroupTr.parentNode.insertBefore(minionTr2, nodegroupTr.nextSibling);

      // fix the click-to-copy-logic
      const addressSpan = minionTr2.querySelector("td.address span");
      if (addressSpan) {
        addressSpan.addEventListener("click", (pClickEvent) => {
          Panel._copyAddress(addressSpan, pClickEvent.ctrlKey || pClickEvent.altKey);
          pClickEvent.stopPropagation();
        });
        addressSpan.addEventListener("mouseout", () => {
          Panel.restoreClickToCopy(addressSpan);
        });
        Panel.restoreClickToCopy(addressSpan);
      }

      // fix the row menu
      const oldMenuButton = minionTr2.querySelector("td div.run-command-button");
      const minionIsOk = minionTr2.dataset.saltversion !== undefined;

      if (oldMenuButton) {
        oldMenuButton.parentElement.remove();
        const newMenuButton = Utils.createTd();
        minionTr2.insertBefore(newMenuButton, minionTr2.firstChild);
        minionTr2.dropdownmenu = new DropDownMenu(newMenuButton, "smaller");
        if (minionIsOk) {
          this._addMenuItemStateApplyMinion(minionTr2.dropdownmenu, pMinionId);
          this._addMenuItemStateApplyTestMinion(minionTr2.dropdownmenu, pMinionId);
          this._addMenuItemShowGrains(minionTr2.dropdownmenu, pMinionId);
          this._addMenuItemShowPillars(minionTr2.dropdownmenu, pMinionId);
          this._addMenuItemShowSchedules(minionTr2.dropdownmenu, pMinionId);
          this._addMenuItemShowBeacons(minionTr2.dropdownmenu, pMinionId);
        }
      }

      if (minionIsOk) {
        // fix the row as needed
        minionTr2.addEventListener("click", (pClickEvent) => {
          const cmdArr = ["state.apply"];
          this.runCommand("", pMinionId, cmdArr);
          pClickEvent.stopPropagation();
        });
      }
    } else {
      // move the row to its proper place
      nodegroupTr.parentNode.insertBefore(minionTr, nodegroupTr.nextSibling);
      minionTr.dataset.moved = true;
    }
  }

  _handleStepGroup (pWheelKeyListAllSimpleData) {
    const nodegroup = this.todoNodegroups.shift();

    // test group membership with function that is typically hidden
    // note: uses full_data=true
    const localTestVersion = this.api.getLocalTestVersion(nodegroup);
    localTestVersion.then((pLocalTestVersionData) => {
      const retdata = pLocalTestVersionData.return[0];
      // handle the list in reverse order
      const nodelist = Object.keys(retdata).sort().
        reverse();

      for (const minionId of nodelist) {
        this._moveMinionToNodegroup(minionId, nodegroup, pWheelKeyListAllSimpleData);
      }

      const titleElement = this.table.querySelector("#ng-" + nodegroup + " td:nth-child(2)");
      const cnt = nodelist.length;

      let txt = Utils.txtZeroOneMany(cnt, "no minions", cnt + " minion", cnt + " minions");
      let online = 0;
      let offline = 0;
      let problems = 0;
      for (const minionId of nodelist) {
        const minionData = retdata[minionId];
        if (minionData === false) {
          offline += 1;
        } else if (minionData.retcode === 0) {
          online += 1;
        } else {
          // that's an error message
          // e.g. unaccepted minion or unknown minion
          problems += 1;
        }
      }
      if (online !== cnt) {
        txt += ", " + online + " online";
      }
      if (offline !== 0) {
        txt += ", " + offline + " offline";
      }
      if (problems !== 0) {
        txt += ", " + Utils.txtZeroOneMany(problems, "no problems", "{0} problem", "{0} problems");
      }

      titleElement.innerHTML = titleElement.innerHTML.replace("(loading)", txt);

      // try again for more
      this.nodeGroupTimeout = window.setTimeout(() => {
        this.nodeGroupTimeout = null;
        this._handleStep(pWheelKeyListAllSimpleData);
      }, 100);
    }, (pLocalTestVersionMsg) => {
      this.showErrorRowInstead(pLocalTestVersionMsg.toString());
    });
  }

  _handleStepNoGroup () {
    this.setPlayPauseButton("none");
    this.todoNodegroups = null;

    const titleElement = this.table.querySelectorAll("#ng-" + null + " td")[1];
    const cnt = this.table.rows.length - titleElement.parentElement.rowIndex - 1;

    if (cnt === 0) {
      // remove the title of the empty group "not in any nodegroup"
      titleElement.parentElement.remove();
      return;
    }

    let txt = Utils.txtZeroOneMany(cnt, "no minions", cnt + " minion", cnt + " minions");
    let online = 0;
    let offline = 0;
    for (let row = titleElement.parentElement.rowIndex + 1; row < this.table.rows.length; row++) {
      const tr = this.table.rows[row];
      if (tr.online === true) {
        online += 1;
      }
      if (tr.offline === true) {
        offline += 1;
      }
    }
    if (online !== cnt) {
      txt += ", " + online + " online";
    }
    if (offline !== 0) {
      txt += ", " + offline + " offline";
    }

    titleElement.innerHTML = titleElement.innerHTML.replace("(loading)", txt);
  }

  _handleStep (pWheelKeyListAllSimpleData) {

    // user can decide
    // system can decide to remove the play/pause button
    if (this.playOrPause !== "play") {
      // try again later for more
      this.nodeGroupTimeout = window.setTimeout(() => {
        this.nodeGroupTimeout = null;
        this._handleStep(pWheelKeyListAllSimpleData);
      }, 100);
      return;
    }

    if (this.todoNodegroups.length === 0) {
      this._handleStepNoGroup();
      return;
    }

    this._handleStepGroup(pWheelKeyListAllSimpleData);
  }

  _addNodegroupsRows () {
    const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    this.allNodegroups = Object.keys(nodegroups).sort();
    this.todoNodegroups = Object.keys(nodegroups).sort();
    for (const nodegroup of this.allNodegroups) {
      this._addNodegroupRow(nodegroup);
    }
    this._addNodegroupRow(null, this.allNodegroups);
  }

  _addNodegroupRow (pNodegroup, pAllNodegroups) {
    const tr = Utils.createTr("no-search", null, "ng-" + pNodegroup);
    tr.style.borderTop = "4px double #ddd";

    const menuTd = Utils.createTd();
    tr.dropdownmenu = new DropDownMenu(menuTd, "smaller");
    tr.appendChild(menuTd);

    const titleTd = Utils.createTd();
    if (pNodegroup) {
      titleTd.innerHTML = Character.EM_DASH + " nodegroup <b>" + pNodegroup + "</b> " + Character.EM_DASH + " (loading) " + Character.EM_DASH;
    } else {
      titleTd.innerText = Character.EM_DASH + " not in any nodegroup " + Character.EM_DASH + " (loading) " + Character.EM_DASH;
    }
    titleTd.colSpan = 4;
    tr.append(titleTd);

    this._addMenuItemStateApplyGroup(tr.dropdownmenu, pNodegroup, pAllNodegroups);
    this._addMenuItemStateApplyTestGroup(tr.dropdownmenu, pNodegroup, pAllNodegroups);

    tr.addEventListener("click", (pClickEvent) => {
      const cmdArr = ["state.apply"];
      this.runCommand("", NodegroupsPanel._getGroupTarget(pNodegroup, pAllNodegroups), cmdArr);
      pClickEvent.stopPropagation();
    });

    this.table.tBodies[0].appendChild(tr);
  }

  _handleNodegroupsWheelKeyListAll (pWheelKeyListAll) {
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
      this._addMenuItemStateApplyMinion(minionTr.dropdownmenu, minionId);
      this._addMenuItemStateApplyTestMinion(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowGrains(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowPillars(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowSchedules(minionTr.dropdownmenu, minionId);
      this._addMenuItemShowBeacons(minionTr.dropdownmenu, minionId);
    }

    this.updateFooter();
  }

  updateMinion (pMinionData, pMinionId, pAllNodegroupsGrains) {
    super.updateMinion(pMinionData, pMinionId, pAllNodegroupsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    this._addMenuItemStateApplyMinion(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemStateApplyTestMinion(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowGrains(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowPillars(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowSchedules(minionTr.dropdownmenu, pMinionId);
    this._addMenuItemShowBeacons(minionTr.dropdownmenu, pMinionId);

    minionTr.addEventListener("click", (pClickEvent) => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr);
      pClickEvent.stopPropagation();
    });

    minionTr.online = true;
  }

  static _getGroupTarget (pNodegroup, pAllNodegroups) {
    if (pNodegroup) {
      // could have use the '#' notation, but this is more native
      return "N@" + pNodegroup;
    }

    let ret = "";
    for (const nodegroup of pAllNodegroups) {
      ret += " and not N@" + nodegroup;
    }

    // strip first " and "
    return ret.substring(5);
  }

  _addMenuItemStateApplyGroup (pMenu, pNodegroup, pAllNodegroups) {
    pMenu.addMenuItem("Apply state...", () => {
      const cmdArr = ["state.apply"];
      this.runCommand("", NodegroupsPanel._getGroupTarget(pNodegroup, pAllNodegroups), cmdArr);
    });
  }

  _addMenuItemStateApplyTestGroup (pMenu, pNodegroup, pAllNodegroups) {
    pMenu.addMenuItem("Test state...", () => {
      const cmdArr = ["state.apply", "test=", true];
      this.runCommand("", NodegroupsPanel._getGroupTarget(pNodegroup, pAllNodegroups), cmdArr);
    });
  }

  _addMenuItemStateApplyMinion (pMenu, pMinionId) {
    pMenu.addMenuItem("Apply state...", () => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemStateApplyTestMinion (pMenu, pMinionId) {
    pMenu.addMenuItem("Test state...", () => {
      const cmdArr = ["state.apply", "test=", true];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemShowKeys (pMenu) {
    pMenu.addMenuItem("Show keys", (pClickEvent) => {
      this.router.goTo("keys", undefined, undefined, pClickEvent);
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
}
