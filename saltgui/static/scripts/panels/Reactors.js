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
    this.setTableSortable("Event", "asc");

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
    let reactorsArr = pWheelConfigValuesData.return[0].data.return.reactor;
    if (reactorsArr) {
      Utils.setStorageItem("session", "reactors", JSON.stringify(reactorsArr));
      Router.updateMainMenu();
    } else {
      reactorsArr = [];
    }

    // the reactors are organized as an array of maps
    // first re-organize into a single map
    const reactorsMap = {};
    for (const reactor of reactorsArr) {
      for (const eventTag in reactor) {
        reactorsMap[eventTag] = reactor[eventTag];
      }
    }

    // then populate the table
    for (const eventTag of Object.keys(reactorsMap).sort()) {
      this._addReactor(eventTag, reactorsMap[eventTag]);
    }

    const txt = Utils.txtZeroOneMany(reactorsArr.length,
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
