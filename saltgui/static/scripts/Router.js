/* global document window */

import {API} from "./Api.js";
import {BeaconsMinionPage} from "./pages/BeaconsMinion.js";
import {BeaconsPage} from "./pages/Beacons.js";
import {Character} from "./Character.js";
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
    Character.init();

    this.api = new API();
    this.api.router = this;
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

    this._registerRouterEventListeners();

    this.updateMainMenu();

    const hash = window.location.hash.replace(/^#/, "");
    const search = window.location.search;
    /* eslint-disable compat/compat */
    /* URLSearchParams.entries() is not supported in IE 11 */
    /* URLSearchParams is not supported in op_mini all, IE 11, Baidu 7.12 */
    this.goTo(hash, Object.fromEntries(new URLSearchParams(search)));
    /* eslint-enable compat/compat */
  }

  _registerMenuItem (pButtonId, pHash) {
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
          this.goTo(pHash);
        });
    }
  }

  _registerRouterEventListeners () {
    document.getElementById("logo").
      addEventListener("click", () => {
        if (window.event.ctrlKey) {
          this.goTo("options");
        } else {
          this.goTo("");
        }
      });

    addEventListener("popstate", (popstate) => {
      const hash = popstate.target.location.hash.replace(/^#/, "");
      const search = popstate.target.location.search;
      /* eslint-disable compat/compat */
      /* URLSearchParams.entries() is not supported in IE 11 */
      /* URLSearchParams is not supported in op_mini all, IE 11, Baidu 7.12 */
      this.goTo(hash, Object.fromEntries(new URLSearchParams(search)), 2);
      /* eslint-enable compat/compat */
    });

    this._registerMenuItem("minions", "");
    this._registerMenuItem("grains", "grains");
    this._registerMenuItem("schedules", "schedules");
    this._registerMenuItem("pillars", "pillars");
    this._registerMenuItem("beacons", "beacons");
    this._registerMenuItem("keys", "keys");
    this._registerMenuItem("jobs", "jobs");
    this._registerMenuItem("templates", "templates");
    this._registerMenuItem("events", "eventsview");
    this._registerMenuItem("reactors", "reactors");
    this._registerMenuItem("logout", "logout");
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

  // pForward = 0 --> normal navigation
  // pForward = 1 --> back navigation using regular gui
  // pForward = 2 --> back navigation using browser
  goTo (pHash, pQuery = {}, pForward = 0) {

    if (Utils.getStorageItem("session", "login-response") === null) {
      // the fact that we don't have a session will be caught later
      // but this was shows less error messages on the console
      pHash = "login";
      pQuery = {"reason": "no-session"};
    }

    // save the details from the parent
    const parentHash = document.location.hash.replace(/^#/, "");
    const search = window.location.search;
    /* eslint-disable compat/compat */
    /* URLSearchParams.entries() is not supported in IE 11 */
    /* URLSearchParams is not supported in op_mini all, IE 11, Baidu 7.12 */
    const parentQuery = Object.fromEntries(new URLSearchParams(search));
    /* eslint-enable compat/compat */

    for (const route of this.pages) {
      if (route.path !== pHash) {
        continue;
      }
      // push history state, so that the address bar holds the correct
      // deep-link; and so that we can use the back-button
      let url = "/";
      let sep = "?";
      for (const key in pQuery) {
        const value = pQuery[key];
        if (!value || value === "undefined") {
          continue;
        }
        url += sep + key + "=" + encodeURIComponent(value);
        sep = "&";
      }
      url += "#" + pHash;
      if (pForward === 0) {
        // forward navigation
        window.history.pushState({}, undefined, url);
        route.parentHash = parentHash;
        route.parentQuery = parentQuery;
      } else if (pForward === 1) {
        // close-icon on a panel
        // do not save parent details
        // these were already registered on the way forward
        window.history.pushState({}, undefined, url);
      } else if (pForward === 2) {
        // backward navigation from browser
        // do nothing extra
      }
      this._showPage(route);
      return;
    }
    // route could not be found
    // just go to the main page
    if (pHash === "") {
      console.log("cannot find default page");
      return;
    }
    this.goTo("");
  }

  _showPage (pPage) {
    pPage.clearPage();

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

    pPage.onShow();

    // start the event-pipe (again)
    // it is either not started, or needs restarting
    API.getEvents(this);

    if (this.currentPage && this.currentPage !== pPage) {
      Router._hidePage(this.currentPage);
    }
    this.currentPage = pPage;

    this.currentPage.pageElement.classList.add("current");
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
