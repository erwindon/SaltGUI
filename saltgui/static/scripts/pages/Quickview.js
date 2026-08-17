/* global */

import {QuickviewPanel} from "../panels/QuickviewPanel.js";
import {Page} from "./Page.js";

export class QuickviewPage extends Page {

  constructor (pRouter) {
    super("quickview", "Quick View", "page-quickview", "button-quickview", pRouter);

    this.quickview = new QuickviewPanel();
    super.addPanel(this.quickview);
  }

  onShow () {
    this.quickview.addImageRows();
  }
}
