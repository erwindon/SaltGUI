import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class GrainsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]grains$", "Grains", "#page_grains", "#button_grains", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);

    // collect the list of displayed minions
    let previewGrainsText = window.localStorage.getItem("preview_grains");
    if(!previewGrainsText || previewGrainsText === "undefined") {
      previewGrainsText = "[]";
    }
    this._previewGrains = JSON.parse(previewGrainsText);
    if(!Array.isArray(this._previewGrains)) {
      this._previewGrains = [ ];
    }
    // add the preview columns
    const tr = this.page_element.querySelector("#page_grains thead tr");
    for(let i = 0; i < this._previewGrains.length; i++) {
      const th = document.createElement("th");
      th.innerText = this._previewGrains[i];
      tr.appendChild(th);
    }

    // The new columns are not yet sortable, make sure they are.
    // First detroy all the default sorting handlers.
    // A (deep)copy of an element does not copy its handlers.
    const oldHead = this.page_element.querySelector("#page_grains table thead");
    const newHead = oldHead.cloneNode(true);
    oldHead.parentNode.replaceChild(newHead, oldHead);
    // Now re-start sorting logic.
    sorttable.makeSortable(this.page_element.querySelector("#page_grains table"));
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(data1 => {
      myThis._handleWheelKeyListAll(data1);
      localGrainsItemsPromise.then(data => {
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

  _handleWheelKeyListAll(data) {
    const list = this.getPageElement().querySelector('#minions');

    if(PageRoute.showErrorRowInstead(list, data)) return;

    const keys = data.return[0].data.return;

    const hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname, 1 + this._previewGrains.length);

      // preliminary dropdown menu
      const element = document.getElementById(hostname);
      const menu = new DropDownMenu(element);
      this._addMenuItemShowGrains(menu, hostname);

      for(let i = 0; i < this._previewGrains.length; i++) {
        element.appendChild(Route._createTd("", ""));
      }

      element.addEventListener("click", evt => window.location.assign("grainsminion?minion=" + encodeURIComponent(hostname)));
    }

    Utils.showTableSortable(this.getPageElement(), "minions");
    Utils.makeTableSearchable(this.getPageElement(), "minions");

    const msg = this.page_element.querySelector("div.minion-list .msg");
    const txt = Utils.txtZeroOneMany(hostnames.length,
      "No minions", "{0} minion", "{0} minions");
    msg.innerText = txt;
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));
    element.appendChild(Route._createTd("graininfo", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
    for(let i = 0; i < this._previewGrains.length; i++) {
      element.appendChild(Route._createTd("", ""));
    }
  }

  _updateMinion(container, minion, hostname, allMinions) {
    super._updateMinion(container, minion, hostname, allMinions);

    const element = document.getElementById(hostname);

    if(typeof minion === "object") {
      const cnt = Object.keys(minion).length;
      const grainInfoText = cnt + " grains";
      const grainInfoTd = Route._createTd("graininfo", grainInfoText);
      grainInfoTd.setAttribute("sorttable_customkey", cnt);
      element.appendChild(grainInfoTd);
    } else {
      const grainInfoTd = Route._createTd("", "");
      Utils.addErrorToTableCell(grainInfoTd, minion);
      element.appendChild(grainInfoTd);
    }

    const menu = new DropDownMenu(element);
    this._addMenuItemShowGrains(menu, hostname);

    // add the preview columns
    for(let i = 0; i < this._previewGrains.length; i++) {
      const td = document.createElement("td");
      const grainName = this._previewGrains[i];
      if(typeof minion === "object") {
        if(grainName in minion) {
          td.innerText = Output.formatObject(minion[grainName]);
          td.classList.add("grain_value");
        }
      } else {
        Utils.addErrorToTableCell(td, minion);
      }
      element.appendChild(td);
    }

    element.addEventListener("click", evt => window.location.assign("grainsminion?minion=" + encodeURIComponent(hostname)));
  }

  _addMenuItemShowGrains(menu, hostname) {
    menu.addMenuItem("Show&nbsp;grains", function(evt) {
      window.location.assign("grainsminion?minion=" + encodeURIComponent(hostname));
    }.bind(this));
  }
}
