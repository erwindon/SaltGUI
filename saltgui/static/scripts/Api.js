import {BeaconsMinionRoute} from './routes/BeaconsMinion.js';

export class HTTPError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

export class API {
  constructor(apiurl="") {
    this.APIURL = apiurl;

    //this.getEvents = this.getEvents.bind(this);
    this.getEvents();
  }

  isAuthenticated() {
    // use the /stats api call to see if we are allowed to access SaltGUI
    // (if the session cookie is still valid)
    return this.apiRequest("GET", "/stats", {})
      .then(response => {
        return window.sessionStorage.getItem("token") !== null;
      }, response => { return false; } );
  }

  login(username, password, eauth="pam") {
    const params = {
      username: username,
      password: password,
      eauth: eauth
    };

    // store it as the default login method
    window.localStorage.setItem("eauth", eauth);

    return this.apiRequest("POST", "/login", params)
      .then(data => {
        const response = data.return[0];
        if(Object.keys(response.perms).length === 0) {
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

  getLocalBeaconsList(minion) {
    const params = {
      client: "local",
      fun: "beacons.list",
      kwarg: { return_yaml: false }
    };
    if(minion) {
      params.tgt_type = "list";
      params.tgt = minion;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalGrainsItems(minion) {
    const params = {
      client: "local",
      fun: "grains.items",
    };
    if(minion) {
      params.tgt_type = "list";
      params.tgt = minion;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalPillarItems(minion) {
    const params = {
      client: "local",
      fun: "pillar.items"
    };
    if(minion) {
      params.tgt_type = "list";
      params.tgt = minion;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalPillarObfuscate(minion) {
    const params = {
      client: "local",
      fun: "pillar.obfuscate"
    };
    if(minion) {
      params.tgt_type = "list";
      params.tgt = minion;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalScheduleList(minion) {
    const params = {
      client: "local",
      fun: "schedule.list",
      kwarg: { return_yaml: false }
    };
    if(minion) {
      params.tgt_type = "list";
      params.tgt = minion;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getRunnerJobsActive() {
    const params = {
      client: "runner",
      fun: "jobs.active"
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerJobsListJob(id) {
    const params = {
      client: "runner",
      fun: "jobs.list_job",
      jid: id
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerJobsListJobs() {
    const params = {
      client: "runner",
      fun: "jobs.list_jobs"
    };
    return this.apiRequest("POST", "/", params);
  }

  getWheelConfigValues() {
    const params = {
      client: "wheel",
      fun: "config.values"
    };
    return this.apiRequest("POST", "/", params);
  }

  getWheelKeyFinger() {
    const params = {
      client: "wheel",
      fun: "key.finger",
      match: "*"
    };
    return this.apiRequest("POST", "/", params);
  }

  getWheelKeyListAll() {
    const params = {
      client: "wheel",
      fun: "key.list_all",
    };
    return this.apiRequest("POST", "/", params);
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
        if(response.ok) return response.json();
        // fetch does not reject on > 300 http status codes, so let's
        // do it ourselves
        throw new HTTPError(response.status, response.statusText);
      });
  }

  getEvents() {
    const token = window.sessionStorage.getItem("token");
    const source = new EventSource('/events?token=' + token);
    source.onopen = function() {
      //console.info('Listening for events...');
    };
    source.onerror = function(err) {
      // Don't show the error
      // It appears with every page-load
      //console.error(err);
    };
    source.onmessage = function(message) {
      const saltEvent = JSON.parse(message.data);
      const tag = saltEvent.tag;
      const data = saltEvent.data;

      // erase the public key value when it is present
      // it is long and boring (so not because it is a secret)
      if(data.pub) data.pub = "...";

      // salt/beacon/<minion>/<beacon>/
      if(tag.startsWith("salt/beacon/"))
      {
        BeaconsMinionRoute.handleEvent(tag, data);
      }
    }.bind(this);
  }
}
