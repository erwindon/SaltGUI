class JobRoute extends Route {

  constructor(router) {
    super("^[\/]job$", "Job", "#page_job", "");
    this.router = router;

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
    job.getPageElement().querySelector(".hosts").innerHTML = "";

    document.querySelector('#button_close_job').addEventListener('click', _ => {
      this.router.goTo("/");
    });

    const container = this.getPageElement().querySelector(".job-info");
    container.querySelector('.function').innerHTML = info.Function;
    container.querySelector('.time').innerHTML = info.StartTime;

    const hostnames = Object.keys(info.Result);
    hostnames.forEach(function(hostname) {
      
      // when you do a state.apply for example you get a json response.
      // let's format it nicely here
      let result = info.Result[hostname].return;
      if (typeof result === "object") {
        result = JSON.stringify(result, null, 2);
      } else {
        result = window.escape(result);
      }
      job._addHost(job.getPageElement().querySelector(".hosts"), hostname, result);
    });
    this.resolvePromise();
  }

  _addHost(container, hostname, result) {
    const host = createElement("div", "host", `<h1>${hostname}</h1>`);
    host.addEventListener('click', this._onHostClick);

    if(typeof result === "string") {
      const task = createElement("div", "task", "");
      task.appendChild(createElement("div", "name", result));
      host.appendChild(task);
      container.appendChild(host);
      return;
    }

    let hasFailedOnce = false;

    Object.keys(result).forEach(function(taskKey) {
      const data = result[taskKey];
      const task = createElement("div", "task", "");
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
