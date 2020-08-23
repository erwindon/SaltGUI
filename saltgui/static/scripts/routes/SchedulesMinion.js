/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";
import {SchedulesMinionPanel} from "../panels/SchedulesMinion.js";

export class SchedulesMinionRoute extends PageRoute {

  constructor (pRouter) {
    super("schedules-minion", "Schedules", "page-schedules-minion", "button-schedules", pRouter);

    this.schedulesminion = new SchedulesMinionPanel();
    super.addPanel(this.schedulesminion);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.schedulesminion.onShow();
    this.jobs.onShow();
  }
}
