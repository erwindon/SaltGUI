/* global */

import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class ReportsPanel extends Panel {

  constructor () {
    super("reports");

    this.addTitle("Reports");
    this.addSearchButton();
    this.addHelpButton([
      "This page contains has a list of reports",
      "as registered in file 'reports.txt'.",
      "See README.md for more details."
    ]);
    this.addTable(["Name", "Description"]);
    this.setTableClickable();

    // table might initially not be sorted
    // this.setTableSortable("Name", "asc");

    this.addMsg();
  }

  onShow () {
    const staticReportsTxtPromise = this.api.getStaticReportsTxt();

    staticReportsTxtPromise.then((pStaticReportsTxt) => {
      if (!pStaticReportsTxt) {
        this.showErrorRowInstead("File 'reports.txt' not found or empty");
        return;
      }

      const reportList = pStaticReportsTxt.split(/\r|\n|\r\n/);

      for (const line of reportList) {
        if (line.match(/^[ \t]*#/)) {
          // ignore comments
          continue;
        }
        if (line.match(/^[ \t]*$/)) {
          // ignore empty lines
          continue;
        }
        const words = line.split(/\t/);
        if (words.length !== 2) {
          console.log("lines in file 'reports.txt' must contain 2 fields, not " + words.length);
          continue;
        }
        this._addReport(words[0], words[1]);
      }

      this.setTableSortable("Name", "asc");

      const txt = Utils.txtZeroOneMany(this.table.tBodies[0].rows.length,
        "No reports", "{0} report", "{0} reports");
      this.setMsg(txt);
    }, (pErrorMsg) => {
      this.setMsg("(error)");
      Utils.addToolTip(this.msgDiv, pErrorMsg);
    });
  }

  _addReport (pName, pDescription) {
    const tr = Utils.createTr();
    tr.appendChild(Utils.createTd("", pName));
    tr.appendChild(Utils.createTd("", pDescription));

    tr.addEventListener("click", (pClickEvent) => {
      this.router.goTo("report", {"id": pName});
      pClickEvent.stopPropagation();
    });

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);
  }
}
