/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {Page} from "./Page.js";
import {ReactorsPanel} from "../panels/Reactors.js";
import {Utils} from "../Utils.js";

export class ReactorsPage extends Page {

  constructor (pRouter) {
    super("reactors", "Reactors", "page-reactors", "button-reactors", pRouter);

    this.reactors = new ReactorsPanel();
    super.addPanel(this.reactors);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  handleSaltJobRetEvent (pData) {
    this.jobs.handleSaltJobRetEvent(pData);
  }

  static isVisible () {
    // show reactor menu item if reactors defined
    const reactorsText = Utils.getStorageItem("session", "reactors", "");
    return reactorsText;
  }
}
