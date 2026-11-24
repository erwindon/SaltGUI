/* global jsonPath */

import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class GrainsPanel extends Panel {

  constructor () {
    super("grains", ["select_minions"]);

    this.addTitle("Grains");
    this.addSearchButton();
    this.addFilterButton();
    this.addHelpButton([
      "The content of specific well-known grains can be made visible in",
      "columns by configuring their name in the server-side configuration file.",
      "See README.md for more details."
    ]);
    this.addWarningField();
    this.addTable(["-select-", "-menu-", "Minion", "Status", "Salt version", "OS version", "Grains"]);

    // cannot initialize sorting before all columns are present
    // this.setTableSortable("Minion", "asc");

    this.addMsg();
  }

  onShow () {
    super.onShow();

    if (this.previewColumsAdded !== true) {
      // collect the list of displayed extra grains
      this.previewGrains = Utils.getStorageItemList("session", "preview_grains");

      // add the preview columns (before we sort the table)
      // the div is not added to the DOM yet
      const tr = this.div.querySelector("#grains-table-thead-tr");
      for (const previewGrain of this.previewGrains) {
        const previewGrainTitle = previewGrain.replace(/[=].*$/g, ""); // NOSONAR S8786
        const th = Utils.createElem("th", "", previewGrainTitle);
        tr.appendChild(th);
      }
      this.previewColumsAdded = true;
      this.setTableClickable("page");
    }

    // initialize sorting after all columns are present
    this.setTableSortable("Minion", "asc");

    const useCacheGrains = Utils.getStorageItemBoolean("session", "use_cache_for_grains", false);
    this.setWarningText("info", useCacheGrains ? "the content of this screen is based on cached grains info, minion status or grain info may not be accurate" : "");

    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localGrainsItemsPromise = useCacheGrains ? this.api.getRunnerCacheGrains(null) : this.api.getLocalGrainsItems(null);

    this.nrMinions = 0;

    wheelKeyListAllPromise.then((ok_WheelKeyListAll) => {
      this._handleGrainsWheelKeyListAll(ok_WheelKeyListAll);
      localGrainsItemsPromise.then((ok_LocalGrainsItems) => {
        this.updateMinions(ok_LocalGrainsItems);
        return true;
      }, (_error_LocalGrainsItems) => {
        const allMinionsErr = Utils.msgPerMinion(ok_WheelKeyListAll.return[0].data.return.minions, JSON.stringify(_error_LocalGrainsItems));
        this.updateMinions({"return": [allMinionsErr]});
        return false;
      });
      return true;
    }, (_error_WheelKeyListAll) => {
      this._handleGrainsWheelKeyListAll(JSON.stringify(_error_WheelKeyListAll));
      Utils.ignorePromise(localGrainsItemsPromise);
      return false;
    });
  }

  _handleGrainsWheelKeyListAll (pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelKeyListAllData)) {
      return;
    }

    const keys = pWheelKeyListAllData.return[0].data.return;
    this.nrMinions = keys.minions.length;
    this.nrUnaccepted = keys.minions_pre.length;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      const minionTr = this.addMinion(minionId, this.previewGrains.length);

      // preliminary dropdown menu
      this._addMenuItemShowGrains(minionTr.dropdownmenu, minionId);

      for (let i = 0; i < this.previewGrains.length; i++) { // NOSONAR S4138
        minionTr.appendChild(Utils.createTd());
      }

      minionTr.addEventListener("click", (pClickEvent) => {
        this.router.goTo("grains-minion", {"minionid": minionId}, undefined, pClickEvent);
        pClickEvent.stopPropagation();
      });
    }

    this.updateFooter();
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    super.updateOfflineMinion(pMinionId, pMinionsDict);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    // force same columns on all rows
    minionTr.appendChild(Utils.createTd("saltversion"));
    minionTr.appendChild(Utils.createTd("os"));
    minionTr.appendChild(Utils.createTd("graininfo"));
    for (let i = 0; i < this.previewGrains.length; i++) { // NOSONAR S4138
      minionTr.appendChild(Utils.createTd());
    }
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    GrainsPanel._addGrainInfoTd(pMinionData, minionTr);
    this._addMenuItemShowGrains(minionTr.dropdownmenu, pMinionId);
    this._addPreviewGrainTds(pMinionData, minionTr);
  }

  static _addGrainInfoTd (pMinionData, minionTr) {
    const grainInfoTd = Utils.createTd();
    if (typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData).length;
      const grainInfoText = cnt + " grains";
      grainInfoTd.classList.add("graininfo");
      grainInfoTd.innerText = grainInfoText;
      grainInfoTd.setAttribute("sorttable_customkey", cnt);
    } else {
      Utils.addErrorToTableCell(grainInfoTd, pMinionData);
    }
    minionTr.appendChild(grainInfoTd);
  }

  _addPreviewGrainTds (pMinionData, minionTr) {
    // add the preview columns
    for (const previewGrain of this.previewGrains) {
      const td = Utils.createTd();
      if (typeof pMinionData === "object") {
        GrainsPanel._populatePreviewGrainTd(td, previewGrain, pMinionData);
      } else {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      minionTr.appendChild(td);
    }
  }

  static _populatePreviewGrainTd (td, previewGrain, pMinionData) {
    const previewGrainValue = previewGrain.replace(/^[^=]*=/g, "");
    if (previewGrainValue.startsWith("$")) {
      // it is a json path
      GrainsPanel._populateJsonPathGrainTd(td, previewGrainValue, pMinionData);
    } else {
      // a plain grain-name or a path in the grains.get style
      GrainsPanel._populateNamedGrainTd(td, previewGrainValue, pMinionData);
    }
  }

  static _populateJsonPathGrainTd (td, previewGrainValue, pMinionData) {
    const obj = jsonPath(pMinionData, previewGrainValue);
    if (Array.isArray(obj)) {
      td.innerText = Output.formatObject(obj[0]);
      td.classList.add("grain-value");
    }
  }

  static _populateNamedGrainTd (td, previewGrainValue, pMinionData) {
    const grainNames = previewGrainValue.split(":");
    let obj = pMinionData;
    for (const grainName of grainNames) {
      if (obj) {
        obj = obj[grainName];
      }
    }
    if (obj) {
      td.innerText = Output.formatObject(obj);
      td.classList.add("grain-value");
    }
  }

  _addMenuItemShowGrains (pMenu, pMinionId) {
    pMenu.addMenuItemCmd("Show grains", (pClickEvent) => {
      this.router.goTo("grains-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }
}
