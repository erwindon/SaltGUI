class RunType {

  static _registerEventListeners() {
    const batchMenuRelJobs = [10, 25]; // in %
    const batchMenuAbsJobs = [1, 2, 3, 5, 10];
    const batchMenuWaitTimes = [0, 1, 2, 3, 5, 10, 30, 60];

    const runblock = document.getElementById("runblock");
    RunType.menuRunType = new DropDownMenu(runblock);
    RunType.menuRunType.setTitle("");
    RunType.menuRunType.addMenuItem("Normal", this._updateRunTypeText, "normal");
    RunType.menuRunType.addMenuItem("Async", this._updateRunTypeText, "async");
    RunType.menuRunType.addMenuItem("Batch", this._updateRunTypeText, "batch");

    RunType.menuBatchSize = new DropDownMenu(runblock);
    RunType.menuBatchSize.setTitle("Batch&nbsp;Size");
    for(const rel of batchMenuRelJobs) {
      RunType.menuBatchSize.addMenuItem(rel.toString() + "%",
        this._updateRunTypeText,
        rel.toString() + "%");
    }
    for(const abs of batchMenuAbsJobs) {
      RunType.menuBatchSize.addMenuItem(abs.toString(),
        this._updateRunTypeText,
        abs.toString());
    }
    RunType.menuBatchSize.hideMenu();

    // batch_wait was introduced in salt 2016.3
    // we take no special actions for older systems
    RunType.menuBatchWait = new DropDownMenu(runblock);
    RunType.menuBatchWait.setTitle("Batch&nbsp;Wait");
    for(const wait of batchMenuWaitTimes) {
      if(wait === 0) {
        RunType.menuBatchWait.addMenuItem("None",
          this._updateRunTypeText,
          wait);
      } else if(wait === 1) {
        RunType.menuBatchWait.addMenuItem(wait.toString() + " second",
          this._updateRunTypeText,
          wait);
      } else {
        RunType.menuBatchWait.addMenuItem(wait.toString() + " seconds",
          this._updateRunTypeText,
          wait);
      }
    }
    RunType.menuBatchWait.hideMenu();
  }

  static _updateRunTypeText() {
    const runType = RunType.getRunType();
    const batchSize = RunType.getBatchSize();
    const batchWait = RunType.getBatchWait();

    // now that the menu is used show the menu title
    // this is much clearer when the Size/Wait menus are also shown

    switch(runType) {
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

      if(batchSize.endsWith("%")) {
        RunType.menuBatchSize.setTitle("Size " + batchSize);
      } else if(batchSize === "1") {
        RunType.menuBatchSize.setTitle("Size " + batchSize + " job");
      } else {
        RunType.menuBatchSize.setTitle("Size " + batchSize + " jobs");
      }

      if(batchWait == "0") {
        RunType.menuBatchWait.setTitle("No wait");
      } else if(batchWait == "1") {
        RunType.menuBatchWait.setTitle("Wait " + batchWait + " second");
      } else {
        RunType.menuBatchWait.setTitle("Wait " + batchWait + " seconds");
      }

      break;
    }
  }

  static setRunTypeDefault() {
    RunType.menuRunType.setValue("normal");
    // do not reset the batchSize or batchWait
    RunType._updateRunTypeText();
    // reset the title to the absolute minimum
    // so that the menu does not stand out in trivial situations
    RunType.menuRunType.setTitle("");
  }

  static getRunType() {
    const runType = RunType.menuRunType.getValue();
    if(runType === undefined || runType === "") return "normal";
    return runType;
  }

  static getBatchSize() {
    const batchSize = RunType.menuBatchSize.getValue();
    if(batchSize === undefined || batchSize === "") return "10%";
    // returns a string, also for the regular batch sizes
    return batchSize;
  }

  static getBatchWait() {
    const batchWait = RunType.menuBatchWait.getValue();
    if(batchWait === undefined || batchWait === "") return 0;
    return parseInt(batchWait);
  }

}
