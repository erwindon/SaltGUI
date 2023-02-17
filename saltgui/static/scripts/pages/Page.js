/* global */

import {Utils} from "../Utils.js";

export class Page {

  constructor (pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter) {
    this.path = pPath;
    this.name = pPageName;

    // <div class='route' id='page-keys'>
    //   <div class='dashboard'>
    //     <div class='panel minion-list'>
    let div = document.getElementById(pPageSelector);
    if (div === null) {
      const route = Utils.createDiv("route", "", pPageSelector);
      const dashboard = Utils.createDiv("dashboard");
      route.append(dashboard);
      const routeContainer = document.getElementById("route-container");
      routeContainer.append(route);
      div = route;
    }
    this.pageElement = div;
    this.router = pRouter;
    if (pMenuItemSelector) {
      this.menuItemElement1 = pMenuItemSelector + "1";
      this.menuItemElement2 = pMenuItemSelector + "2";
    }

    this.panels = [];
    this.api = pRouter.api;
  }

  addPanel (pPanel) {
    pPanel.route = this;
    pPanel.router = this.router;
    const dashboard = this.pageElement.querySelector(".dashboard");
    dashboard.append(pPanel.div);
    pPanel.api = this.api;
    this.panels.push(pPanel);
  }

  static isVisible () {
    // a page is visible, unless the page decides otherwise
    return true;
  }

  static _updateMotd () {

    const motd = document.getElementById("motd");

    const motdStatus = Utils.getStorageItem("session", "motd-status", "");
    if (motdStatus === "hidden") {
      motd.style.display = "none";
      return;
    }

    const saltMotdTxt = Utils.getStorageItem("session", "motd_txt", "");
    const motdTxtDiv = document.getElementById("motdtxt");
    motdTxtDiv.innerText = saltMotdTxt;
    motdTxtDiv.style.display = saltMotdTxt ? "" : "none";

    const saltMotdHtml = Utils.getStorageItem("session", "motd_html", "");
    const motdHtmlDiv = document.getElementById("motdhtml");
    motdHtmlDiv.innerHTML = saltMotdHtml;
    motdHtmlDiv.style.display = saltMotdHtml ? "" : "none";

    const motdCLoseButton1 = document.getElementById("close-motd");
    // remove all event-handlers (yes, this is otherwise a silly assignment)
    // that makes it a different object!
    /* eslint-disable no-self-assign */
    motdCLoseButton1.outerHTML = motdCLoseButton1.outerHTML;
    /* eslint-enable no-self-assign */

    if (!saltMotdTxt && !saltMotdHtml) {
      // nothing to see, don't bother
      motd.style.display = "none";
      return;
    }

    motd.style.display = "";

    const motdCLoseButton2 = document.getElementById("close-motd");
    // add the event-handler
    motdCLoseButton2.addEventListener("click", (pClickEvent) => {
      Utils.setStorageItem("session", "motd_txt", "");
      Utils.setStorageItem("session", "motd_html", "");
      motd.style.display = "none";
      pClickEvent.stopPropagation();
    });
  }

  onShow () {
    for (const panel of this.panels) {
      panel.onShow();
    }
    Page._updateMotd();
  }

  clearPage () {
    for (const panel of this.panels) {
      panel.clearPanel();
    }
  }

  refreshPage () {
    for (const panel of this.panels) {
      if (!panel.needsRefresh) {
        continue;
      }
      panel.needsRefresh = false;
      panel.clearPanel();
      panel.onShow();
    }
  }
}
