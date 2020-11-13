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
      "token", "session_token");
    this._addOptionRow(
      "start", "session_start");
    this._addOptionRow(
      "expire", "session_expire");
    this._addOptionRow(
      "eauth", "session_eauth");
    this._addOptionRow(
      "user", "session_user");
    this._addOptionRow(
      "perms", "session_perms");
    this._addOptionRow(
      "nodegroups", "nodegroups", "(none)");
    this._addOptionRow(
      "templates", "saltgui_templates", "(none)");
    this._addOptionRow(
      "public-pillars", "saltgui_public_pillars", "(none)");
    this._addOptionRow(
      "preview-grains", "saltgui_preview_grains", "(none)");
    this._addOptionRow(
      "hide-jobs", "saltgui_hide_jobs", "(none)");
    this._addOptionRow(
      "show-jobs", "saltgui_show_jobs", "(all)");
    this._addOptionRow(
      "output-formats", "saltgui_output_formats", "'doc,saltguihighstate,json'",
      [
        ["doc", "doc", "none:no doc"],
        ["highstate", "saltgui:SaltGUI highstate", "normal:Normal highstate", "none:No highstate"],
        ["output", "json", "nested", "yaml"]
      ]);
    this._addOptionRow(
      "datetime-fraction-digits", "saltgui_datetime_fraction_digits", "6",
      [["digits", "0", "1", "2", "3", "4", "5", "6"]]);
    this._addOptionRow(
      "tooltip-mode", "saltgui_tooltip_mode", "'full'",
      [["mode", "full", "simple", "none"]]);
  }

  _addOptionRow (pId, pNameTxt, pDefaultValue, pValues = null) {
    const tr = document.createElement("tr");
    tr.id = "option-" + pId;
    tr.dataset.defaultValue = pDefaultValue;
    const tdName = Utils.createTd("", pNameTxt + ":", "option-" + pId + "-name");
    tdName.style.whiteSpace = "normal";
    tr.appendChild(tdName);
    const tdValue = Utils.createTd();
    if (pValues === null) {
      tdValue.id = "option-" + pId + "-value";
    } else {
      const span = Utils.createSpan("", "", "option-" + pId + "-value");
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
          radio.id = "option-" + pId + "-value-" + row[0] + "-" + itemValue;
          radio.type = "radio";
          radio.name = "option-" + pId + "-value-" + row[0];
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

    const nodegroupsValue = Utils.getStorageItem("session", "nodegroups");
    const nodegroupsTd = this.div.querySelector("#option-nodegroups-value");
    nodegroupsTd.innerText = this._makeNodegroupsValue("nodegroups", nodegroupsValue);

    const templatesValue = Utils.getStorageItem("session", "templates");
    const templatesTd = this.div.querySelector("#option-templates-value");
    templatesTd.innerText = this._makeTemplatesValue("templates", templatesValue);

    const publicPillarsValue = Utils.getStorageItem("session", "public_pillars");
    const publicPillarsTd = this.div.querySelector("#option-public-pillars-value");
    publicPillarsTd.innerText = this._makePublicPillarsValue("public-pillars", publicPillarsValue);

    const previewGrainsValue = Utils.getStorageItem("session", "preview_grains");
    const previewGrainsTd = this.div.querySelector("#option-preview-grains-value");
    previewGrainsTd.innerText = this._makePreviewGrainsValue("preview-grains", previewGrainsValue);

    const hideJobsValue = Utils.getStorageItem("session", "hide_jobs");
    const hideJobsTd = this.div.querySelector("#option-hide-jobs-value");
    hideJobsTd.innerText = this._makeHideJobsValue("hide-jobs", hideJobsValue);

    const showJobsValue = Utils.getStorageItem("session", "show_jobs");
    const showJobsTd = this.div.querySelector("#option-show-jobs-value");
    showJobsTd.innerText = this._makeShowJobsValue("show-jobs", showJobsValue);

    const outputFormatsValue = Utils.getStorageItem("session", "output_formats");
    const outputFormatsTd = this.div.querySelector("#option-output-formats-value");
    outputFormatsTd.innerText = this._makeOutputFormatsValue("output-formats", outputFormatsValue);

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
    datetimeFractionDigitsTd.innerText = this._makeDatetimeFractionDigitsValue("datetime-fraction-digits", datetimeFractionDigitsValue);
    const dfd0 = this.div.querySelector("#option-datetime-fraction-digits-value-digits-0");
    dfd0.addEventListener("change", (evt) => { this._newDatetimeFractionDigits(evt); });
    if (datetimeFractionDigitsValue === "0") dfd0.checked = true;
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
    if (datetimeFractionDigitsValue === null || datetimeFractionDigitsValue === "6") dfd6.checked = true;
    /* eslint-enable brace-style,curly,max-statements-per-line */

    /* eslint-disable brace-style,curly,max-statements-per-line */
    const tooltipModeValue = Utils.getStorageItem("session", "tooltip_mode");
    const tooltipModeTd = this.div.querySelector("#option-tooltip-mode-value");
    tooltipModeTd.innerText = this._makeTooltipModeValue("tooltip-mode", tooltipModeValue);
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

  _parseAndFormat (id, valueStr) {
    /* eslint-disable curly */
    if (valueStr === null) valueStr = undefined;
    if (valueStr === "undefined") valueStr = undefined;
    /* eslint-enable curly */
    if (valueStr === undefined) {
      const tr = this.div.querySelector("#option-" + id);
      if (tr.dataset.defaultValue) {
        // 2192 = RIGHTWARDS ARROW
        return "(undefined) \u2192 " + tr.dataset.defaultValue;
      }
      return "(undefined)";
    }
    const value = JSON.parse(valueStr);
    return OutputYaml.formatYAML(value);
  }

  _makeNodegroupsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makeTemplatesValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makePublicPillarsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makePreviewGrainsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makeHideJobsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makeShowJobsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makeOutputFormatsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makeDatetimeFractionDigitsValue (id, value) {
    return this._parseAndFormat(id, value);
  }

  _makeTooltipModeValue (id, value) {
    return this._parseAndFormat(id, value);
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
    outputFormatsTd.innerText = this._makeOutputFormatsValue("output-formats", value);
    Utils.setStorageItem("session", "output_formats", value);
  }

  _newDatetimeFractionDigits (evt) {
    Utils.setStorageItem("session", "datetime_fraction_digits", parseInt(evt.target.value, 10));
    const datetimeFractionDigitsTd = this.div.querySelector("#option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = evt.target.value;
  }

  _newTooltipMode (evt) {
    Utils.setStorageItem("session", "tooltip_mode", evt.target.value);
    const tooltipModeTd = this.div.querySelector("#option-tooltip-mode-value");
    tooltipModeTd.innerText = evt.target.value;
  }
}
