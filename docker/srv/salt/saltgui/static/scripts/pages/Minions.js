/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {MinionsPanel} from "../panels/Minions.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class MinionsPage extends Page {

  constructor (pRouter) {
    super("minions", "Minions", "page-minions", "button-minions", pRouter);

    this.minions = new MinionsPanel();
    super.addPanel(this.minions);
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
