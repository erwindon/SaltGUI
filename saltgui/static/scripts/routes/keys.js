class KeysRoute extends PageRoute {

  constructor(router) {
    super("^[\/]keys$", "Keys", "#page_keys", "#button_keys");
    this.router = router;
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateKeys = this._updateKeys.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._runAcceptKey = this._runAcceptKey.bind(this);
    this._runRejectKey = this._runRejectKey.bind(this);
    this._runDeleteKey = this._runDeleteKey.bind(this);
    this._runCommand = this._runCommand.bind(this);
  }

  onShow() {
    let keys = this;
    return new Promise(function(resolve, reject) {
      keys.resolvePromise = resolve;
      if(keys.keysLoaded && keys.jobsLoaded) resolve();
      keys.router.api.getMinions().then(keys._updateMinions);
      keys.router.api.getKeys().then(keys._updateKeys);
      keys.router.api.getJobs().then(keys._updateJobs);
    });
  }

  _updateKeys(data) {
    let keys = data.return;

    let list = this.getPageElement().querySelector('#minions');
    let hostnames = keys.minions.sort();
    for(let i = 0; i < hostnames.length; i++) {
      this._addMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
      this._addNone(list);

    list = this.getPageElement().querySelector('#keys_denied');
    hostnames = keys.minions_denied.sort();
    for(let i = 0; i < hostnames.length; i++) {
      this._addDeniedMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
      this._addNone(list);

    list = this.getPageElement().querySelector('#keys_unaccepted');
    hostnames = keys.minions_pre.sort();
    for(let i = 0; i < hostnames.length; i++) {
      this._addPreMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
      this._addNone(list);

    list = this.getPageElement().querySelector('#keys_rejected');
    hostnames = keys.minions_rejected.sort();
    for(let i = 0; i < hostnames.length; i++) {
      this._addRejectedMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
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

    let element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    let menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, hostname, " include_accepted=true");
    this._addMenuItemDelete(menu, hostname, "");
  }

  _updateMinion(container, minion) {
    super._updateMinion(container, minion);

    let element = document.getElementById(minion.hostname);

    let menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, minion.hostname, " include_accepted=true");
    this._addMenuItemDelete(menu, minion.hostname, "");
  }

  _addRejectedMinion(container, hostname) {
    let element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    let rejected = Route._createDiv("status", "rejected");
    rejected.classList.add("rejected");
    element.appendChild(rejected);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    let menu = new DropDownMenu(element);
    this._addMenuItemDelete(menu, hostname, "");
    this._addMenuItemAccept(menu, hostname, " include_rejected=true");

    container.appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    let element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    let denied = Route._createDiv("status", "denied");
    denied.classList.add("denied");
    element.appendChild(denied);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    let menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname, " include_denied=true");
    this._addMenuItemReject(menu, hostname, " include_denied=true");
    this._addMenuItemDelete(menu, hostname, "");

    container.appendChild(element);
  }

  _addPreMinion(container, hostname) {
    let element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    let pre = Route._createDiv("status", "unaccepted");
    pre.classList.add("unaccepted");
    element.appendChild(pre);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    let menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname, "");
    this._addMenuItemReject(menu, hostname, "");
    this._addMenuItemDelete(menu, hostname, "");

    container.appendChild(element);
  }

}

