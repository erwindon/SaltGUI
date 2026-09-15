/* global document window */

import {Character} from "../Character.js";
import {CommandBox} from "../CommandBox.js";
import {Documentation} from "../Documentation.js";
import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {ParseCommandLine} from "../ParseCommandLine.js";
import {Router} from "../Router.js";
import {RunType} from "../RunType.js";
import {TargetType} from "../TargetType.js";
import {TemplatesPanel} from "./Templates.js";
import {Utils} from "../Utils.js";

export class ManualRunPanel extends Panel {

  constructor () {
    super("manualrun");

    this.addTitle("Manual Run");
    this.addPanelMenu();

    this.addCloseButton(() => {
      CommandBox.hideManualRun();
    });

    this.addHelpButton([
      "Click for help"
    ]);

    const templateCatDiv = Utils.createDiv("", "", "template-catmenu-here");
    this.div.appendChild(templateCatDiv);

    const templateTmplDiv = Utils.createDiv("", "", "template-tmplmenu-here");
    this.div.appendChild(templateTmplDiv);

    const targetBox = Utils.createDiv("", "", "target-box");
    const targetInput = Utils.createElem("input", "", "", "target");
    targetInput.setAttribute("type", "text");
    targetInput.setAttribute("placeholder", "Target");
    targetInput.setAttribute("spellcheck", "false");
    targetInput.setAttribute("list", "data-list-target");
    targetInput.style.marginRight = "10px";
    targetBox.appendChild(targetInput);
    this.div.appendChild(targetBox);
    this.targetField = targetInput;

    const cmdBox = Utils.createDiv("", "", "cmd-box");
    const cmdInput = Utils.createElem("input", "", "", "command");
    cmdInput.setAttribute("type", "text");
    cmdInput.setAttribute("placeholder", "Command");
    cmdInput.setAttribute("spellcheck", "false");
    cmdInput.style.marginRight = "10px";
    cmdBox.appendChild(cmdInput);
    this.div.appendChild(cmdBox);
    this.commandField = cmdInput;
    this.cmdmenu = new DropDownMenu(cmdBox);

    const runBlock = Utils.createDiv("", "", "run-block");
    const runButton = Utils.createElem("input", "", "", "run-command");
    runButton.setAttribute("type", "submit");
    runButton.value = "Run command";
    runButton.style.marginRight = "10px";
    runBlock.appendChild(runButton);
    this.div.appendChild(runBlock);
    this.runButton = runButton;

    const outputPre = Utils.createElem("pre", "output", "Waiting for command...", "popup-output");
    this.div.appendChild(outputPre);
    this.outputPre = outputPre;

    this._registerEventListeners();
  }

  _registerEventListeners () {
    this.targetField.addEventListener("input", () => {
      if (this.targetField.value === "##connected") {
        this.targetField.value = Utils.getStorageItem("session", "connected", "");
      }
      TargetType.autoSelectTargetType(this.targetField.value);
    });

    this.commandField.addEventListener("input", () => {
      this.cmdmenu.verifyAll();
    });

    this.runButton.addEventListener("click", (pClickEvent) => {
      this._onRun();
      pClickEvent.stopPropagation();
    });

    this.helpButton.addEventListener("click", (pClickEvent) => {
      CommandBox._showHelp();
      pClickEvent.stopPropagation();
    });
  }

  onShow () {
    if (!RunType.menuRunType) {
      RunType.createMenu();
    }
    if (!TargetType.menuTargetType) {
      TargetType.createMenu();
    }

    this.outputPre.innerText = "Waiting for command" + Character.HORIZONTAL_ELLIPSIS;

    if (Router.currentPage.path === "manualrun") {
      this.closeButton.style.display = "none";
    } else {
      this.closeButton.style.display = "";
    }

    TargetType.autoSelectTargetType(this.targetField.value);

    RunType.setRunTypeDefault();

    ManualRunPanel._populateTargetDataList();
    this._populateTemplateCatMenu();
    this._populateTemplateTmplMenu();
    this._populateTestProviders();

    let lst = null;
    switch (window.location.hash) {
    case "#minions":
    case "#grains":
    case "#pillars":
    case "#beacons":
    case "#schedules":
    case "#highstate":
      lst = ManualRunPanel._getSelectedItemList(["select_minions"]);
      break;
    case "#keys":
      lst = ManualRunPanel._getSelectedItemList(["select_keys"]);
      break;
    case "#nodegroups":
      lst = ManualRunPanel._getSelectedItemList(["select_minions", "select_nodegroups"]);
      break;
    }

    if (lst) {
      this.targetField.value = lst;
      TargetType.autoSelectTargetType(lst);
    }

    this.commandField.focus();
    this.targetField.focus();
  }

