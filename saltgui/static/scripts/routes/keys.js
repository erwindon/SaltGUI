class KeysRoute extends PageRoute {

  constructor(router) {
    super("^[\/]keys$", "Keys", "#page_keys", "#button_keys", router);
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._updateKeys = this._updateKeys.bind(this);
    this._runAcceptKey = this._runAcceptKey.bind(this);
    this._runRejectKey = this._runRejectKey.bind(this);
    this._runDeleteKey = this._runDeleteKey.bind(this);
  }

  onShow() {
    const keys = this;
    return new Promise(function(resolve, reject) {
      keys.resolvePromise = resolve;
      if(keys.keysLoaded && keys.jobsLoaded) resolve();
      keys.router.api.getMinions().then(keys._updateMinions);
      keys.router.api.getKeys().then(keys._updateKeys);
      keys.router.api.getJobs().then(keys._updateJobs);
      keys.router.api.getJobsActive().then(keys._runningJobs);
    });
  }

  _updateKeys(data) {
    const keys = data.return;

    const list = this.getPageElement().querySelector("#minions");

    // Unaccepted goes first because that is where the user must decide
    const hdr3 = Route._createTd("subtitle", "Unaccepted Keys");
    hdr3.setAttribute("colspan", 5);
    const tr3 = document.createElement("tr");
    tr3.appendChild(hdr3);
    list.appendChild(tr3);
    let hostnames = keys.minions_pre.sort();
    for(const hostname of hostnames) {
      this._addPreMinion(list, hostname);
    }
    if(hostnames.length === 0)
      this._addNone(list);

    const hdr1 = Route._createTd("subtitle", "Accepted Keys");
    hdr1.setAttribute("colspan", 5);
    const tr1 = document.createElement("tr");
    tr1.appendChild(hdr1);
    list.appendChild(tr1);
    hostnames = keys.minions.sort();
    for(const hostname of hostnames) {
      this._addMinion(list, hostname);
    }
    if(hostnames.length === 0)
      this._addNone(list);

    const hdr2 = Route._createTd("subtitle", "Denied Keys");
    hdr2.setAttribute("colspan", 5);
    const tr2 = document.createElement("tr");
    tr2.appendChild(hdr2);
    list.appendChild(tr2);
    hostnames = keys.minions_denied.sort();
    for(const hostname of hostnames) {
      this._addDeniedMinion(list, hostname);
    }
    if(hostnames.length === 0)
      this._addNone(list);

    const hdr4 = Route._createTd("subtitle", "Rejected Keys");
    hdr4.setAttribute("colspan", 5);
    const tr4 = document.createElement("tr");
    tr4.appendChild(hdr4);
    list.appendChild(tr4);
    hostnames = keys.minions_rejected.sort();
    for(const hostname of hostnames) {
      this._addRejectedMinion(list, hostname);
    }
    if(hostnames.length === 0)
      this._addNone(list);

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addMenuItemAccept(menu, hostname, extra) {
    menu.addMenuItem("Accept&nbsp;key...", function(evt) {
      this._runAcceptKey(evt, hostname, extra);
    }.bind(this));
  }

  _addMenuItemDelete(menu, hostname, extra) {
    menu.addMenuItem("Delete&nbsp;key...", function(evt) {
      this._runDeleteKey(evt, hostname, extra);
    }.bind(this));
  }

  _addMenuItemReject(menu, hostname, extra) {
    menu.addMenuItem("Reject&nbsp;key...", function(evt) {
      this._runRejectKey(evt, hostname, extra);
    }.bind(this));
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    const element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));

    const menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, hostname, " include_accepted=true");
    this._addMenuItemDelete(menu, hostname, "");
  }

  _updateMinion(container, minion, hostname) {
    super._updateMinion(container, minion, hostname);

    const element = document.getElementById(hostname);

    const menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, hostname, " include_accepted=true");
    this._addMenuItemDelete(menu, hostname, "");
  }

  _addRejectedMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const rejected = Route._createTd("status", "rejected");
    rejected.classList.add("rejected");
    element.appendChild(rejected);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));

    const menu = new DropDownMenu(element);
    this._addMenuItemDelete(menu, hostname, "");
    this._addMenuItemAccept(menu, hostname, " include_rejected=true");

    container.appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const denied = Route._createTd("status", "denied");
    denied.classList.add("denied");
    element.appendChild(denied);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));

    const menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname, " include_denied=true");
    this._addMenuItemReject(menu, hostname, " include_denied=true");
    this._addMenuItemDelete(menu, hostname, "");

    container.appendChild(element);
  }

  _addPreMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createTd("hostname", hostname));

    const pre = Route._createTd("status", "unaccepted");
    pre.classList.add("unaccepted");
    element.appendChild(pre);

    // force same columns on all rows
    element.appendChild(Route._createTd("saltversion", ""));
    element.appendChild(Route._createTd("os", ""));

    const menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname, "");
    this._addMenuItemReject(menu, hostname, "");
    this._addMenuItemDelete(menu, hostname, "");

    container.appendChild(element);
  }

}
