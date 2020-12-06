/* global */

import {GrainsPanel} from "../panels/Grains.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";

export class GrainsPage extends Page {

  constructor (pRouter) {
    super("grains", "Grains", "page-grains", "button-grains", pRouter);

    this.grains = new GrainsPanel();
    super.addPanel(this.grains);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
