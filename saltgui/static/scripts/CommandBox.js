/* global */

import {Character} from "./Character.js";
import {Documentation} from "./Documentation.js";
import {DropDownMenu} from "./DropDown.js";
import {Output} from "./output/Output.js";
import {ParseCommandLine} from "./ParseCommandLine.js";
import {Router} from "./Router.js";
import {RunType} from "./RunType.js";
import {TargetType} from "./TargetType.js";
import {TemplatesPanel} from "./panels/Templates.js";
import {Utils} from "./Utils.js";

export class CommandBox {

  constructor (pRouter, pApi) {
    this.router = pRouter;
    this.api = pApi;

    const cmdbox = document.getElementById("cmd-box");
    this.cmdmenu = new DropDownMenu(cmdbox);

    this.documentation = new Documentation(this.router, this);
    this._registerCommandBoxEventListeners();

    RunType.createMenu();
    TargetType.createMenu();

    const manualRun = document.getElementById("popup-run-command");
    Utils.addTableHelp(manualRun, "Click for help", "bottom-center");
    const helpButton = manualRun.querySelector("#help");
    helpButton.addEventListener("click", (pClickEvent) => {
      CommandBox._showHelp();
      pClickEvent.stopPropagation();
    });
  }

  static _templateCatMenuItemTitle (pCategory) {
    let title;
    if (pCategory === undefined) {
      title = "(undefined)";
    } else if (pCategory === null) {
      title = "(all)";
    } else {
      title = pCategory;
    }
    if (CommandBox.templateTmplMenu && CommandBox.templateTmplMenu._templateCategory === pCategory) {
      title = Character.BLACK_CIRCLE + " " + title;
    }
    return title;
  }

  static _populateTemplateCatMenu () {
    const titleElement = document.getElementById("template-catmenu-here");
    if (titleElement.childElementCount) {
      // only build one dropdown menu. cannot be done in constructor
      // since the storage-item is then not populated yet.
      CommandBox.templateCatMenu.setTitle("");
      return;
    }
    const menu = new DropDownMenu(titleElement);
    menu.setTitle("");
    menu.menuButton.classList.add("small-button-left");
    CommandBox.templateCatMenu = menu;
    const templates = Utils.getStorageItemObject("session", "templates");
    const categories = TemplatesPanel.getTemplatesCategories(templates);
    if (categories.length < 2) {
      // no useful content
      return;
    }
    categories.unshift(null);
    for (const category of categories) {
      menu.addMenuItem(
        () => CommandBox._templateCatMenuItemTitle(category),
        () => {
          CommandBox.templateTmplMenu._templateCategory = category;
          if (category === null) {
            CommandBox.templateCatMenu.setTitle("(all)");
          } else if (category === undefined) {
            CommandBox.templateCatMenu.setTitle("(undefined)");
          } else {
            CommandBox.templateCatMenu.setTitle(category);
          }
        }
      );
    }
  }

  static _templateTmplMenuItemTitle (pTemplate) {
    if (CommandBox.templateTmplMenu._templateCategory === null) {
      // "(all)" selected, return all
      return pTemplate.description;
    }
    if (CommandBox.templateTmplMenu._templateCategory === undefined && pTemplate.category === undefined && pTemplate.categories === undefined) {
      // no category selected, return templates without category
      return pTemplate.description;
    }
    if (pTemplate.category && pTemplate.category === CommandBox.templateTmplMenu._templateCategory) {
      // item has one category, return when it matches
      return pTemplate.description;
    }
    if (pTemplate.categories && pTemplate.categories.indexOf(CommandBox.templateTmplMenu._templateCategory) >= 0) {
      // item has a list of categories, return when one matches
      return pTemplate.description;
    }
    return null;
  }

