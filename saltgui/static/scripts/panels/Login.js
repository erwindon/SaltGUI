/* global */

import {Character} from "../Character.js";
import {Panel} from "./Panel.js";
import {Router} from "../Router.js";
import {Utils} from "../Utils.js";

export class LoginPanel extends Panel {

  constructor () {
    LoginPanel.version = "SaltGUI v1.32.0-snapshot";

    super("login");

    this.addTitle("SaltGUI");

    // The FORM is important, so that the ENTER key
    // in any field is redirected to the submit button
    const form = Utils.createElem("form");
    this.div.append(form);

    const motdTxt = Utils.createDiv("motd");
    form.append(motdTxt);
    this.motdTxtDiv = motdTxt;

    const motdHtml = Utils.createDiv("motd");
    form.append(motdHtml);
    this.motdHtmlDiv = motdHtml;

    const noticeWrapper = Utils.createDiv("notice-wrapper", "", "notice-wrapper");
    form.append(noticeWrapper);
    this.noticeWrapperDiv = noticeWrapper;

    const username = Utils.createElem("input");
    username.type = "text";
    username.id = "username";
    username.placeholder = "Username";
    username.autofocus = "";
    form.append(username);
    this.usernameField = username;

    const password = Utils.createElem("input");
    password.type = "password";
    password.id = "password";
    password.placeholder = "Password";
    form.append(password);
    this.passwordField = password;

    // see https://docs.saltstack.com/en/latest/ref/auth/all/index.html
    const select = Utils.createElem("select");
    form.append(select);
    this.eauthField = select;
    this._updateEauthField();

    const submit = Utils.createElem("input");
    submit.id = "login-button";
    submit.type = "submit";
    submit.value = "Login";
    form.append(submit);
    this.loginButton = submit;

    const aa = Utils.createElem("a", "attribution");
    aa.href = "https://github.com/erwindon/SaltGUI";
    aa.target = "_blank";
    aa.rel = "noopener";

    const img = Utils.createElem("img");
    img.src = "static/images/github.png";
    aa.append(img);

    const txt = document.createTextNode(LoginPanel.version);
    aa.append(txt);

    form.append(aa);

    this.div.append(form);

    this._registerEventListeners(form);
  }

  _addEauthSection (pSectionName, pOptionValues) {
    if (pOptionValues.length === 0) {
      // no optionValues --> no section
      return;
    }

    let parent = this.eauthField;
    if (pSectionName) {
      parent = Utils.createElem("optgroup");
      parent.label = pSectionName;
      this.eauthField.append(parent);
    }

    for (const optionValue of pOptionValues) {
      const option = Utils.createElem("option", "", optionValue);
      option.value = optionValue;
      parent.append(option);
    }
  }

  _updateEauthField () {
    // start fresh
    this.eauthField.innerHTML = "";

    const option1 = Utils.createElem("option", "", "Type", "eauth-default");
    option1.value = "default";
    this.eauthField.append(option1);

    this._addEauthSection("standard", ["pam"]);

    // move items to this optgroup only when at least
    // one user reports a succesful use
    // see https://github.com/saltstack/salt/tree/master/salt/auth
    // for information and configuration
    this._addEauthSection("other", ["file", "ldap", "mysql", "yubico"]);

    // auto and sharedsecret already tested but not suitable for general use
    // other values are: django, keystone, pki, rest
    // these can be added after testing to optgroup 'other'
    // add untested values to (new) optgroup 'experimental' on explicit user request
    // and only while the code is on a branch

    // allow user to add any value they want
    let saltAuth = Utils.getStorageItemList("local", "salt-auth-txt");
    if (saltAuth.includes("CLEAR")) {
      saltAuth = saltAuth.filter((item) => item !== "CLEAR");
      if (saltAuth.length === 0) {
        // no cheating
        console.warn("salt-auth-txt has no extries, except 'CLEAR', assuming 'pam'");
        saltAuth = ["pam"];
      }
      this.eauthField.innerHTML = "";
      this._addEauthSection(null, saltAuth);
      if (saltAuth.length === 1) {
        this.eauthField.style.display = "none";
        Utils.setStorageItem("local", "eauth", saltAuth[0]);
      }
      this.eauthField.value = Utils.getStorageItem("local", "eauth", saltAuth[0]);
    } else {
      this._addEauthSection("salt-auth.txt", saltAuth);
      this.eauthField.value = Utils.getStorageItem("local", "eauth", "pam");
    }
  }

  _updateMotdField () {
    const saltMotdTxt = Utils.getStorageItem("local", "salt-motd-txt", "");
    this.motdTxtDiv.innerText = saltMotdTxt;
    this.motdTxtDiv.style.display = saltMotdTxt ? "" : "none";

    const saltMotdHtml = Utils.getStorageItem("local", "salt-motd-html", "");
    this.motdHtmlDiv.innerHTML = saltMotdHtml;
    this.motdHtmlDiv.style.display = saltMotdHtml ? "" : "none";
  }

