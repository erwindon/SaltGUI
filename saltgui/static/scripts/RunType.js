/* global */

import {DropDownMenuRadio} from "./DropDownRadio.js";
import {Utils} from "./Utils.js";

export class RunType {

  static createMenu () {
    const runblock = document.getElementById("run-block");
    RunType.menuRunType = new DropDownMenuRadio(runblock);
    // do not show the menu title at first
    RunType.menuRunType.setTitle("");
    RunType.menuRunType.setDefaultValue("normal");
    RunType.menuRunType.addMenuItemRadio("normal", "Normal");
    RunType.menuRunType.addMenuItemRadio("async", "Async");
  }

  static setRunTypeDefault () {
    RunType.menuRunType.setValue(null);
    // Retrieve last used runType
    let runType = Utils.getStorageItem("local", "runtype");
    // Set default if previous runtype not stored
    if (runType !== "normal" && runType !== "async") {
      runType = "normal";
    }
    RunType.menuRunType.setDefaultValue(runType);
    // reset the title to the absolute minimum
    // so that the menu does not stand out in trivial situations
    RunType.menuRunType.setTitle("");
  }

  static getRunType () {
    let runType = RunType.menuRunType.getValue();
    if (runType === undefined || runType === "") {
      runType = Utils.getStorageItem("local", "runtype", "normal");
    }
    return runType;
  }
}
