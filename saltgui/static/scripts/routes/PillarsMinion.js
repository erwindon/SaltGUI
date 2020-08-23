/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";
import {PillarsMinionPanel} from "../panels/PillarsMinion.js";

export class PillarsMinionRoute extends PageRoute {

  constructor (pRouter) {
    super("pillars-minion", "Pillars", "page-pillars-minion", "button-pillars", pRouter);

    this.pillarsminion = new PillarsMinionPanel();
    super.addPanel(this.pillarsminion);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.pillarsminion.onShow();
    this.jobs.onShow();
  }
}