  _registerEventListeners (pLoginForm) {
    pLoginForm.addEventListener("submit", (ev) => {
      this._onLogin(ev);
    });
  }

  _showNoticeText (pBackgroundColour, pText, pInfoClass) {
    // create a new child every time to restart the animation
    const noticeDiv = Utils.createDiv(pInfoClass, pText, "notice");
    noticeDiv.style.backgroundColor = pBackgroundColour;
    while (this.noticeWrapperDiv.hasChildNodes()) {
      this.noticeWrapperDiv.removeChild(this.noticeWrapperDiv.firstChild);
    }
    this.noticeWrapperDiv.appendChild(noticeDiv);
  }

  _loadSaltAuthTxt () {
    const staticSaltAuthTxtPromise = this.api.getStaticSaltAuthTxt();

    staticSaltAuthTxtPromise.then((pStaticSaltAuthTxt) => {
      if (pStaticSaltAuthTxt) {
        const lines = pStaticSaltAuthTxt.
          trim().
          split(/\r?\n/).
          filter((item) => !item.startsWith("#"));
        const saltAuth = [];
        for (const line of lines) {
          const fields = line.split(/[ \t]+/);
          if (fields.length === 1) {
            saltAuth.push(fields[0]);
          } else {
            console.warn("lines in 'salt-auth.txt' must have 1 word, not " + fields.length + " like in: " + line);
          }
        }
        Utils.setStorageItem("local", "salt-auth-txt", JSON.stringify(saltAuth));
        this._updateEauthField();
      } else {
        Utils.setStorageItem("local", "salt-auth-txt", "[]");
        this._updateEauthField();
      }
      return true;
    }, () => {
      Utils.setStorageItem("local", "salt-auth-txt", "[]");
      this._updateEauthField();
      return false;
    });
  }

  _loadSaltMotdTxt () {
    const staticSaltMotdTxtPromise = this.api.getStaticSaltMotdTxt();

    staticSaltMotdTxtPromise.then((pStaticSaltMotdTxt) => {
      if (pStaticSaltMotdTxt) {
        const lines = pStaticSaltMotdTxt.trim();
        Utils.setStorageItem("local", "salt-motd-txt", lines);
        this._updateMotdField();
      } else {
        Utils.setStorageItem("local", "salt-motd-txt", "");
        this._updateMotdField();
      }
      return true;
    }, () => {
      Utils.setStorageItem("local", "salt-motd-txt", "");
      this._updateMotdField();
      return false;
    });
  }

  _loadSaltMotdHtml () {
    const staticSaltMotdHtmlPromise = this.api.getStaticSaltMotdHtml();

    staticSaltMotdHtmlPromise.then((pStaticSaltMotdHtml) => {
      if (pStaticSaltMotdHtml) {
        const lines = pStaticSaltMotdHtml.trim();
        Utils.setStorageItem("local", "salt-motd-html", lines);
        this._updateMotdField();
      } else {
        Utils.setStorageItem("local", "salt-motd-html", "");
        this._updateMotdField();
      }
      return true;
    }, () => {
      Utils.setStorageItem("local", "salt-motd-html", "");
      this._updateMotdField();
      return false;
    });
  }

  onShow () {
    this._loadSaltAuthTxt();

    this._loadSaltMotdTxt();
    this._loadSaltMotdHtml();

    const reason = decodeURIComponent(Utils.getQueryParam("reason"));
    switch (reason) {
    case null:
    case "":
    case "undefined":
      break;
    case "no-session":
      // gray because we cannot prove that the user was/wasnt logged in
      this._showNoticeText("gray", "Not logged in", "notice_not_logged_in");
      break;
    case "session-cancelled":
      this._showNoticeText("#F44336", "Session cancelled", "notice-session-cancelled");
      break;
    case "session-expired":
      this._showNoticeText("#F44336", "Session expired", "notice-session-expired");
      break;
    case "logout":
      // gray because this is the result of a user action
      this._showNoticeText("gray", "Logout", "notice_logout");
      break;
    default:
      // should not occur
      this._showNoticeText("#F44336", reason, "notice_other:" + reason);
    }

    this._enableLoginControls(true);
  }

  _onLogin (pSubmitEvent) {
    pSubmitEvent.preventDefault();

    const username = this.usernameField.value;
    const password = this.passwordField.value;
    const eauth = this.eauthField.value;

    if (eauth === "default") {
      this._onLoginFailure("Invalid login-type");
      return;
    }

    this._enableLoginControls(false);
    this.api.login(username, password, eauth).then(() => {
      this._onLoginSuccess();
      return true;
    }, (pErr) => {
      this._onLoginFailure(pErr);
      return false;
    });
  }

