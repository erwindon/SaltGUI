import {Route} from './Route.js';
import {Utils} from '../Utils.js';

export class LoginRoute extends Route {

  constructor(pRouter) {
    super("^[\/]login$", "Login", "#page-login", "", pRouter);

    this.loginPending = false;

    this._onLogin = this._onLogin.bind(this);
    this._onLoginSuccess = this._onLoginSuccess.bind(this);
    this._onLoginFailure = this._onLoginFailure.bind(this);
    this._registerLoginRouteEventListeners();
  }

  _registerLoginRouteEventListeners() {
    const submit = document.getElementById("login-form");
    submit.addEventListener("submit", this._onLogin);
  }

  _showNoticeText(pBackgroundColour, pText) {
    // create a new child every time to restart the animation
    const noticeDiv = Route.createDiv("", pText);
    noticeDiv.id = "notice";
    noticeDiv.style.backgroundColor = pBackgroundColour;
    const noticeWrapperDiv = document.getElementById("notice-wrapper");
    noticeWrapperDiv.replaceChild(noticeDiv, noticeWrapperDiv.firstChild);
  }

  onShow() {
    const eauthSelector = document.getElementById("eauth");
    let eauthValue = window.localStorage.getItem("eauth");
    if(eauthValue === "null") eauthValue = null;
    eauthSelector.value = eauthValue ? eauthValue : "pam";

    const reason = decodeURIComponent(Utils.getQueryParam("reason"));
    switch(reason){
    case null:
    case "":
    case "undefined":
      break;
    case "no-session":
      // gray because we cannot prove that the user was/wasnt logged in
      this._showNoticeText("gray", "Not logged in");
      break;
    case "expired-session":
      this._showNoticeText("#F44336", "Session expired");
      break;
    case "logout":
      // gray because this is the result of a user action
      this._showNoticeText("gray", "Logout");
      break;
    default:
      // should not occur
      this._showNoticeText("#F44336", reason);
    }
  }

  _onLogin(pSubmitEvent) {
    pSubmitEvent.preventDefault();
    if(this.loginPending) return; //Don't continue if waiting on a request

    const userNameField = document.getElementById("username");
    const userName = userNameField.value;
    const passWordField = document.getElementById("password");
    const passWord = passWordField.value;
    const eauthField = document.getElementById("eauth");
    const eauth = eauthField.value;

    this._toggleForm(false);
    this.router.api.login(userName, passWord, eauth)
      .then(this._onLoginSuccess, this._onLoginFailure);
  }

  _onLoginSuccess() {
    this._toggleForm(true);

    const userNameField = document.getElementById("username");
    userNameField.disabled = true;
    const passWordField = document.getElementById("password");
    passWordField.disabled = true;
    const eauthField = document.getElementById("eauth");
    eauthField.disabled = true;

    this._showNoticeText("#4CAF50", "Please wait...");

    //we need these functions to populate the dropdown boxes
    const wheelConfigValuesPromise = this.router.api.getWheelConfigValues();

    //we need these functions to populate the dropdown boxes
    const myThis = this;
    wheelConfigValuesPromise.then(pWheelConfigValuesData => {
      myThis._handleLoginWheelConfigValues(pWheelConfigValuesData);
    }, pWheelConfigValuesMsg => {
      // never mind
    });

    // allow the success message to be seen
    setTimeout(_ => this.router.goTo("/"), 1000);
  }

  _handleLoginWheelConfigValues(pWheelConfigValuesData) {
    // store for later use

    const wheelConfigValuesData = pWheelConfigValuesData.return[0].data.return;

    const templates = wheelConfigValuesData.saltgui_templates;
    window.sessionStorage.setItem("templates", JSON.stringify(templates));

    const publicPillars = wheelConfigValuesData.saltgui_public_pillars;
    window.sessionStorage.setItem("public_pillars", JSON.stringify(publicPillars));

    const previewGrains = wheelConfigValuesData.saltgui_preview_grains;
    window.sessionStorage.setItem("preview_grains", JSON.stringify(previewGrains));

    const hideJobs = wheelConfigValuesData.saltgui_hide_jobs;
    window.sessionStorage.setItem("hide_jobs", JSON.stringify(hideJobs));
    const showJobs = wheelConfigValuesData.saltgui_show_jobs;
    window.sessionStorage.setItem("show_jobs", JSON.stringify(showJobs));

    let nodeGroups = wheelConfigValuesData.nodegroups;
    // Even when not set, the api server gives this an actual value "{}" here.
    // Let's assume the user never sets that value. Sounds reasonable because
    // when it is set, it is normally set to an actual value/list.
    if(!nodeGroups || !Object.keys(nodeGroups).length) nodeGroups = undefined;
    window.sessionStorage.setItem("nodegroups", JSON.stringify(nodeGroups));

    const outputFormats = wheelConfigValuesData.saltgui_output_formats;
    window.sessionStorage.setItem("output_formats", JSON.stringify(outputFormats));

    const dateTimeFractionDigits = wheelConfigValuesData.saltgui_datetime_fraction_digits;
    window.sessionStorage.setItem("datetime_fraction_digits", JSON.stringify(dateTimeFractionDigits));

    const toolTipMode = wheelConfigValuesData.saltgui_tooltip_mode;
    window.sessionStorage.setItem("tooltip_mode", toolTipMode);
  }

  _onLoginFailure(error) {
    this._toggleForm(true);

    if(error && error.status === 503) {
      // Service Unavailable
      // e.g. salt-api running but salt-master not running
      this._showNoticeText("#F44336", error.message);
    } else if(error && error.status === -1) {
      // No permissions: login valid, but no api functions executable
      // e.g. PAM says OK and /etc/salt/master says NO
      this._showNoticeText("#F44336", error.message);
    } else {
      this._showNoticeText("#F44336", "Authentication failed");
    }
  }

  _toggleForm(pAllowSubmit) {
    this.loginPending = !pAllowSubmit;
    const loginButton = this.pageElement.querySelector("#login-form input[type='submit']");
    loginButton.disabled = !pAllowSubmit;
  }

}
