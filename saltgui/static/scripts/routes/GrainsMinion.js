/* global document */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {Utils} from "../Utils.js";

export class GrainsMinionRoute extends PageRoute {

  constructor (pRouter) {
    super("grains-minion", "Grains", "page-grains-minion", "button-grains", pRouter);

    this._handleLocalGrainsItems = this._handleLocalGrainsItems.bind(this);

    const closeButton = document.getElementById("grains-minion-button-close");
    closeButton.addEventListener("click", () => {
      this.router.goTo("/grains");
    });

    Utils.makeTableSortable(this.getPageElement());
    Utils.makeTableSearchable(this.getPageElement(), "grains-minion-search-button", "grains-minion-table");
    Utils.makeTableSearchable(this.getPageElement(), "grains-minion-search-button-jobs", "grains-minion-jobs-table");
  }

  onShow () {
    const that = this;

    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    const titleElement = document.getElementById("grains-minion-title");
    titleElement.innerText = "Grains on " + minionId;

    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(minionId);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
      that._handleLocalGrainsItems(pLocalGrainsItemsData, minionId);
    }, (pLocalGrainsItemsMsg) => {
      that._handleLocalGrainsItems(JSON.stringify(pLocalGrainsItemsMsg), minionId);
    });

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      that.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
        that.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, (pRunnerJobsActiveMsg) => {
        that.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, (pRunnerJobsListJobsMsg) => {
      that.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    });
  }

  _handleLocalGrainsItems (pLocalGrainsItemsData, pMinionId) {
    const panel = document.getElementById("grains-minion-panel");
    const minionMenu = new DropDownMenu(panel);
    this._addMenuItemGrainsSetValAdd(minionMenu, pMinionId);
    this._addMenuItemSaltUtilRefreshGrains(minionMenu, pMinionId);

    const container = document.getElementById("grains-minion-table");

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const titleElement = document.getElementById("grains-minion-title");
    panel.insertBefore(minionMenu.menuDropdown, titleElement.nextSibling);

    const msgDiv = document.getElementById("grains-minion-msg");
    if (PageRoute.showErrorRowInstead(container.tBodies[0], pLocalGrainsItemsData, msgDiv)) {
      return;
    }

    const grains = pLocalGrainsItemsData.return[0][pMinionId];

    if (grains === undefined) {
      msgDiv.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if (grains === false) {
      msgDiv.innerText = "Minion '" + pMinionId + "' did not answer";
      return;
    }

    const grainNames = Object.keys(grains).sort();
    for (const grainName of grainNames) {
      const grainTr = document.createElement("tr");

      const grainNameTd = Route.createTd("grain-name", grainName);
      grainTr.appendChild(grainNameTd);

      const grainValue = Output.formatObject(grains[grainName]);

      const grainMenu = new DropDownMenu(grainTr);
      this._addMenuItemGrainsSetValUpdate(grainMenu, pMinionId, grainName, grains);
      this._addMenuItemGrainsAppendWhenNeeded(grainMenu, pMinionId, grainName, grainValue);
      this._addMenuItemGrainsDelKey(grainMenu, pMinionId, grainName);
      this._addMenuItemGrainsDelVal(grainMenu, pMinionId, grainName);

      // menu comes before this data on purpose
      const grainValueTd = Route.createTd("grain-value", grainValue);
      grainTr.appendChild(grainValueTd);

      container.tBodies[0].appendChild(grainTr);

      grainTr.addEventListener("click", (pClickEvent) => {
        this.runCommand(pClickEvent, pMinionId, "grains.setval \"" + grainName + "\" " + JSON.stringify(grains[grainName]));
      });
    }

    const txt = Utils.txtZeroOneMany(grainNames.length,
      "No grains", "{0} grain", "{0} grains");
    msgDiv.innerText = txt;
  }

  _addMenuItemGrainsSetValAdd (pMenu, pMinionId) {
    pMenu.addMenuItem("Add&nbsp;grain...", (pClickEvent) => {
      // use placeholders for name and value
      this.runCommand(pClickEvent, pMinionId, "grains.setval <name> <value>");
    });
  }

  _addMenuItemSaltUtilRefreshGrains (pMenu, pMinionId) {
    pMenu.addMenuItem("Refresh&nbsp;grains...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "saltutil.refresh_grains");
    });
  }

  _addMenuItemGrainsSetValUpdate (pMenu, pMinionId, key, grains) {
    pMenu.addMenuItem("Edit&nbsp;grain...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId,
        "grains.setval \"" + key + "\" " + JSON.stringify(grains[key]));
    });
  }

  _addMenuItemGrainsAppendWhenNeeded (pMenu, pMinionId, key, pGrainValue) {
    if (!pGrainValue.startsWith("[")) {
      return;
    }
    pMenu.addMenuItem("Add&nbsp;value...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "grains.append \"" + key + "\" <value>");
    });
  }

  _addMenuItemGrainsDelKey (pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;key...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "grains.delkey \"" + key + "\"");
    });
  }

  _addMenuItemGrainsDelVal (pMenu, pMinionId, key) {
    pMenu.addMenuItem("Delete&nbsp;value...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "grains.delval \"" + key + "\"");
    });
  }
}
