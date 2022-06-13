/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {PillarsMinionPanel} from "../panels/PillarsMinion.js";

export class PillarsMinionPage extends Page {

  constructor (pRouter) {
    super("pillars-minion", "Pillars", "page-pillars-minion", "button-pillars", pRouter);

    this.pillarsminion = new PillarsMinionPanel();
    super.addPanel(this.pillarsminion);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
