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

  _addJob(container, job) {
    const tr = document.createElement("tr");

    const jidText = job.id;
    tr.appendChild(Route._createTd("jid", jidText));

    const targetText = window.makeTargetText(job["Target-type"], job.Target);
    tr.appendChild(Route._createTd("target", targetText));

    const functionText = job.Function;
    tr.appendChild(Route._createTd("function", functionText));

    const startTimeText = job.StartTime;
    tr.appendChild(Route._createTd("starttime", startTimeText));

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

}
