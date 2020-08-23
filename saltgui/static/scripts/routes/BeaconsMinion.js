/* global */

import {BeaconsMinionPanel} from "../panels/BeaconsMinion.js";
import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {PageRoute} from "./Page.js";

export class BeaconsMinionRoute extends PageRoute {

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
