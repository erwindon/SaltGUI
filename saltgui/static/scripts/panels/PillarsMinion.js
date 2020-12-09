/* global console document */

import {Character} from "../Character.js";
import {Output} from "../output/Output.js";
import {OutputYaml} from "../output/OutputYaml.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class PillarsMinionPanel extends Panel {

  constructor () {
    super("pillars-minion");

    this.addTitle("Pillars on ...");
    this.addPanelMenu();
    this._addMenuItemSaltUtilRefreshPillar();
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
      return true;
    }, (pLocalPillarItemsMsg) => {
      this._handleLocalPillarItems(JSON.stringify(pLocalPillarItemsMsg), minionId);
      return false;
    });
  }

  _handleLocalPillarItems (pLocalPillarItemsData, pMinionId) {
    if (this.showErrorRowInstead(pLocalPillarItemsData, pMinionId)) {
      return;
    }

    const pillars = pLocalPillarItemsData.return[0][pMinionId];

    if (pillars === undefined) {
      this.setMsg("Unknown minion '" + pMinionId + "'");
      return;
    }
    if (pillars === false) {
      this.setMsg("Minion '" + pMinionId + "' did not answer");
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

      const pillarValueTd = Utils.createTd();

      const pillarValueHidden = Character.BLACK_CIRCLE.repeat(8);
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
    this.setMsg(txt);
  }

  _addMenuItemSaltUtilRefreshPillar () {
    this.panelMenu.addMenuItem("Refresh pillar...", (pClickEvent) => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      this.runCommand(pClickEvent, minionId, "saltutil.refresh_pillar");
    });
  }
}
