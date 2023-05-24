/* global */

import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class NodegroupsPanel extends Panel {

  constructor () {
    super("nodegroups");

    this.addTitle("Nodegroups");
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

    this.loadMinionsTxt();

    this._addNodegroupsRows();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleNodegroupsWheelKeyListAll(pWheelKeyListAllData);

      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
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

  _addNodegroupsRows () {
    const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    for (const nodegroup of Object.keys(nodegroups).sort()) {
      this._addNodegroupRow(nodegroup);
    }
    this._addNodegroupRow(null);
  }

  _addNodegroupRow (pNodegroup) {
    const td = Utils.createTd(null, null, "ng-" + pNodegroup);
    if (pNodegroup) {
      td.innerHTML = "--- nodegroup <b>" + pNodegroup + "</b> ---";
    } else {
      td.innerText = "--- not in any nodegroup ---";
    }
    td.colSpan = 5;
    const tr = Utils.createTr();
    tr.append(td);
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
      this._addMenuItemStateApply(menu, minionId);
      this._addMenuItemStateApplyTest(menu, minionId);
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
    this._addMenuItemStateApply(menu, pMinionId);
    this._addMenuItemStateApplyTest(menu, pMinionId);
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
