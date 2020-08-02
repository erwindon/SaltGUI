/* global config document */

import {Output} from "../output/Output.js";
import {ParseCommandLine} from "../ParseCommandLine.js";
import {TargetType} from "../TargetType.js";

export class Route {

  constructor (pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter) {
    this.path = new RegExp("^" + config.NAV_URL.replace(/\//, "[/]") + "[/]" + pPath + "$");
    this.name = pPageName;
    this.pageElement = document.getElementById(pPageSelector);
    this.router = pRouter;
    if (pMenuItemSelector) {
      this.menuItemElement1 = document.getElementById(pMenuItemSelector + "1");
      this.menuItemElement2 = document.getElementById(pMenuItemSelector + "2");
    }

    this.runCommand = this.runCommand.bind(this);
  }

  __getName () {
    return this.name;
  }

  getPath () {
    return this.path;
  }

  getPageElement () {
    return this.pageElement;
  }

  getMenuItemElement1 () {
    return this.menuItemElement1;
  }

  getMenuItemElement2 () {
    return this.menuItemElement2;
  }

  static createTd (pClassName, pInnerText) {
    const td = document.createElement("td");
    if (pClassName) {
      td.className = pClassName;
    }
    if (pInnerText) {
      td.innerText = pInnerText;
    }
    return td;
  }

  static createDiv (pClassName, pInnerText) {
    const div = document.createElement("div");
    if (pClassName) {
      div.className = pClassName;
    }
    if (pInnerText) {
      div.innerText = pInnerText;
    }
    return div;
  }

  static createSpan (pClassName, pInnerText) {
    const span = document.createElement("span");
    if (pClassName) {
      span.className = pClassName;
    }
    if (pInnerText) {
      span.innerText = pInnerText;
    }
    return span;
  }

  runCommand (pClickEvent, pTargetString, pCommandString) {
    this.runFullCommand(pClickEvent, "", pTargetString, pCommandString);
  }

  runFullCommand (pClickEvent, pTargetType, pTargetString, pCommandString) {
    this.router.commandbox.showManualRun(pClickEvent);
    const target = document.getElementById("target");
    const command = document.getElementById("command");
    const targetbox = document.getElementById("target-box");

    if (!pTargetString) {
      pTargetString = "";
    }
    // handle https://github.com/saltstack/salt/issues/48734
    if (pTargetString === "unknown-target") {
      // target was lost...
      pTargetString = "";
      pTargetType = "";
    }

    if (!pCommandString) {
      pCommandString = "";
    }
    if (pCommandString.startsWith("wheel.") && pTargetString.endsWith("_master")) {
      // target was {minionId}_master...
      // too bad when the real minionId is actually like that :-(
      pTargetString = "";
      pTargetType = "";
    }
    if (pCommandString.startsWith("runners.")) {
      // runners do not have a target, so do not bother
      pTargetString = "";
      pTargetType = "";
    }

    if (pTargetType) {
      let targetType = pTargetType;
      // show the extended selection controls when
      targetbox.style.display = "inherit";
      if (targetType !== "glob" && targetType !== "list" && targetType !== "compound" && targetType !== "nodegroup") {
        // we don't support that, revert to standard (not default)
        targetType = "glob";
      }
      TargetType.setTargetType(targetType);
    }
    TargetType.autoSelectTargetType(pTargetString);

    target.value = pTargetString;
    command.value = pCommandString;
    // the menu may become (in)visible due to content of command field
    this.router.commandbox.cmdmenu.verifyAll();
  }

  decodeArgumentsText (rawArguments) {

    if (rawArguments === undefined) {
      // no arguments
      return "";
    }

    if (typeof rawArguments !== "object") {
      // expecting an array (which is an object)
      // just return the representation of anything else
      return " " + JSON.stringify(rawArguments);
    }

    if (!Array.isArray(rawArguments)) {
      // expecting an array
      // just return the representation of anything else
      return " " + JSON.stringify(rawArguments);
    }

    let ret = "";
    for (const obj of rawArguments) {
      // all KWARGS are one entry in the parameters array
      if (obj && typeof obj === "object" && "__kwarg__" in obj) {
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
          if (key === "__kwarg__") {
            continue;
          }
          ret += " " + key + "=" + Output.formatObject(obj[key]);
        }
      } else if (typeof obj === "string" &&
                ParseCommandLine.getPatJid().test(obj)) {
        // prevent quotes being added on JIDs
        ret += " " + obj;
      } else {
        const objAsString = Output.formatObject(obj);
        ret += " " + objAsString.replace(/\n/g, " ");
      }
    }

    return ret;
  }

  onShow () {
    // VOID
  }
}
