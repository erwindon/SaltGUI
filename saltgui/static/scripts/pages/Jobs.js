/* global */

import {JobsDetailsPanel} from "../panels/JobsDetails.js";
import {Page} from "./Page.js";

export class JobsPage extends Page {

  constructor (pRouter) {
    super("jobs", "Jobs", "page-jobs", "button-jobs", pRouter);

    this.jobs = new JobsDetailsPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.jobs.onShow();
  }
}
