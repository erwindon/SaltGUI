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
    this.addTable(["Minion", "Status", "Salt version", "OS version", "-menu-"]);
    this.setTableClickable();
    this.addMsg();

    this.setPlayPauseButton("play");
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

  updateFooter () {
    const txt = Utils.txtZeroOneMany(this.minionsCnt,
      "No minions", "{0} minion", "{0} minions");

    // see https://github.com/erwindon/SaltGUI/issues/517
    // const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    // txt += ", " + Utils.txtZeroOneMany(Object.keys(nodegroups).length,
    //   "no nodegroups", "{0} nodegroup", "{0} nodegroups");

    this.setMsg(txt);
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

      // fix the click-to-copy-logic
      const addressSpan = minionTr2.querySelector("td.address span");
      addressSpan.addEventListener("click", (pClickEvent) => {
        Panel._copyAddress(addressSpan, pClickEvent.ctrlKey || pClickEvent.altKey);
        pClickEvent.stopPropagation();
      });
      addressSpan.addEventListener("mouseout", () => {
        Panel.restoreClickToCopy(addressSpan);
      });
      Panel.restoreClickToCopy(addressSpan);

      // fix the row menu
      const oldMenuButton = minionTr2.querySelector("td div.run-command-button");
      oldMenuButton.parentElement.remove();
      const menu = new DropDownMenu(minionTr2, true);
      this._addMenuItemStateApplyMinion(menu, pMinionId);
      this._addMenuItemStateApplyTestMinion(menu, pMinionId);
      this._addMenuItemShowGrains(menu, pMinionId);
      this._addMenuItemShowPillars(menu, pMinionId);
      this._addMenuItemShowSchedules(menu, pMinionId);
      this._addMenuItemShowBeacons(menu, pMinionId);

      // fix the row
      minionTr2.addEventListener("click", (pClickEvent) => {
        const cmdArr = ["state.apply"];
        this.runCommand("", pMinionId, cmdArr);
        pClickEvent.stopPropagation();
      });
    } else {
      // move the row to its proper place
      nodegroupTr.parentNode.insertBefore(minionTr, nodegroupTr.nextSibling);
      minionTr.dataset.moved = true;
    }
  }

  _handleStep () {

    // user can decide
    // system can decide to remove the play/pause button
    if (this.playOrPause !== "play") {
      // try again lkater for more
      window.setTimeout(() => {
        this._handleStep();
      }, 100);
      return;
    }

    if (this.todoNodegroups.length === 0) {
      this.setPlayPauseButton("none");
      this.todoNodegroups = null;

      const titleElement = this.table.querySelector("#ng-" + null + " td");
      const cnt = this.table.rows.length - titleElement.parentElement.rowIndex - 1;
      titleElement.innerHTML = titleElement.innerHTML.replace(
        " ---",
        ", " + Utils.txtZeroOneMany(cnt, "no minions", cnt + " minion", cnt + " minions") + " ---");
      if (cnt === 0) {
        // remove the title of the empty group "not in any nodegroup"
        titleElement.parentElement.remove();
      }

      return;
    }

    const nodegroup = this.todoNodegroups.shift();

    // test group membership with function that is typically hidden
    const localTestVersion = this.api.getLocalTestVersion(nodegroup);
    localTestVersion.then((pLocalTestVersionData) => {
      // handle the list in reverse order
      const nodelist = Object.keys(pLocalTestVersionData.return[0]).sort().
        reverse();

      for (const minionId of nodelist) {
        this._moveMinionToNodegroup(minionId, nodegroup);
      }

      const titleElement = this.table.querySelector("#ng-" + nodegroup + " td");
      const cnt = nodelist.length;
      titleElement.innerHTML = titleElement.innerHTML.replace(
        " ---",
        ", " + Utils.txtZeroOneMany(cnt, "no minions", cnt + " minion", cnt + " minions") + " ---");

      // try again for more
      window.setTimeout(() => {
        this._handleStep();
      }, 100);
    }, (pLocalTestVersionMsg) => {
      this.showErrorRowInstead(pLocalTestVersionMsg.toString());
    });
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
    const tr = Utils.createTr(null, null, "ng-" + pNodegroup);

    const titleTd = Utils.createTd();
    if (pNodegroup) {
      titleTd.innerHTML = "--- nodegroup <b>" + pNodegroup + "</b> ---&nbsp;&nbsp;&nbsp;";
    } else {
      titleTd.innerText = "--- not in any nodegroup ---" + Character.NO_BREAK_SPACE + Character.NO_BREAK_SPACE + Character.NO_BREAK_SPACE;
    }
    titleTd.colSpan = 5;
    tr.append(titleTd);

    const menu = new DropDownMenu(titleTd, true);
    this._addMenuItemStateApplyGroup(menu, pNodegroup, pAllNodegroups);
    this._addMenuItemStateApplyTestGroup(menu, pNodegroup, pAllNodegroups);

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

    this.minionsCnt = keys.minions.length;
    this.updateFooter();
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
