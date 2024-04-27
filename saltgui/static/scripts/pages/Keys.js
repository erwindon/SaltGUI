/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {KeysPanel} from "../panels/Keys.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class KeysPage extends Page {

  constructor (pRouter) {
    super("keys", "Keys", "page-keys", "button-keys", pRouter);

    this.keys = new KeysPanel();
    super.addPanel(this.keys);
    if (Utils.getQueryParam("popup") !== "true") {
      this.jobs = new JobsSummaryPanel();
      super.addPanel(this.jobs);
    }
  }

  handleSaltAuthEvent (pData) {
    this.keys.handleSaltAuthEvent(pData);
  }

  handleSaltKeyEvent (pData) {
    this.keys.handleSaltKeyEvent(pData);
  }

  handleSaltJobRetEvent (pData) {
    if (this.jobs) {
      this.jobs.handleSaltJobRetEvent(pData);
    }
  }

  handleSyndicEvent () {
    this.keys.handleSyndicEvent();
  }
}
