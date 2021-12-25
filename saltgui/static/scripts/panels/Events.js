/* global document */

import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

const MAX_EVENTS_IN_VIEW = 100;

export class EventsPanel extends Panel {

  constructor () {
    super("events");

    this.addTitle("Recent Events");
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "The content of this page is",
      "automatically refreshed.",
      "Display is limited to " + MAX_EVENTS_IN_VIEW + " events."
    ]);
    this.addTable(["Timestamp", "Tag", "Data"]);
    this.addMsg();

    this.setPlayPauseButton("pause");
  }

  onShow () {
    this.updateFooter();
  }

  updateFooter () {
    // update the footer
    const tbody = this.table.tBodies[0];
    // when there are more than a screen-ful of events, the user
    // will not see the "press play" message. but the user already
    // knows that because that caused the events to be shown...
    let txt = Utils.txtZeroOneMany(tbody.rows.length,
      "No events", "{0} event", "{0} events");
    if (this.playOrPause === "play") {
      if (tbody.rows.length) {
        txt += ", waiting for more events";
      } else {
        txt += ", waiting for events";
      }
    }
    this.setMsg(txt);
  }

  handleAnyEvent (pTag, pData) {

    if (this.playOrPause !== "play") {
      return;
    }

    const tbody = this.table.tBodies[0];
    const tr = document.createElement("tr");

    // add timestamp value
    const stampTd = Utils.createTd();
    let stampTxt = pData["_stamp"];
    if (!stampTxt) {
      stampTxt = new Date().toISOString();
    }
    // The toISOString applies the same offset, so we do it twice
    const localTimeOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const stampDateTime2 = Date.parse(stampTxt) - 2 * localTimeOffset;
    stampTxt = new Date(stampDateTime2).toISOString();
    // fix milliseconds/nanoseconds
    stampTxt = Output.dateTimeStr(stampTxt);
    // remove date
    stampTxt = stampTxt.replace(/.*T/, "");
    stampTd.innerText = Output.dateTimeStr(stampTxt);
    tr.append(stampTd);

    // add tag value
    const tagTd = Utils.createTd("", pTag);
    tr.append(tagTd);

    // add data value
    const dataTd = Utils.createTd("event-data");
    const pDataObj = {};
    Object.assign(pDataObj, pData);
    delete pDataObj._stamp;
    dataTd.innerText = Output.formatObject(pDataObj);
    tr.append(dataTd);

    tbody.prepend(tr);

    const searchBlock = this.div.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, this.table, "refresh");

    // limit to MAX_EVENTS_IN_VIEW rows only
    while (tbody.rows.length > MAX_EVENTS_IN_VIEW) {
      tbody.deleteRow(tbody.rows.length - 1);
    }

    this.updateFooter();
  }
}
