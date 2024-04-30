/* global */

import {HighStatePanel} from "../panels/HighState.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class HighStatePage extends Page {

  constructor (pRouter) {
    super("highstate", "HighState", "page-highstate", "button-highstate", pRouter);

    this.highstate = new HighStatePanel();
    super.addPanel(this.highstate);
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
