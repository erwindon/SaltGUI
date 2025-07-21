/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {SchedulesMinionPanel} from "../panels/SchedulesMinion.js";
import {Utils} from "../Utils.js";

export class SchedulesMinionPage extends Page {

  constructor (pRouter) {
    super("schedules-minion", "Schedules", "page-schedules-minion", "button-schedules", pRouter);

    this.schedulesminion = new SchedulesMinionPanel();
    super.addPanel(this.schedulesminion);
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
