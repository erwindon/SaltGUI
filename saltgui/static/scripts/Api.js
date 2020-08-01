/* global config EventSource window */

import {Utils} from "./Utils.js";

export class HTTPError extends Error {
  constructor (pStatus, pMessage) {
    super();
    this.status = pStatus;
    this.message = pMessage;
  }
}

export class API {
  constructor () {
    this.apiRequest = this.apiRequest.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login (pUserName, pPassWord, pEauth = "pam") {
    const params = {
      "eauth": pEauth,
      "password": pPassWord,
      "username": pUserName
    };

    // store it as the default login method
    Utils.setStorageItem("local", "eauth", pEauth);

    return this.apiRequest("POST", "/login", params).
      then((pLoginData) => {
        const response = pLoginData.return[0];
        if (Object.keys(response.perms).length === 0) {
          // We are allowed to login but there are no permissions available
          // This may happen e.g. for accounts that are in PAM,
          // but not in the 'master' file.
          // Don't give the user an empty screen full of errors
          // just like 403 Unauthorized
          throw new HTTPError(-1, "No permissions");
        }
        Utils.setStorageItem("session", "login-response", JSON.stringify(response));
        Utils.setStorageItem("session", "token", response.token);
      });
  }

  _cleanStorage () {
    // clear local storage except key 'eauth'
    const eauth = Utils.getStorageItem("local", "eauth");
    Utils.clearStorage("local");
    Utils.setStorageItem("local", "eauth", eauth);

    // clear all of session storage
    Utils.clearStorage("session");
  }

  logout () {
    // only delete the session here as the router should take care of
    // redirecting to the login screen
    const that = this;
    return this.apiRequest("POST", "/logout", {}).
      then(() => {
        // we could logout, assume the session is terminated
        that._cleanStorage();
      }, () => {
        // we could not logout, assume the session is broken
        that._cleanStorage();
      });
  }

  getStaticMinionsTxt () {
    return this.apiRequest("GET", "/static/minions.txt");
  }

  getLocalBeaconsList (pMinionId) {
    const params = {
      "client": "local",
      "fun": "beacons.list",
      "kwarg": {"return_yaml": false}
    };
    if (pMinionId) {
      params["tgt_type"] = "list";
      params.tgt = pMinionId;
    } else {
      params["tgt_type"] = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalGrainsItems (pMinionId) {
    const params = {
      "client": "local",
      "fun": "grains.items"
    };
    if (pMinionId) {
      params["tgt_type"] = "list";
      params.tgt = pMinionId;
    } else {
      params["tgt_type"] = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalPillarItems (pMinionId) {
    const params = {
      "client": "local",
      "fun": "pillar.items"
    };
    if (pMinionId) {
      params["tgt_type"] = "list";
      params.tgt = pMinionId;
    } else {
      params["tgt_type"] = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalPillarObfuscate (pMinionId) {
    const params = {
      "client": "local",
      "fun": "pillar.obfuscate"
    };
    if (pMinionId) {
      params["tgt_type"] = "list";
      params.tgt = pMinionId;
    } else {
      params["tgt_type"] = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getLocalScheduleList (pMinionId) {
    const params = {
      "client": "local",
      "fun": "schedule.list",
      "kwarg": {"return_yaml": false}
    };
    if (pMinionId) {
      params["tgt_type"] = "list";
      params.tgt = pMinionId;
    } else {
      params["tgt_type"] = "glob";
      params.tgt = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getRunnerJobsActive () {
    const params = {
      "client": "runner",
      "fun": "jobs.active"
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerJobsListJob (pJobId) {
    const params = {
      "client": "runner",
      "fun": "jobs.list_job",
      "jid": pJobId
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerJobsListJobs () {
    const params = {
      "client": "runner",
      "fun": "jobs.list_jobs"
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerManageVersions () {
    const params = {
      "client": "runner",
      "fun": "manage.versions"
    };
    return this.apiRequest("POST", "/", params);
  }

  getWheelConfigValues () {
    const params = {
      "client": "wheel",
      "fun": "config.values"
    };
    return this.apiRequest("POST", "/", params);
  }

  getWheelKeyFinger (pMinionId) {
    const params = {
      "client": "wheel",
      "fun": "key.finger"
    };
    if (pMinionId) {
      params.match = pMinionId;
    } else {
      params.match = "*";
    }
    return this.apiRequest("POST", "/", params);
  }

  getWheelKeyListAll () {
    const params = {
      "client": "wheel",
      "fun": "key.list_all"
    };
    return this.apiRequest("POST", "/", params);
  }

  apiRequest (pMethod, pRoute, pParams) {
    const url = config.API_URL + pRoute;
    const token = Utils.getStorageItem("session", "token", "");
    const headers = {
      "Accept": "application/json",
      "Cache-Control": "no-cache",
      "X-Auth-Token": token
    };
    if (pRoute.endsWith(".txt")) {
      headers["Accept"] = "text/plain";
    }
    const options = {
      "headers": headers,
      "method": pMethod,
      "url": url
    };

    if (pMethod === "POST") {
      options.body = JSON.stringify(pParams);
    }

    const that = this;
    return window.fetch(url, options).
      then((pResponse) => {
        if (pResponse.ok && pRoute.endsWith(".txt")) {
          return pResponse.text();
        }
        if (pResponse.ok) {
          return pResponse.json();
        }
        // fetch does not reject on > 300 http status codes,
        // so let's do it ourselves
        if (pResponse.status === 401 && pRoute === "/logout") {
          // so we can't logout?
          that._cleanStorage();
          return null;
        }
        if (pResponse.status === 401 && pRoute !== "/login") {
          const loginResponseStr = Utils.getStorageItem("session", "login-response");
          if (!loginResponseStr) {
            that.logout().then(() => {
              window.location.replace(config.NAV_URL + "/login?reason=no-session");
            }, () => {
              window.location.replace(config.NAV_URL + "/login?reason=no-session");
            });
          }

          const loginResponse = JSON.parse(loginResponseStr);
          // just in case...
          if (loginResponse) {
            const now = Date.now() / 1000;
            const expireValue = loginResponse.expire;
            if (now > expireValue) {
              that.logout().then(() => {
                window.location.replace(config.NAV_URL + "/login?reason=expired-session");
              }, () => {
                window.location.replace(config.NAV_URL + "/login?reason=expired-session");
              });
            }
          }
        }
        if (pResponse.status === 404 && pRoute.endsWith(".txt")) {
          // ok
          return "";
        }
        throw new HTTPError(pResponse.status, pResponse.statusText);
      });
  }

  getEvents (pRouter) {
    const tokenOnSetup = Utils.getStorageItem("session", "token");
    if (!tokenOnSetup) {
      return;
    }

    const source = new EventSource(config.API_URL + "/events?token=" + tokenOnSetup);
    source.onopen = () => {
      // console.info("Listening for events...");
    };
    source.onerror = () => {
      // Don't show the error
      // It appears with every page-load
      source.close();
    };
    source.onmessage = (pMessage) => {
      const tokenOnMessage = Utils.getStorageItem("session", "token");
      if (!tokenOnMessage) {
        // no token, stop the stream
        source.close();
        return;
      }

      const loginResponseStr = Utils.getStorageItem("session", "login-response");
      if (!loginResponseStr) {
        // no login details, stop the stream
        source.close();
        return;
      }
      const loginResponse = JSON.parse(loginResponseStr);
      const expireValue = loginResponse.expire;
      const now = Date.now() / 1000;
      if (now > expireValue) {
        // the regular session has expired, also stop the stream
        source.close();
        return;
      }

      const saltEvent = JSON.parse(pMessage.data);
      const tag = saltEvent.tag;
      const data = saltEvent.data;

      // erase the public key value when it is present
      // it is long and boring (so not because it is a secret)
      if (data.pub) {
        data.pub = "...";
      }

      // salt/beacon/<minion>/<beacon>/
      if (tag.startsWith("salt/beacon/")) {
        // new beacon-value is received
        pRouter.beaconsMinionRoute.handleSaltBeaconEvent(tag, data);
      } else if (tag === "salt/auth") {
        // new key has been received
        pRouter.keysRoute.handleSaltAuthEvent(tag, data);
      } else if (tag === "salt/key") {
        pRouter.keysRoute.handleSaltKeyEvent(tag, data);
      } else if (tag.startsWith("salt/job/") && tag.includes("/ret/")) {
        pRouter.jobRoute.handleSaltJobRetEvent(tag, data);
      }

      pRouter.eventsRoute.handleAnyEvent(tag, data);

    };
  }
}
