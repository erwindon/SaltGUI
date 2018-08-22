/* global config document sorttable window */

import {API} from "../Api.js";
import {CommandBox} from "../CommandBox.js";
import {DropDownMenu} from "../DropDown.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

export class Panel {

  constructor (pKey, pContextInfo = null) {

    this.key = pKey;
    this.contextInfo = pContextInfo;

    const div = Utils.createDiv("panel", null);
    div.id = pKey + "-panel";
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

    this.api = new API();
  }

  addTitle (pTitle) {
    const h1 = document.createElement("h1");
    h1.id = this.key + "-title";
    h1.innerText = pTitle;
    this.div.appendChild(h1);
    this.title = h1;
  }

  updateTitle (pTitle) {
    this.title.innerText = pTitle;
  }

  addPanelMenu () {
    const span = document.createElement("span");
    span.id = this.key + "-menu";
    const menu = new DropDownMenu(span);
    this.div.appendChild(span);
    this.panelMenu = menu;
  }

  addSearchButton () {
    const span = document.createElement("span");
    span.id = this.key + "-search-button";
    span.classList.add("search-button");
    // 1F50D = LEFT-POINTING MAGNIFYING GLASS
    // FE0E = VARIATION SELECTOR-15 (render as text)
    span.innerHTML = "&#x1F50D;&#xFE0E;";
    this.div.appendChild(span);
    this.searchButton = span;
  }

  addPlayPauseButton (pInitialStatus) {
    const playButton = document.createElement("span");
    // 23F5 = BLACK MEDIUM RIGHT-POINTING TRIANGLE (play)
    // FE0E = VARIATION SELECTOR-15 (render as text)
    playButton.innerHTML = "&#x23F5;&#xFE0E;";
    playButton.style.cursor = "pointer";
    playButton.style.fontSize = "x-large";
    playButton.style.display = pInitialStatus === "play" ? "none" : "";
    this.div.appendChild(playButton);
    this.playButton = playButton;

    const pauseButton = document.createElement("span");
    // 23F8 = DOUBLE VERTICAL BAR (pause)
    // FE0E = VARIATION SELECTOR-15 (render as text)
    pauseButton.innerHTML = "&#x23F8;&#xFE0E;";
    pauseButton.style.display = "none";
    pauseButton.style.cursor = "pointer";
    pauseButton.style.fontSize = "x-large";
    pauseButton.style.display = pInitialStatus === "pause" ? "none" : "";
    this.div.appendChild(pauseButton);
    this.pauseButton = pauseButton;

    this.playButton.onclick = () => {
      this.playButton.style.display = "none";
      this.pauseButton.style.display = "";
      this.playOrPause = "play";
      this.updateFooter();
    };
    this.pauseButton.onclick = () => {
      this.playButton.style.display = "";
      this.pauseButton.style.display = "none";
      this.playOrPause = "pause";
      this.updateFooter();
    };

    this.playOrPause = pInitialStatus;
  }

  addHelpButton (pHelpText) {
    const span = document.createElement("span");
    span.id = this.key + "-help-button";
    span.classList.add("nearly-visible-button");
    // 2753 = BLACK QUESTION MARK ORNAMENT
    // FE0E = VARIATION SELECTOR-15 (render as text)
    span.innerHTML = "&#x2753;&#xFE0E;";
    span.style.cssFloat = "right";
    span.style.cursor = "help";
    this.div.appendChild(span);

    Utils.addToolTip(span, pHelpText, "bottom-right");
  }

  addCloseButton () {
    const span = document.createElement("span");
    span.id = this.key + "-close-button";
    span.classList.add("nearly-visible-button");
    // 2716 = HEAVY MULTIPLICATION X
    // FE0E = VARIATION SELECTOR-15 (render as text)
    span.innerHTML = "&#x2716;&#xFE0E;";
    span.style.cssFloat = "right";
    this.div.appendChild(span);

    span.addEventListener("click", () => {
      window.history.back();
    });
  }

