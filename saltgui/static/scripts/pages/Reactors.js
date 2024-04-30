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

  /* eslint-disable class-methods-use-this */
  isVisible () {
  /* eslint-enable class-methods-use-this */
    // show reactor menu item if reactors defined
    const reactors = Utils.getStorageItemList("session", "reactors");
    return reactors.length > 0;
  }
}
