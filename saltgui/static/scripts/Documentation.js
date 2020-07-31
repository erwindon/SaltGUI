/* global document */

// documentation utilities

import {TargetType} from "./TargetType.js";

export class Documentation {

  // formatting of the documentation is done as a regular output type
  // that is therefore in output.js

  constructor (pCommandBox) {
    this.commandbox = pCommandBox;
    this._manualRunMenuSysDocRun = this._manualRunMenuSysDocRun.bind(this);

    pCommandBox.cmdmenu.addMenuItem(
      this._manualRunMenuSysDocPrepare,
      this._manualRunMenuSysDocRun);
  }

  _manualRunMenuSysDocPrepare (pMenuItem) {
    const targetField = document.getElementById("target");
    let target = targetField.value;
    target = target ? "target" : "all minions";
    const commandField = document.getElementById("command");
    let command = commandField.value;
    // remove the command arguments
    command = command.trim().replace(/ .*/, "");
    command = command.trim().replace(/[.]*$/, "");
    if (!command.match(/^[a-z_][a-z0-9_.]*$/i)) {
      // When it is not a command, don't treat it as a command.
      // This RE still allows some illegal command formats, but
      // that is something that sys.doc/runners.doc can handle.
      pMenuItem.style.display = "none";
    } else if (!command) {
      // this spot was reserved for `sys.doc` without parameters
      // but that is far too slow for normal use
      pMenuItem.style.display = "none";
    } else if (command === "runners" || command.startsWith("runners.")) {
      // actually "command" is not passed, but we select that part of the actual result
      // because `runners.doc.runner` always returns all documentation for "runners"
      command = command.substring(8);
      if (command) {
        command = " " + command;
      }
      pMenuItem.innerText = "Run 'runners.doc.runner" + command + "'";
      pMenuItem.style.display = "block";
    } else if (command === "wheel" || command.startsWith("wheel.")) {
      // actually "command" is not passed, but we select that part of the actual result
      // because `runners.doc.wheel` always returns all documentation for "wheel"
      command = command.substring(6);
      if (command) {
        command = " " + command;
      }
      pMenuItem.innerText = "Run 'runners.doc.wheel" + command + "'";
      pMenuItem.style.display = "block";
    } else {
      pMenuItem.innerText = "Run 'sys.doc " + command + "' on " + target;
      pMenuItem.style.display = "block";
    }
  }

  _manualRunMenuSysDocRun () {
    const button = document.getElementById("run-command");
    if (button.disabled) {
      return;
    }
    const output = document.getElementById("popup-output");

    const targetField = document.getElementById("target");
    let target = targetField.value;
    // the help text is taken from the first minion that answers
    // when no target is selected, just ask all minions
    if (target === "") {
      target = "*";
    }

    // do not use the command-parser
    const commandField = document.getElementById("command");
    let command = commandField.value;
    // remove arguments
    command = command.trim().replace(/ .*/, "");
    // remove trailing dots
    command = command.trim().replace(/[.]*$/, "");
    // command can be empty here (but the gui prevents that)

    button.disabled = true;
    output.innerText = "Loading...";

    let docCommand;
    let dummyCommand;
    if (command === "runners" || command.startsWith("runners.")) {
      // runners command. docCommand is WITHOUT further arguments
      docCommand = "runners.doc.runner";
      dummyCommand = "runners.doc.runner " + command;
    } else if (command === "wheel" || command.startsWith("wheel.")) {
      // wheel command. docCommand is WITHOUT further arguments
      docCommand = "runners.doc.wheel";
      dummyCommand = "runners.doc.wheel " + command;
    } else {
      // regular command. docCommand is WITH further argument
      docCommand = "sys.doc " + command;
      dummyCommand = "sys.doc " + command;
    }

    const targetType = TargetType.menuTargetType._value;

    this.commandbox.getRunParams(targetType, target, docCommand, true).then((pResponse) => {
      this.commandbox.onRunReturn(pResponse.return[0], dummyCommand);
    }, (pResponse) => {
      this.commandbox.onRunReturn("DOCUMENTATION ERROR:\n\n" + JSON.stringify(pResponse), dummyCommand);
    });
  }

}
