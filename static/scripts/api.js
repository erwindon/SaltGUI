class API {

  constructor() {
    this.APIURL = "";
    this.token = undefined;

    this._callMethod = this._callMethod.bind(this);
    this._fetch = this._fetch.bind(this);
  }

  isAuthenticated() {
    return this.token !== undefined;
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
        api.token = data.return[0].token;
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
    var token = this.token;

    var headers = {
      "Accept": "application/json",
      "X-Auth-Token": token !== undefined ? token : ""
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
