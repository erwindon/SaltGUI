/* global */

import {Character} from "../Character.js";
import {LoginPanel} from "../panels/Login.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Router} from "../Router.js";
import {Utils} from "../Utils.js";

export class OptionsPanel extends Panel {

  constructor () {
    super("options");

    this.addTitle("Options");
    this.addSearchButton();
    this.addHelpButton([
      "Names 'session_*' show the values from the login session.",
      "Names 'saltgui_*' show the values from the master file '/etc/salt/master'.",
      "Other names are regular variables from the master file.",
      "Changes made in this screen are valid for this session ONLY."
    ]);

    const txt = Utils.createDiv("", Character.CIRCLED_INFORMATION_SOURCE + " Any changes made here are for this login session only");
    this.div.append(txt);

    this.addTable(["Name", "Value"]);

    this.options = [
      ["saltgui", "version"],
      ["eauth", "session"],
      ["user", "session"],
      ["token", "session"],
      ["start", "session"],
      ["expire", "session"],
      ["perms", "session"],
      ["nodegroups", null, "(none)"],
      [
        "state-compress-ids", null, "false",
        [["compress-ids", "true", "false"]]
      ],
      [
        "state-output", null, "full",
        [["output", "full", "terse", "mixed", "changes", "full_id", "terse_id", "mixed_id", "changes_id"]]
      ],
      [
        "state-output-pct", null, "false",
        [["output-pct", "true", "false"]]
      ],
      [
        "state-verbose", null, "true",
        [["verbose", "true", "false"]]
      ],
      [
        "datetime-fraction-digits", "saltgui", "6",
        [["digits", "0", "1", "2", "3", "4", "5", "6"]]
      ],
      [
        "datetime-representation", "saltgui", "utc",
        [["representation", "utc", "local", "utc-localtime:utc+localtime", "local-utctime:local+utctime"]]
      ],
      [
        "full-return", "saltgui", "false",
        [["full-return", "true", "false"]]
      ],

      /* note that this is not in the alphabetic order */
      ["show-jobs", "saltgui", "(all)"],
      ["hide-jobs", "saltgui", "(none)"],

      ["ipnumber_field", "saltgui", "fqdn_ip4"],
      ["ipnumber_prefix", "saltgui", "(none)"],

      ["max-show-highstates", "saltgui", "10"],
      ["max-highstate-states", "saltgui", "20"],

      /* note that this is not in the alphabetic order */
      ["show-saltenvs", "saltgui", "(all)"],
      ["hide-saltenvs", "saltgui", "(none)"],

      ["motd-txt", "saltgui", "(none)"],
      ["motd-html", "saltgui", "(none)"],
      [
        "output-formats", "saltgui", "doc,saltguihighstate,json",
        [
          ["doc", "doc", "none:no doc"],
          ["highstate", "saltguihighstate:SaltGUI highstate", "highstate:Normal highstate", "none:No highstate"],
          ["output", "json", "nested", "yaml"]
        ]
      ],
      ["preview-grains", "saltgui", "(none)"],
      ["public-pillars", "saltgui", "(none)"],
      [
        "use-cache-for-grains", "saltgui", "false",
        [["grains", "true", "false"]]
      ],
      [
        "use-cache-for-pillar", "saltgui", "false",
        [["pillar", "true", "false"]]
      ],
      ["templates", "saltgui", "(none)"],
      [
        "tooltip-mode", "saltgui", "full",
        [["mode", "full", "simple", "none"]]
      ],

      /* last because it might be very long */
      ["custom-command-help", "saltgui", "(none)"]
    ];
  }

