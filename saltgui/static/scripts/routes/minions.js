class MinionsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]$", "Minions", "#page_minions", "#button_minions", router);
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateKeys = this._updateKeys.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._runHighState = this._runHighState.bind(this);
    this._runCommand = this._runCommand.bind(this);
  }

  onShow() {
    const minions = this;
    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getMinions().then(minions._updateMinions);
      minions.router.api.getKeys().then(minions._updateKeys);
      minions.router.api.getJobs().then(minions._updateJobs);
      minions.router.api.getRunningJobs().then(minions._runningJobs);
    });
  }

  _updateKeys(data) {
    const keys = data.return;

    const list = this.getPageElement().querySelector('#minions');

    const hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname);
    }

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addMenuItemSyncState(menu, hostname) {
    menu.addMenuItem("Sync&nbsp;state...", function(evt) {
      this._runHighState(evt, hostname);
    }.bind(this));
  }

  _updateMinion(container, minion, hostname) {
    super._updateMinion(container, minion, hostname);

    const element = document.getElementById(hostname);
   
    element.appendChild(Route._createDiv("os", minion.os + " " + minion.osrelease));

    const menu = new DropDownMenu(element);
    this._addMenuItemSyncState(menu, hostname);
  }

  _runHighState(evt, hostname) {
    this._runCommand(evt, hostname, "state.apply");
  }
}
