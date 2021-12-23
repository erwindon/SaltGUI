/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {TemplatesPanel} from "../panels/Templates.js";
import {Utils} from "../Utils.js";

export class TemplatesPage extends Page {

  constructor (pRouter) {
    super("templates", "Templates", "page-templates", "button-templates", pRouter);

    this.templates = new TemplatesPanel();
    super.addPanel(this.templates);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }

  static isVisible () {
    // show template menu item if templates defined
    const templatesMasterText = Utils.getStorageItem("session", "templates_master", "");
    const templatesJsonText = Utils.getStorageItem("session", "templates_json", "");
    return templatesMasterText || templatesJsonText;
  }
}
