/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {TemplatesPanel} from "../panels/Templates.js";

export class TemplatesPage extends Page {

  constructor (pRouter) {
    super("templates", "Templates", "page-templates", "button-templates", pRouter);

    this.templates = new TemplatesPanel();
    super.addPanel(this.templates);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.templates.onShow();
    this.jobs.onShow();
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }
}
