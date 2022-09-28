/* global config */

import {Character} from "../Character.js";
import {CommandBox} from "../CommandBox.js";
import {DropDownMenu} from "../DropDown.js";
import {SortTable} from "../../sorttable/sorttable.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

// which grain to use for IP-number display
const IPNUMBERFIELD = "fqdn_ip4";
// const IPNUMBERFIELD = "ipv4";
// const IPNUMBERFIELD = "fqdn_ip6";
// const IPNUMBERFIELD = "ipv6";
// non-existent grains effectively disable the behaviour
// const IPNUMBERFIELD = "DISABLED";

export class Panel {

  constructor (pKey, pContextInfo = null) {

    this.key = pKey;
    this.contextInfo = pContextInfo;

    const div = Utils.createDiv("panel", "", pKey + "-panel");
    this.div = div;

    // Each panel consists of:
    //
    // Title
    // Panel Menu (optional)
    // Search Button
    // Start/Pause Button (optional)
    // Help Button (optional)
    // Close Button (optional)
    //
    // Table (sortable+filter)
    // Terminal Output
    // (but so far not both)
    //
    // Status line (optional)
  }

  addTitle (pTitle) {
    const h1 = document.createElement("h1");
    h1.id = this.key + "-title";
    h1.innerText = pTitle;
    this.div.appendChild(h1);
    this.title = h1;
    this.originalTitle = pTitle;
  }

  updateTitle (pTitle) {
    this.title.innerText = pTitle;
  }

  addPanelMenu () {
    const span = document.createElement("span");
    span.id = this.key + "-menu";
    const menu = new DropDownMenu(span);
    menu.menuButton.classList.add("small-button-left");
    this.div.appendChild(span);
    this.panelMenu = menu;
  }

  addSettingsMenu () {
    const span = document.createElement("span");
    span.id = this.key + "-settings";
    const menu = new DropDownMenu(span);
    menu.menuButton.classList.add("small-button-left");
    this.div.appendChild(span);
    this.settingsMenu = menu;
  }

  addSearchButton () {
    const span = document.createElement("span");
    span.id = this.key + "-search-button";
    span.classList.add("small-button");
    span.classList.add("small-button-left");
    span.classList.add("small-button-for-click");
    span.classList.add("search-button");
    span.innerText = Character.LEFT_POINTING_MAGNIFYING_GLASS;
    this.div.appendChild(span);
    this.searchButton = span;
  }

  addPlayPauseButton () {
    const playButton = document.createElement("span");
    playButton.innerText = Character.CH_PLAY;
    playButton.classList.add("small-button");
    playButton.classList.add("small-button-left");
    playButton.classList.add("small-button-for-click");
    playButton.style.cursor = "pointer";
    this.div.appendChild(playButton);
    this.playButton = playButton;

    const pauseButton = document.createElement("span");
    pauseButton.innerText = Character.CH_PAUSE;
    pauseButton.classList.add("small-button");
    pauseButton.classList.add("small-button-left");
    pauseButton.classList.add("small-button-for-click");
    pauseButton.style.display = "none";
    pauseButton.style.cursor = "pointer";
    this.div.appendChild(pauseButton);
    this.pauseButton = pauseButton;

    this.playButton.addEventListener("click", (pClickEvent) => {
      this.playButton.style.display = "none";
      this.pauseButton.style.display = "";
      this.playOrPause = "play";
      this.updateFooter();
      pClickEvent.stopPropagation();
    });
    this.pauseButton.addEventListener("click", (pClickEvent) => {
      this.playButton.style.display = "";
      this.pauseButton.style.display = "none";
      this.playOrPause = "pause";
      this.updateFooter();
      pClickEvent.stopPropagation();
    });

    this.setPlayPauseButton("none");
  }

  setPlayPauseButton (pStatus) {
    this.playOrPause = pStatus;
    if (this.playButton) {
      this.playButton.style.display = pStatus === "pause" ? "" : "none";
    }
    if (this.pauseButton) {
      this.pauseButton.style.display = pStatus === "play" ? "" : "none";
    }
    this._updateMsg();
  }

  addHelpButton (pHelpTextArr, pUrl) {
    const span = document.createElement(pUrl ? "a" : "span");
    span.id = this.key + "-help-button";
    span.classList.add("small-button");
    span.classList.add("small-button-right");
    span.classList.add("small-button-for-hover");
    span.innerText = Character.BLACK_QUESTION_MARK_ORNAMENT;
    span.style.cursor = "help";
    this.div.appendChild(span);

    if (pUrl) {
      span.href = pUrl;
      span.target = "_blank";
    }

    Utils.addToolTip(span, pHelpTextArr.join("\n"), "bottom-right");
  }

