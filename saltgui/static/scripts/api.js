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
  }

  isAuthenticated() {
    // use the /stats api call to see if we are allowed to access SaltGUI
    // (if the session cookie is still valid)
    return this.apiRequest("GET", "/stats", {})
      .then(response => {
        return window.sessionStorage.getItem("token") !== null;
      });
  }

  login(username, password, eauth="pam") {
    const params = {
      username: username,
      password: password,
      eauth: eauth
    };

    // store it as the default login method
    localStorage.setItem("eauth", eauth);

    return this.apiRequest("POST", "/login", params)
      .then(data => {
        const response = data.return[0];
        if (Object.keys(response.perms).length === 0) {
          // we are allowed to login but there are no permissions available
          throw new HTTPError(403, "Unauthorized");
        }
        window.sessionStorage.setItem("token", response.token);
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

  getJobsActive() {
    const params = {
      client: "runner",
      fun: "jobs.active"
    };
    return this.apiRequest("POST", "/", params).catch(console.error);
  }

  getConfigValues() {
    const params = {
      client: "wheel",
      fun: "config.values"
    };
    return this.apiRequest("POST", "/", params).catch(console.error);
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