  onHide () {
    this.closeButton.style.display = "";
    RunType.setRunTypeDefault();
    TargetType.setTargetTypeDefault();
  }

  static _populateTargetDataList () {
    const targetList = document.getElementById("data-list-target");
    while (targetList.firstChild) {
      targetList.firstChild.remove();
    }

    const optionConnected = Utils.createElem("option");
    optionConnected.value = "##connected";
    targetList.appendChild(optionConnected);

    const nodeGroups = Utils.getStorageItemObject("session", "nodegroups");
    for (const nodeGroup of Object.keys(nodeGroups).sort(Utils.mySortFunction)) {
      const option = Utils.createElem("option");
      option.value = "#" + nodeGroup;
      targetList.appendChild(option);
    }

    const minions = Utils.getStorageItemList("session", "minions");
    for (const minionId of [...minions].sort(Utils.mySortFunction)) {
      const option = Utils.createElem("option");
      option.value = minionId;
      targetList.appendChild(option);
    }
  }

  _templateCatMenuItemTitle (pCategory) {
    let title;
    if (pCategory === undefined) {
      title = "(undefined)";
    } else if (pCategory === null) {
      title = "(all)";
    } else {
      title = pCategory;
    }
    if (this.templateTmplMenu && this.templateTmplMenu._templateCategory === pCategory) {
      title = Character.BLACK_CIRCLE + " " + title;
    }
    return title;
  }

  _populateTemplateCatMenu () {
    const titleElement = document.getElementById("template-catmenu-here");
    if (titleElement.childElementCount) {
      if (this.templateCatMenu) {
        this.templateCatMenu.setTitle("");
      }
      return;
    }
    const menu = new DropDownMenu(titleElement);
    menu.setTitle("");
    menu.menuButton.classList.add("small-button-left");
    this.templateCatMenu = menu;

    const templates = Utils.getStorageItemObject("session", "templates");
    const categories = TemplatesPanel.getTemplatesCategories(templates);
    if (categories.length < 2) {
      return;
    }
    categories.unshift(null);
    for (const category of categories) {
      menu.addMenuItem(
        () => this._templateCatMenuItemTitle(category),
        () => {
          this.templateTmplMenu._templateCategory = category;
          if (category === null) {
            this.templateCatMenu.setTitle("(all)");
          } else if (category === undefined) {
            this.templateCatMenu.setTitle("(undefined)");
          } else {
            this.templateCatMenu.setTitle(category);
          }
        }
      );
    }
  }

  _templateTmplMenuItemTitle (pTemplate) {
    let keyboardHint = "";
    if (pTemplate.key) {
      keyboardHint = Character.NO_BREAK_SPACE + "[" + pTemplate.key + "]";
    }

    if (this.templateTmplMenu._templateCategory === null) {
      return pTemplate.description + keyboardHint;
    }
    if (this.templateTmplMenu._templateCategory === undefined && pTemplate.category === undefined && pTemplate.categories === undefined) {
      return pTemplate.description + keyboardHint;
    }
    if (pTemplate.category && pTemplate.category === this.templateTmplMenu._templateCategory) {
      return pTemplate.description + keyboardHint;
    }
    if (pTemplate.categories?.includes(this.templateTmplMenu._templateCategory)) {
      return pTemplate.description + keyboardHint;
    }
    return null;
  }