  addTable (pColumnNames, pFieldList = null) {
    const table = document.createElement("table");
    table.id = this.key + "-table";
    table.classList.add(this.key);

    if (pColumnNames) {
      const thead = document.createElement("thead");
      thead.id = this.key + "-table-thead";
      const tr = document.createElement("tr");
      tr.id = this.key + "-table-thead-tr";

      for (const columnName of pColumnNames) {
        const th = document.createElement("th");
        if (columnName && !columnName.startsWith("-")) {
          th.innerHTML = columnName;
        } else {
          th.classList.add("sorttable_nosort");
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
    }

    this.div.appendChild(table);

    this.table = table;
  }

  setTableClickable () {
    // this function is only called when the table is clickable
    this.table.classList.add("highlight-rows");
  }

  setTableSortable (pColumnName, pDirection = "asc") {
    sorttable.makeSortable(this.table);

    const thArr = this.table.querySelectorAll("thead tr th");
    // const thArr = Array.prototype.slice.call(pStartElement.querySelectorAll("thead th"));

    for (const th of thArr) {
      if (th.classList.contains("sorttable_nosort")) {
        continue;
      }

      if (th.innerText === pColumnName) {
        // we do not expect any rows in the table at this moment
        // but sorting is applied to show the sorting indicator
        sorttable.innerSortFunction.apply(th, []);
        if (pDirection === "desc") {
          sorttable.innerSortFunction.apply(th, []);
        }
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
  }

  addMsg () {
    const msg = document.createElement("div");
    msg.id = this.key + "-msg";
    msg.classList.add("msg");
    msg.innerText = "(loading)";
    this.div.appendChild(msg);
    this.msg = msg;
  }

  setMsg (pText, isHTML = false) {
    if (isHTML) {
      this.msg.innerHTML = pText;
    } else {
      this.msg.innerText = pText;
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
          const fields = line.split("\t");
          if (fields.length === 1) {
            minions[fields[0]] = "true";
          } else {
            minions[fields[0]] = fields[1];
          }
        }
        Utils.setStorageItem("session", "minions-txt", JSON.stringify(minions));
      } else {
        Utils.setStorageItem("session", "minions-txt", "{}");
      }
      return true;
    }, () => {
      Utils.setStorageItem("session", "minions-txt", "{}");
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

    const td = Utils.createTd("", "");
    td.colSpan = 99;
    const span = Utils.createSpan("", "(error)");
    Utils.addToolTip(span, pData, "bottom-left");
    td.appendChild(span);

    const tr = document.createElement("tr");
    tr.appendChild(td);

    this.table.appendChild(tr);

    // hide the "(loading)" message
    if (this.msg !== null) {
      this.msg.style.display = "none";
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

    minionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const minionTd = Utils.createTd("status", "accepted");
    minionTd.classList.add("accepted");
    minionTr.appendChild(minionTd);

    minionTr.appendChild(Utils.createTd("os", "loading..."));

    // fill out the number of columns to that of the header
    while (minionTr.cells.length < this.table.tHead.rows[0].cells.length - freeColumns) {
      minionTr.appendChild(Utils.createTd("", ""));
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

  static _getBestIpNumber (pMinionData, prefixes) {
    if (!pMinionData) {
      return null;
    }
    const ipv4 = pMinionData.fqdn_ip4;
    if (!ipv4) {
      return null;
    }
    // either a string or something strange
    if (!Array.isArray(ipv4)) {
      return ipv4;
    }

    // so, it is an array

    // get the public IP number (if any)
    for (const ipv4Number of ipv4) {
      // See https://nl.wikipedia.org/wiki/RFC_1918
      // local = 127.0.0.0/8
      if (ipv4Number.startsWith("127.")) {
        continue;
      }
      // private A = 10.0.0.0/8
      if (ipv4Number.startsWith("10.")) {
        continue;
      }
      // private B = 172.16.0.0/20
      /* eslint-disable curly */
      if (ipv4Number.startsWith("172.16.")) continue;
      if (ipv4Number.startsWith("172.17.")) continue;
      if (ipv4Number.startsWith("172.18.")) continue;
      if (ipv4Number.startsWith("172.19.")) continue;
      if (ipv4Number.startsWith("172.20.")) continue;
      if (ipv4Number.startsWith("172.21.")) continue;
      if (ipv4Number.startsWith("172.22.")) continue;
      if (ipv4Number.startsWith("172.23.")) continue;
      if (ipv4Number.startsWith("172.24.")) continue;
      if (ipv4Number.startsWith("172.25.")) continue;
      if (ipv4Number.startsWith("172.26.")) continue;
      if (ipv4Number.startsWith("172.27.")) continue;
      if (ipv4Number.startsWith("172.28.")) continue;
      if (ipv4Number.startsWith("172.29.")) continue;
      if (ipv4Number.startsWith("172.30.")) continue;
      if (ipv4Number.startsWith("172.31.")) continue;
      /* eslint-enable curly */
      // private C = 192.168.0.0/16
      if (ipv4Number.startsWith("192.168.")) {
        continue;
      }
      // not a local/private address, therefore it is public
      return ipv4Number;
    }

    // No public IP was found
    // Use a common prefix in all available IP numbers
    // get the private IP number (if any)
    // when it matches one of the common prefixes
    for (const prefix in prefixes) {
      for (const ipv4Number of ipv4) {
        if (ipv4Number.startsWith(prefix)) {
          return ipv4Number;
        }
      }
    }

    // no luck...
    // try again, but without the restrictions
    for (const ipv4Number of ipv4) {
      // C = 192.168.x.x
      if (ipv4Number.startsWith("192.168.")) {
        return ipv4Number;
      }
    }
    for (const ipv4Number of ipv4) {
      // B = 172.16.0.0 .. 172.31.255.255
      // never mind the sub-ranges
      if (ipv4Number.startsWith("172.")) {
        return ipv4Number;
      }
    }
    for (const ipv4Number of ipv4) {
      // A = 10.x.x.x
      if (ipv4Number.startsWith("10.")) {
        return ipv4Number;
      }
    }

    // just pick the first one, should then be a local address (127.x.x.x)
    return ipv4[0];
  }

  static _restoreClickToCopy (pTarget) {
    Utils.addToolTip(pTarget, "Click to copy");
  }

  static _copyAddress (pTarget) {
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(pTarget.firstChild);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    Utils.addToolTip(pTarget, "Copied!");
  }

  updateMinion (pMinionData, pMinionId, prefixes) {

    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const ipv4 = Panel._getBestIpNumber(pMinionData, prefixes);
    if (ipv4) {
      const addressTd = Utils.createTd("status", "");
      const addressSpan = Utils.createSpan("", ipv4);
      addressTd.appendChild(addressSpan);
      // ipnumbers do not sort well, reformat into something sortable
      const ipv4parts = ipv4.split(".");
      let sorttableCustomkey = "";
      if (ipv4parts.length === 4) {
        // never mind adding '.'; this is only a sort-key
        for (let i = 0; i < 4; i++) {
          sorttableCustomkey += ipv4parts[i].padStart(3, "0");
        }
        addressTd.setAttribute("sorttable_customkey", sorttableCustomkey);
      }
      addressTd.classList.add("address");
      addressTd.setAttribute("tabindex", -1);
      addressSpan.addEventListener("click", (pClickEvent) => {
        Panel._copyAddress(addressSpan);
        pClickEvent.stopPropagation();
      });
      addressSpan.addEventListener("mouseout", () => {
        Panel._restoreClickToCopy(addressSpan);
      });
      Utils.addToolTip(addressSpan, "Click to copy");
      minionTr.appendChild(addressTd);
    } else {
      const accepted = Utils.createTd("status", "accepted");
      accepted.classList.add("accepted");
      minionTr.appendChild(accepted);
    }

    let saltversion = "---";
    if (typeof pMinionData === "string") {
      saltversion = "";
    } else if (pMinionData && pMinionData.saltversion) {
      saltversion = pMinionData.saltversion;
    }
    if (pMinionData) {
      const td = Utils.createTd("", "");
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
      if (pMinionData.os && typeof pMinionData !== "string") {
        const img = document.createElement("img");
        img.setAttribute("src", config.NAV_URL + "/static/images/os-" + pMinionData.os.replace(" ", "-").toLowerCase() + ".png");
        img.classList.add("osimage");
        td.prepend(img);
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
    const minionsDict = JSON.parse(Utils.getStorageItem("session", "minions-txt"));

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
    this.setMsg(txt);
  }

  updateOfflineMinion (pMinionId, pMinionsDict) {
    const minionTr = this.getElement(Utils.getIdFromMinionId(pMinionId));

    minionTr.appendChild(Utils.createTd("minion-id", pMinionId));

    const offlineSpan = Utils.createSpan("status", "offline");
    // add an opinion when we have one
    if (pMinionId in pMinionsDict) {
      if (pMinionsDict[pMinionId] === "true") {
        Utils.addToolTip(offlineSpan, "Minion is offline\nIs the host running and is the salt-minion installed and started?\nUpdate file 'minions.txt' when needed", "bottom-left");
        offlineSpan.style.color = "red";
      } else {
        Utils.addToolTip(offlineSpan, "Minion is offline\nSince it is reported as inactive in file 'minions.txt', that should be OK", "bottom-left");
      }
    }
    offlineSpan.classList.add("offline");
    const offlineTd = Utils.createTd("", "");
    offlineTd.appendChild(offlineSpan);
    minionTr.appendChild(offlineTd);
  }

  runCommand (pClickEvent, pTargetString, pCommandString) {
    this.runFullCommand(pClickEvent, "", pTargetString, pCommandString);
  }

  runFullCommand (pClickEvent, pTargetType, pTargetString, pCommandString) {
    CommandBox.showManualRun(pClickEvent, this.api);
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
}
