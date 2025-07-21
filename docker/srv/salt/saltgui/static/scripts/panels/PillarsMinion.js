/* global */

import {Character} from "../Character.js";
import {Output} from "../output/Output.js";
import {OutputYaml} from "../output/OutputYaml.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class PillarsMinionPanel extends Panel {

  constructor () {
    super("pillars-minion");

    this.addTitle("Pillars on " + Character.HORIZONTAL_ELLIPSIS);
    this.addPanelMenu();
    this._addPanelMenuItemSaltUtilRefreshPillar();
    this.addSearchButton();
    if (Utils.getQueryParam("popup") !== "true") {
      this.addCloseButton();
    }
    this.addHelpButton([
      "The content of specific well-known pillar values can be made visible",
      "automatically by configuring their name in the server-side configuration file.",
      "See README.md for more details."
    ]);
    this.addWarningField();
    this.addTable(["Name", "Value"]);
    this.setTableSortable("Name", "asc");
    this.addMsg();
  }

  onShow () {
    const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));

    this.updateTitle("Pillars on " + minionId);

    const useCachePillar = Utils.getStorageItemBoolean("session", "use_cache_for_pillar", false);
    this.setWarningText("info", useCachePillar ? "the content of this screen is based on cached grains info, minion status or pillar info may not be accurate" : "");

    const localPillarItemsPromise = useCachePillar ? this.api.getRunnerCachePillar(minionId) : this.api.getLocalPillarItems(minionId);

    localPillarItemsPromise.then((pLocalPillarItemsData) => {
      this._handleLocalPillarItems(pLocalPillarItemsData, minionId);
      return true;
    }, (pLocalPillarItemsMsg) => {
      this._handleLocalPillarItems(JSON.stringify(pLocalPillarItemsMsg), minionId);
      return false;
    });
  }

  _handleLocalPillarItems (pLocalPillarItemsData, pMinionId) {
    if (this.showErrorRowInstead(pLocalPillarItemsData)) {
      return;
    }

    const pillars = pLocalPillarItemsData.return[0][pMinionId];
    if (this.showErrorRowInstead(pillars)) {
      return;
    }

    if (pillars === undefined) {
      this.setMsg("Unknown minion '" + pMinionId + "'");
      return;
    }
    if (pillars === false) {
      this.setMsg("Minion '" + pMinionId + "' did not answer");
      return;
    }

    // collect the public pillars and compile their regexps
    const publicPillars = Utils.getStorageItemList("session", "public_pillars");
    for (let i = 0; i < publicPillars.length; i++) {
      try {
        publicPillars[i] = new RegExp(publicPillars[i]);
      } catch (err) {
        // most likely a syntax error in the RE
        Utils.error("error in regexp saltgui_public_pillars[" + i + "]=" + OutputYaml.formatYAML(publicPillars[i]) + " --> " + err.name + ": " + err.message);
        publicPillars[i] = null;
      }
    }

    const keys = Object.keys(pillars).sort();
    for (const pillarName of keys) {
      const pillar = Utils.createTr();

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
      for (const publicPillar of publicPillars) {
        if (publicPillar && publicPillar.test(pillarName)) {
          // same code as when clicking the hidden value
          pillarHiddenDiv.style.display = "none";
          pillarShownDiv.style.display = "inline-block";
          break;
        }
      }

      pillar.appendChild(pillarValueTd);

      pillarHiddenDiv.addEventListener("click", (pClickEvent) => {
        pillarHiddenDiv.style.display = "none";
        pillarShownDiv.style.display = "inline-block";
        pClickEvent.stopPropagation();
      });

      pillarShownDiv.addEventListener("click", (pClickEvent) => {
        pillarShownDiv.style.display = "none";
        pillarHiddenDiv.style.display = "inline-block";
        pClickEvent.stopPropagation();
      });

      const tbody = this.table.tBodies[0];
      tbody.appendChild(pillar);
    }

    const txt = Utils.txtZeroOneMany(keys.length,
      "No pillars", "{0} pillar", "{0} pillars");
    this.setMsg(txt);
  }

  _addPanelMenuItemSaltUtilRefreshPillar () {
    this.panelMenu.addMenuItem("Refresh pillar...", () => {
      const minionId = decodeURIComponent(Utils.getQueryParam("minionid"));
      const cmdArr = ["saltutil.refresh_pillar"];
      this.runCommand("", minionId, cmdArr);
    });
  }
}
