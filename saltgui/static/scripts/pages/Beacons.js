/* global */

import {BeaconsPanel} from "../panels/Beacons.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class BeaconsPage extends Page {

  constructor (pRouter) {
    super("beacons", "Beacons", "page-beacons", "button-beacons", pRouter);

    this.beacons = new BeaconsPanel();
    super.addPanel(this.beacons);
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
