/* global document */

import {Character} from "./Character.js";
import {DropDownMenu} from "./DropDown.js";
import {Utils} from "./Utils.js";

export class RunType {

  static createMenu () {
    const runblock = document.getElementById("run-block");
    RunType.menuRunType = new DropDownMenu(runblock);
    // do not show the menu title at first
    RunType.menuRunType.setTitle("");
    RunType.menuRunType.addMenuItem("Async", RunType._updateRunTypeText, "async");
    RunType.menuRunType.addMenuItem("Normal", RunType._updateRunTypeText, "normal");
    RunType._updateRunTypeText();
  }

  static _updateRunTypeText () {
    const runType = RunType.getRunType();

    switch (runType) {
    case "async":
      // now that the menu is used show the menu title
      RunType.menuRunType.setTitle("Async");
      break;
    case "normal":
      RunType.menuRunType.setTitle("Normal");
      break;
    default:
      Utils.error("runType", runType);
    }

    const menuItems = RunType.menuRunType.menuDropdownContent.children;
    for (let i = 0; i < menuItems.length; i++) {
      let menuItemText = menuItems[i].innerText;
      menuItemText = menuItemText.replace(/^. /, "");
      if (menuItems[i]._value === runType) {
        menuItemText = Character.BLACK_CIRCLE + " " + menuItemText;
      }
      menuItems[i].innerText = menuItemText;
    }
  }

  static setRunTypeDefault () {
    RunType.menuRunType._value = "async";
    RunType._updateRunTypeText();
    // reset the title to the absolute minimum
    // so that the menu does not stand out in trivial situations
    RunType.menuRunType.setTitle("");
  }

  static getRunType () {
    const runType = RunType.menuRunType._value;
    if (runType === undefined || runType === "") {
      return "async";
    }
    return runType;
  }
}
