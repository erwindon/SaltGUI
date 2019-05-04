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

  static showTableSortable(start, tableClass, reverseSort = false) {
    const th = start.querySelector("table." + tableClass + " th");
    sorttable.innerSortFunction.apply(th, []);
    if(reverseSort) sorttable.innerSortFunction.apply(th, []);
    const tr = start.querySelector("table." + tableClass + " tr");
    for(const th of tr.childNodes) {
      if(th.classList.contains("sorttable_nosort")) continue;
      // the tooltip is too bulky to use, skip for now
      //Utils.addToolTip(th, "Click to sort");
    }
  }

  static addErrorToTableCell(td, errorMessage) {
    const span = document.createElement("span");
    span.innerText = "(error)";
    Utils.addToolTip(span, errorMessage);
    td.appendChild(span);
  }

  static showTableSearchable(start, tableClass) {
    const table = start.querySelector("table." + tableClass);
    const input = document.createElement("input");
    input.style.width = "100%";
    // D83D+DD0D = 1F50D = LEFT-POINTING MAGNIFYING GLASS
    input.placeholder = "\uD83D\uDD0D";
    input.onkeyup = ev => {
      const txt = input.value.toUpperCase();
      for(const row of table.tBodies[0].rows) {
        let show = false;
        for(const cell of row.cells) {
          // do not use "innerText"
          // that one does not handle hidden text
          if(cell.textContent.toUpperCase().includes(txt)) show = true;
        }
        if(show)
          row.classList.remove("nofiltermatch");
        else
          row.classList.add("nofiltermatch");
      }
      const hilitor = new Hilitor(start, "." + tableClass + " tbody");
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
    };
    table.parentNode.insertBefore(input, table);
  }
}
