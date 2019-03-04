import {Route} from './Route';

export class LoginRoute extends Route {

  constructor(router) {
    super("^[\/]login$", "Login", "#page_login", "", router);

    this.loginPending = false;

    this.onLogin = this.onLogin.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
    this.registerEventListeners();
  }

  onShow() {
    const eauthSelector = document.querySelector("#login-form #eauth");
    const eauthValue = window.localStorage.getItem("eauth");
    eauthSelector.value = eauthValue ? eauthValue : "pam";
  }

  registerEventListeners() {
    const submit = document.querySelector("#login-form");
    submit.addEventListener("submit", this.onLogin);
  }

  onLogin(evt) {
    evt.preventDefault();
    if(this.loginPending) return; //Don't continue if waiting on a request

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const eauth = document.querySelector("#eauth").value;

    this.toggleForm(false);
    this.router.api.login(username, password, eauth)
      .then(this.onLoginSuccess, this.onLoginFailure);
  }

  onLoginSuccess() {
    this.toggleForm(true);

    const notice = document.querySelector(".notice-wrapper");

    const success = Route._createDiv("notice", "Please wait...");
    success.style.backgroundColor = "#4CAF50";
    notice.replaceChild(success, notice.firstChild);

    document.querySelector("#username").disabled = true;
    document.querySelector("#password").disabled = true;
    document.querySelector("#eauth").disabled = true;

    notice.className = "notice-wrapper";
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = "notice-wrapper show";

    this.router.goTo("/");
  }

  onLoginFailure() {
    this.toggleForm(true);

    const notice = document.querySelector(".notice-wrapper");

    const authFailed = Route._createDiv("notice", "Authentication failed");
    authFailed.style.backgroundColor = "#F44336";

    notice.replaceChild(authFailed, notice.firstChild);
    notice.className = "notice-wrapper";
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = "notice-wrapper show";
  }

  toggleForm(allowSubmit) {
    this.loginPending = !allowSubmit;
    document.querySelector("#login-form input[type='submit']")
      .disabled = !allowSubmit;
  }

}
