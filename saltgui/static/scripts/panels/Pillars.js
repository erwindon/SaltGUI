/* global */

import {DropDownMenu} from "../DropDown.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class PillarsPanel extends Panel {

  constructor () {
    super("pillars");

    this.addTitle("Pillars");
    this.addSearchButton();
    this.addTable(["Minion", "Status", "Pillars", "-menu-"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localPillarObfuscatePromise = this.api.getLocalPillarObfuscate(null);

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handlePillarsWheelKeyListAll(pWheelKeyListAllData);
      localPillarObfuscatePromise.then((pLocalPillarObfuscateData) => {
        this.updateMinions(pLocalPillarObfuscateData);
        return true;
      }, (pLocalPillarObfuscateMsg) => {
        const allMinionsErr = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, JSON.stringify(pLocalPillarObfuscateMsg));
        this.updateMinions({"return": [allMinionsErr]});
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handlePillarsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      Utils.ignorePromise(localPillarObfuscatePromise);
      return false;
    });
  }

  _handlePillarsWheelKeyListAll (pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelKeyListAllData)) {
      return;
    }

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(minionId, 1);

      // preliminary dropdown menu
      const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemShowPillars(menu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        this.router.goTo("pillars-minion", {"minionid": minionId});
        pClickEvent.stopPropagation();
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
    minionTr.appendChild(Utils.createTd("pillarinfo"));
    minionTr.appendChild(Utils.createTd("run-command-button"));
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(null, pMinionId, pAllMinionsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

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
    const pillarInfoTd = Utils.createTd("pillarinfo", pillarInfoText);
    pillarInfoTd.setAttribute("sorttable_customkey", cnt);
    if (typeof pMinionData !== "object") {
      Utils.addErrorToTableCell(pillarInfoTd, pMinionData);
    }
    minionTr.appendChild(pillarInfoTd);

    const menu = new DropDownMenu(minionTr, true);
    this._addMenuItemShowPillars(menu, pMinionId);
  }

  _addMenuItemShowPillars (pMenu, pMinionId) {
    pMenu.addMenuItem("Show pillars", () => {
      this.router.goTo("pillars-minion", {"minionid": pMinionId});
    });
  }
}
