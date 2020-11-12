/* global config document window */

import {API} from "./Api.js";
import {BeaconsMinionPage} from "./pages/BeaconsMinion.js";
import {BeaconsPage} from "./pages/Beacons.js";
import {CommandBox} from "./CommandBox.js";
import {EventsPage} from "./pages/Events.js";
import {GrainsMinionPage} from "./pages/GrainsMinion.js";
import {GrainsPage} from "./pages/Grains.js";
import {JobPage} from "./pages/Job.js";
import {JobsPage} from "./pages/Jobs.js";
import {KeysPage} from "./pages/Keys.js";
import {LoginPage} from "./pages/Login.js";
import {MinionsPage} from "./pages/Minions.js";
import {OptionsPage} from "./pages/Options.js";
import {PillarsMinionPage} from "./pages/PillarsMinion.js";
import {PillarsPage} from "./pages/Pillars.js";
import {SchedulesMinionPage} from "./pages/SchedulesMinion.js";
import {SchedulesPage} from "./pages/Schedules.js";
import {TemplatesPage} from "./pages/Templates.js";
import {Utils} from "./Utils.js";

export class Router {

  constructor () {
    this.api = new API();
    this.commandbox = new CommandBox(this, this.api);
    this.currentPage = undefined;
    this.pages = [];

    this._registerPage(new LoginPage(this));
    this._registerPage(new MinionsPage(this));
    this._registerPage(this.keysPage = new KeysPage(this));
    this._registerPage(new GrainsPage(this));
    this._registerPage(new GrainsMinionPage(this));
    this._registerPage(new SchedulesPage(this));
    this._registerPage(new SchedulesMinionPage(this));
    this._registerPage(new PillarsPage(this));
    this._registerPage(new PillarsMinionPage(this));
    this._registerPage(new BeaconsPage(this));
    this._registerPage(this.beaconsMinionPage = new BeaconsMinionPage(this));
    this._registerPage(this.jobPage = new JobPage(this));
    this._registerPage(new JobsPage(this));
    this._registerPage(new TemplatesPage(this));
    this._registerPage(this.eventsPage = new EventsPage(this));
    this._registerPage(new OptionsPage(this));

    // show template menu item if templates defined
    const templatesText = Utils.getStorageItem("session", "templates", "");
    if (templatesText) {
      const item1 = document.getElementById("button-templates1");
      item1.classList.remove("menu-item-hidden");
      const item2 = document.getElementById("button-templates2");
      item2.classList.remove("menu-item-hidden");
    }

    this._registerRouterEventListeners();

    Router.updateMainMenu();

    // This URL already has its prefix added
    // therefore is must not be added again
    this.goTo(window.location.pathname + window.location.search, true);
  }

