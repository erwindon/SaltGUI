class HTTPError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

class API {

  constructor(apiurl="") {
    this.APIURL = apiurl;
    this.apiRequest = this.apiRequest.bind(this);
  }

  isAuthenticated() {
    // As there is not an API call to check if you are authenticated we call
    // the stats call to see if we can access that
    return this.apiRequest("GET", "/stats", {})
      .then(response => {
        return window.sessionStorage.getItem("token") !== null;
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

    return this.apiRequest("POST", "/login", params).then(data => {
      window.sessionStorage.setItem("token", data.return[0].token);
    });
  }

  logout() {
    // only delete the session here as the router should take care of
    // redirecting to the login screen
    return this.apiRequest("POST", "/logout", {})
      .then(response => {
        window.sessionStorage.removeItem("token");
      });
  }

  getMinions() {
    return this.apiRequest("GET", "/minions", {});
  }

  getKeys() {
    return this.apiRequest("GET", "/keys", {});
  }

  getJobs() {
    return this.apiRequest("GET", "/jobs", {});
  }

  getJob(id) {
    return this.apiRequest("GET", "/jobs/" + id, {});
  }

  getRunningJobs() {
    return this._getRunParams(null, "runners.jobs.active");
  }

  apiRequest(method, route, params) {
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
        throw new HTTPError(response.status, response.statusText);
      });
  }
}
