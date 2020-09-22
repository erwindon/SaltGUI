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
    this.api = pApi;

    const cmdbox = document.getElementById("cmd-box");
    this.cmdmenu = new DropDownMenu(cmdbox);

    this.documentation = new Documentation(this);
    this._registerCommandBoxEventListeners();

    RunType.createMenu();
    TargetType.createMenu();

    const manualRun = document.getElementById("popup-run-command");
    Utils.addTableHelp(manualRun, "Click for help");
    const helpButton = manualRun.querySelector("#help");
    helpButton.addEventListener("click", () => {
      CommandBox._showHelp();
    });
  }

  static _populateTemplateMenu () {
    const titleElement = document.getElementById("template-menu-here");
    if (titleElement.childElementCount) {
      // only build one dropdown menu. cannot be done in constructor
      // since the storage-item is then not populated yet.
      return;
    }
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
          CommandBox._applyTemplate(template);
        }
      );
    }
  }

  static _showHelp () {
    const output = document.querySelector(".run-command pre");
    let txt = "";
    txt += "<h2>Target field</h2>";
    txt += "<p>Entries that contain a @, (, ) or space are assumed to be a compound target selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/#compound-targeting' target='_blank'>Compound Targeting<img src='static/images/externallink.png' width='12px'></a>.";
    txt += "<br/>Entries that contain a COMMA are assumed to be a list target selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/globbing.html#lists' target='_blank'>List Targeting<img src='static/images/externallink.png' width='12px'></a>.";
    txt += "<br/>Entries that start with a # are assumed to be a nodegroup target selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/nodegroups.html' target='_blank'>Nodegroup Targeting<img src='static/images/externallink.png' width='12px'></a>.";
    txt += "<br/>Otherwise, the target is assumed to be a regular glob selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/globbing.html#globbing' target='_blank'>Globbing Targeting<img src='static/images/externallink.png' width='12px'></a>.";
    txt += "<br/>The dropdown-box to the right of the field is automatically updated with the assumed target type. When you do not agree, it is possible to manually select a value. That value will then be left alone by the system. Note that the dropdown-box only contains the choice 'Nodegroup' when nodegroups are configured in the <b>master</b> file.";
    txt += "<br/>For <b>wheel</b> commands, the value of the target field is added to the commandline as the named variable 'match'. Wheel commands that do not use that parameter do not have a problem with that.";
    txt += "<br/>For <b>runners</b> commands, the value of the target field can be left empty. Any value is silently ignored.</p>";
    txt += "<br/><h2>Command field</h2>";
    txt += "<p>The command field is used to enter the command and its parameters. Double quotes (\") are needed around each item that contains spaces, or when it is otherwise mistaken for a number, boolean, list or object according to the <a href='https://tools.ietf.org/html/rfc7159' target='_blank'>JSON<img src='static/images/externallink.png' width='12px'></a> notation. Additionally, strings in the form \"\"\"string\"\"\" are recognized. This is a notation from the <a href='https://docs.python.org/3/tutorial/introduction.html#strings' target='_blank'>Python<img src='static/images/externallink.png' width='12px'></a> language, which is very useful for the construction of strings that need to contain double-quote characters. This form does not handle any escape characters.";
    txt += "<br/>Parameters in the form name=value are used to pass named variables. The same quoting rules apply to the value. The named parameters are used from left-to-right. Their actual position within the line is otherwise not important.";
    txt += "<br/>A help button is visible when the command field contains some text. It will issue a <b>sys.doc</b> (or <b>runners.doc.wheel</b> or <b>runners.doc.runner</b>) command for the current command. The <b>sys.doc</b> command will be targetted to the given minions when the target field is not empty. It will be targetted to all minions when it is empty. The <b>runners.doc.wheel</b> or <b>runners.doc.runner</b> commands will always run on the master. When answers from multiple minions are available from <b>sys.doc</b>, only the first reasonable answer is used. Small variations in the answer may exist when not all minions have the same software version.</p>";
    txt += "<br/><h2>Run command button</h2>";
    txt += "<p>The 'Run command' button starts the given command for the given minions.";
    txt += "<br/>A dropdown menu to the right of the button can be used to specify that the command must be run asynchronously. In that case the output consists only of a link to retrieve the actual output. When a command takes too long, the command window can be closed without waiting for the output. The Jobs page can then be used to find that command and watch its progress or results.<p>";
    txt += "<br/><h2>Output panel</h2>";
    txt += "<p>When the output is recognized as output from (a command similar to) <b>state.highstate</b>, then the output is formatted for readability. e.g. durations shorter than 10 milliseconds are removed. On the same line as the minion name, a summary is shown in the form of coloured CIRCLE characters. There is one character for each state. When the circle has a double bar over/under it (it is always both) then the state reported that work was done and it may be interesting to see it. Clicking on a circle will scroll to the corresponding state output and shortly highlight it.";
    txt += "</br>Clicking on any output will scroll back to the minion name.";
    txt += "</br>When a minion has multiple lines of output, it can be collapsed.</p>";
    output.innerHTML = txt;
  }

  _registerCommandBoxEventListeners () {
    document.getElementById("popup-run-command").
      addEventListener("click", CommandBox._hideManualRun);
    document.getElementById("button-manual-run").
      addEventListener("click", CommandBox.showManualRun);
    document.getElementById("cmd-close-button").
      addEventListener("click", CommandBox._hideManualRun);

    document.querySelector(".run-command input[type='submit']").
      addEventListener("click", () => {
        this._onRun();
      });

    document.getElementById("target").
      addEventListener("input", () => {
        const targetField = document.getElementById("target");
        const targetType = targetField.value;
        TargetType.autoSelectTargetType(targetType);
      });

    document.getElementById("command").
      addEventListener("input", () => {
        this.cmdmenu.verifyAll();
      });
  }

  static _applyTemplate (template) {

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

    const patWhitespaceAll = /\s/g;
    const commandValueNoTabs = commandValue.replace(patWhitespaceAll, " ");
    if (commandValueNoTabs !== commandValue) {
      commandField.value = commandValueNoTabs;
      CommandBox._showError("The command contains unsupported whitespace characters.\nThese have now been replaced by regular space characters.\nUse 'Run command' again to run the updated command.");
      return;
    }

    const func = this.getRunParams(targetType, targetValue, commandValue);
    if (func === null) {
      return;
    }

    targetField.disabled = true;
    commandField.disabled = true;
    button.disabled = true;
    output.innerText = "Loading...";

    func.then((pResponse) => {
      if (pResponse) {
        CommandBox.onRunReturn(pResponse.return[0], commandValue);
      } else {
        CommandBox._showError("null response");
      }
      return true;
    }, (pResponse) => {
      CommandBox._showError(JSON.stringify(pResponse));
      return false;
    });
  }

  static onRunReturn (pResponse, pCommand) {
    const outputContainer = document.querySelector(".run-command pre");
    let minions = Object.keys(pResponse);
    if (pCommand.startsWith("runners.")) {
      minions = ["RUNNER"];
    } else if (pCommand.startsWith("wheel.")) {
      minions = ["WHEEL"];
    }
    // do not suppress the jobId (even when we can)
    Output.addResponseOutput(outputContainer, null, minions, pResponse, pCommand, "done");
    const targetField = document.getElementById("target");
    const commandField = document.getElementById("command");
    const button = document.querySelector(".run-command input[type='submit']");
    targetField.disabled = false;
    commandField.disabled = false;
    button.disabled = false;
  }

  static showManualRun (pClickEvent) {
    const manualRun = document.getElementById("popup-run-command");
    manualRun.style.display = "block";

    const outputField = document.querySelector(".run-command pre");
    outputField.innerText = "Waiting for command...";

    const targetField = document.getElementById("target");
    TargetType.autoSelectTargetType(targetField.value);
    targetField.onkeyup = (keyUpEvent) => {
      if (keyUpEvent.key === "Escape") {
        CommandBox._hideManualRun(keyUpEvent);
      }
    };

    const commandField = document.getElementById("command");
    commandField.onkeyup = (keyUpEvent) => {
      if (keyUpEvent.key === "Escape") {
        CommandBox._hideManualRun(keyUpEvent);
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

    CommandBox._populateTemplateMenu();

    pClickEvent.stopPropagation();
  }

  // pEvent is:
  // a MouseEvent(type="click") or
  // a KeyEvent(type="keyup")
  static _hideManualRun (pEvent) {
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

  static _showError (pMessage) {
    CommandBox.onRunReturn("ERROR:\n\n" + pMessage, "");
  }

  getRunParams (pTargetType, pTarget, pToRun, pisRunTypeNormalOnly = false) {

    // The leading # was used to indicate a nodegroup
    if (pTargetType === "nodegroup" && pTarget.startsWith("#")) {
      pTarget = pTarget.substring(1);
    }

    if (pToRun === "") {
      CommandBox._showError("'Command' field cannot be empty");
      return null;
    }

    // collection for unnamed parameters
    const argsArray = [];

    // collection for named parameters
    const argsObject = {};

    const ret = ParseCommandLine.parseCommandLine(pToRun, argsArray, argsObject);
    if (ret !== null) {
      // that is an error message being returned
      CommandBox._showError(ret);
      return null;
    }

    if (argsArray.length === 0) {
      CommandBox._showError("First (unnamed) parameter is the function name, it is mandatory");
      return null;
    }

    const functionToRun = argsArray.shift();

    if (typeof functionToRun !== "string") {
      CommandBox._showError("First (unnamed) parameter is the function name, it must be a string, not a " + typeof functionToRun);
      return null;
    }

    // RUNNERS commands do not have a target (MASTER is the target)
    // WHEEL commands also do not have a target
    // but we use the TARGET value to form the usually required MATCH parameter
    // therefore for WHEEL commands it is still required
    if (pTarget === "" && functionToRun !== "runners" && !functionToRun.startsWith("runners.")) {
      CommandBox._showError("'Target' field cannot be empty");
      return null;
    }

    // SALT API returns a 500-InternalServerError when it hits an unknown group
    // Let's improve on that
    if (pTargetType === "nodegroup") {
      const nodeGroupsTxt = Utils.getStorageItem("session", "nodegroups", "{}");
      const nodeGroups = JSON.parse(nodeGroupsTxt);
      if (!(pTarget in nodeGroups)) {
        CommandBox._showError("Unknown nodegroup '" + pTarget + "'");
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
