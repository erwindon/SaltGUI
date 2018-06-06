class Router {

  constructor() {
    this.api = new API();
    this.currentRoute = undefined;
    this.routes = [];
    this.registerRoute(new LoginRoute(this));
    this.registerRoute(new HomeRoute(this));
    this.registerRoute(new JobRoute(this));

    this._registerEventListeners();
    this.goTo(this.api.isAuthenticated() ?
      window.location.pathname + window.location.search : "/login");
  }

  _registerEventListeners() {
    var router = this;
    document.querySelector('.logo').addEventListener('click', _ => {
      if(window.location.pathname === "/login") return;
      router.goTo("/");
    });
  }

  registerRoute(route) {
    this.routes.push(route);
    if(route.onRegister) route.onRegister();
  }

  goTo(path) {
    if(this.switchingRoute) return;
    if(window.location.pathname === path && this.currentRoute) return;
    for(var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      if(!route.getPath().test(path.split("?")[0])) continue;

      window.history.pushState({}, undefined, path);
      this.showRoute(route);
      return;
    }
  }

  showRoute(route) {
    var router = this;
    route.getElement().style.display = "";
    router.switchingRoute = true;

    var afterLoad = function() {
      if(router.currentRoute !== undefined) {
        router.hideRoute(router.currentRoute);
      }

      router.currentRoute = route;
      document.title = "SaltGUI - " + router.currentRoute.getName();
      router.currentRoute.getElement().className = 'route current';
      router.switchingRoute = false;
    };

    var response;
    if(route.onShow) response = route.onShow();

    if(response && response.then) response.then(afterLoad);
    else afterLoad();
  }

  hideRoute(route) {
    route.getElement().className = 'route';
    setTimeout(function() {
      //Hide element after fade, so it does not expand the body
      route.getElement().style.display = "none";
    }, 500);
    if(route.onHide) route.onHide();
  }

}

window.addEventListener('load', new Router());
