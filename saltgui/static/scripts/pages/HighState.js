/* global */

import {HighStatePanel} from "../panels/HighState.js";
import {Page} from "./Page.js";

export class HighStatePage extends Page {

  constructor (pRouter) {
    super("highstate", "HighState", "page-highstate", "button-highstate", pRouter);

    this.highstate = new HighStatePanel();
    super.addPanel(this.highstate);
  }
}
