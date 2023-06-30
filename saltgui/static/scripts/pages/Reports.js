/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {ReportsPanel} from "../panels/Reports.js";

export class ReportsPage extends Page {

  constructor (pRouter) {
    super("reports", "Reports", "page-reports", "button-reports", pRouter);

    this.reports = new ReportsPanel();
    super.addPanel(this.reports);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }
}
