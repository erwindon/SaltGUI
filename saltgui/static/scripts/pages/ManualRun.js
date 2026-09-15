/* global */

import {Documentation} from "../Documentation.js";
import {ManualRunPanel} from "../panels/ManualRun.js";
import {Page} from "./Page.js";

export class ManualRunPage extends Page {

  constructor (pRouter) {
    super("manualrun", "Manual Run", "page-manualrun", "button-manualrun", pRouter);

    this.manualRunPanel = new ManualRunPanel();
    ManualRunPage.panel = this.manualRunPanel;
    super.addPanel(this.manualRunPanel);
  }

  onShow () {
    if (!Documentation.PROVIDERS) {
      Documentation.PROVIDERS = {};
    }

    const dashboard = this.pageElement.querySelector(".dashboard");
    dashboard.appendChild(this.manualRunPanel.div);
    this.manualRunPanel.onShow();
  }

  onHide () {
    this.manualRunPanel.onHide();
  }
}
