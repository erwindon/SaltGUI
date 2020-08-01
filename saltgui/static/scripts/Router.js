/* global config document window */

import {API} from "./Api.js";
import {BeaconsMinionRoute} from "./routes/BeaconsMinion.js";
import {BeaconsRoute} from "./routes/Beacons.js";
import {CommandBox} from "./CommandBox.js";
import {EventsRoute} from "./routes/Events.js";
import {GrainsMinionRoute} from "./routes/GrainsMinion.js";
import {GrainsRoute} from "./routes/Grains.js";
import {JobRoute} from "./routes/Job.js";
import {JobsRoute} from "./routes/Jobs.js";
import {KeysRoute} from "./routes/Keys.js";
import {LoginRoute} from "./routes/Login.js";
import {MinionsRoute} from "./routes/Minions.js";
import {OptionsRoute} from "./routes/Options.js";
import {PillarsMinionRoute} from "./routes/PillarsMinion.js";
import {PillarsRoute} from "./routes/Pillars.js";
import {SchedulesMinionRoute} from "./routes/SchedulesMinion.js";
import {SchedulesRoute} from "./routes/Schedules.js";
import {TemplatesRoute} from "./routes/Templates.js";
import {Utils} from "./Utils.js";

export class Router {

  constructor () {
    this._logoutTimer = this._logoutTimer.bind(this);
    this._updateSessionTimeoutWarning = this._updateSessionTimeoutWarning.bind(this);

    this.api = new API();
    this.commandbox = new CommandBox(this.api);
    this.currentRoute = undefined;
    this.routes = [];

    this._registerRoute(new LoginRoute(this));
    this._registerRoute(new MinionsRoute(this));
    this._registerRoute(this.keysRoute = new KeysRoute(this));
    this._registerRoute(new GrainsRoute(this));
    this._registerRoute(new GrainsMinionRoute(this));
    this._registerRoute(new SchedulesRoute(this));
    this._registerRoute(new SchedulesMinionRoute(this));
    this._registerRoute(new PillarsRoute(this));
    this._registerRoute(new PillarsMinionRoute(this));
    this._registerRoute(new BeaconsRoute(this));
    this._registerRoute(this.beaconsMinionRoute = new BeaconsMinionRoute(this));
    this._registerRoute(this.jobRoute = new JobRoute(this));
    this._registerRoute(new JobsRoute(this));
    this._registerRoute(new TemplatesRoute(this));
    this._registerRoute(this.eventsRoute = new EventsRoute(this));
    this._registerRoute(new OptionsRoute(this));

    // show template menu item if templates defined
    const templatesText = Utils.getStorageItem("session", "templates", "");
    if (templatesText) {
      const item1 = document.getElementById("button-templates1");
      item1.style.display = "inline-block";
      const item2 = document.getElementById("button-templates2");
      item2.style.display = "inline-block";
    }

    this._registerRouterEventListeners();

    // This URL already has its prefix added
    // therefore is must not be added again
    this.goTo(window.location.pathname + window.location.search, true);
  }

