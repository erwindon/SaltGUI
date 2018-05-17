class HomeRoute extends Route {

  constructor(router) {
    super("^[\/]$", "Home", "#home");
    this.router = router;
    this.minionsLoaded = false;
    this.keysLoaded = false;
    this.jobsLoaded = false;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateKeys = this._updateKeys.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._runHighState = this._runHighState.bind(this);
  }

  onShow() {
    var home = this;
    return new Promise(function(resolve, reject) {
      home.resolvePromise = resolve;
      if(home.minionsLoaded && home.keysLoaded && home.jobsLoaded) resolve();
      home.router.api.getMinions().then(home._updateMinions);
      home.router.api.getKeys().then(home._updateKeys);
      home.router.api.getJobs().then(home._updateJobs);
    });
  }

  _updateMinions(data) {
    var minions = data.return[0];

    var list = this.getElement().querySelector('#minions');
    list.innerHTML = "";
    var hostnames = Object.keys(minions).sort();

    for(var i = 0; i < hostnames.length; i++) {
      var minion_info = minions[hostnames[i]];

      // minions can be offline, then the info will be false
      if (minion_info === false) {
        this._addOfflineMinion(list, hostnames[i]);
      } else {
        var minion = minions[hostnames[i]];
        minion.hostname = hostnames[i];
        this._addMinion(list, minion);
      }
    }
    this.minionsLoaded = true;
    if(this.minionsLoaded && this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _updateKeys(data) {
    var keys = data.return;

    var list = this.getElement().querySelector('#keys');
    list.innerHTML = "";

    // never mind the keys.minions list
    // it should be the same as the minions list
    // which we already have

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
    if(this.minionsLoaded && this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addOfflineMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var offline = this._createDiv("offline", "offline");

    element.appendChild(offline);
    container.appendChild(element);
  }

  _addMinion(container, minion) {
    var ip = minion.ipv4[minion.ipv4.length - 1];

    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", minion.hostname));

    var address = this._createDiv("address", ip);
    address.setAttribute("tabindex", -1);
    element.appendChild(address);
    address.addEventListener('click', this._copyAddress);

    element.appendChild(this._createDiv("os", minion.os + " " + minion.osrelease));
    var highStateButton = this._createDiv("run-highstate", "Sync state &#9658;");

    highStateButton.addEventListener('click', evt => {
      this._runHighState(minion.hostname, evt);
    });

    element.appendChild(highStateButton);
    container.appendChild(element);
  }

  _addRejectedMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var rejected = this._createDiv("denied", "denied");

    element.appendChild(rejected);
    container.appendChild(element);
  }

  _addDeniedMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var denied = this._createDiv("rejected", "rejected");

    element.appendChild(denied);
    container.appendChild(element);
  }

  _addPreMinion(container, hostname) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", hostname));

    var pre = this._createDiv("unaccepted", "unaccepted");

    element.appendChild(pre);
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

      this._addJob(jobContainer, job);
      shown = shown + 1;
    }
    this.jobsLoaded = true;
    if(this.minionsLoaded && this.keysLoaded && this.jobsLoaded) this.resolvePromise();
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

  _runHighState(hostname, evt) {
    this.router.api._toggleManualRun(evt);
    var target = document.querySelector("#target");
    var command = document.querySelector("#command");
    target.value = hostname;
    command.value = "state.apply";
  }
}
