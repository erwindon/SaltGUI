/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {KeysPanel} from "../panels/Keys.js";
import {PageRoute} from "./Page.js";

export class KeysRoute extends PageRoute {

  constructor (pRouter) {
    super("keys", "Keys", "page-keys", "button-keys", pRouter);

    this.keys = new KeysPanel();
    super.addPanel(this.keys);
    this.jobs = new JobsSummaryPanel();
    super.addPanel(this.jobs);
  }

  onShow () {
    this.keys.onShow();
    this.jobs.onShow();
  }

  handleSaltAuthEvent (pTag, pData) {
    this.keys.handleSaltAuthEvent(pTag, pData);
  }

  handleSaltKeyEvent (pData) {
    this.keys.handleSaltKeyEvent(pData);
  }
}
