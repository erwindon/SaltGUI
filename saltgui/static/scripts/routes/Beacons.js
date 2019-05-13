import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class BeaconsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]beacons$", "Beacons", "#page_beacons", "#button_beacons", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);

    // add all the required columns
    const tr = this.page_element.querySelector("#page_beacons thead tr");
    while(tr.childElementCount > 6) {
      tr.removeChild(tr.lastChild);
    }

    // The new columns are not yet sortable, make sure they are.
    // First detroy all the default sorting handlers.
    // A (deep)copy of an element does not copy its handlers.
    const oldHead = this.page_element.querySelector("#page_beacons table thead");
    const newHead = oldHead.cloneNode(true);
    oldHead.parentNode.replaceChild(newHead, oldHead);
    // Now re-start sorting logic.
    sorttable.makeSortable(this.page_element.querySelector("#page_beacons table"));
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localBeaconsListPromise = this.router.api.getLocalBeaconsList(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(data1 => {
      myThis._handleWheelKeyListAll(data1);
      localBeaconsListPromise.then(data => {
        myThis._updateMinions(data);
      }, data2 => {
        const data = {"return":[{}]};
        for(const k of data1.return[0].data.return.minions)
          data.return[0][k] = JSON.stringify(data2);
        myThis._updateMinions(data);
      });
    }, data => {
      myThis._handleWheelKeyListAll(JSON.stringify(data));
    });

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      }, data => {
        myThis._handleRunnerJobsActive(JSON.stringify(data));
      });
    }, data => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(data));
    }); 
  }

  static _fixMinion(data) {
    if(typeof data !== "object") return data;

    // the data is an array of objects
    // where each object has one key
    // re-create as a normal object

    const ret = { "beacons": {}, "enabled": true };

    for(const k in data) {
      // correct for empty list that returns this dummy value
      if(k === "beacons" && JSON.stringify(data[k]) === "{}") {
        continue;
      }

      // "enabled" is always a boolean (when present)
      if(k === "enabled") {
        ret.enabled = data.enabled;
        continue;
      }

      // make one object from the settings
      // eliminates one layer in the datamodel
      // and looks much better
      const newdata = { };
      for(const elem of data[k])
        for(const p in elem)
          newdata[p] = elem[p];
      ret.beacons[k] = newdata;
    }

    return ret;
  }

  _handleWheelKeyListAll(data) {
    const list = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(list, data)) return;

    const keys = data.return[0].data.return;

    const hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname, 1);

      // preliminary dropdown menu
      const element = document.getElementById(hostname);
      const menu = new DropDownMenu(element);
      this._addMenuItemShowBeacons(menu, hostname);

      element.addEventListener("click", evt => window.location.assign("beaconsminion?minion=" + encodeURIComponent(hostname)));
    }

    Utils.showTableSortable(this.getPageElement(), "minions");
    Utils.makeTableSearchable(this.getPageElement(), "minions");
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("beaconinfo", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname, allMinions) {

    minion = BeaconsRoute._fixMinion(minion);

    super._updateMinion(container, null, hostname, allMinions);

    const element = document.getElementById(hostname);

    if(typeof minion === "object") {
      const cnt = Object.keys(minion.beacons).length;
      let beaconInfoText;
      if(cnt === 0) {
        beaconInfoText = "No beacons";
      } else if(cnt === 1) {
        beaconInfoText = cnt + " beacon";
      } else {
        beaconInfoText = cnt + " beacons";
      }
      if(!minion.enabled)
        beaconInfoText += " (disabled)";
      const beaconInfoTd = Route._createTd("beaconinfo", beaconInfoText);
      beaconInfoTd.setAttribute("sorttable_customkey", cnt);
      element.appendChild(beaconInfoTd);
    } else {
      const beaconInfoTd = Route._createTd("", "");
      Utils.addErrorToTableCell(beaconInfoTd, minion);
      element.appendChild(beaconInfoTd);
    }

    const menu = new DropDownMenu(element);
    this._addMenuItemShowBeacons(menu, hostname);

    // add all the required columns
    while(element.childElementCount > 6) {
      element.removeChild(element.lastChild);
    }

    element.addEventListener("click", evt => window.location.assign("beaconsminion?minion=" + encodeURIComponent(hostname)));
  }

  _addMenuItemShowBeacons(menu, hostname) {
    menu.addMenuItem("Show&nbsp;beacons", function(evt) {
      window.location.assign("beaconsminion?minion=" + encodeURIComponent(hostname));
    }.bind(this));
  }
}
