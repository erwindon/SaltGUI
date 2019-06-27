import {Output} from '../output/Output.js';
import {ParseCommandLine} from '../ParseCommandLine.js';
import {TargetType} from '../TargetType.js';

export class Route {

  constructor(path, name, pPageSelector, pMenuItemSelector, router) {
    this.path = new RegExp(path);
    this.name = name;
    this.pageElement = document.querySelector(pPageSelector);
    this.router = router;
    if(pMenuItemSelector) {
      this.menuitem_element1 = document.querySelector(pMenuItemSelector + "1");
      this.menuitem_element2 = document.querySelector(pMenuItemSelector + "2");
    }
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }

  getPageElement() {
    return this.pageElement;
  }

  getMenuItemElement1() {
    return this.menuitem_element1;
  }

  getMenuItemElement2() {
    return this.menuitem_element2;
  }

  static _createTd(pClassName, pInnerText) {
    const td = document.createElement("td");
    if(pClassName) td.className = pClassName;
    if(pInnerText) td.innerText = pInnerText;
    return td;
  }

  static _createDiv(pClassName, pInnerText) {
    const div = document.createElement("div");
    if(pClassName) div.className = pClassName;
    if(pInnerText) div.innerText = pInnerText;
    return div;
  }

  static _createSpan(pClassName, pInnerText) {
    const span = document.createElement("span");
    if(pClassName) span.className = pClassName;
    if(pInnerText) span.innerText = pInnerText;
    return span;
  }

  _runCommand(evt, pTargetString, pCommandString) {
    this._runFullCommand(evt, "", pTargetString, pCommandString);
  }

  _runFullCommand(evt, targettype, pTargetString, pCommandString) {
    this.router.commandbox._showManualRun(evt);
    const target = document.querySelector("#target");
    const command = document.querySelector("#command");
    const targetbox = document.querySelector("#target-box");

    if(!pTargetString) pTargetString = "";
    // handle https://github.com/saltstack/salt/issues/48734
    if(pTargetString === "unknown-target") {
      // target was lost...
      pTargetString = "";
      targettype = "";
    }

    if(!pCommandString) pCommandString = "";
    if(pCommandString.startsWith("wheel.") && pTargetString.endsWith("_master")) {
      // target was {minionId}_master...
      // too bad when the real minionId is actually like that :-(
      pTargetString = "";
      targettype = "";
    }
    if(pCommandString.startsWith("runners.")) {
      // runners do not have a target, so do not bother
      pTargetString = "";
      targettype = "";
    }

    if(targettype) {
      let tt = targettype;
      // show the extended selection controls when
      targetbox.style.display = "inherit";
      if(tt !== "glob" && tt !== "list" && tt !== "compound" && tt !== "nodegroup") {
        // we don't support that, revert to standard (not default)
        tt = "glob";
      }
      TargetType.setTargetType(tt);
    }

    target.value = pTargetString;
    command.value = pCommandString;
    // the menu may become (in)visible due to content of command field
    this.router.commandbox.cmdmenu.verifyAll();
  }

  _decodeArgumentsText(rawArguments) {

    if(rawArguments === undefined) {
      // no arguments
      return "";
    }

    if(typeof rawArguments !== "object") {
      // expecting an array (which is an object)
      // just return the representation of anything else
      return " " + JSON.stringify(rawObject);
    }

    if(!Array.isArray(rawArguments)) {
      // expecting an array
      // just return the representation of anything else
      return " " + JSON.stringify(rawObject);
    }

    let ret = "";
    for(const obj of rawArguments) {
      // all KWARGS are one entry in the parameters array
      if(obj && typeof obj === "object" && "__kwarg__" in obj) {
        const keys = Object.keys(obj).sort();
        for(const key of keys) {
          if(key === "__kwarg__") continue;
          ret += " " + key + "=" + Output.formatObject(obj[key]);
        }
      } else if(typeof obj === "string" &&
                ParseCommandLine.getPatJid().test(obj)) {
        // prevent quotes being added on JIDs
        ret += " " + obj;
      } else {
        const s = Output.formatObject(obj);
        ret += " " + s.replace(/\n/g, " ");
      }
    }

    return ret;
  }

}
