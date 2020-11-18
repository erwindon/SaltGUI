/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {OptionsPanel} from "../panels/Options.js";
import {Page} from "./Page.js";

export class OptionsPage extends Page {

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

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
