class HomeRoute extends Route {

  constructor(router) {
    super("^[\/]$", "Home", "#home");
    this.router = router;

    this._updateMinions = this._updateMinions.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._onRun = this._onRun.bind(this);
    this._onRunReturn = this._onRunReturn.bind(this);
    this.registerEventListeners();
  }

  registerEventListeners() {
    document.querySelector(".run-command input[type='submit']")
      .addEventListener('click', this._onRun);
    document.querySelector("#run-command-popup")
      .addEventListener('click', this._toggleManualRun);
    document.querySelector("#home .fab")
      .addEventListener('click', this._toggleManualRun);
  }

  _toggleManualRun(evt) {
    var manualRun = document.querySelector("#run-command-popup");
    var isShowing = manualRun.style.display !== "none"
      && manualRun.style.display !== "";

    //Don't close if they click inside the window
    if(isShowing && evt.target.className !== "popup") return;
    manualRun.style.display = isShowing ? "none" : "block";
  }

  _onRun() {
    var button = document.querySelector(".run-command input[type='submit']");
    var output = document.querySelector(".run-command pre");
    if(button.disabled) return;

    var target = document.querySelector(".run-command #target").value;
    var command = document.querySelector(".run-command #command").value;
    if(target === "" || command === "") return;

    button.disabled = true;
    output.innerHTML = "Loading...";

    this.router.api.runFunction(target, command)
    .then(this._onRunReturn, this._onRunReturn);
  }

  _onRunReturn(data) {
    var response = data.return[0];
    var hostnames = Object.keys(response);

    var outputContainer = document.querySelector(".run-command pre");
    outputContainer.innerHTML = "";

    for(var i = 0; i < hostnames.length; i++) {
      var hostname = hostnames[i];
      var output = response[hostname];
      outputContainer.innerHTML +=
        `<div class='hostname'>${hostname}</div>: ${output}<br>`;
    }

    var button = document.querySelector(".run-command input[type='submit']");
    button.disabled = false;
  }

  onShow() {
    this.router.api.getMinions().then(this._updateMinions);
    this.router.api.getJobs().then(this._updateJobs);
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
    element.appendChild(this._createDiv("run-highstate", "Sync state &#9658;"));
    container.appendChild(element);
  }

  _updateJobs(data) {
    var jobContainer = document.querySelector("#home .jobs");
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
  }

  _addJob(container, job) {
    var element = document.createElement('li');

    element.appendChild(this._createDiv("function", job.Function));
    element.appendChild(this._createDiv("target", job.Target));
    element.appendChild(this._createDiv("time",
      this._elapsedString(new Date(job.StartTime))));
    container.appendChild(element);
  }

  _elapsedString(date) {
    var secondsPassed = (new Date().getTime() / 1000) - (date.getTime() / 1000);
    if(secondsPassed < 20) return "A few moments ago";
    if(secondsPassed < 120) return "A few minutes ago";

    if(secondsPassed < 60 * 60) {
      var minutes = Math.round(secondsPassed / 60);
      return minutes + " minutes ago";
    }

    if(secondsPassed < 60 * 60 * 24) {
      var hours = Math.round(secondsPassed / 60 / 60);
      return hours + " hours ago";
    }

    if(secondsPassed < 60 * 60 * 24 * 2) {
      return "Yesterday";
    }

    if(secondsPassed < 60 * 60 * 24 * 30) {
      var days = Math.round(secondsPassed / 60 / 60 / 24);
      return days + " days ago";
    }

    return "A long time ago, in a galaxy far, far away";
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

}
