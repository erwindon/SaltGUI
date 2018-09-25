class Router {

  constructor() {
    this.api = new API();
    this.commandbox = new CommandBox(this.api);
    this.currentRoute = undefined;
    this.routes = [];

    this.registerRoute(new LoginRoute(this));
    this.registerRoute(new MinionsRoute(this));
    this.registerRoute(new KeysRoute(this));
    this.registerRoute(new GrainsRoute(this));
    this.registerRoute(new JobRoute(this));

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
    const router = this;

    document.querySelector('.logo')
      .addEventListener('click', _ => {
        if(window.location.pathname === "/login") return;
        router.goTo("/");
      });

    document.querySelector("#button_logout")
      .addEventListener('click', _ => {
        this.api.logout().then(() => {
          window.location.replace("/");
        });
      });

    document.querySelector("#button_minions")
      .addEventListener('click', _ => {
        window.location.replace("/");
      });

    document.querySelector("#button_keys")
      .addEventListener('click', _ => {
        window.location.replace("/keys");
      });

    document.querySelector("#button_grains")
      .addEventListener('click', _ => {
        window.location.replace("/grains");
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

      window.history.pushState({}, undefined, path);
      this.showRoute(route);
      return;
    }
  }

  showRoute(route) {
    const router = this;
    route.getPageElement().style.display = "";

    Array.from(document.querySelectorAll(".menu_item_active")).forEach(
      function (e){ e.classList.remove("menu_item_active"); }
    );

    const elem = route.getMenuItemElement();
    if(elem) elem.classList.add("menu_item_active");
    router.switchingRoute = true;

    const afterLoad = function(route) {
      if(router.currentRoute !== undefined) {
        router.hideRoute(router.currentRoute);
      }

      router.currentRoute = route;
      document.title = "SaltGUI - " + router.currentRoute.getName();
      router.currentRoute.getPageElement().className = 'route current';
      router.switchingRoute = false;
    };

    let response;
    if(route.onShow) response = route.onShow();

    if(response && response.then) response.then(afterLoad(route));
    else afterLoad(route);
  }

  hideRoute(route) {
    route.getPageElement().className = 'route';
    setTimeout(function() {
      //Hide element after fade, so it does not expand the body
      route.getPageElement().style.display = "none";
    }, 500);
    if(route.onHide) route.onHide();
  }

}

window.addEventListener('load', () => new Router());

