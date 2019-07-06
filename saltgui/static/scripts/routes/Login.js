import {Route} from './Route.js';
import {Utils} from '../Utils.js';

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

    let reason = decodeURIComponent(Utils.getQueryParam("reason"));
    if(!reason || reason === "undefined") return;
    if(reason === "no-session") reason = "Not logged in!";
    if(reason === "expired-session") reason = "Automatic logout!";
    const noticeDiv = this.pageElement.querySelector(".notice-wrapper");

    const reasonDiv = Route._createDiv("notice", reason);
    reasonDiv.style.backgroundColor = "black";
    noticeDiv.replaceChild(reasonDiv, noticeDiv.firstChild);
    noticeDiv.className = "notice-wrapper";
    noticeDiv.focus(); //Used to trigger a reflow (to restart animation)
    noticeDiv.className = "notice-wrapper show";
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

    const noticeDiv = this.pageElement.querySelector(".notice-wrapper");

    const success = Route._createDiv("notice", "Please wait...");
    success.style.backgroundColor = "#4CAF50";
    noticeDiv.replaceChild(success, noticeDiv.firstChild);

    const userNameField = this.pageElement.querySelector("#username");
    userNameField.disabled = true;
    const passWordField = this.pageElement.querySelector("#password");
    passWordField.disabled = true;
    const eauthField = this.pageElement.querySelector("#eauth");
    eauthField.disabled = true;

    noticeDiv.className = "notice-wrapper";
    noticeDiv.focus(); //Used to trigger a reflow (to restart animation)
    noticeDiv.className = "notice-wrapper show";

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

  _handleWheelConfigValues(pData) {
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

  onLoginFailure() {
    this.toggleForm(true);

    const noticeDiv = this.pageElement.querySelector(".notice-wrapper");

    const authFailed = Route._createDiv("notice", "Authentication failed");
    authFailed.style.backgroundColor = "#F44336";

    noticeDiv.replaceChild(authFailed, noticeDiv.firstChild);
    noticeDiv.className = "notice-wrapper";
    noticeDiv.focus(); //Used to trigger a reflow (to restart animation)
    noticeDiv.className = "notice-wrapper show";
  }

  toggleForm(pAllowSubmit) {
    this.loginPending = !pAllowSubmit;
    const loginButton = this.pageElement.querySelector("#login-form input[type='submit']");
    loginButton.disabled = !pAllowSubmit;
  }

}
