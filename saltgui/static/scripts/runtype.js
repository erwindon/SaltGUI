class RunType {

  static _registerEventListeners() {
    let runblock = document.getElementById("runblock");
    RunType.menuRunType = new DropDownMenu(runblock);
    RunType.menuRunType.setTitle("");
    RunType.menuRunType.addMenuItem("Normal", this._setRunTypeNormal);
    RunType.menuRunType.addMenuItem("Async", this._setRunTypeAsync);
    RunType.menuRunType.addMenuItem("Batch", this._setRunTypeBatch);

    RunType.menuBatchSize = new DropDownMenu(runblock);
    RunType.menuBatchSize.setTitle("Batch&nbsp;Size");
    RunType.menuBatchSize.addMenuItem("10%", this._setRunTypeBatchSize10p);
    RunType.menuBatchSize.addMenuItem("25%", this._setRunTypeBatchSize25p);
    RunType.menuBatchSize.addMenuItem("1", this._setRunTypeBatchSize1);
    RunType.menuBatchSize.addMenuItem("2", this._setRunTypeBatchSize2);
    RunType.menuBatchSize.addMenuItem("3", this._setRunTypeBatchSize3);
    RunType.menuBatchSize.addMenuItem("5", this._setRunTypeBatchSize5);
    RunType.menuBatchSize.addMenuItem("10", this._setRunTypeBatchSize10);
    RunType.menuBatchSize.hideMenu();

    RunType.menuBatchWait = new DropDownMenu(runblock);
    RunType.menuBatchWait.setTitle("Batch&nbsp;Wait");
    RunType.menuBatchWait.addMenuItem("None", this._setRunTypeBatchWaitNone);
    RunType.menuBatchWait.addMenuItem("1 second", this._setRunTypeBatchWait1);
    RunType.menuBatchWait.addMenuItem("2 seconds", this._setRunTypeBatchWait2);
    RunType.menuBatchWait.addMenuItem("3 seconds", this._setRunTypeBatchWait3);
    RunType.menuBatchWait.addMenuItem("5 seconds", this._setRunTypeBatchWait5);
    RunType.menuBatchWait.addMenuItem("10 seconds", this._setRunTypeBatchWait10);
    RunType.menuBatchWait.addMenuItem("30 seconds", this._setRunTypeBatchWait30);
    RunType.menuBatchWait.addMenuItem("60 seconds", this._setRunTypeBatchWait60);
    RunType.menuBatchWait.hideMenu();

    let jobRunType = Route._createDiv("jobRunType", "normal");
    jobRunType.style.display = "none";
    runblock.appendChild(jobRunType);

    let batchSize = Route._createDiv("batchSize", "");
    batchSize.style.display = "none";
    runblock.appendChild(batchSize);

    let batchWait = Route._createDiv("batchWait", "");
    batchWait.style.display = "none";
    runblock.appendChild(batchWait);
  }

  static _updateRunTypeText() {
    let jobRunType = document.querySelector(".jobRunType").innerText;
    let batchWait = document.querySelector(".batchWait").innerText;
    let batchSize = document.querySelector(".batchSize").innerText;

    // now that the menu is used show the menu title
    // this is much clearer when the Size/Wait menus are also shown

    switch(jobRunType) {
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

      if(batchSize === "") {
        RunType.menuBatchSize.setTitle("Size 10%");
      } else if(batchSize.endsWith("%")) {
        RunType.menuBatchSize.setTitle("Size " + batchSize);
      } else if(batchSize === "1") {
        RunType.menuBatchSize.setTitle("Size " + batchSize + " job");
      } else {
        RunType.menuBatchSize.setTitle("Size " + batchSize + " jobs");
      }

      if(batchWait === "") {
        RunType.menuBatchWait.setTitle("No wait");
      } else if(batchWait == "0") {
        RunType.menuBatchWait.setTitle("No wait");
      } else if(batchWait == "1") {
        RunType.menuBatchWait.setTitle("Wait " + batchWait + " second");
      } else {
        RunType.menuBatchWait.setTitle("Wait " + batchWait + " seconds");
      }

      break;
    }
  }

  static _setRunTypeBatchWaitNone() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "0";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait1() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "1";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait2() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "2";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait3() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "3";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait5() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "5";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait10() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "10";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait30() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "30";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchWait60() {
    let batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "60";
    RunType._updateRunTypeText();
  }

  static _setRunTypeDefault() {
    RunType._setRunTypeNormal();
    // reset the title to the absolute minimum
    // so that the menu does not stand out in trivial situations
    RunType.menuRunType.setTitle("");
  }

  static _setRunTypeNormal() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "normal";
    RunType._updateRunTypeText();
  }

  static _setRunTypeAsync() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "async";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatch() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize1() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "1";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize2() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "2";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize3() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "3";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize5() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "5";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize10() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "10";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize10p() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "10%";
    RunType._updateRunTypeText();
  }

  static _setRunTypeBatchSize25p() {
    let jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    let batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "25%";
    RunType._updateRunTypeText();
  }

}
