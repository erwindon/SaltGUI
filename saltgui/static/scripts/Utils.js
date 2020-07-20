import {Route} from './routes/Route.js';

export class Utils {

  // functions for URL parameters

  static _getQueryParam2(pUrl, pName) {
    const questionmarkPos = pUrl.indexOf("?");
    if(questionmarkPos < 0) return undefined;
    const parameters = pUrl.slice(questionmarkPos + 1).split("&");
    for(const parameter of parameters) {
      const namevalue = parameter.split("=");
      if(namevalue.length !== 2) continue;
      if(namevalue[0] === pName) return namevalue[1];
    }
    return undefined;
  }

  /* istanbul ignore next */
  static getQueryParam(pName) {
    let w = null;
    try { w = window; } catch(error) { /* VOID */ }
    if(!w || !w.location) return undefined;
    return Utils._getQueryParam2(w.location.href, pName);
  }

  // functions for storage handling

  static _getStorage(pStorage) {
    // "window" is not defined during unit testing
    try { const w = window; } catch(error) { return null; }
    if(pStorage === "local") return window.localStorage;
    if(pStorage === "session") return window.sessionStorage;
    console.error("UNKNOWN STORAGE TYPE", pStorage);
    return null;
  }

  static getStorageItem(pStorage, pKeyName, pDefaultValue=null) {
    const storage = Utils._getStorage(pStorage);
    if(!storage) { console.log("getStorageItem", pStorage, pKeyName); return pDefaultValue; }
    const v = storage.getItem(pKeyName);
    //console.log("getStorageItem", pStorage, pKeyName, pDefaultValue, "-->", typeof v, v);
    if(v === null) return pDefaultValue;
    if(v === "undefined") return pDefaultValue;
    return v;
  }

  static setStorageItem(pStorage, pKeyName, pValue) {
    const storage = Utils._getStorage(pStorage);
    if(!storage) { console.log("setStorageItem", pStorage, pKeyName, pValue); return; }
    //console.log("setStorageItem", pStorage, pKeyName, pValue);
    storage.setItem(pKeyName, pValue);
  }

  static clearStorage(pStorage) {
    const storage = Utils._getStorage(pStorage);
    if(!storage) { console.log("clearStorage", pStorage); return; }
    //console.log("cleaStorage", pStorage);
    storage.clear();
  }

  // other functions

  static addToolTip(pTooltipHost, pTooltipText, pStyle="bottom-center") {

    // Users may want to switch this on to improve browser performance
    const toolTipMode = Utils.getStorageItem("session", "tooltip_mode");

    if(toolTipMode === "none") {
      return;
    }

    if(toolTipMode === "simple") {
      pTooltipHost.setAttribute("title", pTooltipText);
      return;
    }

    // null or "full" (or anything else)
    const tooltipSpan = Route.createSpan("", pTooltipText);
    tooltipSpan.classList.add("tooltip-text");
    tooltipSpan.classList.add("tooltip-text-" + pStyle);
    pTooltipHost.classList.add("tooltip");

    // remove the old tooltip...
    for(let i = pTooltipHost.children.length - 1; i >= 0; i--) {
      const child = pTooltipHost.children[i];
      if(child.classList.contains("tooltip-text")) {
        pTooltipHost.removeChild(child);
      }
    }

    // ...then add the new tooltip
    pTooltipHost.appendChild(tooltipSpan);
  }

  static makeTableSortable(pStartElement, pIsReverseSort=false, pColumnNr=0) {
    const thArr = Array.prototype.slice.call(pStartElement.querySelectorAll("table th"));
    // we do not expect any rows in the table at this moment
    // but sorting is applied to show the sorting indicator
    sorttable.innerSortFunction.apply(thArr[pColumnNr], []);
    if(pIsReverseSort) sorttable.innerSortFunction.apply(thArr[pColumnNr], []);
    for(const th of thArr) {
      if(th.classList.contains("sorttable_nosort")) continue;
      // the tooltip is too bulky to use, skip for now
      //Utils.addToolTip(th, "Click to sort");
    }
  }

  static addErrorToTableCell(pTd, pErrorMessage) {
    const span = Route.createSpan("", "(error)");
    Utils.addToolTip(span, pErrorMessage, "bottom-left");
    pTd.appendChild(span);
  }

  static hasTextContent(pElement, pSearchText) {
    if(pElement.classList && pElement.classList.contains("run-command-button"))
      return false;
    for(const childNode of pElement.childNodes)
      if(this.hasTextContent(childNode, pSearchText))
        return true;
    if(pElement.nodeType !== 3) // NODE_TEXT
      return false;
    return pElement.textContent.toUpperCase().includes(pSearchText);
  }

