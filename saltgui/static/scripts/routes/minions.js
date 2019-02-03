class MinionsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]$", "Minions", "#page_minions", "#button_minions", router);
    this.jobsLoaded = false;
  }

  onShow() {
    const minions = this;
    return new Promise(function(resolve, reject) {
      minions.resolvePromise = resolve;
      if(minions.jobsLoaded) resolve();
      minions.router.api.getMinions().then(minions._updateMinions);
      minions.router.api.getJobs().then(minions._updateJobs);
      minions.router.api.getJobsActive().then(minions._runningJobs);
      //we need these functions to populate the dropdown boxes
      minions.router.api.getConfigValues().then(minions._configvalues);
    });
  }

  _configvalues(data) {
    // store for later use

    const templates = data.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));

    const public_pillars = data.return[0].data.return.saltgui_public_pillars;
    window.localStorage.setItem("public_pillars", JSON.stringify(public_pillars));

    let nodegroups = data.return[0].data.return.nodegroups;
    if(!nodegroups) nodegroups = {};
    window.localStorage.setItem("nodegroups", JSON.stringify(nodegroups));

    const output_formats = data.return[0].data.return.saltgui_output_formats;
    window.localStorage.setItem("output_formats", JSON.stringify(output_formats));

    const datetime_fraction_digits = data.return[0].data.return.saltgui_datetime_fraction_digits;
    window.localStorage.setItem("datetime_fraction_digits", JSON.stringify(datetime_fraction_digits));
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));
    element.appendChild(Route._createTd("run-command-button", ""));
  }

  _updateMinion(container, minion, hostname) {
    super._updateMinion(container, minion, hostname);

    const element = document.getElementById(hostname);
    const menu = new DropDownMenu(element);
    this._addMenuItemStateApply(menu, hostname);
  }

  _addMenuItemStateApply(menu, hostname) {
    menu.addMenuItem("Apply&nbsp;state...", function(evt) {
      this._runCommand(evt, hostname, "state.apply");
    }.bind(this));
  }
}
