import {API} from './Api.js';
import {BeaconsMinionRoute} from './routes/BeaconsMinion.js';
import {BeaconsRoute} from './routes/Beacons.js';
import {CommandBox} from './CommandBox.js';
import {GrainsMinionRoute} from './routes/GrainsMinion.js';
import {GrainsRoute} from './routes/Grains.js';
import {JobRoute} from './routes/Job.js';
import {JobsRoute} from './routes/Jobs.js';
import {KeysRoute} from './routes/Keys.js';
import {LoginRoute} from './routes/Login.js';
import {MinionsRoute} from './routes/Minions.js';
import {PillarsMinionRoute} from './routes/PillarsMinion.js';
import {PillarsRoute} from './routes/Pillars.js';
import {SchedulesMinionRoute} from './routes/SchedulesMinion.js';
import {SchedulesRoute} from './routes/Schedules.js';
import {TemplatesRoute} from './routes/Templates.js';

export class Router {

  constructor() {
    this.api = new API(this);
    this.commandbox = new CommandBox(this.api);
    this.currentRoute = undefined;
    this.routes = [];

    this.registerRoute(new LoginRoute(this));
    this.registerRoute(new MinionsRoute(this));
    this.registerRoute(this.keysRoute = new KeysRoute(this));
    this.registerRoute(new GrainsRoute(this));
    this.registerRoute(new GrainsMinionRoute(this));
    this.registerRoute(new SchedulesRoute(this));
    this.registerRoute(new SchedulesMinionRoute(this));
    this.registerRoute(new PillarsRoute(this));
    this.registerRoute(new PillarsMinionRoute(this));
    this.registerRoute(new BeaconsRoute(this));
    this.registerRoute(this.beaconsMinionRoute = new BeaconsMinionRoute(this));
    this.registerRoute(new JobRoute(this));
    this.registerRoute(new JobsRoute(this));
    this.registerRoute(new TemplatesRoute(this));

    // show template menu item if templates defined
    const templatesText = window.localStorage.getItem("templates");
    if(templatesText && templatesText !== "undefined") {
      const item1 = document.querySelector("#button-templates1");
      item1.style.display = "inline-block";
      const item2 = document.querySelector("#button-templates2");
      item2.style.display = "inline-block";
    }

    this._registerEventListeners();

    this.api.isAuthenticated()
      .then(valid_session => this.goTo(
        valid_session ? window.location.pathname + window.location.search : "/login"))
      .catch(error => {
        console.error(error);
        this.goTo("/login");
      });
  }

  _registerEventListeners() {
    document.querySelector(".logo")
      .addEventListener("click", _ => {
        if(window.location.pathname === "/login") return;
        this.goTo("/");
      });

    document.querySelector("#button-minions1")
      .addEventListener("click", _ => {
        window.location.replace("/");
      });
    document.querySelector("#button-minions2")
      .addEventListener("click", _ => {
        window.location.replace("/");
      });

    document.querySelector("#button-grains1")
      .addEventListener('click', _ => {
        window.location.replace("/grains");
      });
    document.querySelector("#button-grains2")
      .addEventListener('click', _ => {
        window.location.replace("/grains");
      });

    document.querySelector("#button-schedules1")
      .addEventListener('click', _ => {
        window.location.replace("/schedules");
      });
    document.querySelector("#button-schedules2")
      .addEventListener('click', _ => {
        window.location.replace("/schedules");
      });

    document.querySelector("#button-pillars1")
      .addEventListener('click', _ => {
        window.location.replace("/pillars");
      });
    document.querySelector("#button-pillars2")
      .addEventListener('click', _ => {
        window.location.replace("/pillars");
      });

    document.querySelector("#button-beacons1")
      .addEventListener('click', _ => {
        window.location.replace("/beacons");
      });
    document.querySelector("#button-beacons2")
      .addEventListener('click', _ => {
        window.location.replace("/beacons");
      });

    document.querySelector("#button-keys1")
      .addEventListener("click", _ => {
        window.location.replace("/keys");
      });
    document.querySelector("#button-keys2")
      .addEventListener("click", _ => {
        window.location.replace("/keys");
      });

    document.querySelector("#button-jobs1")
      .addEventListener('click', _ => {
        window.location.replace("/jobs");
      });
    document.querySelector("#button-jobs2")
      .addEventListener('click', _ => {
        window.location.replace("/jobs");
      });

    document.querySelector("#button-templates1")
      .addEventListener('click', _ => {
        window.location.replace("/templates");
      });
    document.querySelector("#button-templates2")
      .addEventListener('click', _ => {
        window.location.replace("/templates");
      });

    document.querySelector("#button-logout1")
      .addEventListener("click", _ => {
        this.api.logout().then(() => {
          window.location.replace("/");
        });
      });
    document.querySelector("#button-logout2")
      .addEventListener("click", _ => {
        this.api.logout().then(() => {
          window.location.replace("/");
        });
      });
  }

  registerRoute(route) {
    this.routes.push(route);
    if(route.onRegister) route.onRegister();
  }

  goTo(path) {
    if(this.switchingRoute) return;
    if(window.location.pathname === path && this.currentRoute) return;
    for(const route of this.routes) {
      if(!route.getPath().test(path.split("?")[0])) continue;
      // push history state for login (including redirect to /)
      if(path === "/login" || path === "/") window.history.pushState({}, undefined, path);
      this.showRoute(route);
      return;
    }
  }

  showRoute(route) {
    const myThis = this;

    route.getPageElement().style.display = "";

    const minionMenuItem = document.getElementById("button-minions1");
    const jobsMenuItem = document.getElementById("button-jobs1");

    Array.from(document.querySelectorAll(".menu-item-active")).forEach(
      function (e){ e.classList.remove("menu-item-active"); }
    );

    const elem1 = route.getMenuItemElement1();
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

    const elem2 = route.getMenuItemElement2();
    if(elem2) {
      elem2.classList.add("menu-item-active");
    }

    this.switchingRoute = true;

    const afterLoad = function(route) {
      if(myThis.currentRoute !== undefined) {
        myThis.hideRoute(myThis.currentRoute);
      }

      myThis.currentRoute = route;
      document.title = "SaltGUI - " + myThis.currentRoute.getName();
      myThis.currentRoute.getPageElement().className = "route current";
      myThis.switchingRoute = false;
    };

    let response;
    if(route.onShow) response = route.onShow();

    if(response && response.then) response.then(afterLoad(route));
    else afterLoad(route);
  }

  hideRoute(route) {
    route.getPageElement().className = "route";
    setTimeout(function() {
      // Hide element after fade, so it does not expand the body
      route.getPageElement().style.display = "none";
    }, 500);
    if(route.onHide) route.onHide();
  }

}
