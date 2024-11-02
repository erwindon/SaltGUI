/* global */

import {JobsSummaryPanel} from "../panels/JobsSummary.js";
import {NodegroupsPanel} from "../panels/Nodegroups.js";
import {Page} from "./Page.js";
import {Utils} from "../Utils.js";

export class NodegroupsPage extends Page {

  constructor (pRouter) {
    super("nodegroups", "Nodegroups", "page-nodegroups", "button-nodegroups", pRouter);

    this.nodegroups = new NodegroupsPanel();
    super.addPanel(this.nodegroups);
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
    // show nodegroups menu item if nodegroups defined
    const nodegroups = Utils.getStorageItemObject("session", "nodegroups");
    return Object.keys(nodegroups).length > 0;
  }

  onHide () {
    this.nodegroups.onHide();
  }
}
