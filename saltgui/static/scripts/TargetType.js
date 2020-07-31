/* global console document */

import {DropDownMenu} from "./DropDown.js";
import {Utils} from "./Utils.js";

export class TargetType {

  static createMenu () {
    const targetbox = document.getElementById("target-box");
    TargetType.menuTargetType = new DropDownMenu(targetbox);
    // do not show the menu title at first
    TargetType.menuTargetType.addMenuItem("Normal", this._manualUpdateTargetTypeText, "glob");
    TargetType.menuTargetType.addMenuItem("List", this._manualUpdateTargetTypeText, "list");
    TargetType.menuTargetType.addMenuItem(TargetType._targetTypeNodeGroupPrepare, this._manualUpdateTargetTypeText, "nodegroup");
    TargetType.menuTargetType.addMenuItem("Compound", this._manualUpdateTargetTypeText, "compound");
    TargetType.setTargetTypeDefault();
  }

  // It takes a while before we known the list of nodegroups
  // so this conclusion must be re-evaluated each time
  static _targetTypeNodeGroupPrepare (pMenuItem) {
    const nodeGroupsText = Utils.getStorageItem("session", "nodegroups");
    if (nodeGroupsText && nodeGroupsText !== "{}") {
      pMenuItem.innerText = "Nodegroup";
      pMenuItem.style.display = "block";
      // optimization as the list of nodegroups will not change until the next login
      // but mainly to preserve the highlight marker
      pMenuItem.verifyCallBack = null;
    } else {
      pMenuItem.style.display = "none";
    }
  }

  static _manualUpdateTargetTypeText () {
    TargetType.menuTargetType._system = false;
    TargetType._updateTargetTypeText();
  }

  static setTargetTypeDefault () {
    TargetType.menuTargetType._system = true;
    TargetType.menuTargetType._value = "glob";
    TargetType._updateTargetTypeText();
  }

  static _updateTargetTypeText () {
    const targetType = TargetType._getTargetType();

    switch (targetType) {
    case "compound":
      TargetType.menuTargetType.setTitle("Compound");
      break;
    case "glob":
      if (TargetType.menuTargetType._system) {
        // reset the title to the absolute minimum
        // so that the menu does not stand out in trivial situations
        TargetType.menuTargetType.setTitle("");
      } else {
        TargetType.menuTargetType.setTitle("Normal");
      }
      break;
    case "list":
      TargetType.menuTargetType.setTitle("List");
      break;
    case "nodegroup":
      TargetType.menuTargetType.setTitle("Nodegroup");
      break;
    default:
      console.error("targetType", targetType);
    }

    TargetType.menuTargetType._value = targetType;

    TargetType.setMenuMarker();
  }

  static setMenuMarker () {
    const targetType = TargetType._getTargetType();
    const menuItems = TargetType.menuTargetType.menuDropdownContent.children;
    for (let i = 0; i < menuItems.length; i++) {
      let menuItemText = menuItems[i].innerText;
      menuItemText = menuItemText.replace(/^. /, "");
      if (menuItems[i]._value === targetType) {
        // 25CF = BLACK CIRCLE
        menuItemText = "\u25CF " + menuItemText;
      }
      menuItems[i].innerText = menuItemText;
    }
  }

  static autoSelectTargetType (pTarget) {

    if (!TargetType.menuTargetType._system) {
      // user has selected the value, do not touch it
      return;
    }

    if (pTarget.includes("@") || pTarget.includes(" ") ||
      pTarget.includes("(") || pTarget.includes(")")) {
      // "@" is a strong indicator for compound target
      // but "space", "(" and ")" are also typical for compound target
      TargetType.menuTargetType._value = "compound";
    } else if (pTarget.includes(",")) {
      // "," is a strong indicator for list target (when it is also not compound)
      TargetType.menuTargetType._value = "list";
    } else if (pTarget.startsWith("#")) {
      // "#" at the start of a line is a strong indicator for nodegroup target
      // this is not a SALTSTACK standard, but our own invention
      TargetType.menuTargetType._value = "nodegroup";
    } else {
      TargetType.menuTargetType._value = "glob";
    }

    // show the new title
    TargetType._updateTargetTypeText();
  }

  static setTargetType (pTargetType) {
    TargetType.menuTargetType._value = pTargetType;
    TargetType.menuTargetType._system = true;
    TargetType._updateTargetTypeText();
  }

  static _getTargetType () {
    const targetType = TargetType.menuTargetType._value;
    if (targetType === undefined || targetType === "") {
      return "glob";
    }
    return targetType;
  }

  static makeTargetText (pTargetType, pTargetPattern) {
    // note that "glob" is the most common case
    // when used from the command-line, that target-type
    // is not even specified.
    // therefore we suppress that one

    // note that due to bug in 2018.3, all finished jobs
    // will be shown as if of type "list"
    // therefore we suppress that one

    let returnText = "";
    if (pTargetType !== "glob" && pTargetType !== "list") {
      returnText = pTargetType + " ";
    }
    returnText += pTargetPattern;
    return returnText;
  }

}
