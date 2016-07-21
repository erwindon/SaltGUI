class JobRoute extends Route {

  constructor(router) {
    super("^[\/]job$", "Job", "#job");
    this.router = router;

    this._onJobData = this._onJobData.bind(this);
  }

  onShow() {
    var job = this;
    return new Promise(function(resolve, reject) {
      job.resolvePromise = resolve;
      job.router.api.getJob(window.getQueryParam("id"))
      .then(job._onJobData);
    });
    return promise;
  }

  _onJobData(data) {
    var job = this;
    var info = data.info[0];
    job.getElement().querySelector(".hosts").innerHTML = "";

    var container = this.getElement().querySelector(".job-info");
    container.querySelector('.function').innerHTML = info.Function;
    container.querySelector('.time').innerHTML =
      elapsedToString(new Date(info.StartTime));

    var hostnames = Object.keys(info.Result);
    hostnames.forEach(function(hostname) {
      var result = info.Result[hostname].return;
      job._addHost(job.getElement().querySelector(".hosts"), hostname, result);
    });
    this.resolvePromise();
  }

  _addHost(container, hostname, result) {
    var host = createElement("div", "host", `<h1>${hostname}</h1>`);
    host.addEventListener('click', this._onHostClick);

    if(typeof result === "string") {
      var task = createElement("div", "task", "");
      task.appendChild(createElement("div", "name", result));
      host.appendChild(task);
      container.appendChild(host);
      return;
    }

    var hasFailedOnce = false;

    Object.keys(result).forEach(function(taskKey) {
      var data = result[taskKey];
      var task = createElement("div", "task", "");
      task.classList.add(data.result !== false ? "success" : "failure");
      if(data.result === false) hasFailedOnce = true;

      task.appendChild(createElement("div", "name", data.name));
      task.appendChild(createElement("div", "comment", data.comment));
      task.appendChild(createElement("div", "duration",
        `Took ${Math.round(data.duration)} seconds.`));
      host.appendChild(task);
    });

    host.style.color = hasFailedOnce ? "red" : "green";
    container.appendChild(host);
  }

  _onHostClick(evt) {
    this.childNodes.forEach(function(child) {
      if(child.nodeName === "H1") return;
      child.style.display = child.style.display !== "none" ? "none" : "block";
    });
  }

}
