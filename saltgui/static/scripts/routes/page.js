class PageRoute extends Route {

  constructor(path, name, page_selector, menuitem_selector, router) {
    super(path, name, page_selector, menuitem_selector, router);

    if(PageRoute.hasMenu === undefined) {
      const hamburger_container = document.querySelector("#hamburger_container");
      const menu = new DropDownMenu(hamburger_container);
      menu.addMenuItem("minions", function(evt) {
        window.location.replace("/");
      });
      menu.addMenuItem("keys", function(evt) {
        window.location.replace("/keys");
      });
      menu.addMenuItem("logout", function(evt) {
        const api = new API();
        api.logout().then(window.location.replace("/"));
      });
      PageRoute.hasMenu = true;
    }

    this._runCommand = this._runCommand.bind(this);
    this._updateJobs = this._updateJobs.bind(this);
    this._updateMinion = this._updateMinion.bind(this);
    this._updateMinions = this._updateMinions.bind(this);
  }

  _updateMinions(data) {
    const minions = data.return[0];

    const list = this.getPageElement().querySelector('#minions');
    const hostnames = Object.keys(minions).sort();

    for(const hostname of hostnames) {
      const minion_info = minions[hostname];

      // minions can be offline, then the info will be false
      if (minion_info === false) {
        this._updateOfflineMinion(list, hostname);
      } else {
        this._updateMinion(list, minion_info, hostname);
      }
    }
  }

  _getElement(container, id) {
    let element = document.getElementById(id);

    if(element === null) {
      // minion not found on screen...
      // construct a basic element that can be updated
      element = document.createElement('li');
      element.id = id;
      container.appendChild(element);
      return element;
    }

    if(element.parentElement !== container) {
      // item is not the expected list, move it
      container.appendChild(element);
    }

    // remove existing content
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    return element;
  }

  _updateOfflineMinion(container, hostname) {
    const element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    const offline = Route._createDiv("status", "offline");
    offline.classList.add("offline");
    element.appendChild(offline);
  }

  _updateMinion(container, minion, hostname) {
    const ip = minion.fqdn_ip4;

    const element = this._getElement(container, hostname);

    element.appendChild(Route._createDiv("hostname", hostname));

    const address = Route._createDiv("status", ip);
    address.classList.add("address");
    address.setAttribute("tabindex", -1);
    address.addEventListener('click', this._copyAddress);
    element.appendChild(address);
  }

  _addMinion(container, hostname) {

    let element = document.getElementById(hostname);
    if(element !== null) {
      // minion already on screen...
      return;
    }

    element = document.createElement('li');
    element.id = hostname;

    element.appendChild(Route._createDiv("hostname", hostname));

    const minion = Route._createDiv("status", "accepted");
    minion.classList.add("accepted");
    element.appendChild(minion);

    element.appendChild(Route._createDiv("os", "loading..."));

    container.appendChild(element);
  }

  _addNone(container) {

    const element = document.createElement('li');

    element.appendChild(Route._createDiv("hostname", "none"));

    container.appendChild(element);
  }

  _updateJobs(data) {
    const jobContainer = this.getPageElement().querySelector(".jobs");
    jobContainer.innerHTML = "";
    const jobs = this._jobsToArray(data.return[0]);
    this._sortJobs(jobs);

    //Add seven most recent jobs
    let shown = 0;
    let i = 0;
    while(shown < 7 && jobs[i] !== undefined) {
      const job = jobs[i];
      i = i + 1;
      if(job.Function === "grains.items") continue;
      if(job.Function === "runner.jobs.active") continue;
      if(job.Function === "runner.jobs.list_job") continue;
      if(job.Function === "runner.jobs.list_jobs") continue;
      if(job.Function === "saltutil.find_job") continue;
      if(job.Function === "saltutil.running") continue;
      if(job.Function === "sys.doc") continue;
      if(job.Function === "wheel.key.list_all") continue;

      this._addJob(jobContainer, job);
      shown = shown + 1;
    }
    this.jobsLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _runningJobs(data) {
    const jobs = data.return[0];
    for(const k in jobs)
    {
      const job = jobs[k];

      // start with same text as for _addJob
      let targetText = window.makeTargetText(job["Target-type"], job.Target);

      // then add the operational statistics
      if(job.Running.length > 0)
        targetText = targetText + ", " + job.Running.length + " running";
      if(job.Returned.length > 0)
        targetText = targetText + ", " + job.Returned.length + " returned";

      const targetField = document.querySelector(".jobs #job" + k + " .target");
      targetField.innerText = targetText;
    }
  }

  _addJob(container, job) {
    const element = document.createElement('li');
    element.id = "job" + job.id;

    const targetText = window.makeTargetText(job["Target-type"], job.Target);
    element.appendChild(Route._createDiv("target", targetText));

    const functionText = job.Function;
    element.appendChild(Route._createDiv("function", functionText));

    const startTimeText = job.StartTime;
    element.appendChild(Route._createDiv("time", startTimeText));

    container.appendChild(element);

    element.addEventListener('click', this._createJobListener(job.id));
  }

  _createJobListener(id) {
    const router = this.router;
    return function() {
      router.goTo("/job?id=" + id);
    };
  }

  _jobsToArray(jobs) {
    const keys = Object.keys(jobs);
    const newArray = [];

    for(const key of keys) {
      const job = jobs[key];
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
      return 0;
    });
  }

  _copyAddress(evt) {
    const target = evt.target;
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
  }

  _runCommand(evt, targetString, commandString) {
    this.router.commandbox._showManualRun(evt);
    const target = document.querySelector("#target");
    const command = document.querySelector("#command");
    target.value = targetString;
    command.value = commandString;
    // the menu may become (in)visible due to content of command field
    this.router.commandbox.menu.verifyAll();
  }
}
