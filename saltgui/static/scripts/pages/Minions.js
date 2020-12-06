/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {MinionsPanel} from "../panels/Minions.js";
import {Page} from "./Page.js";

export class MinionsPage extends Page {

  constructor (pRouter) {
    super("", "Minions", "page-minions", "button-minions", pRouter);

    this.minions = new MinionsPanel();
    super.addPanel(this.minions);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
