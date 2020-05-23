/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {MinePanel} from "../panels/Mine.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class MinePage extends Page {

  constructor (pRouter) {
    super("mine", "Mine", "page-mine", "button-mine", pRouter);

    this.mine = new MinePanel();
    super.addPanel(this.mine);
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
