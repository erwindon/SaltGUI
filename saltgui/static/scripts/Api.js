/* global config */

import {Character} from "./Character.js";
import {CommandBox} from "./CommandBox.js";
import {Router} from "./Router.js";
import {Utils} from "./Utils.js";

export class HTTPError extends Error {
  constructor (pStatus, pMessage) {
    super();
    this.status = pStatus;
    this.message = pMessage;
  }
}

export class API {
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
        Utils.setStorageItem("session", "login_response", JSON.stringify(response));
        Utils.setStorageItem("session", "token", response.token);
        return true;
      });
  }

  static _cleanStorage () {
    // clear local storage except key 'eauth' and 'runtype'
    const eauth = Utils.getStorageItem("local", "eauth");
    const runtype = Utils.getStorageItem("local", "runtype");
    Utils.clearStorage("local");
    Utils.setStorageItem("local", "eauth", eauth);
    Utils.setStorageItem("local", "runtype", runtype);

    // clear all of session storage
    Utils.clearStorage("session");
  }

  logout () {
    // on touchscreens the menus do not go away by themselves
    Utils.hideAllMenus(true);

    // only delete the session here as the router should take care of
    // redirecting to the login screen
    return this.apiRequest("POST", "/logout", {}).
      then(() => {
        // we could logout, assume the session is terminated
        API._cleanStorage();
        return true;
      }, () => {
        // we could not logout, assume the session is broken
        API._cleanStorage();
        return false;
      });
  }

  getStaticMinionsTxt () {
    return this.apiRequest("GET", "/static/minions.txt");
  }

  getStaticSaltAuthTxt () {
    return this.apiRequest("GET", "/static/salt-auth.txt");
  }

  getStaticSaltMotdTxt () {
    return this.apiRequest("GET", "/static/salt-motd.txt");
  }

  getStaticSaltMotdHtml () {
    return this.apiRequest("GET", "/static/salt-motd.html");
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

  getLocalBeaconsListAvailable (pMinionId) {
    const params = {
      "client": "local",
      "fun": "beacons.list_available",
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

  getLocalTestProviders () {
    const params = {
      "client": "local",
      "fun": "test.providers",
      "tgt": "*"
    };
    return this.apiRequest("POST", "/", params);
  }

  getLocalTestVersion (pNodegroup) {
    const params = {
      "client": "local",
      "full_return": true,
      "fun": "test.version",
      "tgt": "N@" + pNodegroup,
      "tgt_type": "compound"
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerCacheGrains (pTgt) {
    const params = {
      "client": "runner",
      "fun": "cache.grains",
      "tgt": pTgt || "*"
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerCachePillar (pTgt) {
    const params = {
      "client": "runner",
      "fun": "cache.pillar",
      "tgt": pTgt || "*"
    };
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

  getRunnerJobsListJobs (pCmd = null) {
    const params = {
      "client": "runner",
      "fun": "jobs.list_jobs"
    };
    if (pCmd) {
      params["search_function"] = pCmd;
    }
    return this.apiRequest("POST", "/", params);
  }

  getRunnerManageVersions () {
    const params = {
      "client": "runner",
      "fun": "manage.versions"
    };
    return this.apiRequest("POST", "/", params);
  }

  getRunnerStateOrchestrateShowSls () {
    const params = {
      "arg": ["*"],
      "client": "runner",
      "fun": "state.orchestrate_show_sls"
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

  getWheelMinionsConnected () {
    const params = {
      "client": "wheel",
      "fun": "minions.connected"
    };
    return this.apiRequest("POST", "/", params);
  }

  getStats () {
    const params = {
    };
    return this.apiRequest("GET", "/stats", params);
  }

  apiRequest (pMethod, pPage, pParams) {
    const url = config.API_URL + pPage;
    const token = Utils.getStorageItem("session", "token", "");
    const headers = {
      "Accept": "application/json",
      "Cache-Control": "no-cache",
      "X-Auth-Token": token
    };
    if (pPage.endsWith(".txt")) {
      headers["Accept"] = "text/plain";
    } else if (pPage.endsWith(".html")) {
      headers["Accept"] = "text/html";
    }
    const options = {
      "headers": headers,
      "method": pMethod,
      "url": url
    };

    if (pMethod === "POST") {
      options.body = JSON.stringify(pParams);
    }

    /* eslint-disable compat/compat */
    /* fetch is not supported in op_mini all, IE 11 */
    return window.fetch(url, options).
    /* eslint-enable compat/compat */
      then((pResponse) => {
        if (pResponse.ok && pPage.endsWith(".txt")) {
          return pResponse.text();
        }
        if (pResponse.ok && pPage.endsWith(".html")) {
          return pResponse.text();
        }
        if (pResponse.ok) {
          return pResponse.json();
        }
        // fetch does not reject on > 300 http status codes,
        // so let's do it ourselves
        if (pResponse.status === 401 && pPage === "/logout") {
          // so we can't logout?
          API._cleanStorage();
          return null;
        }
        if (pResponse.status === 401 && pPage !== "/login") {
          const loginResponseStr = Utils.getStorageItem("session", "login_response");
          if (!loginResponseStr) {
            this.logout().then(() => {
              this.router.goTo("login", {"reason": "no-session"});
              return true;
            }, () => {
              this.router.goTo("login", {"reason": "no-session"});
              return false;
            });
          }

          const loginResponse = JSON.parse(loginResponseStr);
          // just in case...
          if (loginResponse) {
            const now = Date.now() / 1000;
            const expireValue = loginResponse.expire;
            if (now > expireValue) {
              this.logout().then(() => {
                this.router.goTo("login", {"reason": "session-expired"});
                return true;
              }, () => {
                this.router.goTo("login", {"reason": "session-expired"});
                return false;
              });
            }
          }
        }
        if (pResponse.status === 404 && pPage.endsWith(".txt")) {
          // ok
          return "";
        }
        throw new HTTPError(pResponse.status, pResponse.statusText);
      });
  }

  static getEvents () {
    const tokenOnSetup = Utils.getStorageItem("session", "token");
    if (!tokenOnSetup) {
      return;
    }

    // allow only one event-stream
    if (API.eventsOK) {
      return;
    }
    API.eventsOK = true;

    let source;
    try {
      /* eslint-disable compat/compat */
      source = new EventSource(config.API_URL + "/events?token=" + tokenOnSetup);
      /* eslint-enable compat/compat */
    } catch (err) {
      Utils.error("Cannot read the Salt-EventBus with this browser version, browser upgrade recommended");
      return;
    }
    source.onopen = () => {
      // Utils info "Listening for events..."
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

      const loginResponseStr = Utils.getStorageItem("session", "login_response");
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

      // shorten the public key value when it is present
      // it is long and boring (so not because it is a secret)
      // the sizes are so that the first and last 8 characters of the public key are still shown
      if (data.pub && data.pub.length > 75) {
        data.pub = data.pub.substring(0, 35) + Character.HORIZONTAL_ELLIPSIS + data.pub.substring(data.pub.length - 33);
      }

      // salt/beacon/<minion>/<beacon>/
      if (tag.startsWith("salt/beacon/")) {
        // new beacon-value is received
        Router.beaconsMinionPage.handleSaltBeaconEvent(tag, data);
      } else if (tag === "salt/auth") {
        // new key has been received
        Router.keysPage.handleSaltAuthEvent(data);
      } else if (tag === "salt/key") {
        Router.keysPage.handleSaltKeyEvent(data);
      } else if (tag.startsWith("salt/job/") && tag.includes("/ret/")) {
        // return value
        CommandBox.handleSaltJobRetEvent(tag, data);
        Router.keysPage.handleSaltJobRetEvent(data);
        Router.jobPage.handleSaltJobRetEvent(data);
        Router.minionsPage.handleSaltJobRetEvent(data);
        Router.grainsPage.handleSaltJobRetEvent(data);
        Router.grainsMinionPage.handleSaltJobRetEvent(data);
        Router.schedulesPage.handleSaltJobRetEvent(data);
        Router.schedulesMinionPage.handleSaltJobRetEvent(data);
        Router.pillarsPage.handleSaltJobRetEvent(data);
        Router.pillarsMinionPage.handleSaltJobRetEvent(data);
        Router.beaconsPage.handleSaltJobRetEvent(data);
        Router.beaconsMinionPage.handleSaltJobRetEvent(data);
        Router.nodegroupsPage.handleSaltJobRetEvent(data);
        Router.jobsPage.handleSaltJobRetEvent(data);
        Router.templatesPage.handleSaltJobRetEvent(data);
        Router.reactorsPage.handleSaltJobRetEvent(data);
        Router.highStatePage.handleSaltJobRetEvent(data);
        Router.issuesPage.handleSaltJobRetEvent(data);
      } else if (tag.startsWith("salt/job/") && tag.includes("/prog/")) {
        // progress value (exists only for states)
        CommandBox.handleSaltJobProgEvent(tag, data);
      } else if (tag.startsWith("syndic/")) {
        Router.keysPage.handleSyndicEvent();
      }

      Router.eventsPage.handleAnyEvent(tag, data);
    };
  }
}
