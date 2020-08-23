/* global */

import {EventsPanel} from "../panels/Events.js";
import {PageRoute} from "./Page.js";

export class EventsRoute extends PageRoute {

  constructor (pRouter) {
    // don't use /events for the page, that url is reserved
    super("eventsview", "Events", "page-events", "button-events", pRouter);

    this.events = new EventsPanel();
    super.addPanel(this.events);
  }

  onShow () {
    this.events.onShow();
  }

  handleAnyEvent (tag, data) {
    this.events.handleAnyEvent(tag, data);
  }
}