  _populateTemplateTmplMenu () {
    const titleElement = document.getElementById("template-tmplmenu-here");
    if (titleElement.childElementCount) {
      if (this.templateTmplMenu) {
        this.templateTmplMenu._templateCategory = null;
      }
      return;
    }
    const menu = new DropDownMenu(titleElement);
    menu.menuButton.classList.add("small-button-left");
    this.templateTmplMenu = menu;
    this.templateTmplMenu._templateCategory = null;

    const templates = Utils.getStorageItemObject("session", "templates");
    const keys = Object.keys(templates).sort(Utils.mySortFunction);
    for (const key of keys) {
      const template = templates[key];
      let description = template["description"];
      if (!description) {
        description = "(" + key + ")";
      }
      menu.addMenuItem(
        () => this._templateTmplMenuItemTitle(template),
        () => {
          this._applyTemplateByTemplate(template);
        }
      );
    }
  }

  _applyTemplateByTemplate (pTemplate) {
    this._applyTemplateByProperties(pTemplate.targettype, pTemplate.target, pTemplate.command);
  }

  _applyTemplateByProperties (pTargetType, pTarget, pCommand) {
    if (pTargetType) {
      const targetbox = document.getElementById("target-box");
      targetbox.style.display = "inherit";
      if (pTargetType !== "glob" && pTargetType !== "list" && pTargetType !== "compound" && pTargetType !== "nodegroup") {
        pTargetType = "glob";
      }
      TargetType.setTargetType(pTargetType);
    } else {
      TargetType.setTargetTypeDefault();
    }

    if (pTarget) {
      this.targetField.value = pTarget;
      TargetType.autoSelectTargetType(this.targetField.value);
    }

    if (pCommand) {
      this.commandField.value = pCommand;
    }
  }

  _populateTestProviders () {
    if (!Documentation.PROVIDERS || Object.keys(Documentation.PROVIDERS).length > 0) {
      return;
    }

    const target = Utils.getStorageItem("session", "test_providers_target", "*");
    if (target === "SKIP") {
      Documentation.PROVIDERS = {"SKIPPED": []};
      return;
    }

    const localTestProviders = this.api.getLocalTestProviders(target);
    localTestProviders.then((pData) => {
      Documentation.handleLocalTestProviders(pData);
    }, () => {
      Documentation.PROVIDERS = {"ERROR": []};
    });
  }

  static _getNodegroupsSelection () {
    const allNodeGroups = Utils.getStorageItemObject("session", "nodegroups");
    const allNodeGroupsKeys = Object.keys(allNodeGroups);

    let ret = "";
    const lst_nodegroups = Utils.getStorageItem("session", "select_nodegroups", null);
    if (lst_nodegroups) {
      for (const nodegroup of lst_nodegroups.split(",")) {
        if (nodegroup === "null") {
          ret += " or not ( "
          let grplst = "";
          for (const grp of allNodeGroupsKeys) {
            grplst += " or N@" + grp;
          }
          ret += grplst.substring(4) + " )";
        } else if (nodegroup) {
          ret += " or N@" + nodegroup;
        }
      }
    }
    return ret;
  }

  static _getMinionSelection () {
    let ret = "";
    const lst_minions = Utils.getStorageItem("session", "select_minions", null);
    if (lst_minions) {
      let minionlist = "";
      for (const minion of lst_minions.split(",")) {
        if (minion) {
          minionlist += "," + minion;
        }
      }
      if (minionlist) {
        ret += " or L@" + minionlist.substring(1);
      }
    }
    return ret;
  }

  static _getSelectedItemList (pSessionKeys) {
    const selectVisible = Utils.getStorageItemBoolean("session", "select_visible", false);
    if (!selectVisible) {
      return null;
    }

    let target = "";

    if (pSessionKeys.includes("select_nodegroups")) {
      target += ManualRunPanel._getNodegroupsSelection();
    }

    if (pSessionKeys.includes("select_minions")) {
      target += ManualRunPanel._getMinionSelection();
    }

    if (pSessionKeys.includes("select_keys")) {
      const lst_keys = Utils.getStorageItem("session", "select_keys", null);
      if (lst_keys) {
        let keylist = "";
        for (const key of lst_keys.split(",")) {
          if (key) {
            keylist += "," + key;
          }
        }
        target += " or " + keylist.substring(1);
      }
    }

    target = target.substring(4);
    if (target.startsWith("L@")) {
      target = target.substring(2);
    }

    if (target === "") {
      return null;
    }

    return target;
  }

