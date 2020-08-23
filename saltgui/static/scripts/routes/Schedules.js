/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";
import {SchedulesPanel} from "../panels/Schedules.js";

export class SchedulesRoute extends PageRoute {

  constructor (pRouter) {
    super("schedules", "Schedules", "page-schedules", "button-schedules", pRouter);

    this.schedules = new SchedulesPanel();
    super.addPanel(this.schedules);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.schedules.onShow();
    this.jobs.onShow();
  }
}
