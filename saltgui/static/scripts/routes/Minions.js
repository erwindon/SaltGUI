import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class MinionsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]$", "Minions", "#page_minions", "#button_minions", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localGrainsItemsPromise = this.router.api.getLocalGrainsItems(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();
    //we need these functions to populate the dropdown boxes
    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();

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

    //we need these functions to populate the dropdown boxes
    wheelConfigValuesPromise.then(data => {
      myThis._handleWheelConfigValues(data);
    }, data => {
      // never mind
    });
  }

  _handleWheelConfigValues(data) {
    // store for later use

    const templates = data.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));

    const public_pillars = data.return[0].data.return.saltgui_public_pillars;
    window.localStorage.setItem("public_pillars", JSON.stringify(public_pillars));

    const preview_grains = data.return[0].data.return.saltgui_preview_grains;
    window.localStorage.setItem("preview_grains", JSON.stringify(preview_grains));

    let nodegroups = data.return[0].data.return.nodegroups;
    if(!nodegroups) nodegroups = {};
    window.localStorage.setItem("nodegroups", JSON.stringify(nodegroups));

    const output_formats = data.return[0].data.return.saltgui_output_formats;
    window.localStorage.setItem("output_formats", JSON.stringify(output_formats));

    const datetime_fraction_digits = data.return[0].data.return.saltgui_datetime_fraction_digits;
    window.localStorage.setItem("datetime_fraction_digits", JSON.stringify(datetime_fraction_digits));
  }

  _handleWheelKeyListAll(data) {
    const list = this.getPageElement().querySelector("#minions");

    if(PageRoute.showErrorRowInstead(list, data)) return;

    const keys = data.return[0].data.return;

    const hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname, 1);

      // preliminary dropdown menu
      const element = document.getElementById(hostname);
      const menu = new DropDownMenu(element);
      this._addMenuItemStateApply(menu, hostname);

      element.addEventListener("click", evt => this._runCommand(evt, hostname, "state.apply"));
    }

    Utils.showTableSortable(this.getPageElement(), "minions");
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname, allMinions) {
    super._updateMinion(container, minion, hostname, allMinions);

    const element = document.getElementById(hostname);
    const menu = new DropDownMenu(element);
    this._addMenuItemStateApply(menu, hostname);

    element.addEventListener("click", evt => this._runCommand(evt, hostname, "state.apply"));
  }

  _addMenuItemStateApply(menu, hostname) {
    menu.addMenuItem("Apply&nbsp;state...", function(evt) {
      this._runCommand(evt, hostname, "state.apply");
    }.bind(this));
  }
}
