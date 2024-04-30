/* global */

import {BeaconsMinionPanel} from "../panels/BeaconsMinion.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class BeaconsMinionPage extends Page {

  constructor (pRouter) {
    super("beacons-minion", "Beacons", "page-beacons-minion", "button-beacons", pRouter);

    this.beaconsminion = new BeaconsMinionPanel();
    super.addPanel(this.beaconsminion);
    if (Utils.getQueryParam("popup") !== "true") {
      this.jobs = new JobsSummaryPanel();
      super.addPanel(this.jobs);
    }
  }

  handleSaltBeaconEvent (pTag, pData) {
    this.beaconsminion.handleSaltBeaconEvent(pTag, pData);
  }

  handleSaltJobRetEvent (pData) {
    if (this.jobs) {
      this.jobs.handleSaltJobRetEvent(pData);
    }
  }
}
