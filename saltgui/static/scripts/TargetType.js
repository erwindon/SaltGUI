/* global */

import {Character} from "./Character.js";
import {DropDownMenuRadio} from "./DropDownRadio.js";
import {Utils} from "./Utils.js";

export class TargetType {

  static createMenu () {
    const targetbox = document.getElementById("target-box");
    TargetType.menuTargetType = new DropDownMenuRadio(targetbox);
    // do not show the menu title at first
    TargetType.menuTargetType.setTitle("");
    TargetType.menuTargetType.setDefaultValue("glob");
    TargetType.menuTargetType.addMenuItemRadio("glob", "Normal");
    TargetType.menuTargetType.addMenuItemRadio("list", "List");
    TargetType.menuTargetType.addMenuItemRadio("nodegroup", () => TargetType._targetTypeNodeGroupPrepare());
    TargetType.menuTargetType.addMenuItemRadio("compound", "Compound");
    TargetType.autoSelectTargetType("");
  }

  // It takes a while before we known the list of nodegroups
  // so this conclusion must be re-evaluated each time
  static _targetTypeNodeGroupPrepare () {
    const nodeGroups = Utils.getStorageItemObject("session", "nodegroups");
    if (!nodeGroups || Object.keys(nodeGroups).length === 0) {
      return null;
    }

    return "Nodegroup";
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
      Utils.error("targetType", targetType);
    }

    TargetType.menuTargetType._value = targetType;

    TargetType._setMenuMarker();
  }

  static _setMenuMarker () {
    const targetType = TargetType._getTargetType();
    const menuItems = TargetType.menuTargetType.menuDropdownContent.children;
    for (const menuItem of menuItems) {
      let menuItemText = menuItem.innerText;
      menuItemText = menuItemText.replace(/^. /, "");
      if (menuItem._value === targetType) {
        menuItemText = Character.BLACK_CIRCLE + " " + menuItemText;
      }
      menuItem.innerText = menuItemText;
    }
    return null;
  }

  static getTargetTypeFromTarget (pTarget) {
    if (Array.isArray(pTarget)) {
      return "list";
    }
    if (pTarget.includes("@") || pTarget.includes(" ") ||
      pTarget.includes("(") || pTarget.includes(")")) {
      // "@" is a strong indicator for compound target
      // but "space", "(" and ")" are also typical for compound target
      return "compound";
    }
    if (pTarget.includes(",")) {
      // "," is a strong indicator for list target (when it is also not compound)
      return "list";
    }
    if (pTarget.startsWith("#")) {
      // "#" at the start of a line is a strong indicator for nodegroup target
      // this is not a SALTSTACK standard, but our own invention
      return "nodegroup";
    }
    return "glob";
  }

  static autoSelectTargetType (pTarget) {
    if (!TargetType.menuTargetType._system) {
      // user has selected the value, do not touch it
      return;
    }

    if (Array.isArray(pTarget)) {
      TargetType.menuTargetType._value = "list";
    } else if (pTarget.includes("@") || pTarget.includes(" ") ||
      pTarget.includes("(") || pTarget.includes(")")) {
      // "@" is a strong indicator for compound target
      // but "space", "(" and ")" are also typical for compound target
      TargetType.menuTargetType.setDefaultValue("compound");
    } else if (pTarget.includes(",")) {
      // "," is a strong indicator for list target (when it is also not compound)
      TargetType.menuTargetType.setDefaultValue("list");
    } else if (pTarget.startsWith("#")) {
      // "#" at the start of a line is a strong indicator for nodegroup target
      // this is not a SALTSTACK standard, but our own invention
      TargetType.menuTargetType.setDefaultValue("nodegroup");
    } else {
      TargetType.menuTargetType.setDefaultValue("glob");
    }
  }

  static setTargetType (pTargetType) {
    TargetType.menuTargetType.setValue(pTargetType);
  }

  static _getTargetType () {
    return TargetType.menuTargetType.getValue();
  }

  static makeTargetText (pObj) {
    const targetType = pObj["Target-type"];
    const targetPattern = pObj.Target;

    // note that "glob" is the most common case
    // when used from the command-line, that target-type
    // is not even specified.
    // therefore we suppress that one

    // note that due to bug in 2018.3, all finished jobs
    // will be shown as if of type "list"
    // therefore we suppress that one

    let returnText = "";
    if (targetType !== "glob" && targetType !== "list") {
      returnText = targetType + " ";
    }
    returnText += targetPattern;
    return returnText;
  }
}
