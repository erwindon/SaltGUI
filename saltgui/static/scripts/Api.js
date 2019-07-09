export class HTTPError extends Error {
  constructor(pStatus, pMessage) {
    super();
    this.status = pStatus;
    this.message = pMessage;
  }
}

export class API {
  constructor(pRouter) {
    this.apiRequest = this.apiRequest.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.getEvents(pRouter);
  }

  login(pUserName, pPassWord, pEauth="pam") {
    const params = {
      username: pUserName,
      password: pPassWord,
      eauth: pEauth
    };

    // store it as the default login method
    window.localStorage.setItem("eauth", pEauth);

    return this.apiRequest("POST", "/login", params)
      .then(pData => {
        const response = pData.return[0];
        if(Object.keys(response.perms).length === 0) {
          // We are allowed to login but there are no permissions available
          // This may happen e.g. for accounts that are in PAM,
          // but not in the 'master' file.
          // Don't give the user an empty screen full of errors
          throw new HTTPError(403, "Unauthorized");
        }
        window.sessionStorage.setItem("login-response", JSON.stringify(response));
        window.sessionStorage.setItem("token", response.token);
      });
  }

  logout() {
    // only delete the session here as the router should take care of
    // redirecting to the login screen
    return this.apiRequest("POST", "/logout", {})
      .then(pResponse => {
        // we could logout
        // assume the session is terminated
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("login-response");
      }, pResponse => {
        // we could not logout
        // assume the session is broken
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("login-response");
      });
  }

  getLocalBeaconsList(pMinionId) {
    const params = {
      client: "local",
      fun: "beacons.list",
      kwarg: { return_yaml: false }
    };
    if(pMinionId) {
      params.tgt_type = "list";
      params.tgt = pMinionId;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalGrainsItems(pMinionId) {
    const params = {
      client: "local",
      fun: "grains.items",
    };
    if(pMinionId) {
      params.tgt_type = "list";
      params.tgt = pMinionId;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalPillarItems(pMinionId) {
    const params = {
      client: "local",
      fun: "pillar.items"
    };
    if(pMinionId) {
      params.tgt_type = "list";
      params.tgt = pMinionId;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalPillarObfuscate(pMinionId) {
    const params = {
      client: "local",
      fun: "pillar.obfuscate"
    };
    if(pMinionId) {
      params.tgt_type = "list";
      params.tgt = pMinionId;
    } else {
      params.tgt_type = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalScheduleList(pMinionId) {
    const params = {
      client: "local",
      fun: "schedule.list",
      kwarg: { return_yaml: false }
    };
    if(pMinionId) {
      params.tgt_type = "list";
      params.tgt = pMinionId;
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

  getRunnerJobsListJob(pJobId) {
    const params = {
      client: "runner",
      fun: "jobs.list_job",
      jid: pJobId
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

  getWheelKeyFinger(pMinionId) {
    const params = {
      client: "wheel",
      fun: "key.finger"
    };
    if(pMinionId) {
      params.match = pMinionId;
    } else {
      params.match = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getWheelKeyListAll() {
    const params = {
      client: "wheel",
      fun: "key.list_all",
    };
    return this.apiRequest("POST", "/", params);
  }

  apiRequest(pMethod, pRoute, pParams) {
    const location = config.API_URL + pRoute;
    const token = window.sessionStorage.getItem("token");
    const headers = {
      "Accept": "application/json",
      "X-Auth-Token": token !== null ? token : "",
      "Cache-Control": "no-cache"
    };
    const options = {
      method: pMethod,
      url: location,
      headers: headers
    };

    if(pMethod === "POST") options.body = JSON.stringify(pParams);

    const myThis = this;
    return fetch(location, options)
      .then(pResponse => {
        if(pResponse.ok) return pResponse.json();
        // fetch does not reject on > 300 http status codes,
        // so let's do it ourselves
        if(pResponse.status === 401 && pRoute !== "/login") {
          const loginResponseStr = window.sessionStorage.getItem("login-response");
          if(!loginResponseStr) {
            myThis.logout().then(() =>
              window.location.replace("/login?reason=no-session")
            , () =>
              window.location.replace("/login?reason=no-session")
            );
            return null;
          }

          const loginResponse = JSON.parse(loginResponseStr);
          // just in case...
          if(loginResponse) {
            const now = Date.now() / 1000;
            const expireValue = loginResponse.expire;
            if(now > expireValue) {
              myThis.logout().then(() =>
                window.location.replace("/login?reason=expired-session")
              , () =>
                window.location.replace("/login?reason=expired-session")
              );
              return null;
            }
          }
        }
        throw new HTTPError(pResponse.status, pResponse.statusText);
      });
  }

  getEvents(pRouter) {
    const token = window.sessionStorage.getItem("token");
    if(!token) return;

    const source = new EventSource('/events?token=' + token);
    source.onopen = function() {
      //console.info('Listening for events...');
    };
    source.onerror = function(err) {
      // Don't show the error
      // It appears with every page-load
      //console.error(err);
    };
    source.onmessage = function(pMessage) {
      const saltEvent = JSON.parse(pMessage.data);
      const tag = saltEvent.tag;
      const data = saltEvent.data;

      // erase the public key value when it is present
      // it is long and boring (so not because it is a secret)
      if(data.pub) data.pub = "...";

      // salt/beacon/<minion>/<beacon>/
      if(tag.startsWith("salt/beacon/"))
      {
        // new beacon-value is received
        pRouter.beaconsMinionRoute.handleSaltBeaconEvent(tag, data);
      }
      else if(tag === "salt/auth")
      {
        // new key has been received
        pRouter.keysRoute.handleSaltAuthEvent(tag, data);
      }
      else if(tag === "salt/key")
      {
        pRouter.keysRoute.handleSaltKeyEvent(tag, data);
      }
      else if(tag.startsWith("salt/job/") && tag.includes("/ret/"))
      {
        pRouter.jobRoute.handleSaltJobRetEvent(tag, data);
      }
    }.bind(this);
  }
}
