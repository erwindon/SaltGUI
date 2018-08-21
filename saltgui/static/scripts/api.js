class API {

  constructor() {
    this.APIURL = "";

    this._callMethod = this._callMethod.bind(this);
    this._fetch = this._fetch.bind(this);
    this._getRunParams = this._getRunParams.bind(this);
    this._manualRunMenuSysDocPrepare = this._manualRunMenuSysDocPrepare.bind(this);
    this._manualRunMenuSysDocRun = this._manualRunMenuSysDocRun.bind(this);
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
    if(target === "") return;
    var command = document.querySelector(".run-command #command").value;

    var func = this._getRunParams(target, command);
    if(func == null) return;

    button.disabled = true;
    output.innerHTML = "Loading...";

    func.then(this._onRunReturn, this._onRunReturn);
  }

  _onRunReturn(data) {
    var response = data.return[0];
    var hostnames = Object.keys(response).sort();

    var outputContainer = document.querySelector(".run-command pre");
    outputContainer.innerHTML = "";

    for(let i = 0; i < hostnames.length; i++) {
      let hostname = hostnames[i];
      var output = response[hostname];
      if(typeof output !== 'object') {
        continue;
      }
      if(!output) {
        // some commands do not have help-text
        // e.g. wheel.key.get_key
        continue;
      }
      let isSysDocOutput = true;
      for(let key of Object.keys(output)) {

        // e.g. for "test.rand_str"
        if(output[key] === null)
          continue;

        if(typeof output[key] !== 'string') {
          isSysDocOutput = false;
          break;
        }
      }
      if(!isSysDocOutput)
        break;

      // some commands do not exist anywhere
      // prevent an empty display by still using
      // the standard output form when that happens
      var cnt = 0;

      for(let key of Object.keys(output).sort()) {
        let out = output[key];
        if(out === null) continue;
        // the output is already pre-ed
        out = out.replace(/\n[ \t]*<[\/]?pre>[ \t]*\n/g, "\n");
        // turn text into html
        out = out.replace(/&/g, "&amp;");
        out = out.replace(/</g, "&lt;");
        out = out.replace(/>/g, "&gt;");
        out = out.trimEnd();
        outputContainer.innerHTML +=
          `<span class='hostname'>${key}</span>:<br>` +
          '<pre style="height: initial; overflow-y: initial;">' + out + '</pre>';
        cnt += 1;
      }

      if(cnt) {
        // sabotage any further output
        hostnames = [];
        break;
      }
    }

    for(let i = 0; i < hostnames.length; i++) {
      let hostname = hostnames[i];
      let output = response[hostname];

      if (typeof output === 'object') {
        // when you do a state.apply for example you get a json response.
        // let's format it nicely here
        output = JSON.stringify(output, null, 2);
      }
      else if (typeof output === 'string') {
        // Or when it is documentation, strip trailing whitespace
        output = output.replace(/[ \r\n]+$/g, "");
      }

      outputContainer.innerHTML +=
        `<span class='hostname'>${hostname}</span>: ${output}<br>`;
    }

    var button = document.querySelector(".run-command input[type='submit']");
    button.disabled = false;
  }

  _manualRunMenuSysDocPrepare(menuitem) {
    var target = document.querySelector(".run-command #target").value;
    target = target ? "target" : "all minions";
    var command = document.querySelector(".run-command #command").value;
    // remove the command arguments
    command = command.trim().replace(/ .*/, "");
    command = command.trim().replace(/[.]*$/, "");
    if(!command.match(/^[a-z.]*$/i)) {
      // when it is not a command, don't treat it as a command
      menuitem.style.display = "none";
    } else if(!command) {
      // this spot was reserved for `sys.doc` without parameters
      // but that is far too slow for normal use
      menuitem.style.display = "none";
    } else if(command === "runners" || command.startsWith("runners.")) {
      // actually 'command' is not passed, but we select that part of the actual result
      // because `runners.doc.runner` always returns all documentation for `runners'
      command = command.substring(8);
      if(command) command = " " + command;
      menuitem.innerText = "Run 'runners.doc.runner" + command + "'";
      menuitem.style.display = "block";
    } else if(command === "wheel" || command.startsWith("wheel.")) {
      // actually 'command' is not passed, but we select that part of the actual result
      // because `runners.doc.wheel` always returns all documentation for `wheel'
      command = command.substring(6);
      if(command) command = " " + command;
      menuitem.innerText = "Run 'runners.doc.wheel" + command + "'";
      menuitem.style.display = "block";
    } else {
      menuitem.innerText = "Run 'sys.doc " + command + "' on " + target;
      menuitem.style.display = "block";
    }
  }

  _fixDocuReturn(response, visualKey, filterKey) {
    if(!response || typeof response !== "object") {
      // strange --> don't try to fix anything
      return;
    }

    let foundDocu = false;
    for(let hostname of Object.keys(response)) {
      if(typeof response[hostname] !== "object") {
        // make sure it is an object (instead of e.g. "false" for an offline minion)
        delete response[hostname];
        continue;
      }

      let hostResponse = response[hostname];
      for(let key of Object.keys(hostResponse)) {

        // an exact match is great
        if(key === filterKey) continue;

        // a true prefix is also ok
        if(!filterKey || key.startsWith(filterKey + ".")) continue;

        delete hostResponse[key];
      }

      // no documentation present (or left) on this minion?
      // then discard the result of this minion
      if(Object.keys(hostResponse).length === 0) {
        delete response[hostname];
        continue;
      }

      foundDocu = true;
    }

    // prepare a dummy response when no documentation could be found
    // otherwise leave all documentation responses
    if(!foundDocu) {
      response[visualKey] = "no documentation found";
    }
  }

  _manualRunMenuSysDocRun() {
    var button = document.querySelector(".run-command input[type='submit']");
    if(button.disabled) return;
    var output = document.querySelector(".run-command pre");

    var target = document.querySelector(".run-command #target").value;
    // the help text is taken from the first minion that answers
    // when no target is selectes, just ask all minions
    if(target === "") target = "*";

    // do not use the command-parser
    var command = document.querySelector(".run-command #command").value;
    // remove arguments
    command = command.trim().replace(/ .*/, "");
    // remove trailing dots
    command = command.trim().replace(/[.]*$/, "");
    // command can be empty here (but the gui prevents that)

    button.disabled = true;
    output.innerHTML = "Loading...";

    if(command === "runners" || command.startsWith("runners.")) {
      command = command.substring(8);
      this._getRunParams(target, "runners.doc.runner")
        .then(
          arg => {
            arg.return[0] = {"master": arg.return[0]};
            this._fixDocuReturn(arg.return[0], "runners." + command, command);
            this._onRunReturn(arg); },
          this._onRunReturn);
    } else if(command === "wheel" || command.startsWith("wheel.")) {
      command = command.substring(6);
      this._getRunParams(target, "runners.doc.wheel")
        .then(
          arg => {
            arg.return[0] = {"master": arg.return[0]};
            this._fixDocuReturn(arg.return[0], "wheel." + command, command);
            this._onRunReturn(arg); },
          this._onRunReturn);
    } else {
      // regular command
      this._getRunParams(target, "sys.doc " + command)
        .then(
          arg => {
            this._fixDocuReturn(arg.return[0], command, command);
            this._onRunReturn(arg); },
          this._onRunReturn);
    }
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

    if(typeof functionToRun != "string") {
      this._showError("First (unnamed) parameter is the function name, it must be a string, not a " + typeof functionToRun);
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
