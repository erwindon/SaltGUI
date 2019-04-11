import {DropDownMenu} from '../DropDown.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';

export class PillarsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]pillars$", "Pillars", "#page_pillars", "#button_pillars", router);

    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._handleWheelKeyListAll = this._handleWheelKeyListAll.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const minions = this;

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getLocalPillarObfuscate(null).then(minions._updateMinions);
      minions.router.api.getWheelKeyListAll().then(minions._handleWheelKeyListAll);
      minions.router.api.getRunnerJobsListJobs().then(minions._handleRunnerJobsListJobs);
      minions.router.api.getRunnerJobsActive().then(minions._handleRunnerJobsActive);
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

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("pillarinfo", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname) {
    super._updateMinion(container, null, hostname);

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
