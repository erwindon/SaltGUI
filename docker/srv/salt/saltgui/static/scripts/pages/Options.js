/* global */

import {OptionsPanel} from "../panels/Options.js";
import {Page} from "./Page.js";
import {StatsPanel} from "../panels/Stats.js";
import {Utils} from "../Utils.js";

export class OptionsPage extends Page {

  constructor (pRouter) {
    super("options", "Options", "page-options", "", pRouter);

    this.options = new OptionsPanel();
    super.addPanel(this.options);
    if (Utils.getQueryParam("popup") !== "true") {
      this.stats = new StatsPanel();
      super.addPanel(this.stats);
    }
  }

  onHide () {
    this.options.onHide();
    if (this.stats) {
      this.stats.onHide();
    }
  }
}
