/* global */

import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class MinePanel extends Panel {

  constructor () {
    super("mine");

    this.addTitle("Mine");
    this.addSearchButton();
    this.addTable(["-menu-", "Minion", "Status", "Functions"]);
    this.setTableClickable("cmd");
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localMineValidPromise = this.api.getLocalMineValid();

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleMineWheelKeyListAll(pWheelKeyListAllData);

      localMineValidPromise.then((pLocalMineValidData) => {
        this.updateMinions(pLocalMineValidData);
      }, (pLocalMineValidMsg) => {
        const localMineValidData = {"return": [{}]};
        for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
          localMineValidData.return[0][minionId] = JSON.stringify(pLocalMineValidMsg);
        }
        this.updateMinions(localMineValidData);
      });
    }, (pWheelKeyListAllMsg) => {
      this._handleMineWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
    });
  }

  _handleMineWheelKeyListAll (pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelKeyListAllData)) {
      return;
    }

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(minionId, 1);

      // preliminary dropdown menu
      const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      this._addMenuItemShowMine(minionTr.dropdownmenu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        this.router.goTo("mine-minion", {"minionid": minionId});
        pClickEvent.stopPropagation();
      });
    }

    this.updateFooter();
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("mineinfo", ""));
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsMine) {
    super.updateMinion(null, pMinionId, pAllMinionsMine);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    this._addMenuItemShowMine(minionTr.dropdownmenu, pMinionId);

    if (pMinionData === null) {
      const mineInfoText = "no functions";
      const mineInfoTd = Utils.createTd("mineinfo", mineInfoText);
      mineInfoTd.setAttribute("sorttable_customkey", 0);
      minionTr.appendChild(mineInfoTd);
    } else if (typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData).length;
      const mineInfoText = Utils.txtZeroOneMany(cnt, "no functions", "{0} function", "{0} functions");
      const mineInfoTd = Utils.createTd("mineinfo", mineInfoText);
      mineInfoTd.setAttribute("sorttable_customkey", cnt);
      minionTr.appendChild(mineInfoTd);
    } else {
      const mineInfoTd = Utils.createTd("", "");
      Utils.addErrorToTableCell(mineInfoTd, pMinionData);
      minionTr.appendChild(mineInfoTd);
    }
  }

  _addMenuItemShowMine (pMenu, pMinionId) {
    pMenu.addMenuItem("Show functions", () => {
      this.router.goTo("mine-minion", {"minionid": pMinionId});
    });
  }
}