  _onRun () {
    if (this.runButton.disabled) {
      return;
    }

    const targetValue = this.targetField.value;
    const commandValue = this.commandField.value;
    const targetType = TargetType.menuTargetType._value;

    const patWhitespaceAll = /\s/g;
    const commandValueNoTabs = commandValue.replace(patWhitespaceAll, " ");
    if (commandValueNoTabs !== commandValue) {
      this.commandField.value = commandValueNoTabs;
      this._showError("The command contains unsupported whitespace characters.\nThese have now been replaced by regular space characters.\nUse 'Run command' again to run the updated command.");
      return;
    }

    const func = this.getRunParams(targetType, targetValue, commandValue);
    if (func === null) {
      return;
    }

    this.targetField.disabled = true;
    this.commandField.disabled = true;
    this.runButton.disabled = true;
    this.outputPre.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;

    const command = commandValue.split(" ")[0];
    this._markPanelsForRefresh(command);

    func.then((ok_response) => {
      if (ok_response) {
        this._onRunReturn(ok_response.return[0], commandValue);
        this._prepareForAsyncResults(ok_response);
      } else {
        this._showError("null response");
      }
      return true;
    }, (_error_response) => {
      this._showError(JSON.stringify(_error_response));
      return false;
    });
  }

  getRunParams (pTargetType, pTarget, pToRun, pisRunTypeNormalOnly = false, pCanUseFullReturn = true) {
    if (pTargetType === "nodegroup" && pTarget.startsWith("#")) {
      pTarget = pTarget.substring(1);
    }

    if (pToRun === "") {
      this._showError("'Command' field cannot be empty");
      return null;
    }

    const argsArray = [];
    const argsObject = {};

    const ret = ParseCommandLine.parseCommandLine(pToRun, argsArray, argsObject);
    if (ret !== null) {
      this._showError(ret);
      return null;
    }

    if (argsArray.length === 0) {
      this._showError("First (unnamed) parameter is the function name, it is mandatory");
      return null;
    }

    const functionToRun = argsArray.shift();

    const validationError = ManualRunPanel._validateFunctionParams(functionToRun, pTarget, pTargetType);
    if (validationError) {
      this._showError(validationError);
      return null;
    }

    if (functionToRun.startsWith("wheel.") && argsArray.length > 0) {
      this._showError("Wheel commands can only take named parameters");
      return null;
    }

    const fullReturn = pCanUseFullReturn && Utils.getStorageItemBoolean("session", "full_return");

    let params = ManualRunPanel._buildCommandParams(functionToRun, pTarget, pTargetType, argsArray, argsObject, fullReturn);

    const runType = RunType.getRunType();
    if (!pisRunTypeNormalOnly && runType === "async") {
      if (params.client !== "local") {
        this._showError("Async is not supported for '" + functionToRun + "'");
        return null;
      }
      params.client = "local_async";
    }

    return this.api.apiRequest("POST", "/", params);
  }

  static _validateFunctionParams (pFunctionToRun, pTarget, pTargetType) {
    if (typeof pFunctionToRun !== "string") {
      return "First (unnamed) parameter is the function name, it must be a string, not a " + typeof pFunctionToRun;
    }

    if (pFunctionToRun === "runner" || pFunctionToRun.startsWith("runner.")) {
      return "'Runner' commands must be prefixed with 'runners.'";
    }

    if (pTarget === "" && pFunctionToRun !== "runners" && !pFunctionToRun.startsWith("runners.")) {
      return "'Target' field cannot be empty";
    }

    if (pTargetType === "nodegroup") {
      const nodeGroups = Utils.getStorageItemObject("session", "nodegroups");
      if (!(pTarget in nodeGroups)) {
        return "Unknown nodegroup '" + pTarget + "'";
      }
    }

    return null;
  }

