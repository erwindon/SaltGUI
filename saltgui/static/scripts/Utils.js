import {Route} from './routes/Route.js';

export class Utils {

  static getQueryParam2(url, name) {
    const questionmarkPos = url.indexOf("?");
    if(questionmarkPos < 0) return undefined;
    const parameters = url.slice(questionmarkPos + 1).split("&");
    for(const parameter of parameters) {
      const namevalue = parameter.split("=");
      if(namevalue.length !== 2) continue;
      if(namevalue[0] === name) return namevalue[1];
    }
    return undefined;
  }

  /* istanbul ignore next */
  static getQueryParam(name) {
    let w = null;
    try { w = window; } catch(error) { /* VOID */ }
    if(!w || !w.location) return undefined;
    return Utils.getQueryParam2(w.location.href, name);
  }

  static addToolTip(tooltipHost, tooltipText) {
    const tooltipSpan = Route._createSpan("", tooltipText);
    tooltipSpan.classList.add("tooltiptext");
    tooltipHost.classList.add("tooltip");

    // remove the old tooltip...
    for(let i = tooltipHost.children.length - 1; i >= 0; i--) {
      const child = tooltipHost.children[i];
      if(child.classList.contains("tooltiptext")) {
        tooltipHost.removeChild(child);
      }
    }

    // ...then add the new tooltip
    tooltipHost.appendChild(tooltipSpan);
  }

  static showTableSortable(startElement, reverseSort = false) {
    const th = startElement.querySelector("table th");
    sorttable.innerSortFunction.apply(th, []);
    if(reverseSort) sorttable.innerSortFunction.apply(th, []);
    const tr = startElement.querySelector("table tr");
    for(const th of tr.childNodes) {
      if(th.classList.contains("sorttable_nosort")) continue;
      // the tooltip is too bulky to use, skip for now
      //Utils.addToolTip(th, "Click to sort");
    }
  }

  static tableReSort(startElement) {
    const th = startElement.querySelector("table th");
    sorttable.innerSortFunction.apply(th, []);
    sorttable.innerSortFunction.apply(th, []);
  }

  static addErrorToTableCell(td, errorMessage) {
    const span = document.createElement("span");
    span.innerText = "(error)";
    Utils.addToolTip(span, errorMessage);
    td.appendChild(span);
  }

  static hasTextContent(obj, txt) {
    if(obj.classList && obj.classList.contains("run-command-button"))
      return false;
    for(const childNode of obj.childNodes)
      if(this.hasTextContent(childNode, txt))
        return true;
    if(obj.nodeType !== 3) // NODE_TEXT
      return false;
    return obj.textContent.toUpperCase().includes(txt);
  }

  static makeTableSearchable(startElement) {
    const button_search = document.createElement("span");
    button_search.classList.add("search");
    // 1F50D = LEFT-POINTING MAGNIFYING GLASS
    // FE0E = VARIATION SELECTOR-15 (render as text)
    button_search.innerHTML = "&#x1f50d;&#xFE0E;";
    button_search.onclick = ev => {
      Utils.hideShowTableSearchBar(startElement);
    };
    const table = startElement.querySelector("table");
    table.parentElement.insertBefore(button_search, table);
  }

  static addTableHelp(startElement, txt) {
    const button_help = startElement.querySelector("#help");
    button_help.classList.add("search");
    Utils.addToolTip(button_help, txt);
  }

  static hideShowTableSearchBar(startElement) {
    // remove all highlights
    const hilitor = new Hilitor(startElement, "table tbody");
    hilitor.remove();

    // show rows in all tables
    const allFM = startElement.querySelectorAll("table .nofiltermatch");
    for(const fm of allFM)
      fm.classList.remove("nofiltermatch");

    const table = startElement.querySelector("table");

    // hide/show search box
    const input = startElement.querySelector("input.filtertext");
    input.onkeyup = ev => {
      if(ev.key === "Escape") {
        Utils.updateFilter(table, "");
        Utils.hideShowTableSearchBar(startElement);
        return;
      }
    };
    input.oninput = ev => {
      Utils.updateFilter(table, input.value);
    };

    table.parentElement.insertBefore(input, table);
    if(input.style.display === "none") {
      Utils.updateFilter(table, input.value);
      input.style.display = "";
    } else {
      Utils.updateFilter(table, "");
      input.style.display = "none";
    }
    input.focus();
  }

  static updateFilter(table, txt) {
    // remove highlighting before re-comparing
    // as it affects the texts
    const hilitor = new Hilitor(table, "tbody");
    hilitor.remove();

    // find text
    txt = txt.toUpperCase();
    for(const row of table.tBodies[0].rows) {
      let show = false;
      for(const cell of row.cells) {
        // do not use "innerText"
        // that one does not handle hidden text
        if(Utils.hasTextContent(cell, txt)) show = true;
      }
      if(show)
        row.classList.remove("nofiltermatch");
      else
        row.classList.add("nofiltermatch");
    }

    // show the result
    hilitor.setMatchType("open");
    hilitor.setEndRegExp(/^$/);
    hilitor.setBreakRegExp(/^$/);

    // turn the text into a regexp
    let pattern = "";
    for(const chr of txt) {
      if((chr >= 'A' && chr <= 'Z') || (chr >= '0' && chr <= '9'))
        pattern += chr;
      else
        pattern += "\\" + chr;
    }

    hilitor.apply(pattern);
  }

  static txtZeroOneMany(cnt, zeroText, oneText, manyText) {
    let txt = manyText;
    if(cnt === 0) txt = zeroText;
    if(cnt === 1) txt = oneText;
    txt = txt.replace("{0}", cnt);
    return txt;
  }

  // MinionIds cannot directly be used as IDs for HTML elements
  // the id may contain characters that are not allowed in an ID
  // btoa is the base64 encoder
  static getIdFromMinionId(minionId) {
    const patEqualSigns = /==*/;
    return "m" + btoa(minionId).replace(patEqualSigns, "");
  }

  // JobIds are in the format 20190529175411210984
  // so just adding a prefix is sufficient
  static getIdFromJobId(jobId) {
    return "j" + jobId;
  }
}