  _addOptionRow (pName, pCategory, pDefaultValue, pValues = null) {
    const tr = Utils.createTr();
    tr.id = "option-" + pName;
    tr.dataset.defaultValue = pDefaultValue;

    const labelTxt = (pCategory ? pCategory + "_" : "") + pName.replace(/-/g, "_");
    const tdName = Utils.createTd("", labelTxt + ":", "option-" + pName + "-name");
    tdName.style.whiteSpace = "normal";
    tr.appendChild(tdName);

    const tdValue = Utils.createTd();
    if (pValues === null) {
      tdValue.id = "option-" + pName + "-value";
    } else {
      const span = Utils.createSpan("", "", "option-" + pName + "-value");
      tdValue.appendChild(span);

      const br1 = Utils.createBr();
      tdValue.appendChild(br1);

      const br2 = Utils.createBr();
      tdValue.appendChild(br2);

      let addSep = false;
      for (const row of pValues) {
        if (addSep) {
          const br3 = Utils.createBr();
          tdValue.appendChild(br3);
        }
        addSep = true;
        for (let i = 1; i < row.length; i++) {
          let itemValue = row[i];
          let itemLabel = row[i];
          const colonPos = row[i].search(":");
          if (colonPos > 0) {
            itemValue = row[i].substring(0, colonPos);
            itemLabel = row[i].substring(colonPos + 1);
          }

          const radio = Utils.createElem("input");
          radio.id = "option-" + pName + "-value-" + row[0] + "-" + itemValue;
          radio.type = "radio";
          radio.name = "option-" + pName + "-value-" + row[0];
          radio.value = itemValue;
          if (pName === "state-verbose") {
            radio.addEventListener("change", () => {
              this._newStateVerbose();
            });
          } else if (pName === "state-compress-ids") {
            radio.addEventListener("change", () => {
              this._newStateCompressIds();
            });
          } else if (pName === "state-output") {
            radio.addEventListener("change", () => {
              this._newStateOutput();
            });
          } else if (pName === "state-output-pct") {
            radio.addEventListener("change", () => {
              this._newStateOutputPct();
            });
          } else if (pName === "output-formats") {
            radio.addEventListener("change", () => {
              this._newOutputFormats();
            });
          } else if (pName === "datetime-fraction-digits") {
            radio.addEventListener("change", () => {
              this._newDatetimeFractionDigits();
            });
          } else if (pName === "datetime-representation") {
            radio.addEventListener("change", () => {
              this._newDatetimeRepresentation();
            });
          } else if (pName === "tooltip-mode") {
            radio.addEventListener("change", () => {
              this._newToolTipMode();
            });
          } else if (pName === "full-return") {
            radio.addEventListener("change", () => {
              this._newFullReturn();
            });
          } else if (pName === "use-cache-for-grains") {
            radio.addEventListener("change", () => {
              this._newUseCacheForGrains();
            });
          } else if (pName === "use-cache-for-pillar") {
            radio.addEventListener("change", () => {
              this._newUseCacheForPillar();
            });
          }

          if (pName === "state-output" && itemValue === "full_id") {
            tdValue.append(Utils.createBr());
          }

          const label = Utils.createElem("label", "", itemLabel);
          label.htmlFor = radio.id;

          const span2 = Utils.createSpan();

          span2.appendChild(radio);
          span2.appendChild(label);
          tdValue.append(span2);
        }
      }
    }
    tr.appendChild(tdValue);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);
  }

  static _enhanceSessionStart (pTd, pSessionStart) {
    const line1 = Utils.createDiv(null, pSessionStart);

    const line2s = Utils.createSpan();
    Output.dateTimeStr(pSessionStart, line2s);
    const line2d = Utils.createDiv();
    line2d.appendChild(line2s);

    pTd.innerHTML = "";
    pTd.appendChild(line1);
    pTd.appendChild(line2d);
  }

  static _enhanceSessionExpire (pTd, pSessionExpire, pSessionStart) {

    const line1 = Utils.createDiv(null, pSessionExpire);

    const line2s = Utils.createSpan();
    Output.dateTimeStr(pSessionExpire, line2s);
    const line2d = Utils.createDiv();
    line2d.appendChild(line2s);

    const date = new Date(null);
    if (pSessionStart && pSessionExpire) {
      date.setSeconds(pSessionExpire - pSessionStart);
    }
    const str1 = date.toISOString();
    let line3 = null;
    if (str1.startsWith("1970-01-01T")) {
      // remove the date prefix and the millisecond suffix
      const durationStr = "duration is " + str1.substring(11, 19);
      line3 = Utils.createDiv(null, durationStr);
    }

    let line4 = null;
    const leftMillis = pSessionExpire * 1000 - Date.now();
    if (leftMillis < 0) {
      const expiresInStr = "expired";
      line4 = Utils.createDiv(null, expiresInStr);
    } else if (leftMillis < 86400000) {
      const str2 = new Date(leftMillis).toISOString();
      // remove the date prefix and the millisecond suffix
      const expiresInStr = "expires in " + str2.substring(11, 19);
      line4 = Utils.createDiv(null, expiresInStr);
    }

    pTd.innerHTML = "";
    pTd.appendChild(line1);
    pTd.appendChild(line2d);
    if (line3) {
      pTd.appendChild(line3);
    }
    if (line4) {
      pTd.appendChild(line4);
    }
  }

  onShow () {
    // build the controls for all options
    for (const option of this.options) {
      const name = option[0];
      const category = option[1];
      const defaultValue = option[2];
      const valuesArr = option[3];
      this._addOptionRow(name, category, defaultValue, valuesArr);
    }

    const loginResponse = Utils.getStorageItemObject("session", "login_response");
    const sessionStart = loginResponse.start;

    for (const option of this.options) {
      const name = option[0];
      const category = option[1];
      const defaultValue = option[2];
      const valuesArr = option[3];

      let value;
      if (category === "version") {
        value = LoginPanel.version;
      } else if (category === "session") {
        value = loginResponse[name];
      } else if (category === null) {
        value = Utils.getStorageItem("session", name.replace(/-/g, "_"));
      } else if (category === "saltgui") {
        value = Utils.getStorageItem("session", name.replace(/-/g, "_"));
      } else {
        value = category + "[" + name + "]";
      }

      const td = this.div.querySelector("#option-" + name + "-value");
      if (category === "session" && name === "start") {
        OptionsPanel._enhanceSessionStart(td, value);
      } else if (category === "session" && name === "expire") {
        OptionsPanel._enhanceSessionExpire(td, value, sessionStart);
      } else if (category === "session" && name === "perms") {
        // because the "master" file is also in YAML
        Output.setHighlightObject(td, value, null, "yaml");
      } else if (category === "session") {
        td.innerText = value;
      } else {
        this._parseAndFormat(td, name, value);
      }

      if (category === "session" && name === "expire") {
        this.updateExpiresInterval = window.setInterval(() => {
          // just redo the whole text-block
          OptionsPanel._enhanceSessionExpire(td, value, sessionStart);
        }, 1000);
      }

      // some rows only display values, skip these
      if (!valuesArr) {
        continue;
      }

      // first select the "none" values
      for (const valueArr of valuesArr) {
        const id = "option-" + name + "-value-" + valueArr[0] + "-none";
        const noneElement = document.getElementById(id);
        if (noneElement) {
          noneElement.checked = true;
        }
      }

      // select the default value when there is no selection
      if (!value) {
        value = defaultValue;
      }

      const varr = value.replace(/"/g, "").split(",");

      // then select the other values
      for (const valueArr of valuesArr) {
        for (let i = 1; i < valueArr.length; i++) {
          let label = valueArr[i];
          if (label.indexOf(":") >= 0) {
            label = label.replace(/:.*/, "");
          }
          const id = "option-" + name + "-value-" + valueArr[0] + "-" + label;
          const thisElement = document.getElementById(id);
          // Arrays.includes() is only available from ES7/2016
          if (value && varr.indexOf(label) >= 0) {
            thisElement.checked = true;
          }
        }
      }
    }
  }

  onHide () {
    if (this.updateExpiresInterval) {
      // stop the timer when nobody is looking
      window.clearInterval(this.updateExpiresInterval);
      this.updateExpiresInterval = null;
    }
  }

  _parseAndFormat (pTd, id, valueStr) {
    /* eslint-disable curly */
    if (valueStr === null) valueStr = undefined;
    if (valueStr === "undefined") valueStr = undefined;
    /* eslint-enable curly */

    if (valueStr === undefined) {
      const tr = this.div.querySelector("#option-" + id);
      if (tr.dataset.defaultValue) {
        pTd.innerText = "(undefined) " + Character.RIGHTWARDS_ARROW + " " + tr.dataset.defaultValue;
        return;
      }
      pTd.innerText = "(undefined)";
      return;
    }

    if (valueStr.length === 0) {
      pTd.innerText = "(empty string)";
      return;
    }

    if (valueStr[0] !== "{" && valueStr[0] !== "[") {
      pTd.innerText = valueStr;
      return;
    }

    let value;
    try {
      value = JSON.parse(valueStr);
    } catch (err) {
      value = err + " in \"" + valueStr + "\"";
    }
    // because the "master" file is also in YAML
    Output.setHighlightObject(pTd, value, null, "yaml");
  }

  _isSelected (pCategory, pRow, pName) {
    const radioButtonId = "option-" + pCategory + "-value-" + pRow + "-" + pName;
    const radioButton = this.div.querySelector("#" + radioButtonId);
    return radioButton.checked;
  }

  _newStateVerbose () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("state-verbose", "verbose", "false")) value = "false";
    if (this._isSelected("state-verbose", "verbose", "true")) value = "true";
    /* eslint-enable curly */
    const stateVerboseTd = this.div.querySelector("#option-state-verbose-value");
    stateVerboseTd.innerText = value;
    Utils.setStorageItem("session", "state_verbose", value);
  }

  _newStateCompressIds () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("state-compress-ids", "compress-ids", "false")) value = "false";
    if (this._isSelected("state-compress-ids", "compress-ids", "true")) value = "true";
    /* eslint-enable curly */
    const stateCompressIdsTd = this.div.querySelector("#option-state-compress-ids-value");
    stateCompressIdsTd.innerText = value;
    Utils.setStorageItem("session", "state_compress_ids", value);
  }

  _newStateOutput () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("state-output", "output", "full")) value = "full";
    if (this._isSelected("state-output", "output", "terse")) value = "terse";
    if (this._isSelected("state-output", "output", "mixed")) value = "mixed";
    if (this._isSelected("state-output", "output", "changes")) value = "changes";
    if (this._isSelected("state-output", "output", "full_id")) value = "full_id";
    if (this._isSelected("state-output", "output", "terse_id")) value = "terse_id";
    if (this._isSelected("state-output", "output", "mixed_id")) value = "mixed_id";
    if (this._isSelected("state-output", "output", "changes_id")) value = "changes_id";
    /* eslint-enable curly */
    const stateOutputeTd = this.div.querySelector("#option-state-output-value");
    stateOutputeTd.innerText = value;
    Utils.setStorageItem("session", "state_output", value);
  }

  _newStateOutputPct () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("state-output-pct", "output-pct", "false")) value = "false";
    if (this._isSelected("state-output-pct", "output-pct", "true")) value = "true";
    /* eslint-enable curly */
    const stateOutputPcteTd = this.div.querySelector("#option-state-output-pct-value");
    stateOutputPcteTd.innerText = value;
    Utils.setStorageItem("session", "state_output_pct", value);
  }

  _newOutputFormats () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("output-formats", "doc", "doc")) value += ",doc";
    if (this._isSelected("output-formats", "highstate", "saltguihighstate")) value += ",saltguihighstate";
    if (this._isSelected("output-formats", "highstate", "highstate")) value += ",highstate";
    if (this._isSelected("output-formats", "output", "json")) value += ",json";
    if (this._isSelected("output-formats", "output", "nested")) value += ",nested";
    if (this._isSelected("output-formats", "output", "yaml")) value += ",yaml";
    value = value.replace(/^,/, "");
    /* eslint-enable curly */
    const outputFormatsTd = this.div.querySelector("#option-output-formats-value");
    outputFormatsTd.innerText = value;
    Utils.setStorageItem("session", "output_formats", value);
    // refresh the right-hand panel based on the new option value
    Router.currentPage.stats.clearTable();
    Router.currentPage.stats.onShow();
  }

  _newUseCacheForGrains () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("use-cache-for-grains", "grains", "false")) value = "false";
    if (this._isSelected("use-cache-for-grains", "grains", "true")) value = "true";
    value = value.replace(/^,/, "");
    /* eslint-enable curly */
    const useCacheForGrainsTd = this.div.querySelector("#option-use-cache-for-grains-value");
    useCacheForGrainsTd.innerText = value || "(none)";
    Utils.setStorageItem("session", "use_cache_for_grains", value);
  }

  _newUseCacheForPillar () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("use-cache-for-pillar", "pillar", "false")) value = "false";
    if (this._isSelected("use-cache-for-pillar", "pillar", "true")) value = "true";
    value = value.replace(/^,/, "");
    /* eslint-enable curly */
    const useCacheForPillarTd = this.div.querySelector("#option-use-cache-for-pillar-value");
    useCacheForPillarTd.innerText = value || "(none)";
    Utils.setStorageItem("session", "use_cache_for_pillar", value);
  }

  _newDatetimeFractionDigits () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("datetime-fraction-digits", "digits", "0")) value = "0";
    if (this._isSelected("datetime-fraction-digits", "digits", "1")) value = "1";
    if (this._isSelected("datetime-fraction-digits", "digits", "2")) value = "2";
    if (this._isSelected("datetime-fraction-digits", "digits", "3")) value = "3";
    if (this._isSelected("datetime-fraction-digits", "digits", "4")) value = "4";
    if (this._isSelected("datetime-fraction-digits", "digits", "5")) value = "5";
    if (this._isSelected("datetime-fraction-digits", "digits", "6")) value = "6";
    /* eslint-enable curly */
    const datetimeFractionDigitsTd = this.div.querySelector("#option-datetime-fraction-digits-value");
    datetimeFractionDigitsTd.innerText = value;
    Utils.setStorageItem("session", "datetime_fraction_digits", value);
  }

  _newDatetimeRepresentation () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("datetime-representation", "representation", "utc")) value = "utc";
    if (this._isSelected("datetime-representation", "representation", "local")) value = "local";
    if (this._isSelected("datetime-representation", "representation", "utc-localtime")) value = "utc-localtime";
    if (this._isSelected("datetime-representation", "representation", "local-utctime")) value = "local-utctime";
    /* eslint-enable curly */
    const datetimeRepresentationTd = this.div.querySelector("#option-datetime-representation-value");
    datetimeRepresentationTd.innerText = value;
    Utils.setStorageItem("session", "datetime_representation", value);
  }

  _newToolTipMode () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("tooltip-mode", "mode", "full")) value = "full";
    if (this._isSelected("tooltip-mode", "mode", "simple")) value = "simple";
    if (this._isSelected("tooltip-mode", "mode", "none")) value = "none";
    /* eslint-enable curly */
    const toolTipModeTd = this.div.querySelector("#option-tooltip-mode-value");
    toolTipModeTd.innerText = value;
    Utils.setStorageItem("session", "tooltip_mode", value);
  }

  _newFullReturn () {
    let value = "";
    /* eslint-disable curly */
    if (this._isSelected("full-return", "full-return", "false")) value = "false";
    if (this._isSelected("full-return", "full-return", "true")) value = "true";
    /* eslint-enable curly */
    const fullReturnTd = this.div.querySelector("#option-full-return-value");
    fullReturnTd.innerText = value;
    Utils.setStorageItem("session", "full_return", value);
  }
}
