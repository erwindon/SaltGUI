class API {

  constructor() {
    this.APIURL = "";

    // consts
    // note that "none" is not case-insensitive
    this.patNull = /^(None|null|Null|NULL)$/;
    this.patBooleanFalse = /^(false|False|FALSE)$/;
    this.patBooleanTrue = /^(true|True|TRUE)$/;
    this.patInteger = /^((0)|([-+]?[1-9][0-9]*))$/;
    this.patFloat = /^([-+]?(([0-9]+)|([0-9]+[.][0-9]*)|([0-9]*[.][0-9]+))([eE][-+]?[0-9]+)?)$/;

    this._callMethod = this._callMethod.bind(this);
    this._fetch = this._fetch.bind(this);
    this._getRunParams = this._getRunParams.bind(this);
    this._onRun = this._onRun.bind(this);
    this._onRunReturn = this._onRunReturn.bind(this);

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
    if(isShowing && command.startsWith("salt.wheel.key.") && output != "Waiting for command...") {
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

  _parseCommandLine(toRun, args, params) {
    // just in case the user typed some extra whitespace
    // at the start of the line
    toRun = toRun.trim();

    while(toRun.length > 0)
    {
      var name = null;

      var firstSpaceChar = toRun.indexOf(" ");
      if(firstSpaceChar < 0)
        firstSpaceChar = toRun.length;
      var firstEqualSign = toRun.indexOf("=");
      if(firstEqualSign >= 0 && firstEqualSign < firstSpaceChar) {
        // we have the name of a named parameter
        name = toRun.substr(0, firstEqualSign);
        toRun = toRun.substr(firstEqualSign + 1);
        if(toRun === "" || toRun[0] === " ") {
          this._showError("Must have value for named parameter '" + name + "'");
          return false;
        }
      }

      // Determine whether the JSON string starts with a known
      // character for a JSON type
      var endChar = undefined;
      var objType = undefined;
      if(toRun[0] === '{') {
        endChar = '}';
        objType = "dictionary";
      } else if(toRun[0] === '[') {
        endChar = ']';
        objType = "array";
      } else if(toRun[0] === '"') {
        endChar = '"';
        objType = "double-quoted-string";
      } else if(toRun[0] === '\'') {
        endChar = '\'';
        objType = "single-quoted-string";
      }

      var value;
      if(endChar && objType) {
        // The string starts with a character for a known JSON type
        var p = 1;
        while(true) {
          // Try until the next closing character
          var n = toRun.indexOf(endChar, p);
          if(n < 0) {
            this._showError("No valid " + objType + " found");
            return false;
          }

          // parse what we have found so far
          // the string ends with a closing character
          // but that may not be enough, e.g. "{a:{}"
          var s = toRun.substring(0, n + 1);
          try {
            value = JSON.parse(s);
          }
          catch(err) {
            // the string that we tried to parse is not valid json
            // continue to add more text from the input
            p = n + 1;
            continue;
          }

          // the first part of the string is valid JSON
          n = n + 1;
          if(n < toRun.length && toRun[n] !== ' ') {
            console.log("valid " + objType + ", but followed by text:" + toRun.substring(n) + "...");
            return false;
          }

          // valid JSON and not followed by strange characters
          toRun = toRun.substring(n);
          break;
        }
      } else {
        // everything else is a string (without quotes)
        // when we are done, we'll see whether it actually is a number
        // or any of the known constants
        let str = "";
        while(toRun.length > 0 && toRun[0] != ' ') {
          str += toRun[0];
          toRun = toRun.substring(1);
        }

        // try to find whether the string is actually a known constant
        // or integer or float
        if(this.patNull.test(str)) {
          value = null;
        } else if(this.patBooleanFalse.test(str)) {
          value = false;
        } else if(this.patBooleanTrue.test(str)) {
          value = true;
        } else if(this.patInteger.test(str)) {
          value = parseInt(str);
        } else if(this.patFloat.test(str)) {
          value = parseFloat(str);
          if(!isFinite(value)) {
            this._showError("Numeric argument has overflowed or is infinity");
            return false;
          }
        } else {
          value = str;
        }
      }

      if(name !== null) {
        // named parameter
        params[name] = value;
      } else {
        // anonymous parameter
        args.push(value);
      }

      // ignore the whitespace before the next part
      toRun = toRun.trim();
    }

    // succesful
    return true;
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

    if(!this._parseCommandLine(toRun, args, params)) {
      // error already given in function
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

    if(functionToRun.startsWith("salt.wheel.")) {
      // wheel.key functions are treated slightly different
      // we re-use the 'target' field to fill the parameter 'match'
      // as used by the salt.wheel.key functions
      params.client = "wheel";
      // use only the part after "salt.wheel." (11 chars)
      params.fun = functionToRun.substring(11);
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
