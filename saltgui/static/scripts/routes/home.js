class HomeRoute extends Route {

  constructor(router) {
    super("^[\/]$", "Home", "#home");
    this.router = router;
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateKeys = this._updateKeys.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._runHighState = this._runHighState.bind(this);
    this._runAcceptKey = this._runAcceptKey.bind(this);
    this._runRejectKey = this._runRejectKey.bind(this);
    this._runDeleteKey = this._runDeleteKey.bind(this);
    this._runCommand = this._runCommand.bind(this);
  }

  onShow() {
    var home = this;
    return new Promise(function(resolve, reject) {
      home.resolvePromise = resolve;
      if(home.keysLoaded && home.jobsLoaded) resolve();
      home.router.api.getMinions().then(home._updateMinions);
      home.router.api.getKeys().then(home._updateKeys);
      home.router.api.getJobs().then(home._updateJobs);
    });
  }

  _updateMinions(data) {
    var minions = data.return[0];

    var list = this.getElement().querySelector('#minions');
    var hostnames = Object.keys(minions).sort();

    for(var i = 0; i < hostnames.length; i++) {
      var minion_info = minions[hostnames[i]];

      // minions can be offline, then the info will be false
      if (minion_info === false) {
        this._updateOfflineMinion(list, hostnames[i]);
      } else {
        var minion = minions[hostnames[i]];
        minion.hostname = hostnames[i];
        this._updateMinion(list, minion);
      }
    }
  }

  _updateKeys(data) {
    var keys = data.return;

    var list = this.getElement().querySelector('#minions');

    var hostnames = keys.minions.sort();
    for(var i = 0; i < hostnames.length; i++) {
        this._addMinion(list, hostnames[i]);
    }

    var list = this.getElement().querySelector('#keys');
    list.innerHTML = "";

    // never mind the keys.minions list
    // it should be the same as the minions list
    // which we already have

    var keyshdr = this.getElement().querySelector('#keyshdr');
    if(keys.minions_denied.length || keys.minions_pre.length || keys.minions_rejected.length) {
      keyshdr.style.display = "block";
    } else {
      keyshdr.style.display = "none";
    }

    var hostnames = keys.minions_denied.sort();
    for(var i = 0; i < hostnames.length; i++) {
        this._addDeniedMinion(list, hostnames[i]);
    }

    var hostnames = keys.minions_pre.sort();
    for(var i = 0; i < hostnames.length; i++) {
        this._addPreMinion(list, hostnames[i]);
    }

    var hostnames = keys.minions_rejected.sort();
    for(var i = 0; i < hostnames.length; i++) {
        this._addRejectedMinion(list, hostnames[i]);
    }

    this.keysLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addMenu(element) {
    var menuDropdown = this._createDiv("run-command-button", "");
    var menuButton = this._createDiv("menu-dropdown", "&#9658;");
    menuDropdown.appendChild(menuButton);
    var menuDropdownContent = this._createDiv("menu-dropdown-content", "");
    menuDropdown.appendChild(menuDropdownContent);
    element.appendChild(menuDropdown);
    return menuDropdownContent;
  }

  _addMenuItemAccept(hostname) {
    var acceptButton = this._createDiv("run-command-button", "Accept&nbsp;key");
    acceptButton.addEventListener('click', evt => {
      this._runAcceptKey(hostname, evt);
    });
    return acceptButton;
  }

  _addMenuItemDelete(hostname) {
    var deleteButton = this._createDiv("run-command-button", "Delete&nbsp;key");
    deleteButton.addEventListener('click', evt => {
      this._runDeleteKey(hostname, evt);
    });
    return deleteButton;
  }

  _addMenuItemReject(hostname) {
    var rejectButton = this._createDiv("run-command-button", "Reject&nbsp;key");
    rejectButton.addEventListener('click', evt => {
      this._runRejectKey(hostname, evt);
    });
    return rejectButton;
  }

  _addMenuItemSyncState(hostname) {
    var highStateButton = this._createDiv("run-command-button", "Sync&nbsp;state");
    highStateButton.addEventListener('click', evt => {
      this._runHighState(hostname, evt);
    });
    return highStateButton;
  }

  _updateOfflineMinion(container, hostname) {
    var element = document.getElementById(hostname);
    if(element == null) {
      console.log("offline minion not found on screen:", hostname);
      // construct a basic element that can be updated here
      element = document.createElement('li');
      element.id = hostname;
      container.appendChild(element);
    }
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    element.appendChild(this._createDiv("hostname", hostname));

    var offline = this._createDiv("offline", "offline");
    offline.id = "status";
    element.appendChild(offline);

    var menu = this._addMenu(element);
    menu.appendChild(this._addMenuItemReject(hostname));
    menu.appendChild(this._addMenuItemDelete(hostname));
  }

  _updateMinion(container, minion) {
    var ip = minion.fqdn_ip4;

    var element = document.getElementById(minion.hostname);
    if(element == null) {
      console.log("online minion not found on screen:", minion.hostname);
      // construct a basic element that can be updated here
      element = document.createElement('li');
      element.id = minion.hostname;
      container.appendChild(element);
    }
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    element.appendChild(this._createDiv("hostname", minion.hostname));

    var address = this._createDiv("address", ip);
    address.setAttribute("tabindex", -1);
    address.addEventListener('click', this._copyAddress);
    element.appendChild(address);

    element.appendChild(this._createDiv("os", minion.os + " " + minion.osrelease));

    var menu = this._addMenu(element);
    menu.appendChild(this._addMenuItemSyncState(minion.hostname));
    menu.appendChild(this._addMenuItemReject(minion.hostname));
    menu.appendChild(this._addMenuItemDelete(minion.hostname));
  }

  _addMinion(container, hostname) {

    var element = document.getElementById(hostname);
    if(element != null) {
      console.log("minion already on screen:", hostname);
      return;
    }

    var element = document.createElement('li');
    element.id = hostname;

    element.appendChild(this._createDiv("hostname", hostname));

    var minion = this._createDiv("accepted", "accepted");
    minion.id = "status";
    element.appendChild(minion);

    element.appendChild(this._createDiv("os", "Loading..."));

    var menu = this._addMenu(element);
    menu.appendChild(this._addMenuItemReject(hostname));
    menu.appendChild(this._addMenuItemDelete(hostname));

    container.appendChild(element);
  }

  _addRejectedMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var rejected = this._createDiv("rejected", "rejected");
    rejected.id = "status";
    element.appendChild(rejected);

    var menu = this._addMenu(element);
    menu.appendChild(this._addMenuItemDelete(hostname));
    menu.appendChild(this._addMenuItemAccept(hostname));

    container.appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var denied = this._createDiv("denied", "denied");
    denied.id = "status";
    element.appendChild(denied);

    var menu = this._addMenu(element);
    menu.appendChild(this._addMenuItemAccept(hostname));
    menu.appendChild(this._addMenuItemReject(hostname));
    menu.appendChild(this._addMenuItemDelete(hostname));

    container.appendChild(element);
  }

  _addPreMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var pre = this._createDiv("unaccepted", "unaccepted");
    pre.id = "status";
    element.appendChild(pre);

    var menu = this._addMenu(element);
    menu.appendChild(this._addMenuItemAccept(hostname));
    menu.appendChild(this._addMenuItemReject(hostname));
    menu.appendChild(this._addMenuItemDelete(hostname));

    container.appendChild(element);
  }

  _updateJobs(data) {
    var jobContainer = document.querySelector("#home .jobs");
    jobContainer.innerHTML = "";
    var jobs = this._jobsToArray(data.return[0]);
    this._sortJobs(jobs);

    //Add seven most recent jobs
    var shown = 0;
    var i = 0;
    while(shown < 7 && jobs[i] !== undefined) {
      var job = jobs[i];
      i = i + 1;
      if(job.Function === "saltutil.find_job") continue;
      if(job.Function === "grains.items") continue;
      if(job.Function === "wheel.key.list_all") continue;
      if(job.Function === "runner.jobs.list_jobs") continue;

      this._addJob(jobContainer, job);
      shown = shown + 1;
    }
    this.jobsLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addJob(container, job) {
    var element = document.createElement('li');
    element.id = job.id;

    element.appendChild(this._createDiv("function", job.Function));
    element.appendChild(this._createDiv("target", job.Target));
    element.appendChild(this._createDiv("time", job.StartTime));
    container.appendChild(element);
    element.addEventListener('click', this._createJobListener(job.id));
  }

  _createJobListener(id) {
    var router = this.router;
    return function() {
      router.goTo("/job?id=" + id);
    };
  }

  _jobsToArray(jobs) {
    var keys = Object.keys(jobs);
    var newArray = [];

    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var job = jobs[key];
      job.id = key;
      newArray.push(job);
    }

    return newArray;
  }

  _sortJobs(jobs) {
    jobs.sort(function(a, b){
      // The id is already a integer value based on the date, let's use
      // it to sort the jobs
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0
    });
  }

  _copyAddress(evt) {
    var target = evt.target;
    var selection = window.getSelection();
    var range = document.createRange();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
  }

  _runCommand(evt, targetString, commandString) {
    this.router.api._toggleManualRun(evt);
    var target = document.querySelector("#target");
    var command = document.querySelector("#command");
    target.value = targetString;
    command.value = commandString;
  }

  _runHighState(hostname, evt) {
    this._runCommand(evt, hostname, "state.apply");
  }

  _runAcceptKey(hostname, evt) {
    this._runCommand(evt, hostname, "salt.wheel.key.accept");
  }

  _runRejectKey(hostname, evt) {
    this._runCommand(evt, hostname, "salt.wheel.key.reject");
  }

  _runDeleteKey(hostname, evt) {
    this._runCommand(evt, hostname, "salt.wheel.key.delete");
  }
}
