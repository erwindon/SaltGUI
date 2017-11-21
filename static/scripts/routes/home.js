class HomeRoute extends Route {

  constructor(router) {
    super("^[\/]$", "Home", "#home");
    this.router = router;
    this.minionsLoaded = false;
    this.jobsLoaded = false;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._runHighState = this._runHighState.bind(this);
  }

  onShow() {
    var home = this;
    return new Promise(function(resolve, reject) {
      home.resolvePromise = resolve;
      if(home.minionsLoaded && home.jobsLoaded) resolve();
      home.router.api.getMinions().then(home._updateMinions);
      home.router.api.getJobs().then(home._updateJobs);
    });
  }

  _updateMinions(data) {
    var minions = data.return[0];

    var list = this.getElement().querySelector('.minions');
    list.innerHTML = "";
    var hostnames = Object.keys(minions);

    for(var i = 0; i < hostnames.length; i++) {
      var minion = minions[hostnames[i]];
      minion.hostname = hostnames[i];
      this._addMinion(list, minion);
    }
    this.minionsLoaded = true;
    if(this.minionsLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addMinion(container, minion) {
    var ip = minion.ipv4[minion.ipv4.length - 1];

    var element = document.createElement('li');

    element.appendChild(this._createDiv("hostname", minion.hostname));

    var address = this._createDiv("address", ip);
    address.setAttribute("tabindex", -1);
    element.appendChild(address);
    address.addEventListener('click', this._copyAddress);

    element.appendChild(this._createDiv("os", minion.lsb_distrib_description));
    var highStateButton = this._createDiv("run-highstate", "Sync state &#9658;");

    highStateButton.addEventListener('click', evt => {
      this._runHighState(minion.hostname, evt);
    });

    element.appendChild(highStateButton);
    container.appendChild(element);
  }

  _updateJobs(data) {
    var jobContainer = document.querySelector("#home .jobs");
    jobContainer.innerHTML = "";
    var jobs = this._jobsToArray(data.return[0]);
    this._sortJobs(jobs);

    //Add five most recent jobs
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
    if(this.minionsLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addJob(container, job) {
    var element = document.createElement('li');
    element.id = job.id;

    element.appendChild(this._createDiv("function", job.Function));
    element.appendChild(this._createDiv("target", job.Target));
    element.appendChild(this._createDiv("time",
      elapsedToString(new Date(job.StartTime))));
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
      var startTimeA = new Date(a.StartTime);
      var startTimeB = new Date(b.StartTime);

      if(startTimeA.getTime() < startTimeB.getTime()) return 1;
      if(startTimeA.getTime() > startTimeB.getTime()) return -1;
      return 0;
    });
  }

  _createDiv(className, content) {
    var div = document.createElement('div');
    div.className = className;
    div.innerHTML = content;
    return div;
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
