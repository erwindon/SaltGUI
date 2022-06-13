/* global */

import {IssuesPanel} from "../panels/Issues.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";

export class IssuesPage extends Page {

  constructor (pRouter) {
    super("issues", "issues", "page-issues", "button-issues", pRouter);

    this.issues = new IssuesPanel();
    super.addPanel(this.issues);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }
}
