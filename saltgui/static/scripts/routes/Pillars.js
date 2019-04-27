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

    wheelKeyListAllPromise.then(myThis._handleWheelKeyListAll);

    localPillarObfuscatePromise.then(myThis._updateMinions);

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      });
    }); 
  }

  _handleWheelKeyListAll(data) {
    const keys = data.return[0].data.return;

    const list = this.getPageElement().querySelector('#minions');

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

    const cnt = Object.keys(minion).length;
    let pillarInfoText;
    if(cnt === 0) {
      pillarInfoText = "No pillars";
    } else if(cnt === 1) {
      pillarInfoText = cnt + " pillar";
    } else {
      pillarInfoText = cnt + " pillars";
    }
    const pillarInfoTd = Route._createTd("pillarinfo", pillarInfoText);
    pillarInfoTd.setAttribute("sorttable_customkey", cnt);
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
