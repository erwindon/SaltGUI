class API {

  constructor() {
    this.APIURL = "";

    this._callMethod = this._callMethod.bind(this);
    this._fetch = this._fetch.bind(this);
    this._getRunParams = this._getRunParams.bind(this);
    this._manualRunMenuSysDocPrepare = window._manualRunMenuSysDocPrepare.bind(this);
    this._manualRunMenuSysDocRun = window._manualRunMenuSysDocRun.bind(this);
    this._onRun = this._onRun.bind(this);
    this._onRunReturn = this._onRunReturn.bind(this);
    this._toggleManualRun = this._toggleManualRun.bind(this);

    var cmdbox = document.querySelector(".run-command #cmdbox");
    this.menu = new DropDownMenu(cmdbox);
    this.menu.addMenuItem(
      this._manualRunMenuSysDocPrepare,
      this._manualRunMenuSysDocRun);

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
    document.querySelector(".run-command input[type='submit']")
      .addEventListener('click', this._onRun);

    // keydown is too early, keypress also does not work
    document.querySelector("#command")
      .addEventListener('keyup', this.menu.verifyAll);
    // cut/paste do not work everywhere
    document.querySelector("#command")
      .addEventListener('cut', this.menu.verifyAll);
    document.querySelector("#command")
      .addEventListener('paste', this.menu.verifyAll);
    // blur/focus should not be needed but are a valueable fallback
    document.querySelector("#command")
      .addEventListener('blur', this.menu.verifyAll);
    document.querySelector("#command")
      .addEventListener('focus', this.menu.verifyAll);
  }

  _onRun() {
    var button = document.querySelector(".run-command input[type='submit']");
    if(button.disabled) return;
    var output = document.querySelector(".run-command pre");

    var target = document.querySelector(".run-command #target").value;
    var command = document.querySelector(".run-command #command").value;

    var func = this._getRunParams(target, command);
    if(func == null) return;

    button.disabled = true;
    output.innerHTML = "Loading...";

    func.then(
      arg => { this._onRunReturn(command, arg); },
      arg => { this._onRunReturn(command, arg); }
      );
  }

  _onRunReturn(command, data) {
    let response = data.return[0];

    let outputContainer = document.querySelector(".run-command pre");

    window._addOutput(outputContainer, response, command);

    let button = document.querySelector(".run-command input[type='submit']");
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

    return api._callMethod("POST", "/logout", params).then(response => {
      window.sessionStorage.removeItem("token");
      window.location.replace("/");
    }).catch(error => {
      console.error("_logout", error);
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

    if(typeof functionToRun != "string") {
      this._showError("First (unnamed) parameter is the function name, it must be a string, not a " + typeof functionToRun);
      return null;
    }

    // RUNNERS commands do not have a target (MASTER is the target)
    // WHEEL commands also do not have a target
    // but we use the TARGET value to form the usually required MATCH parameter
    // therefore for WHEEL commands it is still required
    if(target === "" && functionToRun !== "runners" && !functionToRun.startsWith("runners.")) {
      this._showError("'Target' field cannot be empty");
      return null;
    }

    if(functionToRun.startsWith("runners.")) {
      params.client = "runner";
      // use only the part after "runners." (8 chars)
      params.fun = functionToRun.substring(8);
      if(args.length !== 0) params.arg = args;
    } else if(functionToRun.startsWith("wheel.")) {
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
