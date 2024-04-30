/* global */

import {IssuesPanel} from "../panels/Issues.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class IssuesPage extends Page {

  constructor (pRouter) {
    super("issues", "issues", "page-issues", "button-issues", pRouter);

    this.issues = new IssuesPanel();
    super.addPanel(this.issues);
    if (Utils.getQueryParam("popup") !== "true") {
      this.jobs = new JobsSummaryPanel();
      super.addPanel(this.jobs);
    }
  }

  handleSaltJobRetEvent (pData) {
    if (this.jobs) {
      this.jobs.handleSaltJobRetEvent(pData);
    }
  }
}
