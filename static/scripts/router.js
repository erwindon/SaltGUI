class Router {

  constructor() {
    this.api = new API();
    this.currentRoute = undefined;
    this.routes = [];
    this.registerRoute(new LoginRoute(this, this.api));
    this.registerRoute(new HomeRoute(this, this.api));

    this.goTo("/login"); //Default page
  }

  registerRoute(route) {
    this.routes.push(route);
    if(route.onRegister) route.onRegister();
  }

  goTo(path) {
    for(var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      if(!route.getPath().test(path)) continue;

      this.showRoute(route);
      window.history.pushState({}, undefined, path);
      return;
    }
  }

  showRoute(route) {

    if(this.currentRoute !== undefined) {
      this.hideRoute(this.currentRoute);
    }

    this.currentRoute = route;
    document.title = "SaltGUI - " + this.currentRoute.getName();
    this.currentRoute.getElement().className = 'route current';
    if(this.currentRoute.onShow) this.currentRoute.onShow();
  }

  hideRoute(route) {
    route.getElement().className = 'route';
    if(route.onHide) route.onHide();
  }

}

window.addEventListener('load', new Router());
