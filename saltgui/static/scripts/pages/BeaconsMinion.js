/* global */

import {BeaconsMinionPanel} from "../panels/BeaconsMinion.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";

export class BeaconsMinionPage extends Page {

  constructor (pRouter) {
    super("beacons-minion", "Beacons", "page-beacons-minion", "button-beacons", pRouter);

    this.beaconsminion = new BeaconsMinionPanel();
    super.addPanel(this.beaconsminion);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.beaconsminion.onShow();
    this.jobs.onShow();
  }

  handleSaltBeaconEvent (pTag, pData) {
    this.beaconsminion.handleSaltBeaconEvent(pTag, pData);
  }
}
