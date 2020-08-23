/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";
import {PillarsPanel} from "../panels/Pillars.js";

export class PillarsRoute extends PageRoute {

  constructor (pRouter) {
    super("pillars", "Pillars", "page-pillars", "button-pillars", pRouter);

    this.pillars = new PillarsPanel();
    super.addPanel(this.pillars);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.pillars.onShow();
    this.jobs.onShow();
  }
}
