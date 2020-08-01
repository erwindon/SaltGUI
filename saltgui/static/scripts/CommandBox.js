/* global document window */

import {Documentation} from "./Documentation.js";
import {DropDownMenu} from "./DropDown.js";
import {Output} from "./output/Output.js";
import {ParseCommandLine} from "./ParseCommandLine.js";
import {RunType} from "./RunType.js";
import {TargetType} from "./TargetType.js";
import {Utils} from "./Utils.js";

export class CommandBox {

  constructor (pApi) {
    const that = this;

    this.api = pApi;
    this.getRunParams = this.getRunParams.bind(this);
    this._onRun = this._onRun.bind(this);
    this.onRunReturn = this.onRunReturn.bind(this);
    this.showManualRun = this.showManualRun.bind(this);
    this._hideManualRun = this._hideManualRun.bind(this);

    const cmdbox = document.getElementById("cmd-box");
    this.cmdmenu = new DropDownMenu(cmdbox);

    this.documentation = new Documentation(this);
    this._registerCommandBoxEventListeners();

    RunType.createMenu();
    TargetType.createMenu();

    const titleElement = document.getElementById("template-menu-here");
    const menu = new DropDownMenu(titleElement);
    const templatesText = Utils.getStorageItem("session", "templates", "{}");
    const templates = JSON.parse(templatesText);
    const keys = Object.keys(templates).sort();
    for (const key of keys) {
      const template = templates[key];
      let description = template["description"];
      if (!description) {
        description = "(" + key + ")";
      }
      menu.addMenuItem(
        description,
        () => {
          that._applyTemplate(template);
        }
      );
    }
  }

  _registerCommandBoxEventListeners () {
    document.getElementById("popup-run-command").
      addEventListener("click", this._hideManualRun);
    document.getElementById("button-manual-run").
      addEventListener("click", this.showManualRun);
    document.getElementById("button-close-cmd").
      addEventListener("click", this._hideManualRun);

    document.querySelector(".run-command input[type='submit']").
      addEventListener("click", this._onRun);

    document.getElementById("target").
      addEventListener("input", () => {
        const targetField = document.getElementById("target");
        const targetType = targetField.value;
        TargetType.autoSelectTargetType(targetType);
      });

    document.getElementById("command").
      addEventListener("input", this.cmdmenu.verifyAll);
  }

  _applyTemplate (template) {

    if (template.targettype) {
      let targetType = template.targettype;
      const targetbox = document.getElementById("target-box");
      // show the extended selection controls when
      targetbox.style.display = "inherit";
      if (targetType !== "glob" && targetType !== "list" && targetType !== "compound" && targetType !== "nodegroup") {
        // we don't support that, revert to standard (not default)
        targetType = "glob";
      }
      TargetType.setTargetType(targetType);
    } else {
      // not in the template, revert to default
      TargetType.setTargetTypeDefault();
    }

    if (template.target) {
      const targetField = document.getElementById("target");
      targetField.value = template.target;
      TargetType.autoSelectTargetType(targetField.value);
    }

    if (template.command) {
      const commandField = document.getElementById("command");
      commandField.value = template.command;
    }
  }

  _onRun () {
    const button = document.querySelector(".run-command input[type='submit']");
    if (button.disabled) {
      return;
    }
    const output = document.querySelector(".run-command pre");

    const targetField = document.getElementById("target");
    const targetValue = targetField.value;
    const commandField = document.getElementById("command");
    const commandValue = commandField.value;

    const targetType = TargetType.menuTargetType._value;

    const func = this.getRunParams(targetType, targetValue, commandValue);
    if (func === null) {
      return;
    }

    button.disabled = true;
    output.innerText = "Loading...";

    func.then((pResponse) => {
      if (pResponse) {
        this.onRunReturn(pResponse.return[0], commandValue);
      } else {
        this._showError("null response");
      }
    }, (pResponse) => {
      this._showError(JSON.stringify(pResponse));
    });
  }

  onRunReturn (pResponse, pCommand) {
    const outputContainer = document.querySelector(".run-command pre");
    let minions = Object.keys(pResponse);
    if (pCommand.startsWith("runners.")) {
      minions = ["RUNNER"];
    } else if (pCommand.startsWith("wheel.")) {
      minions = ["WHEEL"];
    }
    // do not suppress the jobId (even when we can)
    Output.addResponseOutput(outputContainer, null, minions, pResponse, pCommand, "done");
    const button = document.querySelector(".run-command input[type='submit']");
    button.disabled = false;
  }

  showManualRun (pClickEvent) {
    const manualRun = document.getElementById("popup-run-command");
    manualRun.style.display = "block";

    const outputField = document.querySelector(".run-command pre");
    outputField.innerText = "Waiting for command...";

    const targetField = document.getElementById("target");
    TargetType.autoSelectTargetType(targetField.value);
    targetField.onkeyup = (keyUpEvent) => {
      if (keyUpEvent.key === "Escape") {
        this._hideManualRun(keyUpEvent);
      }
    };

    const commandField = document.getElementById("command");
    commandField.onkeyup = (keyUpEvent) => {
      if (keyUpEvent.key === "Escape") {
        this._hideManualRun(keyUpEvent);
      }
    };

    RunType.setRunTypeDefault();

    // (re-)populate the dropdown box
    const targetList = document.getElementById("data-list-target");
    while (targetList.firstChild) {
      targetList.removeChild(targetList.firstChild);
    }
    const nodeGroupsText = Utils.getStorageItem("session", "nodegroups", "[]");
    const nodeGroups = JSON.parse(nodeGroupsText);
    for (const nodeGroup of Object.keys(nodeGroups).sort()) {
      const option = document.createElement("option");
      option.value = "#" + nodeGroup;
      targetList.appendChild(option);
    }
    const minions = JSON.parse(Utils.getStorageItem("session", "minions", "[]"));
    for (const minionId of minions.sort()) {
      const option = document.createElement("option");
      option.value = minionId;
      targetList.appendChild(option);
    }

    // give another field (which does not have a list) focus first
    // because when a field gets focus 2 times in a row,
    // the dropdown box opens, and we don't want that...
    commandField.focus();
    targetField.focus();

    pClickEvent.stopPropagation();
  }

