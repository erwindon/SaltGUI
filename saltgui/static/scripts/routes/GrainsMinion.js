/* global */

import {GrainsMinionPanel} from "../panels/GrainsMinion.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";

export class GrainsMinionRoute extends PageRoute {

  constructor (pRouter) {
    super("grains-minion", "Grains", "page-grains-minion", "button-grains", pRouter);

    this.grainsminion = new GrainsMinionPanel();
    super.addPanel(this.grainsminion);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.grainsminion.onShow();
    this.jobs.onShow();
  }
}