  static makeTableSearchable(pStartElement, pSearchButtonId, pTableId) {

    const inputField = document.createElement("input");
    inputField.style.display = "none";
    inputField.classList.add("filter-text");
    // 1F50D = D83D DD0D = LEFT-POINTING MAGNIFYING GLASS
    inputField.placeholder = "\uD83D\uDD0D";

    const table = document.getElementById(pTableId);
    table.parentElement.insertBefore(inputField, table);

    const searchButton = document.getElementById(pSearchButtonId);
    searchButton.onclick = ev =>
      Utils.hideShowTableSearchBar(inputField, table);
  }

  static addTableHelp(pStartElement, pHelpText, pStyle="bottom-right") {
    const helpButton = pStartElement.querySelector("#help");
    helpButton.classList.add("search-button");
    Utils.addToolTip(helpButton, pHelpText, pStyle);
  }

  static hideShowTableSearchBar(pSearchBlock, pTable, pAction="toggle") {
    // remove all highlights
    const searchInSelector = pTable.tagName === "TABLE" ? "tbody" : "";
    const hilitor = new Hilitor(pTable, searchInSelector);
    hilitor.remove();

    // show rows in all tables
    const allFM = pTable.querySelectorAll(".no-filter-match");
    for(const fm of allFM)
      fm.classList.remove("no-filter-match");

    // hide/show search box (the block may become more complicated later)
    const input = pSearchBlock;
    input.onkeyup = ev => {
      if(ev.key === "Escape") {
        Utils._updateTableFilter(pTable, "");
        Utils.hideShowTableSearchBar(pSearchBlock, pTable);
        return;
      }
    };
    input.oninput = ev =>
      Utils._updateTableFilter(pTable, input.value);

    pTable.parentElement.insertBefore(input, pTable);
    if(pAction === "refresh" && input.style.display === "none") {
      Utils._updateTableFilter(pTable, "");
    } else if(pAction === "refresh") {
      Utils._updateTableFilter(pTable, input.value);
    } else if(input.style.display === "none") {
      Utils._updateTableFilter(pTable, input.value);
      input.style.display = "";
    } else {
      Utils._updateTableFilter(pTable, "");
      input.style.display = "none";
    }
    input.focus();
  }

  static _updateTableFilter(pTable, pSearchText) {
    // remove highlighting before re-comparing
    // as it affects the texts
    const searchInSelector = pTable.tagName === "TABLE" ? "tbody" : "";
    const hilitor = new Hilitor(pTable, searchInSelector);
    hilitor.remove();

    // find text
    pSearchText = pSearchText.toUpperCase();
    const blocks = pTable.tagName === "TABLE" ? pTable.tBodies[0].rows : pTable.children;
    for(const row of blocks) {
      if(row.classList.contains("no-search")) continue;
      let show = false;
      const items = row.tagName === "TR" ? row.cells : [row];
      for(const cell of items) {
        // do not use "innerText"
        // that one does not handle hidden text
        if(Utils.hasTextContent(cell, pSearchText)) {
          show = true;
          break;
        }
      }
      if(show)
        row.classList.remove("no-filter-match");
      else
        row.classList.add("no-filter-match");
    }

    // show the result
    hilitor.setMatchType("open");
    hilitor.setEndRegExp(/^$/);
    hilitor.setBreakRegExp(/^$/);

    // turn the text into a regexp
    let pattern = "";
    for(const chr of pSearchText) {
      if((chr >= 'A' && chr <= 'Z') || (chr >= '0' && chr <= '9'))
        pattern += chr;
      else
        pattern += "\\" + chr;
    }

    hilitor.apply(pattern);
  }

  static txtZeroOneMany(pCnt, pZeroText, pOneText, pManyText) {
    let txt = pManyText;
    if(pCnt === 0) txt = pZeroText;
    if(pCnt === 1) txt = pOneText;
    txt = txt.replace("{0}", pCnt);
    return txt;
  }

  // MinionIds cannot directly be used as IDs for HTML elements
  // the id may contain characters that are not allowed in an ID
  // btoa is the base64 encoder
  static getIdFromMinionId(pMinionId) {
    const patEqualSigns = /==*/;
    return "m" + btoa(pMinionId).replace(patEqualSigns, "");
  }

  // JobIds are in the format 20190529175411210984
  // so just adding a prefix is sufficient
  static getIdFromJobId(pJobId) {
    return "j" + pJobId;
  }

  static isMultiLineString(pStr) {
    if(pStr.includes("\r")) return true;
    if(pStr.includes("\n")) return true;
    return false;
  }

  static createJobStatusSpan(pJobId) {
    const span = Route.createSpan("", "");
    // 21BB = CLOCKWISE OPEN CIRCLE ARROW
    span.innerHTML = "&#x21BB;&nbsp;";
    span.id = "status" + pJobId;
    span.style.display = "none";
    span.style.fontWeight = "bold";
    return span;
  }
}
