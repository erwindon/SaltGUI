/* global document jsonPath */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class GrainsPanel extends Panel {

  constructor () {
    super("grains");

    this.addTitle("Grains");
    this.addSearchButton();
    // TODO extra columns
    this.addHelpButton([
      "The content of specific well-known grains can be made visible in",
      "columns by configuring their name in the server-side configuration file.",
      "See README.md for more details."
    ]);
    this.addTable(["Minion", "Status", "Salt version", "OS version", "Grains", "-menu-"]);
    this.setTableClickable();

    // collect the list of displayed extra grains
    const previewGrainsText = Utils.getStorageItem("session", "preview_grains", "[]");
    this.previewGrains = JSON.parse(previewGrainsText);
    if (!Array.isArray(this.previewGrains)) {
      // TODO: msg
      this.previewGrains = [];
    }

    // add the preview columns (before we sort the table)
    // the div is not added to the DOM yet
    const tr = this.div.querySelector("#grains-table-thead-tr");
    for (let i = 0; i < this.previewGrains.length; i++) {
      const th = document.createElement("th");
      th.innerText = this.previewGrains[i];
      tr.appendChild(th);
    }

    this.setTableSortable("Minion", "asc");
    this.addMsg();
  }

  onShow () {
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.api.getLocalGrainsItems(null);

    wheelKeyListAllPromise.then((pWheelKeyListAllData) => {
      this._handleGrainsWheelKeyListAll(pWheelKeyListAllData);
      localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
        this.updateMinions(pLocalGrainsItemsData);
        return true;
      }, (pLocalGrainsItemsMsg) => {
        const localGrainsItemsData = {"return": [{}]};
        for (const minionId of pWheelKeyListAllData.return[0].data.return.minions) {
          localGrainsItemsData.return[0][minionId] = JSON.stringify(pLocalGrainsItemsMsg);
        }
        this.updateMinions(localGrainsItemsData);
        return false;
      });
      return true;
    }, (pWheelKeyListAllMsg) => {
      this._handleGrainsWheelKeyListAll(JSON.stringify(pWheelKeyListAllMsg));
      return false;
    });
  }

  _handleGrainsWheelKeyListAll (pWheelKeyListAllData) {
    if (this.showErrorRowInstead(pWheelKeyListAllData)) {
      return;
    }

    const keys = pWheelKeyListAllData.return[0].data.return;

    const minionIds = keys.minions.sort();
    for (const minionId of minionIds) {
      this.addMinion(minionId, 1 + this.previewGrains.length);

      // preliminary dropdown menu
      const minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(minionId));
      const menu = new DropDownMenu(minionTr);
      this._addMenuItemShowGrains(menu, minionId);

      for (let i = 0; i < this.previewGrains.length; i++) {
        minionTr.appendChild(Utils.createTd());
      }

      minionTr.addEventListener("click", () => {
        this.router.goTo("grains-minion", {"minionid": minionId});
      });
    }

    Utils.setStorageItem("session", "minions_pre_length", keys.minions_pre.length);

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

    const menu = new DropDownMenu(minionTr);
    this._addMenuItemShowGrains(menu, pMinionId);

    // add the preview columns
    /* eslint-disable max-depth */
    for (let i = 0; i < this.previewGrains.length; i++) {
      const td = Utils.createTd();
      const grainName = this.previewGrains[i];
      if (typeof pMinionData === "object") {
        if (grainName.startsWith("$")) {
          // it is a json path
          const obj = jsonPath(pMinionData, grainName);
          if (Array.isArray(obj)) {
            td.innerText = Output.formatObject(obj[0]);
            td.classList.add("grain-value");
          }
        } else {
          // a plain grain-name or a path in the grains.get style
          const grainNames = grainName.split(":");
          let obj = pMinionData;
          for (const gn of grainNames) {
            if (obj) {
              obj = obj[gn];
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
    pMenu.addMenuItem("Show grains", () => {
      this.router.goTo("grains-minion", {"minionid": pMinionId});
    });
  }
}