  // pEvent is:
  // a MouseEvent(type="click") or
  // a KeyEvent(type="keyup")
  _hideManualRun (pEvent) {
    // Don't close if they click inside the window
    if (pEvent.type === "click" && pEvent.target.className !== "popup" && pEvent.target.className !== "nearly-visible-button") {
      return;
    }

    const manualRun = document.getElementById("popup-run-command");
    manualRun.style.display = "none";

    // reset to default, so that its value is initially hidden
    RunType.setRunTypeDefault();
    TargetType.setTargetTypeDefault();

    // test whether the command may have caused an update to the list
    // the user may have altered the text after running the command, just ignore that
    const commandField = document.getElementById("command");
    const command = commandField.value.split(" ")[0];
    const outputField = document.querySelector(".run-command pre");
    const output = outputField.innerText;
    const screenModifyingCommands = [
      "beacons.add",
      "beacons.delete",
      "beacons.delete",
      "beacons.disable",
      "beacons.disable_beacon",
      "beacons.enable",
      "beacons.enable_beacon",
      "beacons.modify",
      "beacons.reset",
      "grains.append",
      "grains.delkey",
      "grains.delval",
      "grains.setval",
      "ps.kill_pid",
      "saltutil.kill_job",
      "saltutil.refresh_grains",
      "saltutil.refresh_pillar",
      "saltutil.signal_job",
      "saltutil.term_job",
      "schedule.delete",
      "schedule.disable",
      "schedule.disable_job",
      "schedule.enable",
      "schedule.enable_job",
      "schedule.modify",
      "schedule.run_job"
    ];
    if (screenModifyingCommands.includes(command) && output !== "Waiting for command...") {
      window.location.reload();
    }

    pEvent.stopPropagation();
  }

  _showError (pMessage) {
    this.onRunReturn("ERROR:\n\n" + pMessage, "");
  }

  getRunParams (pTargetType, pTarget, pToRun, pisRunTypeNormalOnly = false) {

    // The leading # was used to indicate a nodegroup
    if (pTargetType === "nodegroup" && pTarget.startsWith("#")) {
      pTarget = pTarget.substring(1);
    }

    if (pToRun === "") {
      this._showError("'Command' field cannot be empty");
      return null;
    }

    // collection for unnamed parameters
    const argsArray = [];

    // collection for named parameters
    const argsObject = {};

    const ret = ParseCommandLine.parseCommandLine(pToRun, argsArray, argsObject);
    if (ret !== null) {
      // that is an error message being returned
      this._showError(ret);
      return null;
    }

    if (argsArray.length === 0) {
      this._showError("First (unnamed) parameter is the function name, it is mandatory");
      return null;
    }

    const functionToRun = argsArray.shift();

    if (typeof functionToRun !== "string") {
      this._showError("First (unnamed) parameter is the function name, it must be a string, not a " + typeof functionToRun);
      return null;
    }

    // RUNNERS commands do not have a target (MASTER is the target)
    // WHEEL commands also do not have a target
    // but we use the TARGET value to form the usually required MATCH parameter
    // therefore for WHEEL commands it is still required
    if (pTarget === "" && functionToRun !== "runners" && !functionToRun.startsWith("runners.")) {
      this._showError("'Target' field cannot be empty");
      return null;
    }

    // SALT API returns a 500-InternalServerError when it hits an unknown group
    // Let's improve on that
    if (pTargetType === "nodegroup") {
      const nodeGroupsTxt = Utils.getStorageItem("session", "nodegroups", "{}");
      const nodeGroups = JSON.parse(nodeGroupsTxt);
      if (!(pTarget in nodeGroups)) {
        this._showError("Unknown nodegroup '" + pTarget + "'");
        return null;
      }
    }

    let params = {};
    if (functionToRun.startsWith("runners.")) {
      params = argsObject;
      params.client = "runner";
      // use only the part after "runners." (8 chars)
      params.fun = functionToRun.substring(8);
      if (argsArray.length > 0) {
        params.arg = argsArray;
      }
    } else if (functionToRun.startsWith("wheel.")) {
      // wheel.key functions are treated slightly different
      // we re-use the "target" field to fill the parameter "match"
      // as used by the salt.wheel.key functions
      params = argsObject;
      params.client = "wheel";
      // use only the part after "wheel." (6 chars)
      params.fun = functionToRun.substring(6);
      params.match = pTarget;
    } else {
      params.client = "local";
      params.fun = functionToRun;
      params.tgt = pTarget;
      if (pTargetType) {
        params["tgt_type"] = pTargetType;
      }
      if (argsArray.length !== 0) {
        params.arg = argsArray;
      }
      if (Object.keys(argsObject).length > 0) {
        params.kwarg = argsObject;
      }
    }

    const runType = RunType.getRunType();
    if (!pisRunTypeNormalOnly && params.client === "local" && runType === "async") {
      params.client = "local_async";
      // return looks like:
      // { "jid": "20180718173942195461", "minions": [ ... ] }
    }

    return this.api.apiRequest("POST", "/", params);
  }
}
