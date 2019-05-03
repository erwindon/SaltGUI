import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class PillarsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]pillars$", "Pillars", "#page_pillars", "#button_pillars", router);

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const myThis = this;

    const wheelKeyListAllPromise = this.router.api.getWheelKeyListAll();
    const localPillarObfuscatePromise = this.router.api.getLocalPillarObfuscate(null);
    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    wheelKeyListAllPromise.then(data1 => {
      myThis._handleWheelKeyListAll(data1);
      localPillarObfuscatePromise.then(data => {
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
      this._addMinion(list, hostname, 1);

      // preliminary dropdown menu
      const element = document.getElementById(hostname);
      const menu = new DropDownMenu(element);
      this._addMenuItemShowPillars(menu, hostname);

      element.addEventListener("click", evt => window.location.assign("pillarsminion?minion=" + encodeURIComponent(hostname)));
    }

    Utils.showTableSortable(this.getPageElement(), "minions");
    Utils.showTableSearchable(this.getPageElement(), "minions");
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("pillarinfo", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname, allMinions) {
    super._updateMinion(container, null, hostname, allMinions);

    const element = document.getElementById(hostname);

    let cnt;
    let pillarInfoText;
    if(typeof minion === "object") {
      cnt = Object.keys(minion).length;
      if(cnt === 0) {
        pillarInfoText = "No pillars";
      } else if(cnt === 1) {
        pillarInfoText = cnt + " pillar";
      } else {
        pillarInfoText = cnt + " pillars";
      }
    } else {
      cnt = -1;
      pillarInfoText = "";
    }
    const pillarInfoTd = Route._createTd("pillarinfo", pillarInfoText);
    pillarInfoTd.setAttribute("sorttable_customkey", cnt);
    if(typeof minion !== "object") {
      Utils.addErrorToTableCell(pillarInfoTd, minion);
    }
    element.appendChild(pillarInfoTd);

    const menu = new DropDownMenu(element);
    this._addMenuItemShowPillars(menu, hostname);

    element.addEventListener("click", evt => window.location.assign("pillarsminion?minion=" + encodeURIComponent(hostname)));
  }

  _addMenuItemShowPillars(menu, hostname) {
    menu.addMenuItem("Show&nbsp;pillars", function(evt) {
      window.location.assign("pillarsminion?minion=" + encodeURIComponent(hostname));
    }.bind(this));
  }
}
