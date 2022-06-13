/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {PillarsPanel} from "../panels/Pillars.js";

export class PillarsPage extends Page {

  constructor (pRouter) {
    super("pillars", "Pillars", "page-pillars", "button-pillars", pRouter);

    this.pillars = new PillarsPanel();
    super.addPanel(this.pillars);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
