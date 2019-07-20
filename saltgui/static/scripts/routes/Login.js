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
    const eauthValue = window.localStorage.getItem("eauth");
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
    wheelConfigValuesPromise.then(data => {
      myThis._handleLoginWheelConfigValues(data);
    }, data => {
      // never mind
    });

    // allow the success message to be seen
    setTimeout(_ => this.router.goTo("/"), 1000);
  }

  _handleLoginWheelConfigValues(pData) {
    // store for later use

    const templates = pData.return[0].data.return.saltgui_templates;
    window.localStorage.setItem("templates", JSON.stringify(templates));

    const publicPillars = pData.return[0].data.return.saltgui_public_pillars;
    window.localStorage.setItem("public_pillars", JSON.stringify(publicPillars));

    const previewGrains = pData.return[0].data.return.saltgui_preview_grains;
    window.localStorage.setItem("preview_grains", JSON.stringify(previewGrains));

    const hideJobs = pData.return[0].data.return.saltgui_hide_jobs;
    window.localStorage.setItem("hide_jobs", JSON.stringify(hideJobs));
    const showJobs = pData.return[0].data.return.saltgui_show_jobs;
    window.localStorage.setItem("show_jobs", JSON.stringify(showJobs));

    let nodeGroups = pData.return[0].data.return.nodegroups;
    if(!nodeGroups) nodeGroups = {};
    window.localStorage.setItem("nodegroups", JSON.stringify(nodeGroups));

    const outputFormats = pData.return[0].data.return.saltgui_output_formats;
    window.localStorage.setItem("output_formats", JSON.stringify(outputFormats));

    const dateTimeFractionDigits = pData.return[0].data.return.saltgui_datetime_fraction_digits;
    window.localStorage.setItem("datetime_fraction_digits", JSON.stringify(dateTimeFractionDigits));

    const toolTipMode = pData.return[0].data.return.saltgui_tooltip_mode;
    window.localStorage.setItem("tooltip_mode", toolTipMode);
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