  static _registerMenuItem (pButtonId, pUrl) {
    document.getElementById("button-" + pButtonId + "1").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + pUrl);
      });
    document.getElementById("button-" + pButtonId + "2").
      addEventListener("click", () => {
        window.location.replace(config.NAV_URL + pUrl);
      });
  }

  _registerRouterEventListeners () {
    document.getElementById("logo").
      addEventListener("click", () => {
        if (window.event.ctrlKey) {
          window.location.assign(config.NAV_URL + "/options");
        } else {
          window.location.assign(config.NAV_URL + "/");
        }
      });

    Router._registerMenuItem("minions", "/");
    Router._registerMenuItem("grains", "/grains");
    Router._registerMenuItem("schedules", "/schedules");
    Router._registerMenuItem("pillars", "/pillars");
    Router._registerMenuItem("beacons", "/beacons");
    Router._registerMenuItem("keys", "/keys");
    Router._registerMenuItem("jobs", "/jobs");
    Router._registerMenuItem("templates", "/templates");
    Router._registerMenuItem("events", "/eventsview");

    document.getElementById("button-logout1").
      addEventListener("click", () => {
        this.api.logout().then(() => {
          window.location.replace(config.NAV_URL + "/login?reason=logout");
          return true;
        });
      });
    document.getElementById("button-logout2").
      addEventListener("click", () => {
        this.api.logout().then(() => {
          window.location.replace(config.NAV_URL + "/login?reason=logout");
          return false;
        });
      });

    // don't verify for invalid sessions too often
    // this happens only when the server was reset
    window.setInterval(() => {
      this._logoutTimer();
    }, 60000);

    // verify often for an expired session that we expect
    window.setInterval(() => {
      this._updateSessionTimeoutWarning();
    }, 1000);
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
        return true;
      }, () => {
        window.location.replace(config.NAV_URL + "/login?reason=expired-session");
        return false;
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
    wheelConfigValuesPromise.then(() => true, () => {
      this.api.logout().then(() => {
        window.location.replace(config.NAV_URL + "/login?reason=no-session");
        return false;
      });
    });
  }

  _registerPage (pPage) {
    this.pages.push(pPage);
    if (pPage.onRegister) {
      pPage.onRegister();
    }
  }

  static updateMainMenu () {
    // show template menu item if templates defined
    const templatesText = Utils.getStorageItem("session", "templates", "");
    if (templatesText) {
      const item1 = document.getElementById("button-templates1");
      item1.classList.remove("menu-item-hidden");
      const item2 = document.getElementById("button-templates2");
      item2.classList.remove("menu-item-hidden");
    }
  }

  goTo (pPath, hasPathPrefix = false) {
    if (this.switchingPage) {
      return;
    }
    if (window.location.pathname === config.NAV_URL + pPath && this.currentPage) {
      return;
    }
    if (pPath === "/" && Utils.getStorageItem("session", "login-response") === null) {
      // the fact that we don't have a session will be caught later
      // but this was shows less error messages on the console
      pPath = "/login";
    }
    const pathUrl = (hasPathPrefix ? "" : config.NAV_URL) + pPath.split("?")[0];
    for (const route of this.pages) {
      if (!route.path.test(pathUrl)) {
        continue;
      }
      // push history state for login (including redirect to /)
      if (pathUrl === config.NAV_URL + "/login" || pathUrl === config.NAV_URL + "/") {
        window.history.pushState({}, undefined, pPath);
      }
      this._showPage(route);
      return;
    }
    // route could not be found
    // just go to the main page
    this.goTo("/");
  }

  _showPage (pPage) {
    pPage.pageElement.style.display = "";

    const activeMenuItems = Array.from(document.querySelectorAll(".menu-item-active"));
    activeMenuItems.forEach((menuItem) => {
      menuItem.classList.remove("menu-item-active");
    });

    const elem1 = pPage.menuItemElement1;
    if (elem1) {
      elem1.classList.add("menu-item-active");
      // activate also parent menu item if child element is selected
      if (elem1.id === "button-pillars1" ||
         elem1.id === "button-schedules1" ||
         elem1.id === "button-grains1" ||
         elem1.id === "button-beacons1") {
        const minionMenuItem = document.getElementById("button-minions1");
        minionMenuItem.classList.add("menu-item-active");
      }
      if (elem1.id === "button-jobs1" ||
         elem1.id === "button-templates1") {
        const jobsMenuItem = document.getElementById("button-jobs1");
        jobsMenuItem.classList.add("menu-item-active");
      }
    }

    const elem2 = pPage.menuItemElement2;
    if (elem2) {
      elem2.classList.add("menu-item-active");
    }

    this.switchingPage = true;

    pPage.onShow();

    // start the event-pipe (again)
    // it is either not started, or needs restarting
    API.getEvents(this);

    if (this.currentPage) {
      Router._hidePage(this.currentPage);
    }

    this.currentPage = pPage;
    this.currentPage.pageElement.classList.add("current");
    this.switchingPage = false;
  }

  static _hidePage (pPage) {
    const page = pPage.pageElement;
    page.classList.remove("current");
    // 500ms matches the timeout in main.css (.route)
    window.setTimeout(() => {
      // Hide element after fade, so it does not expand the body
      page.style.display = "none";
    }, 500);
    if (pPage.onHide) {
      pPage.onHide();
    }
  }
}
