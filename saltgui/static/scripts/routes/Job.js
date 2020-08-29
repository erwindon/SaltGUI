/* global */

import {JobPanel} from "../panels/Job.js";
import {PageRoute} from "./Page.js";

export class JobRoute extends PageRoute {

  constructor (pRouter) {
    super("job", "Job", "page-job", "button-jobs", pRouter);

    this.job = new JobPanel();
    super.addPanel(this.job);
  }

  onShow () {
    this.job.onShow();
  }

  handleSaltJobRetEvent (pData) {
    this.job.handleSaltJobRetEvent(pData);
  }
}
