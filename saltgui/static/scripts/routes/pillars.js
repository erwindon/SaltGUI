class PillarsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]pillars$", "Pillars", "#page_pillars", "#button_pillars", router);
    this.jobsLoaded = false;
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const minions = this;

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.jobsLoaded) resolve();
      minions.router.api.getPillarObfuscate().then(minions._updateMinions);
      minions.router.api.getJobs().then(minions._updateJobs);
      minions.router.api.getJobsActive().then(minions._runningJobs);
    });
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
  }

  _addMenuItemShowPillars(menu, hostname) {
    menu.addMenuItem("Show&nbsp;pillars", function(evt) {
      window.location.assign("pillarsminion?minion=" + encodeURIComponent(hostname));
    }.bind(this));
  }
}
