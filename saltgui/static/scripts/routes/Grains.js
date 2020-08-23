/* global */

import {GrainsPanel} from "../panels/Grains.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";

export class GrainsRoute extends PageRoute {

  constructor (pRouter) {
    super("grains", "Grains", "page-grains", "button-grains", pRouter);

    this.grains = new GrainsPanel();
    super.addPanel(this.grains);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.grains.onShow();
    this.jobs.onShow();
  }
}
