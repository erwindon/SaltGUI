/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {MinionsPanel} from "../panels/Minions.js";
import {PageRoute} from "./Page.js";

export class MinionsRoute extends PageRoute {

  constructor (pRouter) {
    super("", "Minions", "page-minions", "button-minions", pRouter);

    this.minions = new MinionsPanel();
    super.addPanel(this.minions);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.minions.onShow();
    this.jobs.onShow();
  }
}
