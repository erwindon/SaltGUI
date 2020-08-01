/* global document */

import {OutputYaml} from "../output/OutputYaml.js";
import {PageRoute} from "./Page.js";
import {Utils} from "../Utils.js";

export class OptionsRoute extends PageRoute {

  constructor (router) {
    super("options", "Options", "page-options", "", router);

    this._newOutputFormats = this._newOutputFormats.bind(this);

    Utils.addTableHelp(this.getPageElement(), "Names 'session_*' show the values from the login session\nNames 'saltgui_*' show the values from the master file '/etc/salt/master'\nChanges made in this screen are valid for this session ONLY");

    Utils.makeTableSearchable(this.getPageElement(), "options-search-button", "options-table");
    Utils.makeTableSearchable(this.getPageElement(), "options-search-button-jobs", "options-jobs-table");
  }

  onShow () {
    const that = this;

    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      that.handleRunnerJobsListJobs(pRunnerJobsListJobsData);
      runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
        that.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, (pRunnerJobsActiveMsg) => {
        that.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, (pRunnerJobsListJobsMsg) => {
      that.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    });

    const loginResponseStr = Utils.getStorageItem("session", "login-response", "{}");
    const loginResponse = JSON.parse(loginResponseStr);

    const tokenValue = loginResponse.token;
    const tokenTd = document.getElementById("option-token-value");
    tokenTd.innerText = tokenValue;

    const startValue = loginResponse.start;
    const startTd = document.getElementById("option-start-value");
    const startStr = new Date(startValue * 1000);
    startTd.innerText = startValue + "\n" + startStr;

    const expireValue = loginResponse.expire;
    const expireTd = document.getElementById("option-expire-value");
    const expireStr = new Date(expireValue * 1000);
    const date = new Date(null);
    if (loginResponse.expire && loginResponse.start) {
      date.setSeconds(loginResponse.expire - loginResponse.start);
    }
    let durationStr = "";
    const str = date.toISOString();
    if (str.startsWith("1970-01-01T")) {
      // remove the date prefix and the millisecond suffix
      durationStr = "\nduration is " + str.substr(11, 8);
    }
    let expiresInStr = "";
    const str2 = new Date(expireValue * 1000 - Date.now()).toISOString();
    if (str2.startsWith("1970-01-01T")) {
      // remove the date prefix and the millisecond suffix
      expiresInStr = "\nexpires in " + str2.substr(11, 8);
    }
    expireTd.innerText = expireValue + "\n" + expireStr + durationStr + expiresInStr;

    const eauthValue = loginResponse.eauth;
    const eauthTd = document.getElementById("option-eauth-value");
    eauthTd.innerText = eauthValue;

    const userValue = loginResponse.user;
    const userTd = document.getElementById("option-user-value");
    userTd.innerText = userValue;

    const permsValue = OutputYaml.formatYAML(loginResponse.perms);
    const permsTd = document.getElementById("option-perms-value");
    permsTd.innerText = permsValue;

    const templatesValue = Utils.getStorageItem("session", "templates");
    const templatesTd = document.getElementById("option-templates-value");
    templatesTd.innerText = this._makeTemplatesValue(templatesValue);

    const publicPillarsValue = Utils.getStorageItem("session", "public_pillars");
    const publicPillarsTd = document.getElementById("option-public-pillars-value");
    publicPillarsTd.innerText = this._makePublicPillarsValue(publicPillarsValue);

    const previewGrainsValue = Utils.getStorageItem("session", "preview_grains");
    const previewGrainsTd = document.getElementById("option-preview-grains-value");
    previewGrainsTd.innerText = this._makePreviewGrainsValue(previewGrainsValue);

    const hideJobsValue = Utils.getStorageItem("session", "hide_jobs");
    const hideJobsTd = document.getElementById("option-hide-jobs-value");
    hideJobsTd.innerText = this._makeHideJobsValue(hideJobsValue);

    const showJobsValue = Utils.getStorageItem("session", "show_jobs");
    const showJobsTd = document.getElementById("option-show-jobs-value");
    showJobsTd.innerText = this._makeShowJobsValue(showJobsValue);

    const nodegroupsValue = Utils.getStorageItem("session", "nodegroups");
    const nodegroupsTd = document.getElementById("option-nodegroups-value");
    nodegroupsTd.innerText = this._makeNodegroupsValue(nodegroupsValue);

    const outputFormatsValue = Utils.getStorageItem("session", "output_formats");
    const outputFormatsTd = document.getElementById("option-output-formats-value");
    outputFormatsTd.innerText = this._makeOutputFormatsValue(outputFormatsValue);

    // ordering:
    // defaults (no-doc and no-highstate) before actual choices
    // highstate before saltguihighstate because of string inclusion
    const of1 = document.getElementById("output-formats-doc-none");
    of1.addEventListener("change", this._newOutputFormats);
    of1.checked = true;
    const of0 = document.getElementById("output-formats-doc-doc");
    of0.addEventListener("change", this._newOutputFormats);
    of0.checked = outputFormatsValue && outputFormatsValue.includes("doc");
    const of4 = document.getElementById("output-formats-highstate-none");
    of4.addEventListener("change", this._newOutputFormats);
    of4.checked = true;
    const of3 = document.getElementById("output-formats-highstate-normal");
    of3.addEventListener("change", this._newOutputFormats);
    of3.checked = outputFormatsValue && outputFormatsValue.includes("highstate");
    const of2 = document.getElementById("output-formats-highstate-saltgui");
    of2.addEventListener("change", this._newOutputFormats);
    of2.checked = outputFormatsValue && outputFormatsValue.includes("saltguihighstate");
    const of5 = document.getElementById("output-formats-output-json");
    of5.addEventListener("change", this._newOutputFormats);
    of5.checked = outputFormatsValue && outputFormatsValue.includes("json");
    const of6 = document.getElementById("output-formats-output-nested");
    of6.addEventListener("change", this._newOutputFormats);
    of6.checked = outputFormatsValue && outputFormatsValue.includes("nested");
    const of7 = document.getElementById("output-formats-output-yaml");
    of7.addEventListener("change", this._newOutputFormats);
    of7.checked = outputFormatsValue && outputFormatsValue.includes("yaml");

    /* eslint-disable curly */
    const datetimeFractionDigitsValue = Utils.getStorageItem("session", "datetime_fraction_digits");
    const datetimeFractionDigitsTd = document.getElementById("option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = this._makeDatetimeFractionDigitsValue(datetimeFractionDigitsValue);
    const dfd0 = document.getElementById("datetime-fraction-digits0");
    dfd0.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "0") dfd0.checked = true;
    const dfd1 = document.getElementById("datetime-fraction-digits1");
    dfd1.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "1") dfd1.checked = true;
    const dfd2 = document.getElementById("datetime-fraction-digits2");
    dfd2.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "2") dfd2.checked = true;
    const dfd3 = document.getElementById("datetime-fraction-digits3");
    dfd3.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "3") dfd3.checked = true;
    const dfd4 = document.getElementById("datetime-fraction-digits4");
    dfd4.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "4") dfd4.checked = true;
    const dfd5 = document.getElementById("datetime-fraction-digits5");
    dfd5.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "5") dfd5.checked = true;
    const dfd6 = document.getElementById("datetime-fraction-digits6");
    dfd6.addEventListener("change", this._newDatetimeFractionDigits);
    if (datetimeFractionDigitsValue === "6") dfd6.checked = true;
    /* eslint-enable curly */

    /* eslint-disable curly */
    const tooltipModeValue = Utils.getStorageItem("session", "tooltip_mode");
    const tooltipModeTd = document.getElementById("option-tooltip-mode-value");
    tooltipModeTd.innerText = this._makeTooltipModeValue(tooltipModeValue);
    const tm0 = document.getElementById("tooltip-mode-full");
    tm0.addEventListener("change", this._newTooltipMode);
    if (tooltipModeValue === "full") tm0.checked = true;
    const tm1 = document.getElementById("tooltip-mode-simple");
    tm1.addEventListener("change", this._newTooltipMode);
    if (tooltipModeValue === "simple") tm1.checked = true;
    const tm2 = document.getElementById("tooltip-mode-none");
    tm2.addEventListener("change", this._newTooltipMode);
    if (tooltipModeValue === "none") tm2.checked = true;
    /* eslint-enable curly */

    const msgSpan = document.getElementById("options-msg");
    msgSpan.style.display = "none";
  }

  _parseAndFormat (valueStr) {
    /* eslint-disable curly */
    if (valueStr === undefined) return "(undefined)";
    if (valueStr === null) return "(undefined)";
    if (valueStr === "undefined") return "(undefined)";
    /* eslint-enable curly */
    const value = JSON.parse(valueStr);
    return OutputYaml.formatYAML(value);
  }

  _makeTemplatesValue (value) {
    return this._parseAndFormat(value);
  }

  _makePublicPillarsValue (value) {
    return this._parseAndFormat(value);
  }

  _makePreviewGrainsValue (value) {
    return this._parseAndFormat(value);
  }

  _makeHideJobsValue (value) {
    return this._parseAndFormat(value);
  }

  _makeShowJobsValue (value) {
    return this._parseAndFormat(value);
  }

  _makeNodegroupsValue (value) {
    return this._parseAndFormat(value);
  }

  _makeOutputFormatsValue (value) {
    return this._parseAndFormat(value);
  }

  _newOutputFormats () {
    let value = "";
    /* eslint-disable curly */
    const of0 = document.getElementById("output-formats-doc-doc");
    if (of0.checked) value += ",doc";
    const of2 = document.getElementById("output-formats-highstate-saltgui");
    if (of2.checked) value += ",saltguihighstate";
    const of3 = document.getElementById("output-formats-highstate-normal");
    if (of3.checked) value += ",highstate";
    const of5 = document.getElementById("output-formats-output-json");
    if (of5.checked) value += ",json";
    const of6 = document.getElementById("output-formats-output-nested");
    if (of6.checked) value += ",nested";
    const of7 = document.getElementById("output-formats-output-yaml");
    if (of7.checked) value += ",yaml";
    /* eslint-enable curly */
    value = "\"" + value.substring(1) + "\"";
    const outputFormatsTd = document.getElementById("option-output-formats-value");
    outputFormatsTd.innerText = this._makeOutputFormatsValue(value);
    Utils.setStorageItem("session", "output_formats", value);
  }

  _makeDatetimeFractionDigitsValue (value) {
    return this._parseAndFormat(value);
  }

  _newDatetimeFractionDigits (evt) {
    Utils.setStorageItem("session", "datetime_fraction_digits", parseInt(evt.target.value, 10));
    const datetimeFractionDigitsTd = document.getElementById("option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = evt.target.value;
  }

  _makeTooltipModeValue (value) {
    if (value === undefined) {
      return "(undefined)";
    }
    if (value === null) {
      return "(undefined)";
    }
    if (value === "undefined") {
      return "(undefined)";
    }
    return value;
  }

  _newTooltipMode (evt) {
    Utils.setStorageItem("session", "tooltip_mode", evt.target.value);
    const tooltipModeTd = document.getElementById("option-tooltip-mode-value");
    tooltipModeTd.innerText = evt.target.value;
  }
}
