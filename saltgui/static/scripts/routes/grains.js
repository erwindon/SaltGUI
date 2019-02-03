class GrainsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]grains$", "Grains", "#page_grains", "#button_grains", router);
    this.jobsLoaded = false;
    this._updateMinion = this._updateMinion.bind(this);
  }

  onShow() {
    const minions = this;

    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.jobsLoaded) resolve();
      minions.router.api.getMinions().then(minions._updateMinions);
      minions.router.api.getJobs().then(minions._updateJobs);
      minions.router.api.getJobsActive().then(minions._runningJobs);
    });
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));
    element.appendChild(Route._createTd("graininfo", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname) {
    super._updateMinion(container, minion, hostname);

    const element = document.getElementById(hostname);

    const cnt = Object.keys(minion).length;
    const grainInfoText = cnt + " grains";
    const grainInfoTd = Route._createTd("graininfo", grainInfoText);
    grainInfoTd.setAttribute("sorttable_customkey", cnt);
    element.appendChild(grainInfoTd);

    const menu = new DropDownMenu(element);
    this._addMenuItemShowGrains(menu, hostname);
  }

  _addMenuItemShowGrains(menu, hostname) {
    menu.addMenuItem("Show&nbsp;grains", function(evt) {
      window.location.assign("grainsminion?minion=" + encodeURIComponent(hostname));
    }.bind(this));
  }
}
