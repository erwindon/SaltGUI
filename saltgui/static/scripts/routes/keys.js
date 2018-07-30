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
    var keys = this;
    return new Promise(function(resolve, reject) {
      keys.resolvePromise = resolve;
      if(keys.keysLoaded && keys.jobsLoaded) resolve();
      keys.router.api.getMinions().then(keys._updateMinions);
      keys.router.api.getKeys().then(keys._updateKeys);
      keys.router.api.getJobs().then(keys._updateJobs);
    });
  }

  _updateKeys(data) {
    var keys = data.return;

    var list = this.getPageElement().querySelector('#minions');
    var hostnames = keys.minions.sort();
    for(var i = 0; i < hostnames.length; i++) {
        this._addMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
        this._addNone(list);

    list = this.getPageElement().querySelector('#keys_denied');
    hostnames = keys.minions_denied.sort();
    for(i = 0; i < hostnames.length; i++) {
        this._addDeniedMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
        this._addNone(list);

    list = this.getPageElement().querySelector('#keys_unaccepted');
    hostnames = keys.minions_pre.sort();
    for(i = 0; i < hostnames.length; i++) {
        this._addPreMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
        this._addNone(list);

    list = this.getPageElement().querySelector('#keys_rejected');
    hostnames = keys.minions_rejected.sort();
    for(i = 0; i < hostnames.length; i++) {
        this._addRejectedMinion(list, hostnames[i]);
    }
    if(hostnames.length == 0)
        this._addNone(list);

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addMenuItemAccept(menu, hostname) {
    menu.addMenuItem("Accept&nbsp;key...", function(evt) {
      this._runAcceptKey(evt, hostname);
    }.bind(this));
  }

  _addMenuItemDelete(menu, hostname) {
    menu.addMenuItem("Delete&nbsp;key...", function(evt) {
      this._runDeleteKey(evt, hostname);
    }.bind(this));
  }

  _addMenuItemReject(menu, hostname) {
    menu.addMenuItem("Reject&nbsp;key...", function(evt) {
      this._runRejectKey(evt, hostname);
    }.bind(this));
  }

  _updateOfflineMinion(container, hostname) {
    super._updateOfflineMinion(container, hostname);

    var element = document.getElementById(hostname);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    var menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, hostname);
    this._addMenuItemDelete(menu, hostname);
  }

  _updateMinion(container, minion) {
    super._updateMinion(container, minion);

    var element = document.getElementById(minion.hostname);

    var menu = new DropDownMenu(element);
    this._addMenuItemReject(menu, minion.hostname);
    this._addMenuItemDelete(menu, minion.hostname);
  }

  _addRejectedMinion(container, hostname) {
    var element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    var rejected = Route._createDiv("status", "rejected");
    rejected.classList.add("rejected");
    element.appendChild(rejected);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    var menu = new DropDownMenu(element);
    this._addMenuItemDelete(menu, hostname);
    this._addMenuItemAccept(menu, hostname);

    container.appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    var element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    var denied = Route._createDiv("status", "denied");
    denied.classList.add("denied");
    element.appendChild(denied);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    var menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname);
    this._addMenuItemReject(menu, hostname);
    this._addMenuItemDelete(menu, hostname);

    container.appendChild(element);
  }

  _addPreMinion(container, hostname) {
    var element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    var pre = Route._createDiv("status", "unaccepted");
    pre.classList.add("unaccepted");
    element.appendChild(pre);

    // force same columns on all rows
    element.appendChild(Route._createDiv("os", ""));

    var menu = new DropDownMenu(element);
    this._addMenuItemAccept(menu, hostname);
    this._addMenuItemReject(menu, hostname);
    this._addMenuItemDelete(menu, hostname);

    container.appendChild(element);
  }

}

