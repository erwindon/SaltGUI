/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {SchedulesMinionPanel} from "../panels/SchedulesMinion.js";

export class SchedulesMinionPage extends Page {

  constructor (pRouter) {
    super("schedules-minion", "Schedules", "page-schedules-minion", "button-schedules", pRouter);

    this.schedulesminion = new SchedulesMinionPanel();
    super.addPanel(this.schedulesminion);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
