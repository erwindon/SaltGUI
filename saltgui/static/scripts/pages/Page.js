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

  static _getIpNumberPrefixes (pAllMinionsGrains) {
    // First we gather all (resonable) prefixes
    // Only use byte-boundaries for networks
    // Must match a subnet of A, B or C network
    const prefixes = {};
    for (const minionId in pAllMinionsGrains) {
      const grains = pAllMinionsGrains[minionId];
      if (!grains.fqdn_ip4) {
        continue;
      }
      if (!Array.isArray(grains.fqdn_ip4)) {
        continue;
      }
      for (const ip of grains.fqdn_ip4) {
        const parts = ip.split(".");
        if (ip.startsWith("10.")) {
          prefixes[parts[0] + "."] = true;
        }
        if (ip.startsWith("10.") ||
           ip.startsWith("172.16.") ||
           ip.startsWith("172.17.") ||
           ip.startsWith("172.18.") ||
           ip.startsWith("172.19.") ||
           ip.startsWith("172.20.") ||
           ip.startsWith("172.21.") ||
           ip.startsWith("172.22.") ||
           ip.startsWith("172.23.") ||
           ip.startsWith("172.24.") ||
           ip.startsWith("172.25.") ||
           ip.startsWith("172.26.") ||
           ip.startsWith("172.27.") ||
           ip.startsWith("172.28.") ||
           ip.startsWith("172.29.") ||
           ip.startsWith("172.30.") ||
           ip.startsWith("172.31.") ||
           ip.startsWith("192.168.")) {
          prefixes[parts[0] + "." + parts[1] + "."] = true;
          prefixes[parts[0] + "." + parts[1] + "." + parts[2] + "."] = true;
        }
      }
    }

    // Then we look whether each minion uses the prefix
    // When at least one minion does not use the subnet,
    //    then it is not a suitable subnet
    for (const prefix in prefixes) {
      for (const minionId in pAllMinionsGrains) {
        let cnt = 0;
        const grains = pAllMinionsGrains[minionId];
        if (!grains.fqdn_ip4) {
          continue;
        }
        if (!Array.isArray(grains.fqdn_ip4)) {
          continue;
        }
        for (const ip of grains.fqdn_ip4) {
          if (!ip.startsWith(prefix)) {
            continue;
          }
          cnt += 1;
        }
        // multiple or unused?
        //    then it is not a suitable subnet
        if (cnt !== 1) {
          prefixes[prefix] = false;
          break;
        }
      }
    }

    // actually remove the unused prefixes
    for (const prefix in prefixes) {
      if (!prefixes[prefix]) {
        delete prefixes[prefix];
      }
    }

    return prefixes;
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
