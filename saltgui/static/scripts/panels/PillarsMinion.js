/* global console document */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {OutputYaml} from "../output/OutputYaml.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class PillarsMinionPanel extends Panel {

  constructor () {
    super("pillars-minion");

    this.addTitle("Pillars on ...");
    this.addPanelMenu();
    this.addSearchButton();
    this.addCloseButton();
    this.addTable(["Name", "Value"]);
    this.setTableSortable("Name", "asc");
    this.addMsg();
  }

  onShow () {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    this.updateTitle("Pillars on " + minionId);

    const localPillarItemsPromise = this.api.getLocalPillarItems(minionId);

    localPillarItemsPromise.then((pLocalPillarItemsData) => {
      this._handleLocalPillarItems(pLocalPillarItemsData, minionId);
    }, (pLocalPillarItemsMsg) => {
      this._handleLocalPillarItems(JSON.stringify(pLocalPillarItemsMsg), minionId);
    });
  }

  _handleLocalPillarItems (pLocalPillarItemsData, pMinionId) {
    const panel = document.getElementById("pillars-minion-panel");
    const menu = new DropDownMenu(panel);
    this._addMenuItemSaltUtilRefreshPillar(menu, pMinionId);

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const titleElement = document.getElementById("pillars-minion-title");
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);

    if (this.showErrorRowInstead(pLocalPillarItemsData)) {
      return;
    }

    const pillars = pLocalPillarItemsData.return[0][pMinionId];

    const msgDiv = this.div.querySelector(".msg");
    if (pillars === undefined) {
      msgDiv.innerText = "Unknown minion '" + pMinionId + "'";
      return;
    }
    if (pillars === false) {
      msgDiv.innerText = "Minion '" + pMinionId + "' did not answer";
      return;
    }

    // collect the public pillars and compile their regexps
    const publicPillarsText = Utils.getStorageItem("session", "public_pillars", "[]");
    let publicPillars = JSON.parse(publicPillarsText);
    if (!Array.isArray(publicPillars)) {
      publicPillars = [];
    }
    for (let i = 0; i < publicPillars.length; i++) {
      try {
        publicPillars[i] = new RegExp(publicPillars[i]);
      } catch (err) {
        // most likely a syntax error in the RE
        console.error("error in regexp saltgui_public_pillars[" + i + "]=" + OutputYaml.formatYAML(publicPillars[i]) + " --> " + err.name + ": " + err.message);
        publicPillars[i] = null;
      }
    }

    const keys = Object.keys(pillars).sort();
    for (const pillarName of keys) {
      const pillar = document.createElement("tr");

      const nameTd = Utils.createTd("pillar-name", pillarName);
      pillar.appendChild(nameTd);

      // menu comes before this data if there was any

      const pillarValueTd = Utils.createTd("", "");

      // 25CF = BLACK CIRCLE, 8 of these
      const pillarValueHidden = "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF";
      const pillarHiddenDiv = Utils.createDiv("pillar-hidden", pillarValueHidden);
      pillarHiddenDiv.style.display = "inline-block";
      Utils.addToolTip(pillarHiddenDiv, "Click to show");
      // initially use the hidden view
      pillarValueTd.appendChild(pillarHiddenDiv);

      const pillarValueShown = Output.formatObject(pillars[pillarName]);
      const pillarShownDiv = Utils.createDiv("pillar-shown", pillarValueShown);
      // initially hide the normal view
      pillarShownDiv.style.display = "none";
      Utils.addToolTip(pillarShownDiv, "Click to hide");
      // add the non-masked representation, not shown yet
      pillarValueTd.appendChild(pillarShownDiv);

      // show public pillars immediatelly
      for (let i = 0; i < publicPillars.length; i++) {
        if (publicPillars[i] && publicPillars[i].test(pillarName)) {
          // same code as when clicking the hidden value
          pillarHiddenDiv.style.display = "none";
          pillarShownDiv.style.display = "inline-block";
          break;
        }
      }

      pillar.appendChild(pillarValueTd);

      pillarHiddenDiv.addEventListener("click", () => {
        pillarHiddenDiv.style.display = "none";
        pillarShownDiv.style.display = "inline-block";
      });

      pillarShownDiv.addEventListener("click", () => {
        pillarShownDiv.style.display = "none";
        pillarHiddenDiv.style.display = "inline-block";
      });

      const tbody = this.table.tBodies[0];
      tbody.appendChild(pillar);
    }

    const txt = Utils.txtZeroOneMany(keys.length,
      "No pillars", "{0} pillar", "{0} pillars");
    msgDiv.innerText = txt;
  }

  _addMenuItemSaltUtilRefreshPillar (pMenu, pMinionId) {
    pMenu.addMenuItem("Refresh&nbsp;pillar...", (pClickEvent) => {
      this.runCommand(pClickEvent, pMinionId, "saltutil.refresh_pillar");
    });
  }
}
