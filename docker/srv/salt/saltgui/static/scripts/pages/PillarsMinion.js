/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {PillarsMinionPanel} from "../panels/PillarsMinion.js";
import {Utils} from "../Utils.js";

export class PillarsMinionPage extends Page {

  constructor (pRouter) {
    super("pillars-minion", "Pillars", "page-pillars-minion", "button-pillars", pRouter);

    this.pillarsminion = new PillarsMinionPanel();
    super.addPanel(this.pillarsminion);
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
