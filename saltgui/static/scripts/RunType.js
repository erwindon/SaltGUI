/* global */

import {Character} from "./Character.js";
import {DropDownMenu} from "./DropDown.js";
import {Utils} from "./Utils.js";

export class RunType {

  static createMenus () {
    const batchMenuRelJobs = [10, 25];
    const batchMenuAbsJobs = [1, 2, 3, 5, 10];
    const batchMenuWaitTimes = [0, 1, 2, 3, 5, 10, 30, 60];

    const runblock = document.getElementById("run-block");
    RunType.menuRunType = new DropDownMenu(runblock);
    // do not show the menu title at first
    RunType.menuRunType.setTitle("");
    RunType.menuRunType.addMenuItem("Normal", RunType._updateRunTypeText, "normal");
    RunType.menuRunType.addMenuItem("Async", RunType._updateRunTypeText, "async");
    RunType.menuRunType.addMenuItem("Batch", RunType._updateRunTypeText, "batch");

    RunType.menuBatchSize = new DropDownMenu(runblock);
    RunType.menuBatchSize.setTitle("Batch Size");
    for (const rel of batchMenuRelJobs) {
      RunType.menuBatchSize.addMenuItem(rel.toString() + "%",
        RunType._updateRunTypeText,
        rel.toString() + "%");
    }
    for (const abs of batchMenuAbsJobs) {
      RunType.menuBatchSize.addMenuItem(abs.toString(),
        RunType._updateRunTypeText,
        abs.toString());
    }
    RunType.menuBatchSize.hideMenu();
    RunType.menuBatchSize.menuButton.style.marginLeft = "10px";

    // batch_wait was introduced in salt 2016.3
    // we take no special actions for older systems
    RunType.menuBatchWait = new DropDownMenu(runblock);
    RunType.menuBatchWait.setTitle("Batch Wait");
    for (const wait of batchMenuWaitTimes) {
      if (wait === 0) {
        RunType.menuBatchWait.addMenuItem("None",
          RunType._updateRunTypeText,
          wait);
      } else if (wait === 1) {
        RunType.menuBatchWait.addMenuItem(wait.toString() + " second",
          RunType._updateRunTypeText,
          wait);
      } else {
        RunType.menuBatchWait.addMenuItem(wait.toString() + " seconds",
          RunType._updateRunTypeText,
          wait);
      }
    }
    RunType.menuBatchWait.hideMenu();
    RunType.menuBatchWait.menuButton.style.marginLeft = "10px";

    RunType._updateRunTypeText();
  }

  static _updateRunTypeText () {
    const runType = RunType.getRunType();
    const batchSize = RunType.getBatchSize();
    const batchWait = RunType.getBatchWait();

    // now that the menu is used show the menu title
    // this is much clearer when the Size/Wait menus are also shown

    switch (runType) {
    case "normal":
      RunType.menuRunType.setTitle("Normal");
      RunType.menuBatchSize.hideMenu();
      RunType.menuBatchWait.hideMenu();
      break;
    case "async":
      RunType.menuRunType.setTitle("Async");
      RunType.menuBatchSize.hideMenu();
      RunType.menuBatchWait.hideMenu();
      break;
    case "batch":
      RunType.menuRunType.setTitle("Batch");
      RunType.menuBatchSize.showMenu();
      RunType.menuBatchWait.showMenu();

      if (batchSize.endsWith("%")) {
        RunType.menuBatchSize.setTitle("Size " + batchSize);
      } else if (batchSize === "1") {
        RunType.menuBatchSize.setTitle("Size " + batchSize + " job");
      } else {
        RunType.menuBatchSize.setTitle("Size " + batchSize + " jobs");
      }

      if (batchWait === "0") {
        RunType.menuBatchWait.setTitle("No wait");
      } else if (batchWait === "1") {
        RunType.menuBatchWait.setTitle("Wait " + batchWait + " second");
      } else {
        RunType.menuBatchWait.setTitle("Wait " + batchWait + " seconds");
      }

      break;
    default:
      Utils.error("runType", runType);
    }

    // Store last used runType
    Utils.setStorageItem("local", "runtype", runType);

    const menuItems = RunType.menuRunType.menuDropdownContent.children;
    for (const menuItem of menuItems) {
      let menuItemText = menuItem.innerText;
      menuItemText = menuItemText.replace(/^. /, "");
      if (menuItem._value === runType) {
        menuItemText = Character.BLACK_CIRCLE + " " + menuItemText;
      }
      menuItem.innerText = menuItemText;
    }
  }

  static setRunTypeDefault () {
    // Retrieve last used runType
    let runType = Utils.getStorageItem("local", "runtype");
    // Set default if previous runtype not stored
    if (runType !== "normal" && runType !== "async") {
      runType = "normal";
    }
    RunType.menuRunType._value = runType;
    // do not reset the batchSize or batchWait
    RunType._updateRunTypeText();
    // reset the title to the absolute minimum
    // so that the menu does not stand out in trivial situations
    RunType.menuRunType.setTitle("");
  }

  static getRunType () {
    let runType = RunType.menuRunType._value;
    if (runType === undefined || runType === "") {
      runType = Utils.getStorageItem("local", "runtype", "normal");
    }
    return runType;
  }

  static getBatchSize () {
    const batchSize = RunType.menuBatchSize._value;
    if (batchSize === undefined || batchSize === "") {
      return "10%";
    }
    // returns a string, also for the regular batch sizes
    return batchSize;
  }

  static getBatchWait () {
    const batchWait = RunType.menuBatchWait._value;
    if (batchWait === undefined || batchWait === "") {
      return 0;
    }
    return parseInt(batchWait, 10);
  }
}