  _onLoginSuccess () {
    this._showNoticeText("#4CAF50", "Please wait" + Character.HORIZONTAL_ELLIPSIS, "notice_please_wait");

    Utils.setStorageItem("local", "salt-motd-txt", "");
    Utils.setStorageItem("local", "salt-motd-html", "");

    // We need these functions to populate the dropdown boxes
    const wheelConfigValuesPromise = this.api.getWheelConfigValues();
    const runnerStateOrchestrateShowSlsPromise = this.api.getRunnerStateOrchestrateShowSls();

    // these may have been hidden on a previous logout
    Utils.hideAllMenus(false);

    // We need these functions to populate the dropdown boxes
    // or determine visibility of menu items
    wheelConfigValuesPromise.then((pWheelConfigValuesData) => {
      LoginPanel._handleLoginWheelConfigValues(pWheelConfigValuesData);
      Router.updateMainMenu();
      return true;
    }, () => false);
    runnerStateOrchestrateShowSlsPromise.then((pRunnerStateOrchestrateShowSlsData) => {
      LoginPanel._handleRunnerStateOrchestrateShowSls(pRunnerStateOrchestrateShowSlsData);
      Router.updateMainMenu();
      return true;
    }, () => false);

    // allow the success message to be seen
    window.setTimeout(() => {
      // erase credentials since we don't do page-refresh
      this.usernameField.value = "";
      this.passwordField.value = "";
      if (Utils.getStorageItem("session", "login_response") !== null) {
        // we might have been logged out in this first second
        // e.g. when clock between client and server differs more than the session timout
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("page")) {
          // a redirect page is specified
          const params = {};
          for (const pair of urlParams.entries()) {
            params[pair[0]] = pair[1];
          }
          const page = params["page"];
          delete params["page"];
          this.router.goTo(page, params);
        } else {
          this.router.goTo("");
        }
      }
    }, 1000);
  }

  static _handleRunnerStateOrchestrateShowSls (pRunnerStateOrchestrateShowSlsData) {
    // until we prove it it available
    Utils.setStorageItem("session", "orchestrations", "false");

    const ret = pRunnerStateOrchestrateShowSlsData.return[0];
    for (const key in ret) {
      const obj = ret[key];
      for (const stepkey in obj) {
        const step = obj[stepkey].salt;
        if (step !== undefined) {
          for (const item of step) {
            if (item === "function" || item === "state" || item === "runner" || item === "wheel") {
              Utils.setStorageItem("session", "orchestrations", "true");
              return;
            }
          }
        }
      }
    }
  }

  static _handleLoginWheelConfigValues (pWheelConfigValuesData) {
    const wheelConfigValuesData = pWheelConfigValuesData.return[0].data.return;

    // store for later use

    const templates = wheelConfigValuesData.saltgui_templates;
    Utils.setStorageItem("session", "templates", JSON.stringify(templates));

    for (const templateName in templates) {
      const template = templates[templateName];
      if (template.key !== undefined) {
        Utils.setStorageItem("session", "template_" + template.key, templateName);
      }
    }

    const reactors = wheelConfigValuesData.reactor;
    Utils.setStorageItem("session", "reactors", JSON.stringify(reactors));

    const pages = wheelConfigValuesData.saltgui_pages;
    Utils.setStorageItem("session", "pages", JSON.stringify(pages));

    const publicPillars = wheelConfigValuesData.saltgui_public_pillars;
    Utils.setStorageItem("session", "public_pillars", JSON.stringify(publicPillars));

    const previewGrains = wheelConfigValuesData.saltgui_preview_grains;
    Utils.setStorageItem("session", "preview_grains", JSON.stringify(previewGrains));

    const ipNumberField = wheelConfigValuesData.saltgui_ipnumber_field;
    Utils.setStorageItem("session", "ipnumber_field", ipNumberField);
    const ipNumberPrefix = wheelConfigValuesData.saltgui_ipnumber_prefix;
    Utils.setStorageItem("session", "ipnumber_prefix", JSON.stringify(ipNumberPrefix));

    const maxShowHighstates = wheelConfigValuesData.saltgui_max_show_highstates;
    Utils.setStorageItem("session", "max_show_highstates", JSON.stringify(maxShowHighstates));

    const maxHighstateStates = wheelConfigValuesData.saltgui_max_highstate_states;
    Utils.setStorageItem("session", "max_highstate_states", JSON.stringify(maxHighstateStates));

    const showSaltEnvs = wheelConfigValuesData.saltgui_show_saltenvs;
    Utils.setStorageItem("session", "show_saltenvs", JSON.stringify(showSaltEnvs));
    const hideSaltEnvs = wheelConfigValuesData.saltgui_hide_saltenvs;
    Utils.setStorageItem("session", "hide_saltenvs", JSON.stringify(hideSaltEnvs));

    const showJobs = wheelConfigValuesData.saltgui_show_jobs;
    Utils.setStorageItem("session", "show_jobs", JSON.stringify(showJobs));
    const hideJobs = wheelConfigValuesData.saltgui_hide_jobs;
    Utils.setStorageItem("session", "hide_jobs", JSON.stringify(hideJobs));

    const useCacheForGrains = wheelConfigValuesData.saltgui_use_cache_for_grains;
    Utils.setStorageItem("session", "use_cache_for_grains", JSON.stringify(useCacheForGrains));

    const useCacheForPillar = wheelConfigValuesData.saltgui_use_cache_for_pillar;
    Utils.setStorageItem("session", "use_cache_for_pillar", JSON.stringify(useCacheForPillar));

    const syndicMaster = wheelConfigValuesData.syndic_master;
    Utils.setStorageItem("session", "syndic_master", syndicMaster);

    const orderMasters = wheelConfigValuesData.order_masters;
    Utils.setStorageItem("session", "order_masters", orderMasters);

    let nodeGroups = wheelConfigValuesData.nodegroups;
    // Even when not set, the api server gives this an actual value "{}" here.
    // Let's assume the user never sets that value. Sounds reasonable because
    // when it is set, it is normally set to an actual value/list.
    if (!nodeGroups || !Object.keys(nodeGroups).length) {
      nodeGroups = undefined;
    }
    Utils.setStorageItem("session", "nodegroups", JSON.stringify(nodeGroups));

    const stateVerbose = wheelConfigValuesData.saltgui_state_verbose;
    Utils.setStorageItem("session", "state_verbose", JSON.stringify(stateVerbose));

    const stateCompressIds = wheelConfigValuesData.state_compress_ids;
    Utils.setStorageItem("session", "state_compress_ids", stateCompressIds);

    const stateOutput = wheelConfigValuesData.saltgui_state_output;
    Utils.setStorageItem("session", "state_output", stateOutput);

    const stateOutputPct = wheelConfigValuesData.saltgui_state_output_pct;
    Utils.setStorageItem("session", "state_output_pct", stateOutputPct);

    const outputFormats = wheelConfigValuesData.saltgui_output_formats;
    Utils.setStorageItem("session", "output_formats", outputFormats);

    const dateTimeFractionDigits = wheelConfigValuesData.saltgui_datetime_fraction_digits;
    Utils.setStorageItem("session", "datetime_fraction_digits", JSON.stringify(dateTimeFractionDigits));

    const dateTimeRepresentation = wheelConfigValuesData.saltgui_datetime_representation;
    Utils.setStorageItem("session", "datetime_representation", dateTimeRepresentation);

    const toolTipMode = wheelConfigValuesData.saltgui_tooltip_mode;
    Utils.setStorageItem("session", "tooltip_mode", toolTipMode);

    const motdTxt = wheelConfigValuesData.saltgui_motd_txt;
    Utils.setStorageItem("session", "motd_txt", motdTxt);

    const motdHtml = wheelConfigValuesData.saltgui_motd_html;
    Utils.setStorageItem("session", "motd_html", motdHtml);

    const customHelp = wheelConfigValuesData.saltgui_custom_command_help;
    Utils.setStorageItem("session", "custom_command_help", customHelp);

    const fullReturn = wheelConfigValuesData.saltgui_full_return;
    Utils.setStorageItem("session", "full_return", fullReturn);
  }

  _onLoginFailure (error) {
    if (typeof error === "string") {
      // something detected before trying to login
      this._showNoticeText("#F44336", error, "notice_login_string_error");
    } else if (error && error.status === 503) {
      // Service Unavailable
      // e.g. salt-api running but salt-master not running
      this._showNoticeText("#F44336", error.message, "notice_login_service_unavailable");
    } else if (error && error.status === -1) {
      // No permissions: login valid, but no api functions executable
      // e.g. PAM says OK and /etc/salt/master says NO
      this._showNoticeText("#F44336", error.message, "notice_login_other_error");
    } else if (error.toString().startsWith("TypeError: NetworkError")) {
      this._showNoticeText("#F44336", "Network Error", "notice_login_other_error");
    } else {
      this._showNoticeText("#F44336", "Authentication failed", "notice_auth_failed");
    }

    this._enableLoginControls(true);
  }

  _enableLoginControls (pEnable) {
    this.usernameField.disabled = !pEnable;
    this.passwordField.disabled = !pEnable;
    this.eauthField.disabled = !pEnable;
    this.loginButton.disabled = !pEnable;
    if (pEnable) {
      this.usernameField.focus();
    } else {
      this.usernameField.blur();
      this.passwordField.blur();
      this.eauthField.blur();
      this.loginButton.blur();
    }
  }
}
