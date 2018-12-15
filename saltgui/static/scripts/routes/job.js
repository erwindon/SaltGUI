class JobRoute extends Route {

  constructor(router) {
    super("^[\/]job$", "Job", "#page_job", "", router);
    this._onJobData = this._onJobData.bind(this);
  }

  onShow() {
    const job = this;
    const id = decodeURIComponent(window.getQueryParam("id"));
    return new Promise(function(resolve, reject) {
      job.resolvePromise = resolve;
      job.router.api.getJob(id).then(job._onJobData);
    });
  }

  _onJobData(data) {
    const job = this;
    const info = data.info[0];
    job.getPageElement().querySelector(".output").innerText = "";

    document.querySelector("#button_close_job").addEventListener("click", _ => {
      this.router.goTo("/");
    });

    const jobinfo = this.getPageElement().querySelector(".job-info");

    const functionText = info.Function + " on " +
      window.makeTargetText(info["Target-type"], info.Target);
    jobinfo.querySelector(".function").innerText = functionText;

    jobinfo.querySelector(".time").innerText = info.StartTime;

    const output = job.getPageElement().querySelector(".output");
    // use same formatter as direct commands
    let minions = ["WHEEL"];
    if(info.Minions) minions = info.Minions;
    Output.addResponseOutput(output, minions, info.Result, info.Function);

    this.resolvePromise();
  }

}
