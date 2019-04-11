import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';

export class JobsRoute extends PageRoute {

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
        jobs._handleRunnerJobsListJobs(data, 50);
      });
      jobs.router.api.getRunnerJobsActive().then(data => {
        jobs._showRunnerJobsActive(data);
      });
    });
  }

}
