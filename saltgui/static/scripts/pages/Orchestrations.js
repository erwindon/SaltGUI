/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {OrchestrationsPanel} from "../panels/Orchestrations.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class OrchestrationsPage extends Page {

  constructor (pRouter) {
    super("orchestrations", "Orchestrations", "page-orchestrations", "button-orchestrations", pRouter);

    this.orchestrations = new OrchestrationsPanel();
    super.addPanel(this.orchestrations);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  /* eslint-disable class-methods-use-this */
  isVisible () {
  /* eslint-enable class-methods-use-this */
    // show orchestrations menu item if orchestrations defined
    return Utils.getStorageItemBoolean("session", "orchestrations");
  }
}
