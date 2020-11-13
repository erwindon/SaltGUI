/* global document */

import {OutputYaml} from "../output/OutputYaml.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class OptionsPanel extends Panel {

  constructor () {
    super("options");

    this.addTitle("Options");
    // this.addSearchButton();
    this.addHelpButton("Names 'session_*' show the values from the login session\nNames 'saltgui_*' show the values from the master file '/etc/salt/master'\nChanges made in this screen are valid for this session ONLY");
    this.addTable(["Name", "Value"]);

    this._addOptionRow(
      "token-name", "session_token", "token-value");
    this._addOptionRow(
      "start-name", "session_start", "start-value");
    this._addOptionRow(
      "expire-name", "session_expire", "expire-value");
    this._addOptionRow(
      "eauth-name", "session_eauth", "eauth-value");
    this._addOptionRow(
      "user-name", "session_user", "user-value");
    this._addOptionRow(
      "perms-name", "session_perms", "perms-value");
    this._addOptionRow(
      "nodegroups-name", "nodegroups", "nodegroups-value");
    this._addOptionRow(
      "templates-name", "saltgui_templates", "templates-value");
    this._addOptionRow(
      "public-pillars-name", "saltgui_public_pillars", "public-pillars-value");
    this._addOptionRow(
      "preview-grains-name", "saltgui_preview_grains", "preview-grains-value");
    this._addOptionRow(
      "hide-jobs-name", "saltgui_hide_jobs", "hide-jobs-value");
    this._addOptionRow(
      "show-jobs-name", "saltgui_show_jobs", "show-jobs-value");
    this._addOptionRow(
      "output-formats-name", "saltgui_output_formats", "output-formats-value",
      [
        ["doc", "doc", "none:no doc"],
        ["highstate", "saltgui:SaltGUI highstate", "normal:Normal highstate", "none:No highstate"],
        ["output", "json", "nested", "yaml"]
      ]);
    this._addOptionRow(
      "datetime-fraction-digits-name", "saltgui_datetime_fraction_digits", "datetime-fraction-digits-value",
      [["digits", "0", "1", "2", "3", "4", "5", "6"]]);
    this._addOptionRow(
      "tooltip-mode-name", "saltgui_tooltip_mode", "tooltip-mode-value",
      [["mode", "full", "simple", "none"]]);
  }

  _addOptionRow (pNameId, pNameTxt, pValueId, pValues = null) {
    const tr = document.createElement("tr");
    const tdName = Utils.createTd("", pNameTxt + ":", "option-" + pNameId);
    tdName.style.whiteSpace = "normal";
    tr.appendChild(tdName);
    const tdValue = Utils.createTd();
    if (pValues === null) {
      tdValue.id = "option-" + pValueId;
    } else {
      const span = Utils.createSpan("", "", "option-" + pValueId);
      tdValue.appendChild(span);
      const br1 = document.createElement("br");
      tdValue.appendChild(br1);
      const br2 = document.createElement("br");
      tdValue.appendChild(br2);
      let addSep = false;
      for (const row of pValues) {
        if (addSep) {
          const br3 = document.createElement("br");
          tdValue.appendChild(br3);
        }
        addSep = true;
        for (let i = 1; i < row.length; i++) {
          let itemText = row[i];
          let itemValue = row[i];
          const colonPos = row[i].search(":");
          if (colonPos > 0) {
            itemValue = row[i].substring(0, colonPos);
            itemText = row[i].substring(colonPos + 1);
          }
          const radio = document.createElement("input");
          radio.id = "option-" + pValueId + "-" + row[0] + "-" + itemValue;
          radio.type = "radio";
          radio.name = "option-" + pValueId + "-" + row[0];
          radio.value = itemValue;
          tdValue.appendChild(radio);
          const label = document.createElement("label");
          label.htmlFor = radio.id;
          label.innerText = itemText;
          tdValue.appendChild(label);
        }
      }
    }
    tr.appendChild(tdValue);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);
  }

  onShow () {
    const loginResponseStr = Utils.getStorageItem("session", "login-response", "{}");
    const loginResponse = JSON.parse(loginResponseStr);

    const tokenValue = loginResponse.token;
    const tokenTd = this.div.querySelector("#option-token-value");
    tokenTd.innerText = tokenValue;

    const startValue = loginResponse.start;
    const startTd = this.div.querySelector("#option-start-value");
    const startStr = new Date(startValue * 1000);
    startTd.innerText = startValue + "\n" + startStr;

    const expireValue = loginResponse.expire;
    const expireTd = this.div.querySelector("#option-expire-value");
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
    const eauthTd = this.div.querySelector("#option-eauth-value");
    eauthTd.innerText = eauthValue;

    const userValue = loginResponse.user;
    const userTd = this.div.querySelector("#option-user-value");
    userTd.innerText = userValue;

    const permsValue = OutputYaml.formatYAML(loginResponse.perms);
    const permsTd = this.div.querySelector("#option-perms-value");
    permsTd.innerText = permsValue;

    const templatesValue = Utils.getStorageItem("session", "templates");
    const templatesTd = this.div.querySelector("#option-templates-value");
    templatesTd.innerText = OptionsPanel._makeTemplatesValue(templatesValue);

    const publicPillarsValue = Utils.getStorageItem("session", "public_pillars");
    const publicPillarsTd = this.div.querySelector("#option-public-pillars-value");
    publicPillarsTd.innerText = OptionsPanel._makePublicPillarsValue(publicPillarsValue);

    const previewGrainsValue = Utils.getStorageItem("session", "preview_grains");
    const previewGrainsTd = this.div.querySelector("#option-preview-grains-value");
    previewGrainsTd.innerText = OptionsPanel._makePreviewGrainsValue(previewGrainsValue);

    const hideJobsValue = Utils.getStorageItem("session", "hide_jobs");
    const hideJobsTd = this.div.querySelector("#option-hide-jobs-value");
    hideJobsTd.innerText = OptionsPanel._makeHideJobsValue(hideJobsValue);

    const showJobsValue = Utils.getStorageItem("session", "show_jobs");
    const showJobsTd = this.div.querySelector("#option-show-jobs-value");
    showJobsTd.innerText = OptionsPanel._makeShowJobsValue(showJobsValue);

    const nodegroupsValue = Utils.getStorageItem("session", "nodegroups");
    const nodegroupsTd = this.div.querySelector("#option-nodegroups-value");
    nodegroupsTd.innerText = OptionsPanel._makeNodegroupsValue(nodegroupsValue);

    const outputFormatsValue = Utils.getStorageItem("session", "output_formats");
    const outputFormatsTd = this.div.querySelector("#option-output-formats-value");
    outputFormatsTd.innerText = OptionsPanel._makeOutputFormatsValue(outputFormatsValue);

    // ordering:
    // defaults (no-doc and no-highstate) before actual choices
    // highstate before saltguihighstate because of string inclusion
    /* eslint-disable brace-style,max-statements-per-line */
    const of0 = this.div.querySelector("#option-output-formats-value-doc-doc");
    of0.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of0.checked = !outputFormatsValue || outputFormatsValue.includes("doc");
    const of1 = this.div.querySelector("#option-output-formats-value-doc-none");
    of1.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of1.checked = outputFormatsValue && !outputFormatsValue.includes("doc");

    const of3 = this.div.querySelector("#option-output-formats-value-highstate-normal");
    of3.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of3.checked = outputFormatsValue && outputFormatsValue.includes("highstate");
    const of2 = this.div.querySelector("#option-output-formats-value-highstate-saltgui");
    of2.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of2.checked = !outputFormatsValue || outputFormatsValue.includes("saltguihighstate");
    const of4 = this.div.querySelector("#option-output-formats-value-highstate-none");
    of4.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of4.checked = outputFormatsValue && !outputFormatsValue.includes("highstate");

    const of5 = this.div.querySelector("#option-output-formats-value-output-json");
    of5.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of5.checked = !outputFormatsValue || outputFormatsValue.includes("json");
    const of6 = this.div.querySelector("#option-output-formats-value-output-nested");
    of6.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of6.checked = outputFormatsValue && outputFormatsValue.includes("nested");
    const of7 = this.div.querySelector("#option-output-formats-value-output-yaml");
    of7.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of7.checked = outputFormatsValue && outputFormatsValue.includes("yaml");
    /* eslint-enable brace-style,max-statements-per-line */

    /* eslint-disable brace-style,curly,max-statements-per-line */
    const datetimeFractionDigitsValue = Utils.getStorageItem("session", "datetime_fraction_digits");
    const datetimeFractionDigitsTd = this.div.querySelector("#option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = OptionsPanel._makeDatetimeFractionDigitsValue(datetimeFractionDigitsValue);
    const dfd0 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-0");
    dfd0.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === null || datetimeFractionDigitsValue === "0") dfd0.checked = true;
    const dfd1 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-1");
    dfd1.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "1") dfd1.checked = true;
    const dfd2 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-2");
    dfd2.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "2") dfd2.checked = true;
    const dfd3 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-3");
    dfd3.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "3") dfd3.checked = true;
    const dfd4 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-4");
    dfd4.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "4") dfd4.checked = true;
    const dfd5 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-5");
    dfd5.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "5") dfd5.checked = true;
    const dfd6 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-6");
    dfd6.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "6") dfd6.checked = true;
    /* eslint-enable brace-style,curly,max-statements-per-line */

    /* eslint-disable brace-style,curly,max-statements-per-line */
    const tooltipModeValue = Utils.getStorageItem("session", "tooltip_mode");
    const tooltipModeTd = this.div.querySelector("#option-tooltip-mode-value");
    tooltipModeTd.innerText = OptionsPanel._makeTooltipModeValue(tooltipModeValue);
    const tm0 = this.div.querySelector("#option-tooltip-mode-value-mode-full");
    tm0.addEventListener("change", (evt) => { this._newTooltipMode(evt); });
    if (!tooltipModeValue || tooltipModeValue === "full") tm0.checked = true;
    const tm1 = this.div.querySelector("#option-tooltip-mode-value-mode-simple");
    tm1.addEventListener("change", (evt) => { this._newTooltipMode(evt); });
    if (tooltipModeValue === "simple") tm1.checked = true;
    const tm2 = this.div.querySelector("#option-tooltip-mode-value-mode-none");
    tm2.addEventListener("change", (evt) => { this._newTooltipMode(evt); });
    if (tooltipModeValue === "none") tm2.checked = true;
    /* eslint-enable brace-style,curly,max-statements-per-line */
  }

  static _parseAndFormat (valueStr) {
    /* eslint-disable curly */
    if (valueStr === undefined) return "(undefined)";
    if (valueStr === null) return "(undefined)";
    if (valueStr === "undefined") return "(undefined)";
    /* eslint-enable curly */
    const value = JSON.parse(valueStr);
    return OutputYaml.formatYAML(value);
  }

  static _makeTemplatesValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  static _makePublicPillarsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  static _makePreviewGrainsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  static _makeHideJobsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  static _makeShowJobsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  static _makeNodegroupsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  static _makeOutputFormatsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  _newOutputFormats () {
    let value = "";
    /* eslint-disable curly */
    const of0 = this.div.querySelector("#option-output-formats-value-doc-doc");
    if (of0.checked) value += ",doc";
    const of2 = this.div.querySelector("#option-output-formats-value-highstate-saltgui");
    if (of2.checked) value += ",saltguihighstate";
    const of3 = this.div.querySelector("#option-output-formats-value-highstate-normal");
    if (of3.checked) value += ",highstate";
    const of5 = this.div.querySelector("#option-output-formats-value-output-json");
    if (of5.checked) value += ",json";
    const of6 = this.div.querySelector("#option-output-formats-value-output-nested");
    if (of6.checked) value += ",nested";
    const of7 = this.div.querySelector("#option-output-formats-value-output-yaml");
    if (of7.checked) value += ",yaml";
    /* eslint-enable curly */
    value = JSON.stringify(value.substring(1));
    const outputFormatsTd = this.div.querySelector("#option-output-formats-value");
    outputFormatsTd.innerText = OptionsPanel._makeOutputFormatsValue(value);
    Utils.setStorageItem("session", "output_formats", value);
  }

  static _makeDatetimeFractionDigitsValue (value) {
    return OptionsPanel._parseAndFormat(value);
  }

  _newDatetimeFractionDigits (evt) {
    Utils.setStorageItem("session", "datetime_fraction_digits", parseInt(evt.target.value, 10));
    const datetimeFractionDigitsTd = this.div.querySelector("#option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = evt.target.value;
  }

  static _makeTooltipModeValue (value) {
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
    const tooltipModeTd = this.div.querySelector("#option-tooltip-mode-value");
    tooltipModeTd.innerText = evt.target.value;
  }
}