  _registerRouterEventListeners () {
    document.getElementById("logo").
      addEventListener("click", () => {
        if (window.location.pathname === config.NAV_URL + "/login") {
          return;
        }
        if (window.event.ctrlKey) {
          window.location.assign(config.NAV_URL + "/options");
        } else {
          window.location.assign(config.NAV_URL + "/");
        }
      });

    document.getElementById("button-minions1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/");
      });
    document.getElementById("button-minions2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/");
      });

    document.getElementById("button-grains1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/grains");
      });
    document.getElementById("button-grains2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/grains");
      });

    document.getElementById("button-schedules1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/schedules");
      });
    document.getElementById("button-schedules2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/schedules");
      });

    document.getElementById("button-pillars1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/pillars");
      });
    document.getElementById("button-pillars2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/pillars");
      });

    document.getElementById("button-beacons1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/beacons");
      });
    document.getElementById("button-beacons2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/beacons");
      });

    document.getElementById("button-keys1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/keys");
      });
    document.getElementById("button-keys2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/keys");
      });

    document.getElementById("button-jobs1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/jobs");
      });
    document.getElementById("button-jobs2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/jobs");
      });

    document.getElementById("button-templates1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/templates");
      });
    document.getElementById("button-templates2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/templates");
      });

    document.getElementById("button-events1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/eventsview");
      });
    document.getElementById("button-events2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + "/eventsview");
      });

    document.getElementById("button-logout1").
      addEventListener("click", () => {
        this.api.logout().then(() => {
          window.location.replace(config.NAV_URL + "/login?reason=logout");
        });
      });
    document.getElementById("button-logout2").
      addEventListener("click", () => {
        this.api.logout().then(() => {
          window.location.replace(config.NAV_URL + "/login?reason=logout");
        });
      });

    // don't verify for invalid sessions too often
    // this happens only when the server was reset
    window.setInterval(this._logoutTimer, 60000);

    // verify often for an expired session that we expect
    window.setInterval(this._updateSessionTimeoutWarning, 1000);
  }

  _updateSessionTimeoutWarning () {
    const warning = document.getElementById("warning");

    const loginResponseStr = Utils.getStorageItem("session", "login-response", "{}");
    const loginResponse = JSON.parse(loginResponseStr);

    const expireValue = loginResponse.expire;
    if (!expireValue) {
      warning.style.display = "none";
      return;
    }

    const leftMillis = expireValue * 1000 - Date.now();

    if (leftMillis <= 0) {
      warning.style.display = "";
      warning.innerText = "Logout";
      // logout, and redirect to login screen
      this.api.logout().then(() => {
        window.location.replace(config.NAV_URL + "/login?reason=expired-session");
      }, () => {
        window.location.replace(config.NAV_URL + "/login?reason=expired-session");
      });
      return;
    }

    if (leftMillis > 60000) {
      // warn in the last minute
      warning.style.display = "none";
      warning.innerText = "";
      return;
    }

    warning.style.display = "";
    const left = new Date(leftMillis).toISOString();
    if (left.startsWith("1970-01-01T")) {
      // remove the date prefix and the millisecond suffix
      warning.innerText = "Session expires in " + left.substr(11, 8);
    } else {
      // stupid fallback
      warning.innerText = "Session expires in " + leftMillis + " milliseconds";
    }
  }

  _logoutTimer () {
    // are we logged in?
    const token = Utils.getStorageItem("session", "token");
    if (!token) {
      return;
    }

    // just a random lightweight api call
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();
    // don't act in the callbacks
    // Api.apiRequest will do all the work
    wheelConfigValuesPromise.then(() => {
      // VOID
    }, () => {
      this.api.logout().then(() => {
        window.location.replace(config.NAV_URL + "/login?reason=no-session");
      });
    });
  }

  _registerRoute (pRoute) {
    this.routes.push(pRoute);
    if (pRoute.onRegister) {
      pRoute.onRegister();
    }
  }

  goTo (pPath, hasPathPrefix = false) {
    if (this.switchingRoute) {
      return;
    }
    if (window.location.pathname === config.NAV_URL + pPath && this.currentRoute) {
      return;
    }
    if (pPath === "/" && Utils.getStorageItem("session", "login-response") === null) {
      // the fact that we don't have a session will be caught later
      // but this was shows less error messages on the console
      pPath = "/login";
    }
    const pathUrl = (hasPathPrefix ? "" : config.NAV_URL) + pPath.split("?")[0];
    for (const route of this.routes) {
      if (!route.getPath().test(pathUrl)) {
        continue;
      }
      // push history state for login (including redirect to /)
      if (pathUrl === config.NAV_URL + "/login" || pathUrl === config.NAV_URL + "/") {
        window.history.pushState({}, undefined, pPath);
      }
      this._showRoute(route);
      return;
    }
    // route could not be found
    // just go to the main page
    this.goTo("/");
  }

  _showRoute (pRoute) {
    const that = this;

    pRoute.getPageElement().style.display = "";

    const minionMenuItem = document.getElementById("button-minions1");
    const jobsMenuItem = document.getElementById("button-jobs1");

    const activeMenuItems = Array.from(document.querySelectorAll(".menu-item-active"));
    activeMenuItems.forEach((menuItem) => {
      menuItem.classList.remove("menu-item-active");
    });

    const elem1 = pRoute.getMenuItemElement1();
    if (elem1) {
      elem1.classList.add("menu-item-active");
      // activate also parent menu item if child element is selected
      if (elem1.id === "button-pillars1" ||
         elem1.id === "button-schedules1" ||
         elem1.id === "button-grains1" ||
         elem1.id === "button-beacons1") {
        minionMenuItem.classList.add("menu-item-active");
      }
      if (elem1.id === "button-jobs1" ||
         elem1.id === "button-templates1") {
        jobsMenuItem.classList.add("menu-item-active");
      }
    }

    const elem2 = pRoute.getMenuItemElement2();
    if (elem2) {
      elem2.classList.add("menu-item-active");
    }

    this.switchingRoute = true;

    pRoute.onShow();

    // start the event-pipe (again)
    // it is either not started, or needs restarting
    this.api.getEvents(this);

    if (that.currentRoute) {
      that._hideRoute(that.currentRoute);
    }

    that.currentRoute = pRoute;
    that.currentRoute.getPageElement().classList.add("current");
    that.switchingRoute = false;
  }

  _hideRoute (pRoute) {
    const page = pRoute.getPageElement();
    page.classList.remove("current");
    // 500ms matches the timeout in main.css (.route)
    window.setTimeout(() => {
      // Hide element after fade, so it does not expand the body
      page.style.display = "none";
    }, 500);
    if (pRoute.onHide) {
      pRoute.onHide();
    }
  }

}
