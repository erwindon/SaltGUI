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
    this._addPanelMenuItemGrainsSetValAdd();
    this._addPanelMenuItemSaltUtilRefreshGrains();

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
    if (this.showErrorRowInstead(pLocalGrainsItemsData)) {
      return;
    }

    const grains = pLocalGrainsItemsData.return[0][pMinionId];
    if (this.showErrorRowInstead(grains)) {
      return;
    }

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

      const grainMenu = new DropDownMenu(grainTr, true);
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
        const cmdArr = ["grains.setval", grainName, grains[grainName]];
        this.runCommand("", pMinionId, cmdArr);
        pClickEvent.stopPropagation();
      });
    }

    const txt = Utils.txtZeroOneMany(grainNames.length,
      "No grains", "{0} grain", "{0} grains");
    this.setMsg(txt);
  }

  _addPanelMenuItemGrainsSetValAdd () {
    this.panelMenu.addMenuItem("Add grain...", () => {
      // use placeholders for name and value
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["grains.setval", "<name>", "<value>"];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addPanelMenuItemSaltUtilRefreshGrains () {
    this.panelMenu.addMenuItem("Refresh grains...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["saltutil.refresh_grains"];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addMenuItemGrainsSetValUpdate (pMenu, pMinionId, key, grains) {
    pMenu.addMenuItem("Edit grain...", () => {
      const cmdArr = ["grains.setval", key, grains[key]];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemGrainsAppendWhenNeeded (pMenu, pMinionId, key, pGrainValue) {
    if (!pGrainValue.startsWith("[")) {
      return;
    }
    pMenu.addMenuItem("Add value...", () => {
      const cmdArr = ["grains.append", key, "<value>"];
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemGrainsDelKey (pMenu, pMinionId, pKey, pValue) {
    const cmdArr = ["grains.delkey"];
    if (typeof pValue === "object") {
      cmdArr.push("force=", true);
    }
    cmdArr.push(pKey);
    pMenu.addMenuItem("Delete key...", () => {
      this.runCommand("", pMinionId, cmdArr);
    });
  }

  _addMenuItemGrainsDelVal (pMenu, pMinionId, pKey, pValue) {
    const cmdArr = ["grains.delval"];
    if (typeof pValue === "object") {
      cmdArr.push("force=", true);
    }
    cmdArr.push(pKey);
    pMenu.addMenuItem("Delete value...", () => {
      this.runCommand("", pMinionId, cmdArr);
    });
  }
}