  static _buildCommandParams (pFunctionToRun, pTarget, pTargetType, pArgsArray, pArgsObject, pFullReturn) {
    let params = {};

    if (pFunctionToRun.startsWith("runners.")) {
      params = pArgsObject;
      params.client = "runner";
      params["full_return"] = pFullReturn;
      params.fun = pFunctionToRun.substring(8);
      if (pArgsArray.length > 0) {
        params.arg = pArgsArray;
      }
    } else if (pFunctionToRun.startsWith("wheel.")) {
      params = pArgsObject;
      params.client = "wheel";
      params.fun = pFunctionToRun.substring(6);
      params.match = pTarget;
    } else {
      params.client = "local";
      params.fun = pFunctionToRun;
      params.tgt = pTarget;
      params["full_return"] = pFullReturn;
      if (pTargetType) {
        params["tgt_type"] = pTargetType;
      }
      if (pArgsArray.length !== 0) {
        params.arg = pArgsArray;
      }
      if (Object.keys(pArgsObject).length > 0) {
        params.kwarg = pArgsObject;
      }
    }

    return params;
  }

  _markPanelsForRefresh (pCommand) {
    if (!this.router.currentPage) {
      return;
    }

    const readOnlyPanels = ["events", "options", "reactors", "stats", "templates"];
    const screenModifyingCommands = {
      "beacons.add": ["beacons", "beacons-minion"],
      "beacons.delete": ["beacons", "beacons-minion"],
      "beacons.disable": ["beacons", "beacons-minion"],
      "beacons.disable_beacon": ["beacons-minion"],
      "beacons.enable": ["beacons", "beacons-minion", "issues"],
      "beacons.enable_beacon": ["beacons-minion", "issues"],
      "beacons.modify": ["beacons-minion"],
      "beacons.reset": ["beacons", "beacons-minion"],
      "grains.append": ["minions", "grains", "grains-minion"],
      "grains.delkey": ["minions", "grains", "grains-minion"],
      "grains.delval": ["minions", "grains", "grains-minion"],
      "grains.setval": ["minions", "grains", "grains-minion"],
      "mine.delete": ["mine-minion"],
      "mine.flush": ["mine-minion"],
      "mine.update": ["mine-minion"],
      "ps.kill_pid": ["job", "jobs"],
      "saltutil.kill_job": ["job", "jobs", "issues"],
      "saltutil.refresh_grains": ["minions", "grains", "grains-minion"],
      "saltutil.refresh_pillar": ["pillars", "pillars-minion"],
      "saltutil.signal_job": ["job", "jobs", "issues"],
      "saltutil.term_job": ["job", "jobs", "issues"],
      "schedule.add": ["schedules", "schedules-minion"],
      "schedule.delete": ["schedules", "schedules-minion"],
      "schedule.disable": ["schedules", "schedules-minion"],
      "schedule.disable_job": ["schedules-minion"],
      "schedule.enable": ["schedules", "schedules-minion", "issues"],
      "schedule.enable_job": ["schedules-minion", "issues"],
      "schedule.modify": ["schedules", "schedules-minion"],
      "schedule.run_job": ["*"],
      "state.apply": ["*"],
      "state.highstate": ["*"],
      "state.sls_id": ["*"]
    };

    if (pCommand in screenModifyingCommands) {
      for (const panel of this.router.currentPage.panels) {
        if (readOnlyPanels.includes(panel.key)) {
          // nothing changed on this panel
        } else if (screenModifyingCommands[pCommand].includes(panel.key)) {
          panel.needsRefresh = true;
        } else if (screenModifyingCommands[pCommand].includes("*")) {
          panel.needsRefresh = true;
        }
      }
    }

    for (const panel of this.router.currentPage.panels) {
      if (panel.key !== "job" && panel.key !== "jobs") {
        // panel does not show jobs (or a job)
      } else if (pCommand.startsWith("wheel.")) {
        // wheel commands do not end up in the jobs list
      } else if (pCommand.startsWith("runners.")) {
        // runners commands do not end up in the jobs list
      } else {
        panel.needsRefresh = true;
      }
    }
  }

