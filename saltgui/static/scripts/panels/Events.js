/* global */

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
    this.nrEvents = 0;
    this.updateFooter();
  }

  updateFooter () {
    // when there are more than a screen-ful of events, the user
    // will not see the "press play" message. but the user already
    // knows that because that caused the events to be shown...
    let txt = Utils.txtZeroOneMany(this.nrEvents, "No events", "{0} event", "{0} events");
    if (this.playOrPause === "play") {
      const tbody = this.table.tBodies[0];
      txt += "<span class='no-print'>";
      if (tbody.rows.length) {
        txt += ", waiting for more events";
      } else {
        txt += ", waiting for events";
      }
      txt += "</span>";
    }
    super.updateFooter(txt);
  }

  handleAnyEvent (pTag, pData) {

    if (this.playOrPause !== "play") {
      return;
    }

    const tbody = this.table.tBodies[0];
    const tr = Utils.createTr();

    // add timestamp value
    const stampTd = Utils.createTd();
    const stampSpan = Utils.createSpan();
    let stampTxt = pData["_stamp"];
    if (!stampTxt) {
      stampTxt = new Date().toISOString();
    }
    Output.dateTimeStr(stampTxt, stampSpan, "bottom-left", true);
    stampTd.appendChild(stampSpan);
    tr.append(stampTd);

    // add tag value
    const tagTd = Utils.createTd("", pTag);
    tr.append(tagTd);

    // add data value
    const pDataObj = {};
    Object.assign(pDataObj, pData);
    delete pDataObj._stamp;
    const dataTd = Utils.createTd("event-data", Output.formatObject(pDataObj));
    tr.append(dataTd);

    tbody.prepend(tr);

    const searchBlock = this.div.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, this.table, "refresh");

    // limit to MAX_EVENTS_IN_VIEW rows only
    while (tbody.rows.length > MAX_EVENTS_IN_VIEW) {
      tbody.deleteRow(tbody.rows.length - 1);
    }

    this.nrEvents = tbody.rows.length;
    this.updateFooter();
  }
}
