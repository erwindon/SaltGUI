/* global */

import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Router} from "../Router.js";
import {Utils} from "../Utils.js";

export class ReactorsPanel extends Panel {

  constructor () {
    super("reactors");

    this.addTitle("Reactors");
    this.addSearchButton();
    this.addTable(["Event", "Reactors"]);

    // cannot use this now since we are loading
    // the data in random order
    // this.setTableSortable("Event", "asc");

    this.addMsg();
  }

  onShow () {
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();

    wheelConfigValuesPromise.then((pWheelConfigValuesData) => {
      this._handleReactorsWheelConfigValues(pWheelConfigValuesData);
      return true;
    }, (pWheelConfigValuesMsg) => {
      this._handleReactorsWheelConfigValues(JSON.stringify(pWheelConfigValuesMsg));
      return false;
    });
  }

  _handleReactorsWheelConfigValues (pWheelConfigValuesData) {
    if (this.showErrorRowInstead(pWheelConfigValuesData)) {
      return;
    }

    // should we update it or just use from cache (see commandbox) ?
    let reactors = pWheelConfigValuesData.return[0].data.return.reactor;
    if (reactors) {
      Utils.setStorageItem("session", "reactors", JSON.stringify(reactors));
      Router.updateMainMenu();
    } else {
      reactors = [];
    }
    for (const reactor of reactors) {
      for (const eventTag in reactor) {
        this._addReactor(eventTag, reactor[eventTag]);
      }
    }

    this.setTableSortable("Event", "asc");

    const txt = Utils.txtZeroOneMany(reactors.length,
      "No reactors", "{0} reactor", "{0} reactors");
    this.setMsg(txt);
  }

  _addReactor (pEvent, pReactor) {
    const tr = Utils.createTr();
    tr.appendChild(Utils.createTd("", pEvent));
    tr.appendChild(Utils.createTd("", Output.formatObject(pReactor)));

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);
  }
}
