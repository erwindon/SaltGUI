/* global */

import {GrainsPanel} from "../panels/Grains.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class GrainsPage extends Page {

  constructor (pRouter) {
    super("grains", "Grains", "page-grains", "button-grains", pRouter);

    this.grains = new GrainsPanel();
    super.addPanel(this.grains);
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
