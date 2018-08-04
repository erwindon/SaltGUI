class API {

  constructor() {
    this.APIURL = "";

    this._callMethod = this._callMethod.bind(this);
    this._fetch = this._fetch.bind(this);
    this._getRunParams = this._getRunParams.bind(this);
    this._onRun = this._onRun.bind(this);
    this._onRunReturn = this._onRunReturn.bind(this);
    this._setRunTypeAsync = this._setRunTypeAsync.bind(this);
    this._setRunTypeBatchSize1 = this._setRunTypeBatchSize1.bind(this);
    this._setRunTypeBatchSize2 = this._setRunTypeBatchSize2.bind(this);
    this._setRunTypeBatchSize3 = this._setRunTypeBatchSize3.bind(this);
    this._setRunTypeBatchSize5 = this._setRunTypeBatchSize5.bind(this);
    this._setRunTypeBatchSize10 = this._setRunTypeBatchSize10.bind(this);
    this._setRunTypeBatchSize10p = this._setRunTypeBatchSize10p.bind(this);
    this._setRunTypeBatchSize25p = this._setRunTypeBatchSize25p.bind(this);
    this._setRunTypeBatch = this._setRunTypeBatch.bind(this);
    this._setRunTypeBatchWaitNone = this._setRunTypeBatchWaitNone.bind(this);
    this._setRunTypeBatchWait1 = this._setRunTypeBatchWait1.bind(this);
    this._setRunTypeBatchWait2 = this._setRunTypeBatchWait2.bind(this);
    this._setRunTypeBatchWait3 = this._setRunTypeBatchWait3.bind(this);
    this._setRunTypeBatchWait5 = this._setRunTypeBatchWait5.bind(this);
    this._setRunTypeBatchWait10 = this._setRunTypeBatchWait10.bind(this);
    this._setRunTypeBatchWait30 = this._setRunTypeBatchWait30.bind(this);
    this._setRunTypeBatchWait60 = this._setRunTypeBatchWait60.bind(this);
    this._setRunTypeNormal = this._setRunTypeNormal.bind(this);

    this._registerEventListeners();
  }

  _registerEventListeners() {
    document.querySelector("#popup_runcommand")
      .addEventListener('click', this._toggleManualRun);
    document.querySelector("#button_manualrun")
      .addEventListener('click', this._toggleManualRun);
    document.querySelector("#button_close_cmd")
      .addEventListener('click', this._toggleManualRun);
    document.querySelector("#button_logout")
      .addEventListener('click', _ => {
        this._logout(this);
    } );
    document.querySelector("#button_minions")
      .addEventListener('click', _ => {
        window.location.replace("/");
    } );
    document.querySelector("#button_keys")
      .addEventListener('click', _ => {
        window.location.replace("/keys");
    } );

    var runblock = document.getElementById("runblock");
    this.menuRunType = new DropDownMenu(runblock);
    this.menuRunType.addMenuItem("Normal", this._setRunTypeNormal);
    this.menuRunType.addMenuItem("Async", this._setRunTypeAsync);
    this.menuRunType.addMenuItem("Batch", this._setRunTypeBatch);

    this.menuBatchSize = new DropDownMenu(runblock);
    this.menuBatchSize.setTitle("Batch&nbsp;Size");
    this.menuBatchSize.addMenuItem("10%", this._setRunTypeBatchSize10p);
    this.menuBatchSize.addMenuItem("25%", this._setRunTypeBatchSize25p);
    this.menuBatchSize.addMenuItem("1", this._setRunTypeBatchSize1);
    this.menuBatchSize.addMenuItem("2", this._setRunTypeBatchSize2);
    this.menuBatchSize.addMenuItem("3", this._setRunTypeBatchSize3);
    this.menuBatchSize.addMenuItem("5", this._setRunTypeBatchSize5);
    this.menuBatchSize.addMenuItem("10", this._setRunTypeBatchSize10);
    this.menuBatchSize.hideMenu();

    this.menuBatchWait = new DropDownMenu(runblock);
    this.menuBatchWait.setTitle("Batch&nbsp;Wait");
    this.menuBatchWait.addMenuItem("None", this._setRunTypeBatchWaitNone);
    this.menuBatchWait.addMenuItem("1 second", this._setRunTypeBatchWait1);
    this.menuBatchWait.addMenuItem("2 seconds", this._setRunTypeBatchWait2);
    this.menuBatchWait.addMenuItem("3 seconds", this._setRunTypeBatchWait3);
    this.menuBatchWait.addMenuItem("5 seconds", this._setRunTypeBatchWait5);
    this.menuBatchWait.addMenuItem("10 seconds", this._setRunTypeBatchWait10);
    this.menuBatchWait.addMenuItem("30 seconds", this._setRunTypeBatchWait30);
    this.menuBatchWait.addMenuItem("60 seconds", this._setRunTypeBatchWait60);
    this.menuBatchWait.hideMenu();

    var jobRunType = Route._createDiv("jobRunType", "normal");
    jobRunType.style.display = "none";
    runblock.appendChild(jobRunType);

    var batchSize = Route._createDiv("batchSize", "");
    batchSize.style.display = "none";
    runblock.appendChild(batchSize);

    var batchWait = Route._createDiv("batchWait", "");
    batchWait.style.display = "none";
    runblock.appendChild(batchWait);

    document.querySelector(".run-command input[type='submit']")
      .addEventListener('click', this._onRun);
  }

  _updateRunTypeText() {
    var jobRunType = document.querySelector(".jobRunType").innerText;
    var batchWait = document.querySelector(".batchWait").innerText;
    var batchSize = document.querySelector(".batchSize").innerText;

    // now that the menu is used show the menu title
    // this is much clearer when the Size/Wait menus are also shown

    switch(jobRunType) {
    case "normal":
      this.menuRunType.setTitle("Normal");
      this.menuBatchSize.hideMenu();
      this.menuBatchWait.hideMenu();
      break;
    case "async":
      this.menuRunType.setTitle("Async");
      this.menuBatchSize.hideMenu();
      this.menuBatchWait.hideMenu();
      break;
    case "batch":
      this.menuRunType.setTitle("Batch");
      this.menuBatchSize.showMenu();
      this.menuBatchWait.showMenu();

      if(batchSize === "") {
        this.menuBatchSize.setTitle("Size 10%");
      } else if(batchSize.endsWith("%")) {
        this.menuBatchSize.setTitle("Size " + batchSize);
      } else if(batchSize === "1") {
        this.menuBatchSize.setTitle("Size " + batchSize + " job");
      } else {
        this.menuBatchSize.setTitle("Size " + batchSize + " jobs");
      }

      if(batchWait === "") {
        this.menuBatchWait.setTitle("No wait");
      } else if(batchWait == "0") {
        this.menuBatchWait.setTitle("No wait");
      } else if(batchWait == "1") {
        this.menuBatchWait.setTitle("Wait " + batchWait + " second");
      } else {
        this.menuBatchWait.setTitle("Wait " + batchWait + " seconds");
      }

      break;
    }
  }

  _setRunTypeBatchWaitNone() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "0";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait1() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "1";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait2() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "2";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait3() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "3";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait5() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "5";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait10() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "10";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait30() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "30";
    this._updateRunTypeText();
  }

  _setRunTypeBatchWait60() {
    var batchWait = document.querySelector(".batchWait");
    batchWait.innerText = "60";
    this._updateRunTypeText();
  }

  _setRunTypeNormal() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "normal";
    this._updateRunTypeText();
  }

  _setRunTypeAsync() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "async";
    this._updateRunTypeText();
  }

  _setRunTypeBatch() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize1() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "1";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize2() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "2";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize3() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "3";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize5() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "5";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize10() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "10";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize10p() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "10%";
    this._updateRunTypeText();
  }

  _setRunTypeBatchSize25p() {
    var jobRunType = document.querySelector(".jobRunType");
    jobRunType.innerText = "batch";
    var batchSize = document.querySelector(".batchSize");
    batchSize.innerText = "25%";
    this._updateRunTypeText();
  }

  _onRun() {
    var button = document.querySelector(".run-command input[type='submit']");
    var output = document.querySelector(".run-command pre");
    if(button.disabled) return;

    var target = document.querySelector(".run-command #target").value;
    var command = document.querySelector(".run-command #command").value;

    var func = this._getRunParams(target, command);
    if(func == null) return;

    button.disabled = true;
    output.innerHTML = "Loading...";

    func.then(this._onRunReturn, this._onRunReturn);
  }

  _onRunReturn(data) {
    var outputContainer = document.querySelector(".run-command pre");
    outputContainer.innerHTML = "";

    // collate all output, so that it can be presented in alphabetic order
    var response = { };
    for(var r of data.return)
      for(var h in r)
        response[h] = r[h];

    var hostnames = Object.keys(response).sort();
    for(var i = 0; i < hostnames.length; i++) {
      var hostname = hostnames[i];

      var output = response[hostname];

      // when you do a state.apply for example you get a json response.
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
    var manualRun = document.querySelector("#popup_runcommand");
    var isShowing = manualRun.style.display !== "none" && manualRun.style.display !== "";

    //Don't close if they click inside the window
    if(isShowing && evt.target.className !== "popup" && evt.target.className !== "nearlyvisiblebutton") return;
    manualRun.style.display = isShowing ? "none" : "block";
    document.body.style["overflow-y"] = isShowing ? "scroll" : "hidden";

    // test whether the command may have caused an update to the list
    // the user may have altered the text after running the command, just ignore that
    var command = document.querySelector(".run-command #command").value;
    var output = document.querySelector(".run-command pre").innerHTML;
    if(isShowing && command.startsWith("wheel.key.") && output != "Waiting for command...") {
      location.reload();
    }
    evt.stopPropagation();
  }

  isAuthenticated() {
    return window.sessionStorage.getItem("token") !== null;
  }

  _logout(api) {
    var params = {
    };

    return new Promise(function(resolve, reject) {
      api._callMethod("POST", "/logout", params)
      .then(function(data) {
        window.sessionStorage.removeItem("token");
        window.location.replace("/");
        resolve();
      }, reject);
    });
  }

  login(username, password) {
    var api = this;

    var params = {
      username: username,
      password: password,
      eauth: "pam"
    };

    // overrule the eauth method when one is selected
    var type = document.querySelector("#login-form #eauth");
    if(type.value !== "default") {
      params.eauth = type.value;
    }
    localStorage.setItem('logintype', type.value);

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

  getKeys() {
    return this._callMethod("GET", "/keys", {});
  }

  getJobs() {
    return this._callMethod("GET", "/jobs", {});
  }

  getJob(id) {
    return this._callMethod("GET", "/jobs/" + id, {});
  }

  _showError(errorMessage) {
    var errLabel = document.querySelector("#cmd_error");
    errLabel.innerText = errorMessage;
    if(errorMessage)
      errLabel.style.display = "block";
    else
      errLabel.style.display = "none";
  }

  _getRunParams(target, toRun) {

    this._showError("");

    if(target === "") {
      this._showError("'Target' field cannot be empty");
      return null;
    }

    if(toRun === "") {
      this._showError("'Command' field cannot be empty");
      return null;
    }

    // collection for unnamed parameters
    var args = [ ];

    // collection for named parameters
    var params = { };

    let ret = window.parseCommandLine(toRun, args, params);
    if(ret !== null) {
      // that is an error message being returned
      this._showError(ret);
      return null;
    }

    if(args.length === 0) {
      this._showError("First (unnamed) parameter is the function name, it is mandatory");
      return null;
    }

    var functionToRun = args.shift();

    if(typeof functionToRun != typeof "dummy") {
      this._showError("First (unnamed) parameter is the function name, it must be a string, not a " + typeof functionToRun);
      return null;
    }

    if(functionToRun.startsWith("wheel.")) {
      // wheel.key functions are treated slightly different
      // we re-use the 'target' field to fill the parameter 'match'
      // as used by the salt.wheel.key functions
      params.client = "wheel";
      // use only the part after "wheel." (6 chars)
      params.fun = functionToRun.substring(6);
      params.match = target;
    } else {
      params.client = "local";
      params.fun = functionToRun;
      params.tgt = target;
      if(args.length !== 0) params.arg = args;
    }

    var jobRunType = document.querySelector(".jobRunType");
    if(params.client === "local" && jobRunType.innerText === "async") {
      params.client = "local_async";
      // return looks like:
      // { "jid": "20180718173942195461", "minions": [ ... ] }
    }
    if(params.client === "local" && jobRunType.innerText === "batch") {
      params.client = "local_batch";
      // TODO
      params.batch = "10%";
      // TODO
      params.batch_wait = 3;
      // it returns the actual output in a group of batches
    }

    return this._callMethod("POST", "/", params);
  }

  _callMethod(method, route, params) {
    var location = this.APIURL + route;
    var token = window.sessionStorage.getItem("token");

    var headers = {
      "Accept": "application/json",
      "X-Auth-Token": token !== null ? token : "",
      "Cache-Control": "no-cache"
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
    if(response.status == 401 && document.location.pathname != "/login") {
      // sesion has expired
      // redirect to login screen
      window.sessionStorage.removeItem("token");
      document.location.replace("/");
      return;
    }
    if(response.status !== 200) {
      reject();
      return;
    }

    response.json()
    .then(resolve, reject);
  }

}
