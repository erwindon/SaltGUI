/* global */

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
    this.addTable(["Minion", "Status", "Salt version", "OS version", "-menu-"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.api.getLocalGrainsItems(null);

    this.loadMinionsTxt();

    this._addNodegroupsRows();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleNodegroupsWheelKeyListAll(pWheelKeyListAllData);

      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
        window.setTimeout(() => {
          this._handleStep();
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

  _moveMinionToNodegroup (pMinionId, pNodegroup) {
    const minionTrId = Utils.getIdFromMinionId(pMinionId);
    const minionTr = this.table.querySelector("#" + minionTrId);
    const nodegroupTrId = "ng-" + pNodegroup;
    const nodegroupTr = this.table.querySelector("#" + nodegroupTrId);
    if (minionTr.dataset.moved) {
      // this minion is already part of a group
      // duplicate it to put it in its 2nd (3rd,etc) group
      const minionTr2 = minionTr.cloneNode(true);
      nodegroupTr.parentNode.insertBefore(minionTr2, nodegroupTr.nextSibling);
    } else {
      // move the row to its proper place
      nodegroupTr.parentNode.insertBefore(minionTr, nodegroupTr.nextSibling);
      minionTr.dataset.moved = true;
    }
  }

  _handleStep () {
    if (!this.allNodegroups) {
      return;
    }

    if (this.allNodegroups.length === 0) {
      this.allNodegroups = null;
      return;
    }

    const nodegroup = this.allNodegroups.shift();

    const localTestPing = this.api.getLocalTestPing(nodegroup);
    localTestPing.then((pLocalTestPingData) => {
      // handle the list in reverse order
      const nodelist = Object.keys(pLocalTestPingData.return[0]).sort().
        reverse();

      for (const minionId of nodelist) {
        this._moveMinionToNodegroup(minionId, nodegroup);
      }

      // try again for more
      window.setTimeout(() => {
        this._handleStep();
      }, 100);
    }, (pLocalTestPingMsg) => {
      this.showErrorRowInstead(pLocalTestPingMsg.toString());
    });
  }

  _addNodegroupsRows () {
    const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    const allNodegroups = Object.keys(nodegroups).sort();
    this.allNodegroups = allNodegroups;
    for (const nodegroup of allNodegroups) {
      this._addNodegroupRow(nodegroup);
    }
    this._addNodegroupRow(null, allNodegroups);
  }

  _addNodegroupRow (pNodegroup, pAllNodegroups) {
    const tr = Utils.createTr(null, null, "ng-" + pNodegroup);

    const titleTd = Utils.createTd();
    if (pNodegroup) {
      titleTd.innerHTML = "--- nodegroup <b>" + pNodegroup + "</b> ---";
    } else {
      titleTd.innerText = "--- not in any nodegroup ---";
    }
    titleTd.colSpan = 4;
    tr.append(titleTd);

    const menuTd = Utils.createTd();
    const menu = new DropDownMenu(menuTd, true);
    this._addMenuItemStateApplyGroup(menu, pNodegroup, pAllNodegroups);
    this._addMenuItemStateApplyTestGroup(menu, pNodegroup, pAllNodegroups);
    tr.append(menuTd);

    this.table.tBodies[0].appendChild(tr);
  }

  _handleNodegroupsWheelKeyListAll (pWheelKeyListAll) {
    if (this.showErrorRowInstead(pWheelKeyListAll)) {
      return;
    }

    const keys = pWheelKeyListAll.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId, 1);

      // preliminary dropdown menu
      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemStateApplyMinion(menu, minionId);
      this._addMenuItemStateApplyTestMinion(menu, minionId);
      this._addMenuItemShowGrains(menu, minionId);
      this._addMenuItemShowPillars(menu, minionId);
      this._addMenuItemShowSchedules(menu, minionId);
      this._addMenuItemShowBeacons(menu, minionId);
    }

    Utils.setStorageItem("session", "minions_pre_length", keys.minions_pre.length);

    let txt = Utils.txtZeroOneMany(minionIds.length,
      "No minions", "{0} minion", "{0} minions");

    const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    txt += ", " + Utils.txtZeroOneMany(Object.keys(nodegroups).length,
      "no nodegroups", "{0} nodegroup", "{0} nodegroups");

    this.setMsg(txt);
  }

  updateMinion (pMinionData, pMinionId, pAllNodegroupsGrains) {
    super.updateMinion(pMinionData, pMinionId, pAllNodegroupsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    const menu = new DropDownMenu(minionTr, true);
    this._addMenuItemStateApplyMinion(menu, pMinionId);
    this._addMenuItemStateApplyTestMinion(menu, pMinionId);
    this._addMenuItemShowGrains(menu, pMinionId);
    this._addMenuItemShowPillars(menu, pMinionId);
    this._addMenuItemShowSchedules(menu, pMinionId);
    this._addMenuItemShowBeacons(menu, pMinionId);

    minionTr.addEventListener("click", (pClickEvent) => {
      const cmdArr = ["state.apply"];
      this.runCommand("", pMinionId, cmdArr);
      pClickEvent.stopPropagation();
    });
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

  _addMenuItemShowGrains (pMenu, pMinionId) {
    pMenu.addMenuItem("Show grains", () => {
      this.router.goTo("grains-minion", {"minionid": pMinionId});
    });
  }

  _addMenuItemShowSchedules (pMenu, pMinionId) {
    pMenu.addMenuItem("Show schedules", () => {
      this.router.goTo("schedules-minion", {"minionid": pMinionId});
    });
  }

  _addMenuItemShowPillars (pMenu, pMinionId) {
    pMenu.addMenuItem("Show pillars", () => {
      this.router.goTo("pillars-minion", {"minionid": pMinionId});
    });
  }

  _addMenuItemShowBeacons (pMenu, pMinionId) {
    pMenu.addMenuItem("Show beacons", () => {
      this.router.goTo("beacons-minion", {"minionid": pMinionId});
    });
  }
}
