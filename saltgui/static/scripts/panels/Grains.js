/* global jsonPath */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class GrainsPanel extends Panel {

  constructor () {
    super("grains");

    this.addTitle("Grains");
    this.addSearchButton();
    this.addHelpButton([
      "The content of specific well-known grains can be made visible in",
      "columns by configuring their name in the server-side configuration file.",
      "See README.md for more details."
    ]);
    this.addWarningField();
    this.addTable(["Minion", "Status", "Salt version", "OS version", "Grains", "-menu-"]);

    // cannot initialize sorting before all columns are present
    // this.setTableSortable("Minion", "asc");

    this.addMsg();
  }

  onShow () {
    if (this.previewColumsAdded !== true) {
      // collect the list of displayed extra grains
      this.previewGrains = Utils.getStorageItemList("session", "preview_grains");

      // add the preview columns (before we sort the table)
      // the div is not added to the DOM yet
      const tr = this.div.querySelector("#grains-table-thead-tr");
      for (const previewGrain of this.previewGrains) {
        const previewGrainTitle = previewGrain.replaceAll(/[=].*$/g, "");
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

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleGrainsWheelKeyListAll(pWheelKeyListAllData);
      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
        return true;
      }, (pLocalGrainsItemsMsg) => {
        const allMinionsErr = Utils.msgPerMinion(pWheelKeyListAllData.return[0].data.return.minions, JSON.stringify(pLocalGrainsItemsMsg));
        this.updateMinions({"return": [allMinionsErr]});
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleGrainsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
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
      const minionTr = this.addMinion(minionId, 1 + this.previewGrains.length);

      // preliminary dropdown menu
      const menu = new DropDownMenu(minionTr, true);
      this._addMenuItemShowGrains(menu, minionId);

      for (let i = 0; i < this.previewGrains.length; i++) {
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
    minionTr.appendChild(Utils.createTd("run-command-button"));
    for (let i = 0; i < this.previewGrains.length; i++) {
      minionTr.appendChild(Utils.createTd());
    }
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {
    super.updateMinion(pMinionData, pMinionId, pAllMinionsGrains);

    const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));

    if (typeof pMinionData === "object") {
      const cnt = Object.keys(pMinionData).length;
      const grainInfoText = cnt + " grains";
      const grainInfoTd = Utils.createTd("graininfo", grainInfoText);
      grainInfoTd.setAttribute("sorttable_customkey", cnt);
      minionTr.appendChild(grainInfoTd);
    } else {
      const grainInfoTd = Utils.createTd();
      Utils.addErrorToTableCell(grainInfoTd, pMinionData);
      minionTr.appendChild(grainInfoTd);
    }

    const menu = new DropDownMenu(minionTr, true);
    this._addMenuItemShowGrains(menu, pMinionId);

    // add the preview columns
    /* eslint-disable max-depth */
    for (const previewGrain of this.previewGrains) {
      const td = Utils.createTd();
      if (typeof pMinionData === "object") {
        const previewGrainValue = previewGrain.replaceAll(/^[^=]*=/g, "");
        if (previewGrainValue.startsWith("$")) {
          // it is a json path
          const obj = jsonPath(pMinionData, previewGrainValue);
          if (Array.isArray(obj)) {
            td.innerText = Output.formatObject(obj[0]);
            td.classList.add("grain-value");
          }
        } else {
          // a plain grain-name or a path in the grains.get style
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
      } else {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      minionTr.appendChild(td);
    }
    /* eslint-enable max-depth */
  }

  _addMenuItemShowGrains (pMenu, pMinionId) {
    pMenu.addMenuItem("Show grains", (pClickEvent) => {
      this.router.goTo("grains-minion", {"minionid": pMinionId}, undefined, pClickEvent);
    });
  }
}
