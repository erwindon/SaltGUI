/* global document */

import {Output} from "../output/Output.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {Utils} from "../Utils.js";

const MAX_EVENTS_IN_VIEW = 100;

export class EventsRoute extends PageRoute {

  constructor (pRouter) {
    // don't use /events for the page, that url is reserved
    super("eventsview", "Events", "page-events", "button-events", pRouter);

    const eventsPlayButton = document.getElementById("events-play-button");
    eventsPlayButton.onclick = () => this._clickEventsPlayButton(true);
    const eventsPauseButton = document.getElementById("events-pause-button");
    eventsPauseButton.onclick = () => this._clickEventsPlayButton(false);
    // initially paused
    this._clickEventsPlayButton(false);

    Utils.addTableHelp(this.getPageElement(), "The content of this page is\nautomatically refreshed\nDisplay is limited to " + MAX_EVENTS_IN_VIEW + " events");
    Utils.makeTableSearchable(this.getPageElement(), "events-search-button", "events-table");
  }

  _clickEventsPlayButton (isPlay) {
    const eventsPlayButton = document.getElementById("events-play-button");
    eventsPlayButton.style.display = isPlay ? "none" : "";
    const eventsPauseButton = document.getElementById("events-pause-button");
    eventsPauseButton.style.display = isPlay ? "" : "none";
    Utils.setStorageItem("session", "events-button", isPlay ? "play" : "pause");
    this._updateFooter();
  }

  _updateFooter () {
    // update the footer
    const msgDiv = document.getElementById("events-msg");
    const tbody = document.getElementById("events-table-tbody");
    // when there are more than a screen-ful of events, the user
    // will not see the "press play" message. but ths user already
    // knows that because that cause the events to be shown...
    // 23F5 = BLACK MEDIUM RIGHT-POINTING TRIANGLE (play)
    // FE0E = VARIATION SELECTOR-15 (render as text)
    msgDiv.innerHTML = Utils.txtZeroOneMany(tbody.rows.length,
      "No events", "{0} event", "{0} events") +
      (Utils.getStorageItem("session", "events-button") === "play"
        ? ""
        : ", press '&#x23F5;&#xFE0E;' to begin");
  }

  handleAnyEvent (pTag, pData) {

    if (Utils.getStorageItem("session", "events-button") !== "play") {
      // includes un-set and empty
      return;
    }

    const tbody = document.getElementById("events-table-tbody");
    const tr = document.createElement("tr");

    // add timestamp value
    const stampTd = Route.createTd("", "");
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
    const tagTd = Route.createTd("", pTag);
    tr.append(tagTd);

    // add data value
    const dataTd = Route.createTd("event-data", "");
    const pDataObj = {};
    Object.assign(pDataObj, pData);
    delete pDataObj._stamp;
    dataTd.innerText = Output.formatObject(pDataObj);
    tr.append(dataTd);

    tbody.prepend(tr);

    const searchBlock = this.pageElement.querySelector(".search-box");
    Utils.hideShowTableSearchBar(searchBlock, tbody.parentElement, "refresh");

    // limit to MAX_EVENTS_IN_VIEW rows only
    while (tbody.rows.length > MAX_EVENTS_IN_VIEW) {
      tbody.deleteRow(tbody.rows.length - 1);
    }

    this._updateFooter();
  }
}
