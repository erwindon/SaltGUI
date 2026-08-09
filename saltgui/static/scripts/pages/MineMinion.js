/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {MineMinionPanel} from "../panels/MineMinion.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class MineMinionPage extends Page {

  constructor (pRouter) {
    super("mine-minion", "Mine", "page-mine-minion", "button-mine", pRouter);

    this.mineminion = new MineMinionPanel();
    super.addPanel(this.mineminion);
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

  onHide () {
    this.mineminion.onHide();
  }
}
