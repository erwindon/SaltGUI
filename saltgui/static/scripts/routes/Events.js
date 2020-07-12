import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class EventsRoute extends PageRoute {

  constructor(pRouter) {
    // don't use /events for the page, that url is reserved
    super("eventsview", "Events", "#page-events", "#button-events", pRouter);

    Utils.makeTableSearchable(this.getPageElement());
  }

  handleAnyEvent(pTag, pData) {
    const tbody = this.pageElement.querySelector("table tbody");
    const tr = document.createElement("tr");

    // add timestamp value
    const stampTd = Route.createTd("", "");
    let stampTxt = pData["_stamp"];
    //if(!stampTxt) stampTxt = new Date().toISOString();
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
    const tagTd = Route.createTd("", "");
    tagTd.innerText = pTag;
    tr.append(tagTd);

    // add data value
    const dataTd = Route.createTd("", "");
    const pDataObj = {};
    Object.assign(pDataObj, pData);
    delete pDataObj._stamp;
    dataTd.innerText = Output.formatObject(pDataObj);
    tr.append(dataTd);

    tbody.prepend(tr);

    // limit to 100 rows only
    while(tbody.rows.length > 5) {
      tbody.deleteRow(tbody.rows.length - 1);
    }

    // update the footer
    const msgDiv = this.pageElement.querySelector(".msg");
    msgDiv.innerText = Utils.txtZeroOneMany(tbody.rows.length,
      "No events", "{0} event", "{0} events");
  }
}
