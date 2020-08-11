/* global document */

import {Character} from "../Character.js";
import {DropDownMenuCmd} from "../DropDownCmd.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class MineMinionPanel extends Panel {

  constructor () {
    super("mine-minion");

    this.addTitle("Mine on " + Character.HORIZONTAL_ELLIPSIS);
    this.addCloseButton();
    this.addPanelMenu();
    this._addMenuItemMineUpdate();
    this._addMenuItemMineFlush();
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addTable(["-menu-", "Function", "Parameters", "Data"]);
    this.addMsg();
  }

  onShow () {
    this.nrFunctions = 0;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    this.updateTitle("Mine on " + minionId);

    const localMineValidPromise = this.router.api.getLocalMineValid(minionId);

    localMineValidPromise.then((ok_LocalMineValid) => {
      this._handleLocalMineValid(ok_LocalMineValid, minionId);
    }, (_error_LocalMineValid) => {
      this._handleLocalMineValid(JSON.stringify(_error_LocalMineValid), minionId);
    });
  }

  loopInit () {
    return this.mineFunctions;
  }

  loopItem (pMineId) {
    const tr = document.getElementById("mine." + pMineId);

    const detailsField = tr.querySelector("td.function-data");
    detailsField.classList.add("no-status");
    detailsField.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;

    return this._getMineDetails(detailsField, pMineId);
  }

  loopEnd () {
    this.updateFooter();
  }

  updateFooter () {
    const txt = Utils.txtZeroOneMany(this.nrFunctions, "No functions", "{0} function", "{0} functions");
    super.updateFooter(txt);
  }

  _getMineDetails (pDetailsField, pMineId) {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
    // we ask what the minion known about itself
    // we just assume that the master and all minions are synchronized with that
    const localMineGetPromise = this.router.api.getLocalMineGet(minionId, minionId, pMineId);

    return localMineGetPromise.then((ok_LocalMineGet) => {
      MineMinionPanel._handleLocalMineGet(pDetailsField, ok_LocalMineGet.return[0][minionId]);
      // the other functions are independent, continue with them
      return true;
    }, (_error_LocalMineGet) => {
      MineMinionPanel._handleLocalMineGet(pDetailsField, JSON.stringify(_error_LocalMineGet));
      // the other functions are independent, continue with them
      return true;
    });
  }

  static _handleLocalMineGet (pDetailsField, pLocalMineGetData) {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
    let data = pLocalMineGetData[minionId];
    if (data === undefined) {
      pDetailsField.innerText = "(none)";
      pDetailsField.classList.add("value-none");
    } else {
      pDetailsField.innerText = Output.formatObject(data);
      pDetailsField.classList.remove("value-none");
    }
  }

  _handleLocalMineValid (pLocalMineValidData, pMinionId) {
    if (this.showErrorRowInstead(pLocalMineValidData)) {
      return;
    }

    let mine = pLocalMineValidData.return[0][pMinionId];
    if (mine === null) {
      mine = {};
    }

    if (mine === undefined) {
      this.setMsgTxt("Unknown minion '" + pMinionId + "'");
      return;
    }
    if (mine === false) {
      this.setMsgTxt("Minion '" + pMinionId + "' did not answer");
      return;
    }
    const mineNames = Object.keys(mine).sort(Utils.mySortFunction);
    this.nrFunctions = mineNames.length;
    this.mineFunctions = mineNames;
    for (const mineName of mineNames) {
      const mineTr = document.createElement("tr");
      mineTr.id = "mine." + mineName;

      const menuTd = Utils.createTd();
      const menu = new DropDownMenuCmd(menuTd, "smaller");
      mineTr.dropdownmenu = menu;
      mineTr.appendChild(menuTd);

      const mineNameTd = Utils.createTd("mine-name", mineName);
      mineTr.appendChild(mineNameTd);

      let parameters = mine[mineName];
      if (Array.isArray(parameters) && parameters.length === 1) {
        parameters = parameters[0];
      }
      const functionParameter = Output.formatObject(parameters);

      this._addMenuItemMineDelete(mineTr.dropdownmenu, pMinionId, mineName);

      // menu comes before this data on purpose
      const functionParameterTd = Utils.createTd("function-parameter", functionParameter);
      mineTr.appendChild(functionParameterTd);

      const functionDataTd = Utils.createTd("function-data", "(click)");
      mineTr.appendChild(functionDataTd);

      this.table.tBodies[0].appendChild(mineTr);
    }

    // find the details of the functions one-by-one
    this.startLoop(this, 1000);
  }

  _addMenuItemMineFlush () {
    this.panelMenu.addMenuItemCmd("Flush...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["mine.flush"];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addMenuItemMineUpdate () {
    this.panelMenu.addMenuItemCmd("Update...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["mine.update"];
      this.runCommand("", minionId, cmdArr);
    });
  }

  _addMenuItemMineDelete (pMenu, pMinionId, pKey) {
    pMenu.addMenuItemCmd("Delete key...", () => {
      const cmdArr = ["mine.delete", pKey];
      this.runCommand("", pMinionId, cmdArr);
    });
  }
}
