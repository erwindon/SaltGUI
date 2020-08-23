/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {OptionsPanel} from "../panels/Options.js";
import {PageRoute} from "./Page.js";

export class OptionsRoute extends PageRoute {

  constructor (pRouter) {
    super("options", "Options", "page-options", "", pRouter);

    this.options = new OptionsPanel();
    super.addPanel(this.options);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.options.onShow();
    this.jobs.onShow();
  }
}
