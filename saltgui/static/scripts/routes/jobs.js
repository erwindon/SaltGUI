class JobsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]jobs$", "Jobs", "#page_jobs", "#button_jobs", router);
    this.jobsLoaded = false;

    this._updateJobs = this._updateJobs.bind(this);
  }

  onShow() {
    const jobs = this;
    return new Promise(function(resolve, reject) {
      jobs.resolvePromise = resolve;
      if(jobs.jobsLoaded) resolve();
      jobs.router.api.getJobs().then(jobs._updateJobs);
      jobs.router.api.getJobsActive().then(jobs._runningJobs);
    });
  }

  _updateJobs(data) {
    const jobContainer = this.getPageElement().querySelector(".jobs");
    const jobs = this._jobsToArray(data.return[0]);
    this._sortJobs(jobs);

    //Add twenty most recent jobs
    let shown = 0;
    let i = 0;
    while(shown < 20 && jobs[i] !== undefined) {
      const job = jobs[i];
      i = i + 1;
      if(job.Function === "grains.append") continue;
      if(job.Function === "grains.delkey") continue;
      if(job.Function === "grains.delval") continue;
      if(job.Function === "grains.items") continue;
      if(job.Function === "grains.setval") continue;
      if(job.Function === "pillar.items") continue;
      if(job.Function === "pillar.obfuscate") continue;
      if(job.Function === "runner.jobs.active") continue;
      if(job.Function === "runner.jobs.list_job") continue;
      if(job.Function === "runner.jobs.list_jobs") continue;
      if(job.Function === "saltutil.find_job") continue;
      if(job.Function === "saltutil.refresh_grains") continue;
      if(job.Function === "saltutil.refresh_pillar") continue;
      if(job.Function === "saltutil.running") continue;
      if(job.Function === "schedule.delete") continue;
      if(job.Function === "schedule.disable") continue;
      if(job.Function === "schedule.disable_job") continue;
      if(job.Function === "schedule.enable") continue;
      if(job.Function === "schedule.enable_job") continue;
      if(job.Function === "schedule.list") continue;
      if(job.Function === "schedule.modify") continue;
      if(job.Function === "schedule.run_job") continue;
      if(job.Function === "sys.doc") continue;
      if(job.Function === "wheel.config.values") continue;
      if(job.Function === "wheel.key.accept") continue;
      if(job.Function === "wheel.key.delete") continue;
      if(job.Function === "wheel.key.list_all") continue;
      if(job.Function === "wheel.key.reject") continue;

      this._addJob(jobContainer, job);
      shown = shown + 1;
    }
    this.jobsLoaded = true;
    if(this.jobsLoaded) this.resolvePromise();
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
      // the field may not (yet) be on the screen
      if(targetField) targetField.innerText = targetText;
    }
  }

  _addJob(container, job) {
    const tr = document.createElement("tr");

    const jidText = job.id;
    tr.appendChild(Route._createTd("JID", jidText));

    const targetText = window.makeTargetText(job["Target-type"], job.Target);
    tr.appendChild(Route._createTd("Target", targetText));

    const functionText = job.Function;
    tr.appendChild(Route._createTd("Function", functionText));

    const startTimeText = job.StartTime;
    tr.appendChild(Route._createTd("Start Time", startTimeText));

    const menu = new DropDownMenu(tr);
    menu.addMenuItem("Show&nbsp;details...", function(evt) {
      window.location.assign("/job?id=" + encodeURIComponent(job.id));
    }.bind(this));

    // fill out the number of columns to that of the header
    while(tr.cells.length < container.tHead.rows[0].cells.length) {
      tr.appendChild(Route._createTd("", ""));
    }

    container.tBodies[0].appendChild(tr);
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

}
