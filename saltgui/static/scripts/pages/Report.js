/* global */

import {Page} from "./Page.js";
import {ReportPanel} from "../panels/Report.js";

export class ReportPage extends Page {

  constructor (pRouter) {
    super("report", "Report", "page-report", "button-report", pRouter);

    this.report = new ReportPanel();
    super.addPanel(this.report);
  }
}
