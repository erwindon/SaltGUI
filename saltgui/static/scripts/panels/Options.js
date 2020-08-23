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

    // the panel is not part of the DOM yet
    const tbody = this.div.querySelector("tbody");

    this._addOptionRow(tbody,
      "token-name", "session_token", "token-value");
    this._addOptionRow(tbody,
      "start-name", "session_start", "start-value");
    this._addOptionRow(tbody,
      "expire-name", "session_expire", "expire-value");
    this._addOptionRow(tbody,
      "eauth-name", "session_eauth", "eauth-value");
    this._addOptionRow(tbody,
      "user-name", "session_user", "user-value");
    this._addOptionRow(tbody,
      "perms-name", "session_perms", "perms-value");
    this._addOptionRow(tbody,
      "nodegroups-name", "nodegroups", "nodegroups-value");
    this._addOptionRow(tbody,
      "templates-name", "saltgui_templates", "templates-value");
    this._addOptionRow(tbody,
      "public-pillars-name", "saltgui_public_pillars", "public-pillars-value");
    this._addOptionRow(tbody,
      "preview-grains-name", "saltgui_preview_grains", "preview-grains-value");
    this._addOptionRow(tbody,
      "hide-jobs-name", "saltgui_hide_jobs", "hide-jobs-value");
    this._addOptionRow(tbody,
      "show-jobs-name", "saltgui_show_jobs", "show-jobs-value");
    this._addOptionRow(tbody,
      "output-formats-name", "saltgui_output_formats", "output-formats-value",
      [
        ["doc", "doc", "none:no doc"],
        ["highstate", "saltgui:SaltGUI highstate", "normal:Normal highstate", "none:No highstate"],
        ["output", "json", "nested", "yaml"]
      ]);
    this._addOptionRow(tbody,
      "datetime-fraction-digits-name", "saltgui_datetime_fraction_digits", "datetime-fraction-digits-value",
      [["digits", "0", "1", "2", "3", "4", "5", "6"]]);
    this._addOptionRow(tbody,
      "tooltip-mode-name", "saltgui_tooltip_mode", "tooltip-mode-value",
      [["mode", "full", "simple", "none"]]);
  }

  _addOptionRow (pBody, pNameId, pNameTxt, pValueId, pValues = null) {
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    tdName.id = "option-" + pNameId;
    tdName.style = "white-space: normal";
    tdName.innerText = pNameTxt + ":";
    tr.appendChild(tdName);
    const tdValue = document.createElement("td");
    if (pValues === null) {
      tdValue.id = "option-" + pValueId;
    } else {
      const span = document.createElement("span");
      span.id = "option-" + pValueId;
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
    pBody.appendChild(tr);
  }

  onShow () {
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
    /* eslint-disable brace-style,max-statements-per-line */
    const of1 = document.getElementById("option-output-formats-value-doc-none");
    of1.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of1.checked = true;
    const of0 = document.getElementById("option-output-formats-value-doc-doc");
    of0.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of0.checked = outputFormatsValue && outputFormatsValue.includes("doc");
    const of4 = document.getElementById("option-output-formats-value-highstate-none");
    of4.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of4.checked = true;
    const of3 = document.getElementById("option-output-formats-value-highstate-normal");
    of3.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of3.checked = outputFormatsValue && outputFormatsValue.includes("highstate");
    const of2 = document.getElementById("option-output-formats-value-highstate-saltgui");
    of2.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of2.checked = outputFormatsValue && outputFormatsValue.includes("saltguihighstate");
    const of5 = document.getElementById("option-output-formats-value-output-json");
    of5.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of5.checked = outputFormatsValue && outputFormatsValue.includes("json");
    const of6 = document.getElementById("option-output-formats-value-output-nested");
    of6.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of6.checked = outputFormatsValue && outputFormatsValue.includes("nested");
    const of7 = document.getElementById("option-output-formats-value-output-yaml");
    of7.addEventListener("change", (evt) => { this._newOutputFormats(evt); });
    of7.checked = outputFormatsValue && outputFormatsValue.includes("yaml");
    /* eslint-enable brace-style,max-statements-per-line */

    /* eslint-disable brace-style,curly,max-statements-per-line */
    const datetimeFractionDigitsValue = Utils.getStorageItem("session", "datetime_fraction_digits");
    const datetimeFractionDigitsTd = document.getElementById("option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = this._makeDatetimeFractionDigitsValue(datetimeFractionDigitsValue);
    const dfd0 = document.getElementById("option-datetime-fraction-digits-value-digits-0");
    dfd0.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "0") dfd0.checked = true;
    const dfd1 = document.getElementById("option-datetime-fraction-digits-value-digits-1");
    dfd1.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "1") dfd1.checked = true;
    const dfd2 = document.getElementById("option-datetime-fraction-digits-value-digits-2");
    dfd2.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "2") dfd2.checked = true;
    const dfd3 = document.getElementById("option-datetime-fraction-digits-value-digits-3");
    dfd3.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "3") dfd3.checked = true;
    const dfd4 = document.getElementById("option-datetime-fraction-digits-value-digits-4");
    dfd4.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "4") dfd4.checked = true;
    const dfd5 = document.getElementById("option-datetime-fraction-digits-value-digits-5");
    dfd5.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "5") dfd5.checked = true;
    const dfd6 = document.getElementById("option-datetime-fraction-digits-value-digits-6");
    dfd6.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "6") dfd6.checked = true;
    /* eslint-enable brace-style,curly,max-statements-per-line */

    /* eslint-disable brace-style,curly,max-statements-per-line */
    const tooltipModeValue = Utils.getStorageItem("session", "tooltip_mode");
    const tooltipModeTd = document.getElementById("option-tooltip-mode-value");
    tooltipModeTd.innerText = this._makeTooltipModeValue(tooltipModeValue);
    const tm0 = document.getElementById("option-tooltip-mode-value-mode-full");
    tm0.addEventListener("change", (evt) => { this._newTooltipMode(evt); });
    if (tooltipModeValue === "full") tm0.checked = true;
    const tm1 = document.getElementById("option-tooltip-mode-value-mode-simple");
    tm1.addEventListener("change", (evt) => { this._newTooltipMode(evt); });
    if (tooltipModeValue === "simple") tm1.checked = true;
    const tm2 = document.getElementById("option-tooltip-mode-value-mode-none");
    tm2.addEventListener("change", (evt) => { this._newTooltipMode(evt); });
    if (tooltipModeValue === "none") tm2.checked = true;
    /* eslint-enable brace-style,curly,max-statements-per-line */
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
    const of0 = document.getElementById("option-output-formats-value-doc-doc");
    if (of0.checked) value += ",doc";
    const of2 = document.getElementById("option-output-formats-value-highstate-saltgui");
    if (of2.checked) value += ",saltguihighstate";
    const of3 = document.getElementById("option-output-formats-value-highstate-normal");
    if (of3.checked) value += ",highstate";
    const of5 = document.getElementById("option-output-formats-value-output-json");
    if (of5.checked) value += ",json";
    const of6 = document.getElementById("option-output-formats-value-output-nested");
    if (of6.checked) value += ",nested";
    const of7 = document.getElementById("option-output-formats-value-output-yaml");
    if (of7.checked) value += ",yaml";
    /* eslint-enable curly */
    value = JSON.stringify(value.substring(1));
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
