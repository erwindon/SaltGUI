/* global */

import {JobsDetailsPanel} from "../panels/JobsDetails.js";
import {PageRoute} from "./Page.js";

export class JobsRoute extends PageRoute {

  constructor (pRouter) {
    super("jobs", "Jobs", "page-jobs", "button-jobs", pRouter);

    this.jobs = new JobsDetailsPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.jobs.onShow();
  }
}
