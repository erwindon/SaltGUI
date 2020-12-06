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
import {LogoutPage} from "./pages/Logout.js";
import {MinionsPage} from "./pages/Minions.js";
import {OptionsPage} from "./pages/Options.js";
import {PillarsMinionPage} from "./pages/PillarsMinion.js";
import {PillarsPage} from "./pages/Pillars.js";
import {ReactorsPage} from "./pages/Reactors.js";
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
    this._registerPage(this.minionsPage = new MinionsPage(this));
    this._registerPage(this.keysPage = new KeysPage(this));
    this._registerPage(this.grainsPage = new GrainsPage(this));
    this._registerPage(this.grainsMinionPage = new GrainsMinionPage(this));
    this._registerPage(this.schedulesPage = new SchedulesPage(this));
    this._registerPage(this.schedulesMinionPage = new SchedulesMinionPage(this));
    this._registerPage(this.pillarsPage = new PillarsPage(this));
    this._registerPage(this.pillarsMinionPage = new PillarsMinionPage(this));
    this._registerPage(this.beaconsPage = new BeaconsPage(this));
    this._registerPage(this.beaconsMinionPage = new BeaconsMinionPage(this));
    this._registerPage(this.jobPage = new JobPage(this));
    this._registerPage(this.jobsPage = new JobsPage(this));
    this._registerPage(this.templatesPage = new TemplatesPage(this));
    this._registerPage(this.eventsPage = new EventsPage(this));
    this._registerPage(this.reactorsPage = new ReactorsPage(this));
    this._registerPage(this.optionsPage = new OptionsPage(this));
    this._registerPage(new LogoutPage(this));

    Router._registerRouterEventListeners();

    this.updateMainMenu();

    // This URL already has its prefix added
    // therefore is must not be added again
    this.goTo(window.location.pathname + window.location.search, true);
  }

  static _registerMenuItem (pButtonId, pUrl) {
    for (const nr of ["1", "2"]) {
      document.getElementById("button-" + pButtonId + nr).
        addEventListener("click", (pClickEvent) => {
          const panel = pClickEvent.target.parentElement;
          if (panel.classList.contains("dropdown-content")) {
            // temporarily hide the panel, won't be visible again
            // after 500ms because the mouseover caused it to show
            // also clicking toplevel button cannot do the same
            panel.style.display = "none";
            setTimeout(() => {
              panel.style.display = "";
            }, 500);
          }
          window.location.replace(config.NAV_URL + pUrl);
        });
    }
  }

  static _registerRouterEventListeners () {
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
    Router._registerMenuItem("reactors", "/reactors");
    Router._registerMenuItem("logout", "/logout");
  }

  _registerPage (pPage) {
    this.pages.push(pPage);
    if (pPage.onRegister) {
      pPage.onRegister();
    }
  }

  updateMainMenu () {
    for (const page of this.pages) {
      const visible = page.constructor.isVisible();
      for (const item of [page.menuItemElement1, page.menuItemElement2]) {
        if (!item) {
          // This page does not have a menu item
          // e.g. login-page or grains-minion page
        } else if (visible) {
          item.classList.remove("menu-item-hidden");
        } else {
          item.classList.add("menu-item-hidden");
        }
      }
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
      if (elem1.id === "button-events1" ||
         elem1.id === "button-reactors1") {
        const eventsMenuItem = document.getElementById("button-events1");
        eventsMenuItem.classList.add("menu-item-active");
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
