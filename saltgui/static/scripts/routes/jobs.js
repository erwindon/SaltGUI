class JobsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]jobs$", "Jobs", "#page_jobs", "#button_jobs", router);
    this.jobsLoaded = false;
  }

  onShow() {
    const jobs = this;
    return new Promise(function(resolve, reject) {
      jobs.resolvePromise = resolve;
      if(jobs.jobsLoaded) resolve();
      jobs.router.api.getRunnerJobsListJobs().then(data => {
        jobs._updateJobs(data, 50, true);
      });
      jobs.router.api.getRunnerJobsActive().then(data => {
        jobs._runningJobs(data, true);
      });
    });
  }

}
