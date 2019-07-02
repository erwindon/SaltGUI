import {Route} from './Route.js';

export class LoginRoute extends Route {

  constructor(pRouter) {
    super("^[\/]login$", "Login", "#page-login", "", pRouter);

    this.loginPending = false;

    this.onLogin = this.onLogin.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
    this.registerEventListeners();
  }

  onShow() {
    const eauthSelector = this.pageElement.querySelector("#login-form #eauth");
    const eauthValue = window.localStorage.getItem("eauth");
    eauthSelector.value = eauthValue ? eauthValue : "pam";
  }

  registerEventListeners() {
    const submit = this.pageElement.querySelector("#login-form");
    submit.addEventListener("submit", this.onLogin);
  }

  onLogin(pSubmitEvent) {
    pSubmitEvent.preventDefault();
    if(this.loginPending) return; //Don't continue if waiting on a request

    const userNameField = this.pageElement.querySelector("#username");
    const userName = userNameField.value;
    const passWordField = this.pageElement.querySelector("#password");
    const passWord = passWordField.value;
    const eauthField = this.pageElement.querySelector("#eauth");
    const eauth = eauthField.value;

    this.toggleForm(false);
    this.router.api.login(userName, passWord, eauth)
      .then(this.onLoginSuccess, this.onLoginFailure);
  }

  onLoginSuccess() {
    this.toggleForm(true);

    const notice = this.pageElement.querySelector(".notice-wrapper");

    const success = Route._createDiv("notice", "Please wait...");
    success.style.backgroundColor = "#4CAF50";
    notice.replaceChild(success, notice.firstChild);

    const userNameField = this.pageElement.querySelector("#username");
    userNameField.disabled = true;
    const passWordField = this.pageElement.querySelector("#password");
    passWordField.disabled = true;
    const eauthField = this.pageElement.querySelector("#eauth");
    eauthField.disabled = true;

    notice.className = "notice-wrapper";
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = "notice-wrapper show";

    //we need these functions to populate the dropdown boxes
    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();

    //we need these functions to populate the dropdown boxes
    const myThis = this;
    wheelConfigValuesPromise.then(data => {
      myThis._handleWheelConfigValues(data);
    }, data => {
      // never mind
    });

    // allow the success message to be seen
    setTimeout(_ => this.router.goTo("/"), 1000);
  }

  onLoginFailure() {
    this.toggleForm(true);

    const notice = this.pageElement.querySelector(".notice-wrapper");

    const authFailed = Route._createDiv("notice", "Authentication failed");
    authFailed.style.backgroundColor = "#F44336";

    notice.replaceChild(authFailed, notice.firstChild);
    notice.className = "notice-wrapper";
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = "notice-wrapper show";
  }

  toggleForm(pAllowSubmit) {
    this.loginPending = !pAllowSubmit;
    const loginButton = this.pageElement.querySelector("#login-form input[type='submit']");
    loginButton.disabled = !pAllowSubmit;
  }

}
