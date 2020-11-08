/* global document */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class GrainsMinionPanel extends Panel {

  constructor () {
    super("grains-minion");

    this.addTitle("Grains on ...");
    this.addPanelMenu();
    this.addSearchButton();
    this.addCloseButton();
    this.addTable(["Name", "-menu-", "Value"]);
    this.setTableSortable("Name", "asc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    this.updateTitle("Grains on " + minionId);

    const localGrainsItemsPromise = this.api.getLocalGrainsItems(minionId);

    localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
      this._handleLocalGrainsItems(pLocalGrainsItemsData, minionId);
      return true;
    }, (pLocalGrainsItemsMsg) => {
      this._handleLocalGrainsItems(JSON.stringify(pLocalGrainsItemsMsg), minionId);
      return false;
    });
  }

  _handleLocalGrainsItems (pLocalGrainsItemsData, pMinionId) {
    this._addMenuItemGrainsSetValAdd(pMinionId);
    this._addMenuItemSaltUtilRefreshGrains(pMinionId);

    if (this.showErrorRowInstead(pLocalGrainsItemsData)) {
      return;
    }

    const grains = pLocalGrainsItemsData.return[0][pMinionId];

    if (grains === undefined) {
      this.setMsg("Unknown minion '" + pMinionId + "'");
      return;
    }
    if (grains === false) {
      this.setMsg("Minion '" + pMinionId + "' did not answer");
      return;
    }

    const grainNames = Object.keys(grains).sort();
    for (const grainName of grainNames) {
      const grainTr = document.createElement("tr");

      const grainNameTd = Utils.createTd("grain-name", grainName);
      grainTr.appendChild(grainNameTd);

      const grainValue = Output.formatObject(grains[grainName]);

      const grainMenu = new DropDownMenu(grainTr);
      this._addMenuItemGrainsSetValUpdate(grainMenu, pMinionId, grainName, grains);
      this._addMenuItemGrainsAppendWhenNeeded(grainMenu, pMinionId, grainName, grainValue);
      this._addMenuItemGrainsDelKey(grainMenu, pMinionId, grainName, grains[grainName]);
      this._addMenuItemGrainsDelVal(grainMenu, pMinionId, grainName, grains[grainName]);

      // menu comes before this data on purpose
      const grainValueTd = Utils.createTd("grain-value", grainValue);
      grainTr.appendChild(grainValueTd);

      const tbody = this.table.tBodies[0];
      tbody.appendChild(grainTr);

      grainTr.addEventListener("click", (pClickEvent) => {
        this.runCommand(pClickEvent, pMinionId, "grains.setval " + JSON.stringify(grainName) + " " + JSON.stringify(grains[grainName]));
      });
    }

    const txt = Utils.txtZeroOneMany(grainNames.length,
      "No grains", "{0} grain", "{0} grains");
    this.setMsg(txt);
  }

  _addMenuItemGrainsSetValAdd (pMinionId) {
    this.panelMenu.addMenuItem("Add grain...", (pClickEvent) => {
      // use placeholders for name and value
      this.runCommand(pClickEvent, pMinionId, "grains.setval <name> <value>");
    });
  }

  _addMenuItemSaltUtilRefreshGrains (pMinionId) {
    this.panelMenu.addMenuItem("Refresh grains...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "saltutil.refresh_grains");
    });
  }

  _addMenuItemGrainsSetValUpdate (pMenu, pMinionId, key, grains) {
    pMenu.addMenuItem("Edit grain...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId,
        "grains.setval " + JSON.stringify(key) + " " + JSON.stringify(grains[key]));
    });
  }

  _addMenuItemGrainsAppendWhenNeeded (pMenu, pMinionId, key, pGrainValue) {
    if (!pGrainValue.startsWith("[")) {
      return;
    }
    pMenu.addMenuItem("Add value...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "grains.append " + JSON.stringify(key) + " <value>");
    });
  }

  _addMenuItemGrainsDelKey (pMenu, pMinionId, pKey, pValue) {
    const forceClause = pValue !== null && typeof pValue === "object" ? " force=true" : "";
    pMenu.addMenuItem("Delete key...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "grains.delkey" + forceClause + " " + JSON.stringify(pKey));
    });
  }

  _addMenuItemGrainsDelVal (pMenu, pMinionId, pKey, pValue) {
    const forceClause = pValue !== null && typeof pValue === "object" ? " force=true" : "";
    pMenu.addMenuItem("Delete value...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "grains.delval" + forceClause + " " + JSON.stringify(pKey));
    });
  }
}
