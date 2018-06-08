class LoginRoute extends Route{

  constructor(router) {
    super("^[\/]login$", "Login", "#page_login");
    this.router = router;

    this.loginPending = false;

    this.onLogin = this.onLogin.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
    this.registerEventListeners();
  }

  updateTypeColor() {
    var typeItem = document.querySelector("#login-form #eauth");
    // make it look like a hint
    if(typeItem.value === "default")
      typeItem.style.color = "gray";
    else
      typeItem.style.color = "black";
  }

  onShow() {

    var typeItem = document.querySelector("#login-form #eauth");

    // restore login type
    let typeValue = localStorage.getItem('logintype');
    if(!typeValue) typeValue = "default";
    typeItem.value = typeValue;

    this.updateTypeColor();

    typeItem.addEventListener('change', this.updateTypeColor);
  }
  
  registerEventListeners() {
    var submit = document.querySelector("#login-form");
    submit.addEventListener('submit', this.onLogin);
  }

  onLogin(evt) {
    evt.preventDefault();
    if(this.loginPending) return; //Don't continue if waiting on a request

    var username = document.querySelector("#username").value;
    var password = document.querySelector("#password").value;

    this.toggleForm(false);
    this.router.api.login(username, password)
    .then(this.onLoginSuccess, this.onLoginFailure);
  }

  onLoginSuccess() {
    this.toggleForm(true);

    var notice = document.querySelector('.notice-wrapper');

    var success = Route._createDiv("notice", "Please wait...");
    success.style.backgroundColor = "#4CAF50";
    notice.replaceChild(success, notice.firstChild);

    document.querySelector("#username").disabled = true;
    document.querySelector("#password").disabled = true;

    notice.className = 'notice-wrapper';
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = 'notice-wrapper show';

    this.router.goTo("/");
  }

  onLoginFailure() {
    this.toggleForm(true);

    var notice = document.querySelector('.notice-wrapper');

    var authFailed = Route._createDiv("notice", "Authentication failed");
    authFailed.style.backgroundColor = "#F44336";

    notice.replaceChild(authFailed, notice.firstChild);
    notice.className = 'notice-wrapper';
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = 'notice-wrapper show';
  }

  toggleForm(allowSubmit) {
    this.loginPending = !allowSubmit;
    document.querySelector("#login-form input[type='submit']")
      .disabled = !allowSubmit;
  }

}
