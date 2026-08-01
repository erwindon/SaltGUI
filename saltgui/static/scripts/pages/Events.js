/* global */

import {EventsPanel} from "../panels/Events.js";
import {Page} from "./Page.js";

export class EventsPage extends Page {

  constructor (pRouter) {
    // there is no (technical) confusion with API call "/events" because we use only "#events"
    super("events", "Events", "page-events", "button-events", pRouter);

    this.events = new EventsPanel();
    super.addPanel(this.events);
  }

  handleAnyEvent (pTag, pData) {
    this.events.handleAnyEvent(pTag, pData);
  }
}
