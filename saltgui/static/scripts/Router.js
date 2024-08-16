/* global config */

import {API} from "./Api.js";
import {BeaconsMinionPage} from "./pages/BeaconsMinion.js";
import {BeaconsPage} from "./pages/Beacons.js";
import {Character} from "./Character.js";
import {CommandBox} from "./CommandBox.js";
import {EventsPage} from "./pages/Events.js";
import {GrainsMinionPage} from "./pages/GrainsMinion.js";
import {GrainsPage} from "./pages/Grains.js";
import {HighStatePage} from "./pages/HighState.js";
import {IssuesPage} from "./pages/Issues.js";
import {JobPage} from "./pages/Job.js";
import {JobsPage} from "./pages/Jobs.js";
import {KeysPage} from "./pages/Keys.js";
import {LoginPage} from "./pages/Login.js";
import {LogoutPage} from "./pages/Logout.js";
import {MinionsPage} from "./pages/Minions.js";
import {NodegroupsPage} from "./pages/Nodegroups.js";
import {OptionsPage} from "./pages/Options.js";
import {OrchestrationsPage} from "./pages/Orchestrations.js";
import {Output} from "./output/Output.js";
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
    Output.router = this;
    this.commandbox = new CommandBox(this, this.api);
    this.pages = [];
    Router.currentPage = undefined;

    this._registerPage(new LoginPage(this));
    this._registerPage(Router.minionsPage = new MinionsPage(this));
    this._registerPage(Router.keysPage = new KeysPage(this));
    this._registerPage(Router.grainsPage = new GrainsPage(this));
    this._registerPage(Router.grainsMinionPage = new GrainsMinionPage(this));
    this._registerPage(Router.schedulesPage = new SchedulesPage(this));
    this._registerPage(Router.schedulesMinionPage = new SchedulesMinionPage(this));
    this._registerPage(Router.pillarsPage = new PillarsPage(this));
    this._registerPage(Router.pillarsMinionPage = new PillarsMinionPage(this));
    this._registerPage(Router.beaconsPage = new BeaconsPage(this));
    this._registerPage(Router.beaconsMinionPage = new BeaconsMinionPage(this));
    this._registerPage(Router.nodegroupsPage = new NodegroupsPage(this));
    this._registerPage(Router.jobPage = new JobPage(this));
    this._registerPage(Router.jobsPage = new JobsPage(this));
    this._registerPage(Router.highStatePage = new HighStatePage(this));
    this._registerPage(Router.templatesPage = new TemplatesPage(this));
    this._registerPage(Router.eventsPage = new EventsPage(this));
    this._registerPage(Router.reactorsPage = new ReactorsPage(this));
    this._registerPage(Router.orchestrationsPage = new OrchestrationsPage(this));
    this._registerPage(Router.optionsPage = new OptionsPage(this));
    this._registerPage(Router.issuesPage = new IssuesPage(this));
    this._registerPage(Router.logoutPage = new LogoutPage(this));

    this._registerRouterEventListeners();

    const logo = document.getElementById("logo");
    Utils.addToolTip(logo, "CTRL-click here to see\nOptions and Stats", "logo");

    const fab = document.querySelector(".fab");
    Utils.addToolTip(fab, "Click here or type 'c'\nto show manual run", "fab");

    Router.updateMainMenu();

    const hash = window.location.hash.replace(/^#/, "");
    const search = window.location.search;
    /* eslint-disable compat/compat */
    /* URLSearchParams.entries() is not supported in IE 11 */
    /* URLSearchParams is not supported in op_mini all, IE 11, Baidu 7.12 */
    this.goTo(hash, Object.fromEntries(new URLSearchParams(search)));
    /* eslint-enable compat/compat */
  }

  _registerMenuItem (pParentId, pButtonId, pUrl, pKey) {

    // shortcut

    if (pKey) {
      Utils.setStorageItem("session", "menu_" + pKey, pUrl);
    }

    // full menu

    const fullMenuDiv = document.querySelector(".fullmenu");

    const dropDownName = pParentId || pButtonId;
    let dropDownDiv = document.getElementById("dropdown-" + dropDownName);
    if (!dropDownDiv) {
      dropDownDiv = Utils.createDiv("dropdown", "", "dropdown-" + dropDownName);
      fullMenuDiv.append(dropDownDiv);
    }

    if (pParentId) {
      let dropdownContent = document.getElementById("dropdown-content-" + pParentId);
      if (!dropdownContent) {
        dropdownContent = Utils.createDiv("dropdown-content", "", "dropdown-content-" + pParentId);
        dropDownDiv.append(dropdownContent);
      }
      const itemDiv = Utils.createDiv("run-command-button menu-item", pButtonId, "button-" + pButtonId + "1");
      if (pKey) {
        // currently applies to all, but just in case
        itemDiv.classList.add("menu-item-first-letter");
      }
      dropdownContent.append(itemDiv);
    } else {
      const topItemDiv = Utils.createDiv("menu-item", pButtonId, "button-" + pButtonId + "1");
      dropDownDiv.append(topItemDiv);
      if (pKey) {
        topItemDiv.classList.add("menu-item-first-letter");
      }
    }

    // mini menu

    const miniMenuDiv = document.querySelector(".minimenu");
    const dropdownContent2 = miniMenuDiv.querySelector(".dropdown-content");
    const menuItemDiv = Utils.createDiv("run-command-button menu-item", pButtonId, "button-" + pButtonId + "2");
    if (pParentId) {
      menuItemDiv.style.paddingLeft = "50px";
    }
    if (pKey) {
      menuItemDiv.classList.add("menu-item-first-letter");
    }
    dropdownContent2.append(menuItemDiv);

    // activate the menu items as needed

    // conditions go inside the handler because the pages
    // data may still being retrieved at this point
    for (const nr of ["1", "2"]) {
      document.getElementById("button-" + pButtonId + nr).
        addEventListener("click", (pClickEvent) => {
          const pages = Router._getPagesList();
          // Arrays.includes() is only available from ES7/2016
          if (pUrl && (pButtonId === "logout" || pages.length === 0 || pages.indexOf(pButtonId) >= 0)) {
            this.goTo(pUrl);
          }
          // hide the menu, it will stay hidden when the mouse is not over it
          // does not work well on touch-schreens
          let dropDownPanel = null;
          if (pClickEvent.target.classList.contains("run-command-button")) {
            dropDownPanel = pClickEvent.target.parentElement;
          } else {
            // may be null when there is no dropdown part
            dropDownPanel = pClickEvent.target.nextSibling;
          }
          if (dropDownPanel) {
            dropDownPanel.style.display = "none";
            window.setTimeout(() => {
              dropDownPanel.style.display = "";
            }, 500);
          }
          // prevent further actions
          pClickEvent.stopPropagation();
        });
    }
  }

  _registerRouterEventListeners () {
    document.getElementById("logo").
      addEventListener("click", (pClickEvent) => {
        if (pClickEvent.ctrlKey || pClickEvent.altKey) {
          this.goTo("options");
        } else {
          this.goTo("");
        }
        pClickEvent.stopPropagation();
      });

    // for touch screens
    document.getElementById("logo").
      addEventListener("dblclick", (pClickEvent) => {
        this.goTo("options");
        pClickEvent.stopPropagation();
      });

    document.getElementById("docu").
      addEventListener("click", (pClickEvent) => {
        window.open("https://erwindon.github.io/SaltGUI/", "_blank");
        pClickEvent.stopPropagation();
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

    this._registerMenuItem(null, "minions", "minions", "m");
    this._registerMenuItem("minions", "grains", "grains", "g");
    this._registerMenuItem("minions", "schedules", "schedules", "s");
    this._registerMenuItem("minions", "pillars", "pillars", "p");
    this._registerMenuItem("minions", "beacons", "beacons", "b");
    this._registerMenuItem("minions", "nodegroups", "nodegroups", "n");
    this._registerMenuItem(null, "keys", "keys", "k");
    this._registerMenuItem(null, "jobs", "jobs", "j");
    this._registerMenuItem("jobs", "highstate", "highstate", "h");
    this._registerMenuItem("jobs", "orchestrations", "orchestrations", "o");
    this._registerMenuItem("jobs", "templates", "templates", "t");
    this._registerMenuItem(null, "events", "events", "e");
    this._registerMenuItem("events", "reactors", "reactors", "r");
    this._registerMenuItem(null, "issues", "issues", "i");
    // no shortcut for logout
    this._registerMenuItem(null, "logout", "logout");
  }

  _registerPage (pPage) {
    this.pages.push(pPage);
    if (pPage.onRegister) {
      pPage.onRegister();
    }
  }

  static _getPagesList () {
    const pages = Utils.getStorageItemObject("session", "pages");
    const userName = Utils.getStorageItemObject("session", "login_response").user;
    if (!userName || typeof pages !== "object" || !(userName in pages)) {
      return [];
    }
    const ret = pages[userName];
    if (!ret || ret[0] === "*") {
      return [];
    }
    return ret;
  }

  static _showMenuItem (pPages, pPage, pChildren = []) {
    // assume the best
    let visible = true;

    // do not show unwanted menu items
    // Arrays.includes() is only available from ES7/2016
    if (pPages.length && pPages.indexOf(pPage.path) < 0) {
      visible = false;
    }

    // do not show pages that have no actual content
    if (!pPage.isVisible()) {
      visible = false;
    }

    // force visibility of the logout menuitem
    if (pPage.path === "logout") {
      visible = true;
    }

    // still show a menu item when a child is visible
    let hasVisibleChild = false;
    for (const page of pChildren) {
      // Arrays.includes() is only available from ES7/2016
      if (pPages.indexOf(page) >= 0) {
        hasVisibleChild = true;
        break;
      }
    }

    // perform the hiding/showing
    for (let nr = 1; nr <= 2; nr++) {
      const item = document.getElementById("button-" + pPage.path + nr);
      item.style.color = !visible && hasVisibleChild ? "lightgray" : "black";
      if (visible || hasVisibleChild) {
        item.classList.remove("menu-item-hidden");
      } else {
        item.classList.add("menu-item-hidden");
      }
    }
  }

  static _cancelSelections () {
    // see https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
    const sel = window.getSelection ? window.getSelection() : document.selection;
    if (sel) {
      if (sel.removeAllRanges) {
        sel.removeAllRanges();
      } else if (sel.empty) {
        sel.empty();
      }
    }
  }

  static updateMainMenu () {
    const pages = Router._getPagesList();

    Router._showMenuItem(pages, Router.minionsPage, ["grains", "schedules", "pillars", "beacons", "nodegroups"]);
    Router._showMenuItem(pages, Router.grainsPage);
    Router._showMenuItem(pages, Router.schedulesPage);
    Router._showMenuItem(pages, Router.pillarsPage);
    Router._showMenuItem(pages, Router.beaconsPage);
    Router._showMenuItem(pages, Router.nodegroupsPage);
    Router._showMenuItem(pages, Router.keysPage);
    Router._showMenuItem(pages, Router.jobsPage, ["highstate", "orchestrations", "templates"]);
    Router._showMenuItem(pages, Router.highStatePage);
    Router._showMenuItem(pages, Router.orchestrationsPage);
    Router._showMenuItem(pages, Router.templatesPage);
    Router._showMenuItem(pages, Router.eventsPage, ["reactors"]);
    Router._showMenuItem(pages, Router.reactorsPage);
    Router._showMenuItem(pages, Router.issuesPage);
    Router._showMenuItem(pages, Router.logoutPage);
  }

  // pForward = 0 --> normal navigation
  // pForward = 1 --> back navigation using regular gui
  // pForward = 2 --> back navigation using browser
  goTo (pHash, pQuery = {}, pForward = 0, pEvent = null) {

    // close the command-box when it is stil open
    CommandBox.hideManualRun();

    if (pHash !== "login" && Utils.getStorageItem("session", "login_response") === null) {
      // the fact that we don't have a session will be caught later
      // but this was shows less error messages on the console
      // but do not destroy the reason when login is already the goal

      // keep the old query parameters, and save the new location
      pQuery["reason"] = "no-session";
      pQuery["page"] = pHash;
      pHash = "login";
    }

    const pages = Router._getPagesList();
    if (!pHash) {
      // go to the concrete default page
      if (pages.length) {
        pHash = pages[0];
      } else {
        pHash = "minions";
      }
    }

    // save the details from the parent
    const parentHash = document.location.hash.replace(/^#/, "");
    const search = window.location.search;
    /* eslint-disable compat/compat */
    /* URLSearchParams.entries() is not supported in IE 11 */
    /* URLSearchParams is not supported in op_mini all, IE 11, Baidu 7.12 */
    const parentQuery = Object.fromEntries(new URLSearchParams(search));
    /* eslint-enable compat/compat */

    let inNewWindow = false;
    if (pEvent) {
      inNewWindow = pEvent.altKey || pEvent.ctrlKey;
    }

    for (const route of this.pages) {
      if (route.path !== pHash) {
        continue;
      }
      // push history state, so that the address bar holds the correct
      // deep-link; and so that we can use the back-button
      let url = config.NAV_URL ? config.NAV_URL : "/";
      let sep = "?";
      for (const key in pQuery) {
        const value = pQuery[key];
        if (!value || value === "undefined") {
          continue;
        }
        url += sep + key + "=" + encodeURIComponent(value);
        sep = "&";
      }
      if (inNewWindow) {
        url += sep + "popup=true";
        sep = "&";
      }
      url += "#" + pHash;
      if (parentHash === route.path) {
        // page refresh
        // prevents being detected as "forward navigation"
        // stay on the page, but parameters may have been updated
        window.history.replaceState({}, undefined, url);
      } else if (pForward === 0) {
        // forward navigation
        if (inNewWindow) {
          // in a new window
          Router._cancelSelections();
          window.open(url);
          return;
        }
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
      Router._showPage(route);
      return;
    }

    // route could not be found
    // just go to the main page
    if (pHash === "") {
      Utils.log("cannot find default page");
      return;
    }
    this.goTo("");
  }

  static _showPage (pPage) {
    pPage.clearPage();

    pPage.pageElement.style.display = "";

    // de-activate all menu items
    const activeMenuItems = Array.from(document.querySelectorAll(".menu-item-active"));
    activeMenuItems.forEach((menuItem) => {
      menuItem.classList.remove("menu-item-active");
    });

    // highlight the fullmenu item
    const elem1 = document.getElementById(pPage.menuItemElement1);
    if (elem1) {
      elem1.classList.add("menu-item-active");
      const parentItem = elem1.parentElement.parentElement.firstChild;
      // activate also parent menu item if child element is selected
      if (parentItem.id.startsWith("button-")) {
        parentItem.classList.add("menu-item-active");
      }
    }

    // highlight the minimenu item
    const elem2 = document.getElementById(pPage.menuItemElement2);
    if (elem2) {
      elem2.classList.add("menu-item-active");
    }

    pPage.onShow();

    // start the event-pipe (again)
    // it is either not started, or needs restarting
    API.getEvents();

    if (Router.currentPage && Router.currentPage !== pPage) {
      Router._hidePage(Router.currentPage);
    }
    Router.currentPage = pPage;

    Router.currentPage.pageElement.classList.add("current");
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
