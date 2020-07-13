import {API} from './Api.js';
import {BeaconsMinionRoute} from './routes/BeaconsMinion.js';
import {BeaconsRoute} from './routes/Beacons.js';
import {CommandBox} from './CommandBox.js';
import {EventsRoute} from './routes/Events.js';
import {GrainsMinionRoute} from './routes/GrainsMinion.js';
import {GrainsRoute} from './routes/Grains.js';
import {JobRoute} from './routes/Job.js';
import {JobsRoute} from './routes/Jobs.js';
import {KeysRoute} from './routes/Keys.js';
import {LoginRoute} from './routes/Login.js';
import {MinionsRoute} from './routes/Minions.js';
import {OptionsRoute} from './routes/Options.js';
import {PillarsMinionRoute} from './routes/PillarsMinion.js';
import {PillarsRoute} from './routes/Pillars.js';
import {SchedulesMinionRoute} from './routes/SchedulesMinion.js';
import {SchedulesRoute} from './routes/Schedules.js';
import {TemplatesRoute} from './routes/Templates.js';

export class Router {

  constructor() {
    this._logoutTimer = this._logoutTimer.bind(this);

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
    const templatesText = window.sessionStorage.getItem("templates");
    if(templatesText && templatesText !== "undefined") {
      const item1 = document.querySelector("#button-templates1");
      item1.style.display = "inline-block";
      const item2 = document.querySelector("#button-templates2");
      item2.style.display = "inline-block";
    }

    this._registerRouterEventListeners();

    // This URL already has its prefix added
    // therefore is must not be added again
    this.goTo(window.location.pathname + window.location.search, true);
  }

  _registerRouterEventListeners() {
    document.querySelector(".logo")
      .addEventListener("click", pClickEvent => {
        if(window.location.pathname === config.NAV_URL + "/login") return;
        if(window.event.ctrlKey) {
          window.location.assign(config.NAV_URL + "/options");
        } else {
          window.location.assign(config.NAV_URL + "/");
        }
      });

    document.querySelector("#button-minions1")
      .addEventListener("click", pClickEvent =>
        window.location.replace(config.NAV_URL + "/")
      );
    document.querySelector("#button-minions2")
      .addEventListener("click", pClickEvent =>
        window.location.replace(config.NAV_URL + "/")
      );

    document.querySelector("#button-grains1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/grains")
      );
    document.querySelector("#button-grains2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/grains")
      );

    document.querySelector("#button-schedules1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/schedules")
      );
    document.querySelector("#button-schedules2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/schedules")
      );

    document.querySelector("#button-pillars1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/pillars")
      );
    document.querySelector("#button-pillars2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/pillars")
      );

    document.querySelector("#button-beacons1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/beacons")
      );
    document.querySelector("#button-beacons2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/beacons")
      );

    document.querySelector("#button-keys1")
      .addEventListener("click", pClickEvent =>
        window.location.replace(config.NAV_URL + "/keys")
      );
    document.querySelector("#button-keys2")
      .addEventListener("click", pClickEvent =>
        window.location.replace(config.NAV_URL + "/keys")
      );

    document.querySelector("#button-jobs1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/jobs")
      );
    document.querySelector("#button-jobs2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/jobs")
      );

    document.querySelector("#button-templates1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/templates")
      );
    document.querySelector("#button-templates2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/templates")
      );

    document.querySelector("#button-events1")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/eventsview")
      );
    document.querySelector("#button-events2")
      .addEventListener('click', pClickEvent =>
        window.location.replace(config.NAV_URL + "/eventsview")
      );

    document.querySelector("#button-logout1")
      .addEventListener("click", pClickEvent => {
        this.api.logout().then(
          pLogoutData => window.location.replace(config.NAV_URL + "/login?reason=logout"));
      });
    document.querySelector("#button-logout2")
      .addEventListener("click", pClickEvent => {
        this.api.logout().then(
          pLogoutData => window.location.replace(config.NAV_URL + "/login?reason=logout"));
      });

    // don't verify the session too often
    setInterval(this._logoutTimer, 60000);
  }

  _logoutTimer() {
    // are we logged in?
    const token = window.sessionStorage.getItem("token");
    if(!token) return;

    // just a random lightweight api call
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();
    // don't act in the callbacks
    // Api.apiRequest will do all the work
    wheelConfigValuesPromise.then(pWheelConfigValuesData => {
      // VOID
    }, pWheelConfigValuesMsg => {
      // VOID
    });
  }

  _registerRoute(pRoute) {
    this.routes.push(pRoute);
    if(pRoute.onRegister) pRoute.onRegister();
  }

  goTo(pPath, hasPathPrefix=false) {
    if(this.switchingRoute) return;
    if(window.location.pathname === config.NAV_URL + pPath && this.currentRoute) return;
    const pathUrl = (hasPathPrefix ? "" : config.NAV_URL) + pPath.split("?")[0];
    for(const route of this.routes) {
      if(!route.getPath().test(pathUrl)) continue;
      // push history state for login (including redirect to /)
      if(pathUrl === config.NAV_URL + "/login" || pathUrl === config.NAV_URL + "/") {
        window.history.pushState({}, undefined, pathUrl);
      }
      this._showRoute(route);
      return;
    }
    // route could not be found
    // just go to the main page
    this.goTo("/");
  }

  _showRoute(pRoute) {
    const myThis = this;

    pRoute.getPageElement().style.display = "";

    const minionMenuItem = document.getElementById("button-minions1");
    const jobsMenuItem = document.getElementById("button-jobs1");

    const activeMenuItems = Array.from(document.querySelectorAll(".menu-item-active"));
    activeMenuItems.forEach(
      function (e){ e.classList.remove("menu-item-active"); }
    );

    const elem1 = pRoute.getMenuItemElement1();
    if(elem1) {
      elem1.classList.add("menu-item-active");
      // activate also parent menu item if child element is selected
      if(elem1.id === "button-pillars1" ||
         elem1.id === "button-schedules1" ||
         elem1.id === "button-grains1" ||
         elem1.id === "button-beacons1") {
        minionMenuItem.classList.add("menu-item-active");
      }
      if(elem1.id === "button-jobs1" ||
         elem1.id === "button-templates1") {
        jobsMenuItem.classList.add("menu-item-active");
      }
    }

    const elem2 = pRoute.getMenuItemElement2();
    if(elem2) {
      elem2.classList.add("menu-item-active");
    }

    this.switchingRoute = true;

    pRoute.onShow();

    // start the event-pipe (again)
    // it is either not started, or needs restarting
    this.api.getEvents(this);

    if(myThis.currentRoute) {
      myThis._hideRoute(myThis.currentRoute);
    }

    myThis.currentRoute = pRoute;
    myThis.currentRoute.getPageElement().classList.add("current");
    myThis.switchingRoute = false;
  }

  _hideRoute(pRoute) {
    const page = pRoute.getPageElement();
    page.classList.remove("current");
    // 500ms matches the timeout in main.css (.route)
    setTimeout(function() {
      // Hide element after fade, so it does not expand the body
      page.style.display = "none";
    }, 500);
    if(pRoute.onHide) pRoute.onHide();
  }

}
