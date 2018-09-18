class PageRoute extends Route {

  constructor(path, name, page_selector, menuitem_selector) {
    super(path, name, page_selector, menuitem_selector);

    if(PageRoute.hasMenu == undefined) {
      const header = document.getElementById("header");
      const menu = new DropDownMenu(header);
      menu.addMenuItem("minions", function(evt) {
        window.location.replace("/");
      });
      menu.addMenuItem("keys", function(evt) {
        window.location.replace("/keys");
      });
      menu.addMenuItem("logout", function(evt) {
        const api = new API();
        api._logout(api);
      });
      PageRoute.hasMenu = true;
    }
  }

  _updateMinions(data) {
    const minions = data.return[0];

    const list = this.getPageElement().querySelector('#minions');
    const hostnames = Object.keys(minions).sort();

    for(let i = 0; i < hostnames.length; i++) {
      const minion_info = minions[hostnames[i]];

      // minions can be offline, then the info will be false
      if (minion_info === false) {
        this._updateOfflineMinion(list, hostnames[i]);
      } else {
        const minion = minions[hostnames[i]];
        minion.hostname = hostnames[i];
        this._updateMinion(list, minion);
      }
    }
  }

  _getElement(container, id) {
    let element = document.getElementById(id);

    if(element == null) {
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

  _updateMinion(container, minion) {
    const ip = minion.fqdn_ip4;

    const element = this._getElement(container, minion.hostname);

    element.appendChild(Route._createDiv("hostname", minion.hostname));

    const address = Route._createDiv("status", ip);
    address.classList.add("address");
    address.setAttribute("tabindex", -1);
    address.addEventListener('click', this._copyAddress);
    element.appendChild(address);

    element.appendChild(Route._createDiv("os", minion.os + " " + minion.osrelease));
  }

  _addMinion(container, hostname) {

    let element = document.getElementById(hostname);
    if(element != null) {
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
      if(job.Function === "saltutil.find_job") continue;
      if(job.Function === "grains.items") continue;
      if(job.Function === "wheel.key.list_all") continue;
      if(job.Function === "runner.jobs.list_job") continue;
      if(job.Function === "runner.jobs.list_jobs") continue;
      if(job.Function === "sys.doc") continue;

      this._addJob(jobContainer, job);
      shown = shown + 1;
    }
    this.jobsLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addJob(container, job) {
    const element = document.createElement('li');
    element.id = job.id;

    element.appendChild(Route._createDiv("target", job.Target));
    element.appendChild(Route._createDiv("function", job.Function));
    element.appendChild(Route._createDiv("time", job.StartTime));
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

    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
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
    this.router.api._showManualRun(evt);
    const target = document.querySelector("#target");
    const command = document.querySelector("#command");
    target.value = targetString;
    command.value = commandString;
    // the menu may become (in)visible due to content of command field
    this.router.api.menu.verifyAll();
  }

  _runHighState(evt, hostname) {
    this._runCommand(evt, hostname, "state.apply");
  }

  _runAcceptKey(evt, hostname, extra) {
    this._runCommand(evt, hostname, "wheel.key.accept" + extra);
  }

  _runRejectKey(evt, hostname, extra) {
    this._runCommand(evt, hostname, "wheel.key.reject" + extra);
  }

  _runDeleteKey(evt, hostname, extra) {
    this._runCommand(evt, hostname, "wheel.key.delete" + extra);
  }
}
