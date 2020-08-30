/* global */

import {BeaconsPanel} from "../panels/Beacons.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";

export class BeaconsPage extends Page {

  constructor (pRouter) {
    super("beacons", "Beacons", "page-beacons", "button-beacons", pRouter);

    this.beacons = new BeaconsPanel();
    super.addPanel(this.beacons);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.beacons.onShow();
    this.jobs.onShow();
  }
}
