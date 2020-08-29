/* global config document */

export class Route {

  constructor (pPath, pPageName, pPageSelector, pMenuItemSelector, pRouter) {
    this.path = new RegExp("^" + config.NAV_URL.replace(/\//, "[/]") + "[/]" + pPath + "$");
    this.name = pPageName;

    // <div class='route' id='page-keys'>
    //   <div class='dashboard'>
    //     <div class='panel minion-list'>
    let div = document.getElementById(pPageSelector);
    if (div === null) {
      const route = document.createElement("div");
      route.id = pPageSelector;
      route.classList.add("route");
      const dashboard = document.createElement("div");
      dashboard.classList.add("dashboard");
      route.append(dashboard);
      const routeContainer = document.getElementById("route-container");
      routeContainer.append(route);
      div = route;
    }
    this.pageElement = div;
    this.router = pRouter;
    if (pMenuItemSelector) {
      this.menuItemElement1 = document.getElementById(pMenuItemSelector + "1");
      this.menuItemElement2 = document.getElementById(pMenuItemSelector + "2");
    }
  }
}