  static _populateTemplateTmplMenu () {
    const titleElement = document.getElementById("template-tmplmenu-here");
    if (titleElement.childElementCount) {
      // only build one dropdown menu. cannot be done in constructor
      // since the storage-item is then not populated yet.
      // but reset the selected template category
      CommandBox.templateTmplMenu._templateCategory = null;
      return;
    }
    const menu = new DropDownMenu(titleElement);
    menu.menuButton.classList.add("small-button-left");
    CommandBox.templateTmplMenu = menu;
    CommandBox.templateTmplMenu._templateCategory = null;
    const templates = Utils.getStorageItemObject("session", "templates");
    const keys = Object.keys(templates).sort();
    for (const key of keys) {
      const template = templates[key];
      let description = template["description"];
      if (!description) {
        description = "(" + key + ")";
      }
      menu.addMenuItem(
        () => CommandBox._templateTmplMenuItemTitle(template),
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
    txt += "<p>";
    txt += "Entries that contain a @, (, ) or space are assumed to be a compound target selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/#compound-targeting' target='_blank' rel='noopener'>Compound Targeting" + Documentation.EXTERNAL_LINK + "</a>.";
    txt += "<br/>";
    txt += "Entries that contain a COMMA are assumed to be a list target selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/globbing.html#lists' target='_blank' rel='noopener'>List Targeting" + Documentation.EXTERNAL_LINK + "</a>.";
    txt += "<br/>";
    txt += "Entries that start with a # are assumed to be a nodegroup target selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/nodegroups.html' target='_blank' rel='noopener'>Nodegroup Targeting" + Documentation.EXTERNAL_LINK + "</a>.";
    txt += "<br/>";
    txt += "Target '##connected' will immediately be replaced by the latest known list of connected minions.";
    txt += "<br/>";
    txt += "Otherwise, the target is assumed to be a regular glob selection. See <a href='https://docs.saltstack.com/en/latest/topics/targeting/globbing.html#globbing' target='_blank' rel='noopener'>Globbing Targeting" + Documentation.EXTERNAL_LINK + "</a>.";
    txt += "<br/>";
    txt += "The dropdown-box to the right of the field is automatically updated with the assumed target type. When you do not agree, it is possible to manually select a value. That value will then be left alone by the system. Note that the dropdown-box only contains the choice 'Nodegroup' when nodegroups are configured in the <b>master</b> file.";
    txt += "<br/>";
    txt += "For <b>wheel</b> commands, the value of the target field is added to the commandline as the named variable 'match'. Wheel commands that do not use that parameter do not have a problem with that.";
    txt += "<br/>";
    txt += "For <b>runners</b> commands, the value of the target field can be left empty. Any value is silently ignored.";
    txt += "</p>";

    txt += "<br/>";

    txt += "<h2>Command field</h2>";
    txt += "<p>";
    txt += "The command field is used to enter the command and its parameters. Double quotes (\") are needed around each item that contains spaces, or when it is otherwise mistaken for a number, boolean, list or object according to the <a href='https://tools.ietf.org/html/rfc7159' target='_blank' rel='noopener'>JSON" + Documentation.EXTERNAL_LINK + "</a> notation. Additionally, strings in the form \"\"\"string\"\"\" are recognized. This is a notation from the <a href='https://docs.python.org/3/tutorial/introduction.html#strings' target='_blank' rel='noopener'>Python" + Documentation.EXTERNAL_LINK + "</a> language, which is very useful for the construction of strings that need to contain double-quote characters. This form does not handle any escape characters.";
    txt += "<br/>";
    txt += "Parameters in the form name=value are used to pass named variables. The same quoting rules apply to the value. The named parameters are used from left-to-right. Their actual position within the line is otherwise not important.";
    txt += "<br/>";
    txt += "Enter `salt-run` commands with the prefix `runners.`. e.g. `runners.jobs.last_run`. The target field can remain empty in that case as it is not used.";
    txt += "<br/>";
    txt += "Enter `salt-call` commands with the prefix `wheel.`. e.g. `wheel.key.finger`. The target field will be added as named parameter `target`. But note that that parameter may not actually be used depending on the command.";
    txt += "<br/>";
    txt += "A help button is visible when the command field contains some text. It will issue a <b>sys.doc</b> (or <b>runners.doc.wheel</b> or <b>runners.doc.runner</b>) command for the current command. The <b>sys.doc</b> command will be targetted to the given minions when the target field is not empty. It will be targetted to all minions when it is empty. The <b>runners.doc.wheel</b> or <b>runners.doc.runner</b> commands will always run on the master. When answers from multiple minions are available from <b>sys.doc</b>, only the first reasonable answer is used. Small variations in the answer may exist when not all minions have the same software version.";
    txt += "</p>";

    txt += "<br/>";

    txt += "<h2>Run command button</h2>";
    txt += "<p>";
    txt += "The 'Run command' button starts the given command for the given minions.";
    txt += "<br/>";
    txt += "A dropdown menu to the right of the button can be used to specify that the command must be run asynchronously. In that case, the output consists only of a link to retrieve the actual output and also an indication on the progress per minion, which will be updated asynchronously. When option <b>state_events</b> is set to <b>true</b> in the <b>master</b> file, then also the progress of individual states is shown.";
    txt += "<br/>";
    txt += "When a command takes too long, the command window can be closed without waiting for the output. The Jobs page can then be used to find that command and watch its progress or results.";
    txt += "</p>";

    txt += "<br/>";

    txt += "<h2>Output panel</h2>";
    txt += "<p>";
    txt += "When the output is recognized as output from (a command similar to) <b>state.highstate</b>, then the output is formatted for readability. e.g. durations shorter than 10 milliseconds are removed. On the same line as the minion name, a summary is shown in the form of coloured CIRCLE characters. There is one character for each state. When the circle has a double bar over/under it (it is always both) then the state reported that work was done and it may be interesting to see it. Clicking on a circle will scroll to the corresponding state output and shortly highlight it.";
    txt += "<br/>";
    txt += "Clicking on any output will scroll back to the minion name.";
    txt += "<br/>";
    txt += "When a minion has multiple lines of output, it can be collapsed.";
    txt += "</p>";

    txt += "<br/>";

    txt += "<h2>Templates</h2>";
    txt += "<p>";
    txt += "The server-side configuration file can define common used values for the target and command fields, or combinations of these. The command menu to use these templates becomes visible on this screen when there is at least one template defined in the configuration file. See README.md for more details.";
    txt += "</p>";

    output.innerHTML = txt;
  }

  _registerCommandBoxEventListeners () {
    document.getElementById("popup-run-command").addEventListener(
      "click", (pClickEvent) => {
        // only close if click is really outside the window
        // and not from any child element
        if (pClickEvent.target.id === "popup-run-command") {
          CommandBox.hideManualRun();
        }
        pClickEvent.stopPropagation();
      });
    document.getElementById("button-manual-run").addEventListener(
      "click", (pClickEvent) => {
        CommandBox.showManualRun(this.api);
        pClickEvent.stopPropagation();
      });
    document.getElementById("cmd-close-button").addEventListener(
      "click", (pClickEvent) => {
        CommandBox.hideManualRun();
        pClickEvent.stopPropagation();
      });

    document.querySelector(".run-command input[type='submit']").
      addEventListener("click", (pClickEvent) => {
        this._onRun();
        pClickEvent.stopPropagation();
      });

    document.getElementById("target").
      addEventListener("input", () => {
        const targetField = document.getElementById("target");
        if (targetField.value === "##connected") {
          // just replace it with the actual value
          targetField.value = Utils.getStorageItem("session", "connected", "");
        }
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

  static getScreenModifyingCommands () {
    return {
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
      "state.apply": ["highstate"],
      "state.highstate": ["highstate"],
      "state.sls_id": ["issues"]
    };
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
    output.innerText = "loading...";

    const screenModifyingCommands = CommandBox.getScreenModifyingCommands();
    // test whether the command may have caused an update to the list
    const command = commandValue.split(" ")[0];
    if (command in screenModifyingCommands) {
      // update panel when it may have changed
      for (const panel of Router.currentPage.panels) {
        if (screenModifyingCommands[command].indexOf(panel.key) >= 0) {
          // Arrays.includes() is only available from ES7/2016
          // the command may have changed a specific panel
          panel.needsRefresh = true;
        } else if (screenModifyingCommands[command].indexOf("*") >= 0) {
          // Arrays.includes() is only available from ES7/2016
          // the command may have changed any panel
          panel.needsRefresh = true;
        }
      }
    }
    // update panels that show job-statusses
    for (const panel of Router.currentPage.panels) {
      if (panel.key !== "job" && panel.key !== "jobs") {
        // panel does not show jobs (or a job)
      } else if (command.startsWith("wheel.")) {
        // wheel commands do not end up in the jobs list
      } else if (command.startsWith("runners.")) {
        // runners commands do not end up in the jobs list
      } else {
        panel.needsRefresh = true;
      }
    }

    func.then((pResponse) => {
      if (pResponse) {
        CommandBox.onRunReturn(pResponse.return[0], commandValue);
        CommandBox._prepareForAsyncResults(pResponse);
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
    Output.addResponseOutput(outputContainer, null, minions, pResponse, pCommand, "done", undefined, undefined);
    const targetField = document.getElementById("target");
    const commandField = document.getElementById("command");
    const button = document.querySelector(".run-command input[type='submit']");
    targetField.disabled = false;
    commandField.disabled = false;
    button.disabled = false;
  }

  static showManualRun (pApi) {
    const manualRun = document.getElementById("popup-run-command");
    manualRun.style.display = "block";

    const outputField = document.querySelector(".run-command pre");
    outputField.innerText = "Waiting for command...";

    const targetField = document.getElementById("target");
    TargetType.autoSelectTargetType(targetField.value);
    targetField.onkeyup = (keyUpEvent) => {
      if (keyUpEvent.key === "Escape") {
        CommandBox.hideManualRun();
      }
    };

    const commandField = document.getElementById("command");
    commandField.onkeyup = (keyUpEvent) => {
      if (keyUpEvent.key === "Escape") {
        CommandBox.hideManualRun();
      }
    };

    RunType.setRunTypeDefault();

    // (re-)populate the dropdown box
    const targetList = document.getElementById("data-list-target");
    while (targetList.firstChild) {
      targetList.removeChild(targetList.firstChild);
    }
    const nodeGroups = Utils.getStorageItemObject("session", "nodegroups");

    const optionConnected = Utils.createElem("option");
    optionConnected.value = "##connected";
    targetList.appendChild(optionConnected);

    for (const nodeGroup of Object.keys(nodeGroups).sort()) {
      const option = Utils.createElem("option");
      option.value = "#" + nodeGroup;
      targetList.appendChild(option);
    }

    const minions = Utils.getStorageItemList("session", "minions");
    for (const minionId of [...minions].sort()) {
      const option = Utils.createElem("option");
      option.value = minionId;
      targetList.appendChild(option);
    }

    // give another field (which does not have a list) focus first
    // because when a field gets focus 2 times in a row,
    // the dropdown box opens, and we don't want that...
    commandField.focus();
    targetField.focus();

    CommandBox._populateTemplateCatMenu();
    CommandBox._populateTemplateTmplMenu();

    const localTestProviders = pApi.getLocalTestProviders();

    localTestProviders.then((pData) => {
      Documentation._handleLocalTestProviders(pData);
    }, () => {
      // VOID
    });
  }

  static hideManualRun () {
    const manualRun = document.getElementById("popup-run-command");
    manualRun.style.display = "none";

    // reset to default, so that its value is initially hidden
    RunType.setRunTypeDefault();
    TargetType.setTargetTypeDefault();

    if (Router.currentPage) {
      Router.currentPage.refreshPage();
    }
  }

  static _showError (pMessage) {
    CommandBox.onRunReturn("ERROR:\n\n" + pMessage, "");
  }

  getRunParams (pTargetType, pTarget, pToRun, pisRunTypeNormalOnly = false, pCanUseFullReturn = true) {

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

    // prevent a common spelling error
    if (functionToRun === "runner" || functionToRun.startsWith("runner.")) {
      CommandBox._showError("'Runner' commands must be prefixed with 'runners.'");
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
      const nodeGroups = Utils.getStorageItemObject("session", "nodegroups");
      if (!(pTarget in nodeGroups)) {
        CommandBox._showError("Unknown nodegroup '" + pTarget + "'");
        return null;
      }
    }

    const fullReturn = pCanUseFullReturn && Utils.getStorageItemBoolean("session", "full_return");

    let params = {};
    if (functionToRun.startsWith("runners.")) {
      params = argsObject;
      params.client = "runner";
      params["full_return"] = fullReturn;
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
      if (argsArray.length > 0) {
        CommandBox._showError("Wheel commands can only take named parameters");
        return null;
      }
    } else {
      params.client = "local";
      params.fun = functionToRun;
      params.tgt = pTarget;
      params["full_return"] = fullReturn;
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
    if (!pisRunTypeNormalOnly && runType === "async") {
      if (params.client === "local" && runType === "async") {
        params.client = "local_async";
        // return will look like:
        // { "jid": "20180718173942195461", "minions": [ ... ] }
      } else {
        CommandBox._showError("Async is not supported for '" + functionToRun + "'");
        return null;
      }
    }

    return this.api.apiRequest("POST", "/", params);
  }

  static handleSaltJobRetEvent (pTag, pData) {
    // salt/job/20201105221605666661/ret/ss04
    // {"jid": "20201105221605666661", "id": "ss04", "return": {"no_|-states_|-states_|-None": {"result": false, "comment": "No Top file or master_tops data matches found. Please see master log for details.", "name": "No States", "changes": {}, "__run_num__": 0}}, "retcode": 2, "success": false, "fun": "state.apply", "fun_args": null, "out": "highstate", "_stamp": "2020-11-05T22:16:06.377513"}
    const part = pTag.split("/");
    if (part.length !== 5) {
      Utils.info("unkown tag", pTag);
      return;
    }

    const eventJid = part[2];
    const eventMinionId = part[4];

    if (CommandBox.jid !== eventJid) {
      // not the job that we are looking at
      return;
    }

    const id = "run-" + Utils.getIdFromMinionId(eventMinionId);
    let div = document.getElementById(id);
    if (div === null) {
      div = Utils.createDiv();
      div.id = "run-" + Utils.getIdFromMinionId(eventMinionId);
      div.style.marginTop = 0;

      const minionSpan1 = Utils.createSpan("", eventMinionId);
      div.appendChild(minionSpan1);

      const minionSpan2 = Utils.createSpan("", ": " + Character.HOURGLASS_WITH_FLOWING_SAND + " ");
      div.appendChild(minionSpan2);

      const output = document.querySelector(".run-command pre");
      output.appendChild(div);
    }

    const isSuccess = Output._getIsSuccess(pData);
    const minionClass = Output.getMinionLabelClass(isSuccess, pData);

    const span1 = div.children[0];
    span1.classList.add("minion-id", minionClass);

    const span2 = div.children[1];
    span2.innerText = div.children.length > 2 ? ": " : "";
  }

  static handleSaltJobProgEvent (pTag, pData) {
    // salt/job/20201105020540728914/prog/ss01/0
    const part = pTag.split("/");
    if (part.length !== 6) {
      Utils.info("unkown tag", pTag);
      return;
    }

    const eventJid = part[2];
    const eventMinionId = part[4];
    const eventSeqNr = parseInt(part[5], 10);

    if (CommandBox.jid !== eventJid) {
      // not the job that we are looking at
      return;
    }

    const task = pData.data.ret;

    const divId = "run-" + Utils.getIdFromMinionId(eventMinionId);
    const div = document.getElementById(divId);
    if (div === null) {
      Utils.log("div=null, minion=" + eventMinionId);
      return;
    }

    // make sure there is a black circle for the current event
    while (div.children.length <= eventSeqNr + 2) {
      const newSpan = Utils.createSpan("", Character.BLACK_CIRCLE);
      div.appendChild(newSpan);
    }

    const span = div.children[eventSeqNr + 2];
    Output._setTaskToolTip(span, task);
  }

  static _prepareForAsyncResults (pResponse) {
    const ret = pResponse.return[0];
    CommandBox.jid = ret.jid;
    CommandBox.minionIds = ret.minions;

    const output = document.querySelector(".run-command pre");

    // fix the JID label
    // it is not a minion-id, so deserves no status
    const jidId = Utils.getIdFromMinionId("jid");
    const labelSpan = document.querySelector("div#" + jidId + " span span");
    if (labelSpan === null) {
      // not an asynchronous job
      return;
    }
    labelSpan.classList.remove("minion-id", "host-success");

    // remove the initial minions list
    const minionsId = Utils.getIdFromMinionId("minions");
    const minionsList = document.getElementById(minionsId);
    minionsList.remove();

    // leave some space
    const spacerDiv = Utils.createDiv();
    output.appendChild(spacerDiv);

    // add new minions list to track progress of this state command
    for (const minionId of CommandBox.minionIds) {
      const minionDiv = Utils.createDiv("task-summary");
      minionDiv.id = "run-" + Utils.getIdFromMinionId(minionId);
      minionDiv.style.marginTop = 0;

      const minionSpan1 = Utils.createSpan("", minionId);
      minionDiv.appendChild(minionSpan1);

      const minionSpan2 = Utils.createSpan("", ": " + Character.HOURGLASS_WITH_FLOWING_SAND + " ");
      minionDiv.appendChild(minionSpan2);

      output.appendChild(minionDiv);
    }

    const warnSpan = Utils.createSpan(
      "",
      "\nnote that unresponsive minions will not time out in this overview");
    output.appendChild(warnSpan);
  }
}
