class HTTPError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

class API {

  constructor() {
    this.APIURL = "";

    this._callMethod = this._callMethod.bind(this);
    this._getRunParams = this._getRunParams.bind(this);
    this._onRun = this._onRun.bind(this);
    this._onRunReturn = this._onRunReturn.bind(this);
    this._showManualRun = this._showManualRun.bind(this);
    this._hideManualRun = this._hideManualRun.bind(this);

    const cmdbox = document.querySelector(".run-command #cmdbox");
    this.menu = new DropDownMenu(cmdbox);
    Documentation.addCommandMenuItems(this);

    this._registerEventListeners();
  }

  _registerEventListeners() {
    document.querySelector("#popup_runcommand")
      .addEventListener('click', this._hideManualRun);
    document.querySelector("#button_manualrun")
      .addEventListener('click', this._showManualRun);
    document.querySelector("#button_close_cmd")
      .addEventListener('click', this._hideManualRun);
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
    const button = document.querySelector(".run-command input[type='submit']");
    if(button.disabled) return;
    const output = document.querySelector(".run-command pre");

    const target = document.querySelector(".run-command #target").value;
    const command = document.querySelector(".run-command #command").value;

    const func = this._getRunParams(target, command);
    if(func === null) return;

    button.disabled = true;
    output.innerHTML = "Loading...";

    func.then(
      arg => { this._onRunReturn(arg.return[0], command); },
      arg => { this._onRunReturn(arg.return[0], command); }
    );
  }

  _onRunReturn(response, command) {
    const outputContainer = document.querySelector(".run-command pre");
    Output.addOutput(outputContainer, response, command);
    const button = document.querySelector(".run-command input[type='submit']");
    button.disabled = false;
  }

  _showManualRun(evt) {
    const manualRun = document.querySelector("#popup_runcommand");
    manualRun.style.display = "block";

    document.body.style["overflow-y"] = "hidden";
    document.querySelector(".run-command pre").innerHTML = "Waiting for command...";

    evt.stopPropagation();
  }

  _hideManualRun(evt) {
    //Don't close if they click inside the window
    if(evt.target.className !== "popup" && evt.target.className !== "nearlyvisiblebutton") return;

    const manualRun = document.querySelector("#popup_runcommand");
    manualRun.style.display = "none";

    document.body.style["overflow-y"] = "scroll";

    // test whether the command may have caused an update to the list
    // the user may have altered the text after running the command, just ignore that
    const command = document.querySelector(".run-command #command").value;
    const output = document.querySelector(".run-command pre").innerHTML;
    if(command.startsWith("wheel.key.") && output !== "Waiting for command...") {
      location.reload();
    }

    evt.stopPropagation();
  }

  isAuthenticated() {
    // As there is not an API call to check if you are authenticated we call
    // the stats call to see if we can access that
    return this._callMethod("GET", "/stats", {})
      .then(response => {
        return window.sessionStorage.getItem("token") !== null;
      });
  }

  logout() {
    // only delete the session here as the router should take care of
    // redirecting to the login screen
    return this._callMethod("POST", "/logout", {})
      .then(response => {
        window.sessionStorage.removeItem("token");
      });
  }

  login(username, password) {
    const params = {
      username: username,
      password: password,
      eauth: "pam"
    };

    // overrule the eauth method when one is selected
    const type = document.querySelector("#login-form #eauth");
    if(type.value !== "default") {
      params.eauth = type.value;
    }
    localStorage.setItem('logintype', type.value);

    return this._callMethod("POST", "/login", params).then(data => {
      window.sessionStorage.setItem("token", data.return[0].token);
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

  getRunningJobs() {
    return this._getRunParams(null, "runners.jobs.active");
  }

  _showError(message) {
    this._onRunReturn(message);
  }

  _getRunParams(target, toRun) {

    if(toRun === "") {
      this._showError("'Command' field cannot be empty");
      return null;
    }

    // collection for unnamed parameters
    const args = [ ];

    // collection for named parameters
    const params = { };

    const ret = window.parseCommandLine(toRun, args, params);
    if(ret !== null) {
      // that is an error message being returned
      this._showError(ret);
      return null;
    }

    if(args.length === 0) {
      this._showError("First (unnamed) parameter is the function name, it is mandatory");
      return null;
    }

    const functionToRun = args.shift();

    if(typeof functionToRun !== "string") {
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

    return this._callMethod("POST", "/", params)
      .catch(error => {
        this._showError(error.message);
        return error;
      });
  }

  _callMethod(method, route, params) {
    const location = this.APIURL + route;
    const token = window.sessionStorage.getItem("token");
    const headers = {
      "Accept": "application/json",
      "X-Auth-Token": token !== null ? token : "",
      "Cache-Control": "no-cache"
    };
    const options = {
      method: method,
      url: location,
      headers: headers
    };

    if(method === "POST") options.body = JSON.stringify(params);

    return fetch(location, options)
      .then(response => {
        if (response.ok) return response.json();
        // fetch does not reject on > 300 http status codes, so let's
        // do it ourselves

        return Promise.reject(
          new HTTPError(response.status, response.statusText));
      });
  }
}
