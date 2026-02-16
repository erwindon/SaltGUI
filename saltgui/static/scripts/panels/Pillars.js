/* global */

import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class PillarsPanel extends Panel {

  constructor () {
    super("pillars");

    this.addTitle("Pillars");
    this.addSearchButton();
    this.addWarningField();
    this.addTable(["-menu-", "Minion", "Status", "Pillars"]);
    this.setTableSortable("Minion", "asc");
    this.setTableClickable("page");
    this.addMsg();
  }

  onShow () {
    const useCachePillar = Utils.getStorageItemBoolean("session", "use_cache_for_pillar", false);
    this.setWarningText("info", useCachePillar ? "the content of this screen is based on cached grains info, minion status or pillar info may not be accurate" : "");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localPillarObfuscatePromise = useCachePillar ? this.api.getRunnerCachePillar(null) : this.api.getLocalPillarObfuscate(null);

    this.nrMinions = 0;

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
    this.nrMinions = keys.minions.length;
    this.nrUnaccepted = keys.minions_pre.length;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId);

      // preliminary dropdown menu
      this._addMenuItemShowPillars(minionTr.dropdownmenu, minionId);

      minionTr.addEventListener("click", (pClickEvent) => {
        this.router.goTo("pillars-minion", {"minionid": minionId}, undefined, pClickEvent);
        pClickEvent.stopPropagation();
      });
    }

    this.updateFooter();
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("pillarinfo"));
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

    this._addMenuItemShowPillars(minionTr.dropdownmenu, pMinionId);
  }

  _addMenuItemShowPillars (pMenu, pMinionId) {
    pMenu.addMenuItemCmd("Show pillars", (pClickEvent) => {
      this.router.goTo("pillars-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }
}
