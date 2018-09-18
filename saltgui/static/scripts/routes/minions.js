class MinionsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]$", "Minions", "#page_minions", "#button_minions");
    this.router = router;
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateKeys = this._updateKeys.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._runHighState = this._runHighState.bind(this);
    this._runCommand = this._runCommand.bind(this);
  }

  onShow() {
    let minions = this;
    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.keysLoaded && minions.jobsLoaded) resolve();
      minions.router.api.getMinions().then(minions._updateMinions);
      minions.router.api.getKeys().then(minions._updateKeys);
      minions.router.api.getJobs().then(minions._updateJobs);
    });
  }

  _updateKeys(data) {
    let keys = data.return;

    let list = this.getPageElement().querySelector('#minions');

    let hostnames = keys.minions.sort();
    for(let i = 0; i < hostnames.length; i++) {
      this._addMinion(list, hostnames[i]);
    }

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addMenuItemSyncState(menu, hostname) {
    menu.addMenuItem("Sync&nbsp;state...", function(evt) {
      this._runHighState(evt, hostname);
    }.bind(this));
  }

  _updateMinion(container, minion) {
    super._updateMinion(container, minion);

    let element = document.getElementById(minion.hostname);
    let menu = new DropDownMenu(element);
    this._addMenuItemSyncState(menu, minion.hostname);
  }

}
