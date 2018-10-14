class JobRoute extends Route {

  constructor(router) {
    super("^[\/]job$", "Job", "#page_job", "", router);
    this._onJobData = this._onJobData.bind(this);
  }

  onShow() {
    const job = this;
    return new Promise(function(resolve, reject) {
      job.resolvePromise = resolve;
      job.router.api.getJob(window.getQueryParam("id"))
        .then(job._onJobData);
    });
  }

  _onJobData(data) {
    const job = this;
    const info = data.info[0];
    job.getPageElement().querySelector(".output").innerHTML = "";

    document.querySelector('#button_close_job').addEventListener('click', _ => {
      this.router.goTo("/");
    });

    const jobinfo = this.getPageElement().querySelector(".job-info");

    const functionText = info.Function + " on " +
      window.makeTargetText(info["Target-type"], info.Target);
    jobinfo.querySelector('.function').innerText = functionText;

    jobinfo.querySelector('.time').innerText = info.StartTime;

    const hostnames = Object.keys(info.Result).sort();
    const output = job.getPageElement().querySelector(".output");
    hostnames.forEach(function(hostname) {
      // use same formatter as direct commands
      const result = info.Result[hostname].return;
      Output.addOutput(output, result, info.Function);
    });
    this.resolvePromise();
  }

}
