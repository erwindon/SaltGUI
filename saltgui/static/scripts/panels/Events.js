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

    this.nrEvents = 0;
    this.missedEvents = 0;
    this.missedEventsRow = null;
    this.missedEventsRowDataTd = null;
    this.missedEventsRowTimestampSpan = null;
  }

  onShow () {
    this.nrEvents = 0;
    this.missedEvents = 0;
    this.missedEventsRow = null;
    this.missedEventsRowDataTd = null;
    this.missedEventsRowTimestampSpan = null;
    this.updateFooter();
  }

  updateFooter () {
    const noprint_b = "<span class='no-print'>";
    const noprint_e = "</span>";

    // when there are more than a screen-ful of events, the user
    // will not see the "press play" message. but the user already
    // knows that because that caused the events to be shown...
    let txt = Utils.txtZeroOneMany(this.nrEvents, "No events", "{0} event", "{0} events");
    if (this.playOrPause === "play") {
      const tbody = this.table.tBodies[0];
      txt += noprint_b;
      if (tbody.rows.length) {
        txt += ", waiting for more events";
      } else {
        txt += ", waiting for events";
      }
      txt += noprint_e;
    }
    super.updateFooter(txt);
  }

  handleAnyEvent (pTag, pData) {
    const tbody = this.table.tBodies[0];

    if (this.playOrPause !== "play") {
      this.missedEvents += 1;
      const missedTxt = Utils.txtZeroOneMany(this.missedEvents, "", "{0} missed event", "{0} missed events");
      if (this.missedEventsRow === null) {
        const tr = Utils.createTr();
        tr.classList.add("missed-events");

        const stampTd = Utils.createTd();
        const stampSpan = Utils.createSpan();
        const stampDate = new Date();
        Output.dateTimeStr(stampDate, stampSpan, "bottom-left", true);
        stampTd.appendChild(stampSpan);
        tr.append(stampTd);

        const tagTd = Utils.createTd();
        const sinceTextSpan = Utils.createSpan();
        sinceTextSpan.innerText = "Since ";
        tagTd.appendChild(sinceTextSpan);
        const sinceTimeSpan = Utils.createSpan();
        Output.dateTimeStr(stampDate, sinceTimeSpan, "bottom-left", true);
        tagTd.appendChild(sinceTimeSpan);
        tr.append(tagTd);

        const dataTd = Utils.createTd("event-data", missedTxt);
        tr.append(dataTd);
        tbody.prepend(tr);
        this.missedEventsRow = tr;
        this.missedEventsRowDataTd = dataTd;
        this.missedEventsRowTimestampSpan = stampSpan;
      } else {
        const stampSpan = this.missedEventsRowTimestampSpan;
        while (stampSpan.firstChild) {
          stampSpan.removeChild(stampSpan.firstChild);
        }
        const stampDate = new Date();
        Output.dateTimeStr(stampDate, stampSpan, "bottom-left", true);
        this.missedEventsRowDataTd.innerText = missedTxt;
      }
      return;
    }

    if (this.missedEventsRow !== null) {
      this.missedEventsRow = null;
      this.missedEventsRowDataTd = null;
      this.missedEventsRowTimestampSpan = null;
      this.missedEvents = 0;
    }

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
    this.nrEvents += 1;

    const searchBlock = this.div.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, this.table, "refresh");

    // limit to MAX_EVENTS_IN_VIEW rows only
    while (tbody.rows.length > MAX_EVENTS_IN_VIEW) {
      const deletedRow = tbody.rows[tbody.rows.length - 1];
      if (!deletedRow.classList.contains("missed-events")) {
        this.nrEvents -= 1;
      }
      tbody.deleteRow(tbody.rows.length - 1);
    }

    this.updateFooter();
  }
}