  addCloseButton () {
    const span = document.createElement("span");
    span.id = this.key + "-close-button";
    span.classList.add("small-button");
    span.classList.add("small-button-right");
    span.classList.add("small-button-for-click");
    span.innerText = Character.HEAVY_MULTIPLICATION_X;
    this.div.appendChild(span);

    span.addEventListener("click", (pClickEvent) => {
      this.router.goTo(this.route.parentHash, this.route.parentQuery, 1);
      pClickEvent.stopPropagation();
    });
  }

  addWarningField () {
    const warning = document.createElement("h2");
    warning.classList.add("warning");
    this.div.append(warning);
    this.warningField = warning;
  }

  setWarningText (pIcon = "", pTxt = "") {
    let newTxt;
    switch (pIcon) {
    case "info":
      newTxt = Character.CIRCLED_INFORMATION_SOURCE + Character.NO_BREAK_SPACE + pTxt;
      break;
    case "warn":
      newTxt = Character.WARNING_SIGN + Character.NO_BREAK_SPACE + pTxt;
      break;
    case "":
      newTxt = pTxt;
      break;
    default:
      newTxt = "???" + pIcon + "???" + Character.NO_BREAK_SPACE + pTxt;
    }
    if (this.warningField.innerText !== newTxt) {
      // prevent selection of text to be cancelled
      this.warningField.innerText = newTxt;
    }
  }

