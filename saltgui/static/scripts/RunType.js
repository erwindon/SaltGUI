/* global console document */

import {DropDownMenu} from "./DropDown.js";

export class RunType {

  static createMenu () {
    const runblock = document.getElementById("run-block");
    RunType.menuRunType = new DropDownMenu(runblock);
    // do not show the menu title at first
    RunType.menuRunType.setTitle("");
    RunType.menuRunType.addMenuItem("Normal", this._updateRunTypeText, "normal");
    RunType.menuRunType.addMenuItem("Async", this._updateRunTypeText, "async");
    RunType._updateRunTypeText();
  }

  static _updateRunTypeText () {
    const runType = RunType.getRunType();

    switch (runType) {
    case "normal":
      // now that the menu is used show the menu title
      RunType.menuRunType.setTitle("Normal");
      break;
    case "async":
      RunType.menuRunType.setTitle("Async");
      break;
    default:
      console.error("runType", runType);
    }

    const menuItems = RunType.menuRunType.menuDropdownContent.children;
    for (let i = 0; i < menuItems.length; i++) {
      let menuItemText = menuItems[i].innerText;
      menuItemText = menuItemText.replace(/^. /, "");
      if (menuItems[i]._value === runType) {
        // 25CF = BLACK CIRCLE
        menuItemText = "\u25CF " + menuItemText;
      }
      menuItems[i].innerText = menuItemText;
    }
  }

  static setRunTypeDefault () {
    RunType.menuRunType._value = "normal";
    RunType._updateRunTypeText();
    // reset the title to the absolute minimum
    // so that the menu does not stand out in trivial situations
    RunType.menuRunType.setTitle("");
  }

  static getRunType () {
    const runType = RunType.menuRunType._value;
    if (runType === undefined || runType === "") {
      return "normal";
    }
    return runType;
  }

}
