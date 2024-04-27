/* global */

import {GrainsMinionPanel} from "../panels/GrainsMinion.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class GrainsMinionPage extends Page {

  constructor (pRouter) {
    super("grains-minion", "Grains", "page-grains-minion", "button-grains", pRouter);

    this.grainsminion = new GrainsMinionPanel();
    super.addPanel(this.grainsminion);
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