  _onRunReturn (pResponse, pCommand) {
    let minions = Object.keys(pResponse);
    if (pCommand.startsWith("runners.")) {
      minions = ["RUNNER"];
    } else if (pCommand.startsWith("wheel.")) {
      minions = ["WHEEL"];
    }
    const outputOptions = {
      initialStatus: "done"
    };
    Output.addResponseOutput(this.outputPre, minions, pResponse, pCommand, outputOptions);
    this.targetField.disabled = false;
    this.commandField.disabled = false;
    this.runButton.disabled = false;
  }

  _prepareForAsyncResults (pResponse) {
    const ret = pResponse.return[0];
    this.jid = ret.jid;
    if (ret.minions) {
      this.minionIds = ret.minions.sort();
    } else {
      this.minionIds = [];
    }

    const output = this.outputPre;

    const jidId = Utils.getIdFromMinionId("jid");
    const labelSpan = document.querySelector("div#" + jidId + " span span");
    if (labelSpan === null) {
      return;
    }
    labelSpan.classList.remove("minion-id", "host-success");

    const minionsId = Utils.getIdFromMinionId("minions");
    const minionsList = document.getElementById(minionsId);
    if (minionsList) {
      minionsList.remove();
    }

    const spacerDiv = Utils.createDiv();
    output.appendChild(spacerDiv);

    for (const minionId of this.minionIds) {
      const div = ManualRunPanel._createNewMinionRow(minionId);
      output.appendChild(div);
    }

    const warnSpan = Utils.createSpan(
      "",
      "\nnote that unresponsive minions will not time out in this overview",
      "unresponsive");
    output.appendChild(warnSpan);
  }

  static _createNewMinionRow (pMinionId) {
    const div = Utils.createDiv("task-summary");
    div.id = "run-" + Utils.getIdFromMinionId(pMinionId);
    div.style.marginTop = 0;

    const minionSpan1 = Utils.createSpan("", pMinionId);
    div.appendChild(minionSpan1);

    const minionSpan2 = Utils.createSpan("", ": " + Character.HOURGLASS_WITH_FLOWING_SAND + " ");
    div.appendChild(minionSpan2);

    return div;
  }

  handleSaltJobRetEvent (pTag, pData) {
    const part = pTag.split("/");
    if (part.length !== 5) {
      Utils.info("unknown tag", pTag);
      return;
    }

    const eventJid = part[2];
    const eventMinionId = part[4];

    if (this.jid !== eventJid) {
      return;
    }

    const id = "run-" + Utils.getIdFromMinionId(eventMinionId);
    let div = document.getElementById(id);
    if (div === null) {
      div = this._createNewMinionRow(eventMinionId);
      this.outputPre.appendChild(div);
    }

    const isSuccess = Output.getIsSuccess(pData);
    const minionClass = Output.getMinionLabelClass(isSuccess, pData);

    const span1 = div.children[0];
    span1.classList.remove("host-unknown");
    span1.classList.add("minion-id", minionClass);

    const span2 = div.children[1];
    span2.innerText = div.children.length > 2 ? ": " : "";

    const anyUnknown = document.querySelector(".host-unknown");
    if (anyUnknown === null) {
      const unresponsive = document.getElementById("unresponsive");
      if (unresponsive) {
        unresponsive.style.display = "none";
      }
    }
  }

  handleSaltJobProgEvent (pTag, pData) {
    const part = pTag.split("/");
    if (part.length !== 6) {
      Utils.info("unknown tag", pTag);
      return;
    }

    const eventJid = part[2];
    const eventMinionId = part[4];
    const eventSeqNr = Number.parseInt(part[5], 10);

    if (this.jid !== eventJid) {
      return;
    }

    const task = pData.data.ret;

    const divId = "run-" + Utils.getIdFromMinionId(eventMinionId);
    let div = document.getElementById(divId);
    if (div === null) {
      div = this._createNewMinionRow(eventMinionId);
      this.outputPre.appendChild(div);
    }

    while (div.children.length <= eventSeqNr + 2) {
      const newSpan = Utils.createSpan("", Character.BLACK_CIRCLE);
      div.appendChild(newSpan);
    }

    const span = div.children[eventSeqNr + 2];
    Output.setTaskToolTip(span, task);
  }

  _showError (pMessage) {
    this._onRunReturn("ERROR:\n\n" + pMessage, "");
  }
}
