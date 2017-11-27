class API {

  constructor() {
    this.APIURL = "";

    this._callMethod = this._callMethod.bind(this);
    this._fetch = this._fetch.bind(this);
    this._onRun = this._onRun.bind(this);
    this._onRunReturn = this._onRunReturn.bind(this);
    this._registerEventListeners();
  }

  _registerEventListeners() {
    document.querySelector("#run-command-popup")
      .addEventListener('click', this._toggleManualRun);
    document.querySelector(".fab")
      .addEventListener('click', this._toggleManualRun);
    document.querySelector(".run-command input[type='submit']")
      .addEventListener('click', this._onRun);
  }

  _onRun() {
    var button = document.querySelector(".run-command input[type='submit']");
    var output = document.querySelector(".run-command pre");
    if(button.disabled) return;

    var target = document.querySelector(".run-command #target").value;
    var command = document.querySelector(".run-command #command").value;
    if(target === "" || command === "") return;

    button.disabled = true;
    output.innerHTML = "Loading...";

    this.runFunction(target, command)
    .then(this._onRunReturn, this._onRunReturn);
  }

  _onRunReturn(data) {
    var response = data.return[0];
    var hostnames = Object.keys(response);

    var outputContainer = document.querySelector(".run-command pre");
    outputContainer.innerHTML = "";

    for(var i = 0; i < hostnames.length; i++) {
      var hostname = hostnames[i];

      var output = response[hostname];

      // when you do a salt.apply for example you get a json response.
      // let's format it nicely here
      if (typeof output === 'object') {
        output = JSON.stringify(output, null, 2);
      }

      outputContainer.innerHTML +=
        `<div class='hostname'>${hostname}</div>: ${output}<br>`;
    }

    var button = document.querySelector(".run-command input[type='submit']");
    button.disabled = false;
  }

  _toggleManualRun(evt) {
    var manualRun = document.querySelector("#run-command-popup");
    var isShowing = manualRun.style.display !== "none"
      && manualRun.style.display !== "";

    //Don't close if they click inside the window
    if(isShowing && evt.target.className !== "popup") return;
    manualRun.style.display = isShowing ? "none" : "block";
    document.body.style["overflow-y"] = isShowing ? "scroll" : "hidden";
  }

  isAuthenticated() {
    return window.sessionStorage.getItem("token") !== null;
  }

  login(username, password) {
    var api = this;

    var params = {
      username: username,
      password: password,
      eauth: "pam"
    };

    return new Promise(function(resolve, reject) {
      api._callMethod("POST", "/login", params)
      .then(function(data) {
        window.sessionStorage.setItem("token", data.return[0].token);
        resolve();
      }, reject);
    });
  }

  getMinions() {
    return this._callMethod("GET", "/minions", {});
  }

  getJobs() {
    return this._callMethod("GET", "/jobs", {});
  }

  getJob(id) {
    return this._callMethod("GET", "/jobs/" + id, {});
  }

  runFunction(target, toRun) {
    var args = toRun.split(" ");
    var functionToRun = args[0];
    args.shift();

    var params = {
      tgt: target,
      fun: functionToRun,
      client: "local"
    };

    if(args.length !== 0) params.arg = args.join(" ");

    return this._callMethod("POST", "/", params);
  }

  _callMethod(method, route, params) {
    var location = this.APIURL + route;
    var token = window.sessionStorage.getItem("token");

    var headers = {
      "Accept": "application/json",
      "X-Auth-Token": token !== null ? token : ""
    };

    return this._fetch(method, location, headers, params);
  }

  _fetch(method, url, headers, params) {
    var onFetchResponse = this._onFetchResponse;
    return new Promise(function(resolve, reject) {

      var options = {
        method: method,
        url: url,
        headers: headers
      };

      if(method === "POST") options.body = JSON.stringify(params);

      fetch(url, options).then(
        (response) => onFetchResponse(response, resolve, reject),
        reject
      );
    });
  }

  _onFetchResponse(response, resolve, reject) {
    if(response.status !== 200) {
      reject();
      return;
    }

    response.json()
    .then(resolve, reject);
  }

}