  addTable (pColumnNames, pFieldList = null) {
    const table = document.createElement("table");
    table.id = this.key + "-table";
    table.classList.add(this.key);

    let anyHiddenColumns = false;
    if (pColumnNames) {
      for (const colName of pColumnNames) {
        if (colName.startsWith("@")) {
          anyHiddenColumns = true;
        }
      }
    }

    if (anyHiddenColumns) {
      for (const colName of pColumnNames) {
        const col = document.createElement("col");
        if (colName.startsWith("@")) {
          col.style.visibility = "collapse";
        }
        table.append(col);
      }
    }

    if (pColumnNames) {
      const thead = document.createElement("thead");
      thead.id = this.key + "-table-thead";
      const tr = document.createElement("tr");
      tr.id = this.key + "-table-thead-tr";

      for (const columnName of pColumnNames) {
        const th = document.createElement("th");
        let cn = columnName;
        if (cn && cn.startsWith("@")) {
          cn = cn.substring(1);
        }
        if (cn && !cn.startsWith("-")) {
          th.innerText = cn;
        }
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      table.appendChild(thead);
    }

    const tbody = document.createElement("tbody");
    // not needed yet
    // tbody.id = this.key + "-table-tbody";
    table.appendChild(tbody);

    // most tables are searchable (but not all)
    // when it is, we already prepared the search button for it
    if (this.div.querySelector(".search-button") !== null) {
      const searchBox = Utils.makeSearchBox(this.searchButton, table, pFieldList);
      this.div.appendChild(searchBox);
      this.searchBox = searchBox;
    }

    this.div.appendChild(table);

    this.table = table;
  }

  clearTable () {
    while (this.table.tBodies[0].children.length) {
      this.table.tBodies[0].deleteRow(0);
    }
  }

  setTableClickable () {
    // this function is only called when the table is clickable
    this.table.classList.add("highlight-rows");
  }

  setTableSortable (pColumnName, pDirection = "asc") {

    const thArr = this.table.querySelectorAll("thead tr th");

    // mark columns as click-able
    for (const th of thArr) {
      if (th.innerText !== "") {
        th.classList.add("sorttable_sortable");
      }
    }

    SortTable.makeSortable(this.table);

    // apply the initial sort
    for (const th of thArr) {
      if (th.innerText !== pColumnName) {
        continue;
      }
      // we do not expect any rows in the table at this moment
      // but sorting is applied to show the sorting indicator
      SortTable.innerSortFunction(th);
      if (pDirection === "desc") {
        SortTable.innerSortFunction(th);
      }

      // the tooltip is too bulky to use, skip for now
      // Utils.addToolTip(th, "Click to sort");
    }
  }

  addConsole () {
    const console = document.createElement("div");
    console.id = this.key + "-output";
    console.classList.add("output");
    this.div.appendChild(console);
    this.console = console;
  }

  addMsg () {
    const msgDiv = document.createElement("div");
    msgDiv.id = this.key + "-msg";
    msgDiv.classList.add("msg");
    this.div.appendChild(msgDiv);
    this.msgDiv = msgDiv;
    this.setMsg("(loading)");
  }

  setMsg (pText) {
    this.msgTxt = pText;
    this._updateMsg();
  }

  _updateMsg () {
    if (!this.msgDiv) {
      // the div is not created yet
      return;
    }

    let txt = this.msgTxt;
    let isHTML = false;

    if (this.playOrPause === "pause" && this.pauseButton) {
      if (txt) {
        txt += ", ";
      }
      if (this.table && this.table.tBodies[0].rows.length) {
        txt += "press " + Character.buttonInText(Character.CH_PLAY) + " to continue";
      } else {
        txt += "press " + Character.buttonInText(Character.CH_PLAY) + " to begin";
      }
      isHTML = true;
    }

    if (this.playOrPause === "play" && this.playButton) {
      if (txt) {
        txt += ", ";
      }
      txt += "press " + Character.buttonInText(Character.CH_PAUSE) + " to pause";
      isHTML = true;
    }

    if (isHTML) {
      this.msgDiv.innerHTML = txt;
    } else {
      this.msgDiv.innerText = txt;
    }
  }

  loadMinionsTxt () {
    const staticMinionsTxtPromise = this.api.getStaticMinionsTxt();

    staticMinionsTxtPromise.then((pStaticMinionsTxt) => {
      if (pStaticMinionsTxt) {
        const lines = pStaticMinionsTxt.
          trim().
          split(/\r?\n/).
          filter((item) => !item.startsWith("#"));
        const minions = {};
        for (const line of lines) {
          const fields = line.split(/[ \t]+/);
          if (fields.length === 1) {
            minions[fields[0]] = "true";
          } else if (fields.length === 2) {
            minions[fields[0]] = fields[1];
          } else {
            Utils.warn("lines in 'minions.txt' must have 1 or 2 words, not " + fields.length + " like in: " + line);
          }
        }
        Utils.setStorageItem("session", "minions_txt", JSON.stringify(minions));
      } else {
        Utils.setStorageItem("session", "minions_txt", "{}");
      }
      return true;
    }, () => {
      Utils.setStorageItem("session", "minions_txt", "{}");
      return false;
    });
  }

  showErrorRowInstead (pData) {
    if (pData === null) {
      // not an error, but also nothing to show
      return true;
    }

    if (typeof pData === "object") {
      // not an error
      return false;
    }

    const td = Utils.createTd();
    td.colSpan = 99;
    Utils.addErrorToTableCell(td, pData, "bottom-left");

    const tr = document.createElement("tr");
    tr.id = "error-row";
    tr.appendChild(td);

    if (!this.table.tFoot) {
      this.table.createTFoot();
    }
    // remove any old message
    while (this.table.tFoot.rows.length > 0) {
      this.table.tFoot.deleteRow(0);
    }
    // add the new message
    this.table.tFoot.appendChild(tr);

    // hide the "(loading)" message
    if (this.msgDiv) {
      this.msgDiv.style.display = "none";
    }

    return true;
  }

  addMinion (pMinionId, freeColumns = 0) {

    let minionTr = this.table.querySelector("#" + Utils.getIdFromMinionId(pMinionId));
    if (minionTr !== null) {
      // minion already on screen...
      return;
    }

    minionTr = document.createElement("tr");
    minionTr.id = Utils.getIdFromMinionId(pMinionId);
    minionTr.dataset.minionId = pMinionId;

    minionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const minionTd = Utils.createTd("status", "accepted");
    minionTd.classList.add("accepted");
    minionTr.appendChild(minionTd);

    minionTr.appendChild(Utils.createTd("os", "loading..."));

    // fill out the number of columns to that of the header
    while (this.table.tHead.rows[0] && minionTr.cells.length < this.table.tHead.rows[0].cells.length - freeColumns) {
      minionTr.appendChild(Utils.createTd());
    }

    const tbody = this.table.tBodies[0];
    tbody.appendChild(minionTr);
  }

  getElement (id) {
    let minionTr = this.table.querySelector("#" + id);

    if (minionTr === null) {
      // minion not found on screen...
      // construct a basic element that can be updated
      minionTr = document.createElement("tr");
      minionTr.id = id;
      this.table.querySelector("tbody").appendChild(minionTr);
    }

    // remove existing content
    while (minionTr.firstChild) {
      minionTr.removeChild(minionTr.firstChild);
    }

    return minionTr;
  }

  static _getIpNumberUses (pAllMinionsGrains, pIpNumber) {
    let cnt = 0;
    for (const minionId in pAllMinionsGrains) {
      const ipNumbers = pAllMinionsGrains[minionId][IPNUMBERFIELD];
      if (!Array.isArray(ipNumbers)) {
        continue;
      }
      if (ipNumbers.includes(pIpNumber)) {
        cnt += 1;
      }
    }
    return cnt;
  }

  static _getBestIpNumber (pMinionData, pAllMinionsGrains) {
    if (!pMinionData) {
      return null;
    }

    const allIpNumbers = pMinionData[IPNUMBERFIELD];
    // either a string or something strange
    if (!Array.isArray(allIpNumbers)) {
      return null;
    }

    // so, it is an array

    // sort it, so that we get more consistent results
    // when there are minions which report multiple IP
    // numbers for their hostname
    allIpNumbers.sort();

    // get the public IP number (if any)
    let bestPriority = 100;
    let bestIpNumber = null;
    for (const ipNumber of allIpNumbers) {
      if (typeof ipNumber !== "string") {
        continue;
      }

      // IP numbers that are used by multiple minions are not a
      // candidate for display here. typically happens for:
      // 127.0.0.1 (localhost), 10.0.2.15 (virtualbox host address)
      if (Panel._getIpNumberUses(pAllMinionsGrains, ipNumber) !== 1) {
        continue;
      }

      const prio = Panel._getIpNumberPriority(ipNumber);
      if (prio < bestPriority) {
        bestIpNumber = ipNumber;
        bestPriority = prio;
      }
    }

    return bestIpNumber;
  }

  static _getAllIpNumbers (pMinionData) {
    if (!pMinionData) {
      // for pages where no grains data available
      return [];
    }
    const allIpNumbers = pMinionData[IPNUMBERFIELD];
    if (!Array.isArray(allIpNumbers)) {
      return [];
    }
    for (const str of allIpNumbers) {
      if (typeof str !== "string") {
        return [];
      }
    }
    return allIpNumbers;
  }

  static _getIpNumberPriority (pIpNumber) {
    // See https://nl.wikipedia.org/wiki/RFC_1918

    if (typeof pIpNumber !== "string") {
      return 10;
    }

    if (pIpNumber.startsWith("127.") || pIpNumber === "::1") {
      // local = 127.0.0.0/8
      return 5;
    }
    if (pIpNumber.startsWith("10.")) {
      // private A = 10.0.0.0/8
      return 4;
    }
    if (pIpNumber.startsWith("192.")) {
      // private C = 192.168.0.0/16
      return 3;
    }
    if (pIpNumber.startsWith("172.16.") ||
        pIpNumber.startsWith("172.17.") ||
        pIpNumber.startsWith("172.18.") ||
        pIpNumber.startsWith("172.19.") ||
        pIpNumber.startsWith("172.20.") ||
        pIpNumber.startsWith("172.21.") ||
        pIpNumber.startsWith("172.22.") ||
        pIpNumber.startsWith("172.23.") ||
        pIpNumber.startsWith("172.24.") ||
        pIpNumber.startsWith("172.25.") ||
        pIpNumber.startsWith("172.26.") ||
        pIpNumber.startsWith("172.27.") ||
        pIpNumber.startsWith("172.28.") ||
        pIpNumber.startsWith("172.29.") ||
        pIpNumber.startsWith("172.30.") ||
        pIpNumber.startsWith("172.31.")) {
      // private B = 172.16.0.0/20
      return 2;
    }

    // anything else could be a public IP number
    return 1;
  }

  static _restoreClickToCopy (pTarget) {
    if (pTarget.dataset.multiIpNumber === pTarget.dataset.singleIpNumber) {
      Utils.addToolTip(pTarget, "Click to copy");
    } else {
      const cntIpNumbers = pTarget.dataset.multiIpNumber.trim().split("\n").length;
      let tooltipTxt = "Click to copy this IP number";
      tooltipTxt += "\nALT-Click to copy these " + cntIpNumbers + " IP numbers:";
      tooltipTxt += "\n" + pTarget.dataset.multiIpNumber;
      Utils.addToolTip(pTarget, tooltipTxt);
    }
  }

  static _copyAddress (pTarget, useMultiAddress) {
    if (useMultiAddress && pTarget.dataset.multiIpNumber !== pTarget.dataset.singleIpNumber) {
      navigator.clipboard.writeText(pTarget.dataset.multiIpNumber);
      Utils.addToolTip(pTarget, "Copied all!");
    } else {
      navigator.clipboard.writeText(pTarget.dataset.singleIpNumber);
      Utils.addToolTip(pTarget, "Copied!");
    }
  }

  updateMinion (pMinionData, pMinionId, pAllMinionsGrains) {

    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const bestIpNumber = Panel._getBestIpNumber(pMinionData, pAllMinionsGrains);
    const allIpNumbers = Panel._getAllIpNumbers(pMinionData);

    if (bestIpNumber) {
      const addressTd = Utils.createTd("status");
      const addressSpan = Utils.createSpan("", bestIpNumber);
      addressSpan.dataset.singleIpNumber = bestIpNumber;
      addressSpan.dataset.multiIpNumber = allIpNumbers.join("\n");
      addressTd.appendChild(addressSpan);
      // ipnumbers do not sort well, reformat into something sortable
      const bestIpNumberParts = bestIpNumber.split(".");
      let sorttableCustomkey = "";
      if (bestIpNumberParts.length === 4) {
        // never mind adding '.'; this is only a sort-key
        for (let i = 0; i < 4; i++) {
          sorttableCustomkey += bestIpNumberParts[i].padStart(3, "0");
        }
        addressTd.setAttribute("sorttable_customkey", sorttableCustomkey);
      }
      addressTd.classList.add("address");
      addressTd.setAttribute("tabindex", -1);
      addressSpan.addEventListener("click", (pClickEvent) => {
        Panel._copyAddress(addressSpan, pClickEvent.ctrlKey || pClickEvent.altKey);
        pClickEvent.stopPropagation();
      });
      addressSpan.addEventListener("mouseout", () => {
        Panel._restoreClickToCopy(addressSpan);
      });
      Panel._restoreClickToCopy(addressSpan);
      minionTr.appendChild(addressTd);
    } else {
      const accepted = Utils.createTd("status", "accepted");
      accepted.classList.add("accepted");
      minionTr.appendChild(accepted);
    }

    minionTr.dataset.minionId = pMinionId;

    let saltversion = "---";
    if (typeof pMinionData === "string") {
      saltversion = "";
    } else if (pMinionData && pMinionData.saltversion) {
      saltversion = pMinionData.saltversion;
      minionTr.dataset.saltversion = saltversion;
    }
    if (pMinionData) {
      const td = Utils.createTd();
      td.setAttribute("sorttable_customkey", saltversion);
      const span = Utils.createSpan("saltversion", saltversion);
      td.appendChild(span);
      if (typeof pMinionData === "string") {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      minionTr.appendChild(td);
    }

    let os = "---";
    if (typeof pMinionData === "string") {
      os = "";
    } else if (pMinionData && pMinionData.os && pMinionData.osrelease) {
      os = pMinionData.os + " " + pMinionData.osrelease;
    } else if (pMinionData && pMinionData.os) {
      os = pMinionData.os;
    }
    if (pMinionData) {
      const td = Utils.createTd("os", os);
      if (typeof pMinionData === "string") {
        Utils.addErrorToTableCell(td, pMinionData);
      }
      if (typeof pMinionData === "object" && pMinionData.os) {
        Panel.addPrefixImage(td, "os-" + pMinionData.os);
      }
      minionTr.appendChild(td);
    }
  }

  updateMinions (pData) {
    if (!pData) {
      return;
    }

    const minions = pData.return[0];
    const minionIds = Object.keys(minions).sort();
    const minionsDict = JSON.parse(Utils.getStorageItem("session", "minions_txt", "{}"));

    // save for the autocompletion
    // This callback will also be called after LOGOUT due to the regular error handling
    // Do not store the information in that case
    if (Utils.getStorageItem("session", "token")) {
      Utils.setStorageItem("session", "minions", JSON.stringify(minionIds));
    }

    let cntOnline = 0;
    let cntOffline = 0;
    for (const minionId of minionIds) {
      const minionInfo = minions[minionId];

      // minions can be offline, then the info will be false
      if (minionInfo === false) {
        this.updateOfflineMinion(minionId, minionsDict);
        cntOffline += 1;
      } else {
        this.updateMinion(minionInfo, minionId, minions);
        cntOnline += 1;
      }
    }

    let txt = Utils.txtZeroOneMany(minionIds.length, "No minions", "{0} minion", "{0} minions");
    if (cntOnline !== minionIds.length) {
      txt += ", " + Utils.txtZeroOneMany(cntOnline, "none online", "{0} online", "{0} online");
    }
    if (cntOffline > 0) {
      txt += ", " + Utils.txtZeroOneMany(cntOffline, "none offline", "{0} offline", "{0} offline");
    }

    const cntMinionsPre = Utils.getStorageItem("session", "minions_pre_length");
    if (cntMinionsPre) {
      txt += Utils.txtZeroOneMany(
        parseInt(cntMinionsPre, 10),
        "",
        ", {0} unaccepted key",
        ", {0} unaccepted keys");
    }

    this.setMsg(txt);
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const offlineSpan = Utils.createSpan("status", "offline");
    // add an opinion when we have one
    if (pMinionsDict && pMinionId in pMinionsDict) {
      if (pMinionsDict[pMinionId] === "true") {
        Utils.addToolTip(offlineSpan, "Minion is offline\nIs the host running and is the salt-minion installed and started?\nUpdate file 'minions.txt' when needed", "bottom-left");
        offlineSpan.classList.add("offline");
      } else {
        Utils.addToolTip(offlineSpan, "Minion is offline\nSince it is reported as inactive in file 'minions.txt', that should be OK", "bottom-left");
        offlineSpan.classList.remove("offline");
      }
    } else {
      offlineSpan.classList.add("offline");
    }
    const offlineTd = Utils.createTd();
    offlineTd.appendChild(offlineSpan);
    minionTr.appendChild(offlineTd);
  }

  static makeCommandString (pCommandStringArray) {
    let commandString = "";
    let separator = "";
    for (const cmd of pCommandStringArray) {
      commandString += separator;
      separator = " ";
      if (typeof cmd !== "string") {
        commandString += JSON.stringify(cmd);
        continue;
      }
      if (cmd.match(/^[a-z_]+=$/i)) {
        // handle key-value pairs
        const pos = cmd.indexOf("=");
        commandString += cmd.substring(0, pos + 1);
        // value comes in a separate element
        separator = "";
        continue;
      }
      if (cmd.match(/^<[a-z]*>$/)) {
        // It's a placeholder
        commandString += cmd;
        continue;
      }
      if (cmd.match(/^[a-z_][a-z0-9_]*(?:[.][a-z0-9_]+)*$/i)) {
        // It's a simple string or a command
        commandString += cmd;
        continue;
      }
      commandString += JSON.stringify(cmd);
    }
    return commandString;
  }

  runCommand (pTargetType, pTargetString, pCommandString) {
    if (typeof pCommandString !== "string") {
      // assume it is an array
      pCommandString = Panel.makeCommandString(pCommandString);
    }

    CommandBox.showManualRun(this.api);
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

  clearPanel () {
    if (this.title && this.originalTitle.includes("...")) {
      this.title.innerText = this.originalTitle;
    }
    if (this.table) {
      this.clearTable();
    }
    if (this.msgDiv) {
      this.setMsg("(loading)");
    }
    if (this.timeField) {
      this.timeField.innerHTML = "&nbsp;";
    }
    if (this.console) {
      this.console.innerText = "";
    }
    if (this.output) {
      this.output.innerText = "";
    }
    for (const tr of document.querySelectorAll("#error-row")) {
      tr.parentElement.remove(tr);
    }

    if (this.searchBox && this.table) {
      Utils.hideShowTableSearchBar(this.searchBox, this.table, "hide");
    }
  }

  static addPrefixImage (pElem, pImageName) {
    const img = document.createElement("img");
    const pngName = pImageName.replace(" ", "-").toLowerCase() + ".png";
    img.setAttribute("src", config.NAV_URL + "/static/images/" + pngName);
    img.setAttribute("onerror", "this.onerror=null; this.title='Unknown image, please report to SaltGUI team that image \\'" + pngName + "\\' is missing'; this.src='/static/images/UNKNOWN.png'");
    img.classList.add("prefiximage");
    pElem.prepend(img);
  }

  static addPrefixIcon (pElem, pIconChar) {
    // starts with a TD, but there may be a SPAN involved
    if (pElem.querySelector("span")) {
      pElem = pElem.querySelector("span");
    }
    if (!pElem.innerText.startsWith(pIconChar)) {
      pElem.innerText = pIconChar + pElem.innerText;
    }
  }
}
