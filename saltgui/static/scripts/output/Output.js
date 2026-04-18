/* global Blob document MouseEvent window */

import {Character} from "../Character.js";
import {OutputDocumentation} from "./OutputDocumentation.js";
import {OutputHighstate} from "./OutputHighstate.js";
import {OutputJson} from "./OutputJson.js";
import {OutputNested} from "./OutputNested.js";
import {OutputYaml} from "./OutputYaml.js";
import {ParseCommandLine} from "../ParseCommandLine.js";
import {Utils} from "../Utils.js";
import hljs from "../../highlight/es/core.js";
import json from "../../highlight/es/languages/json.js";
import yaml from "../../highlight/es/languages/yaml.js";

hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);

// Functions to turn responses from the salt system into visual information
// The following variations exist:
// A) documentation output
//    one of the responsing nodes is selected
//    all other nodes are then ignored
// B) state output
//    the response is formatted as a list of tasks
// C) error output
//    the response is formatted as text
// D) other output
//    the response is formatted as json text
//
// Additionally the following preparations may be needed:
// 1) Output from WHEEL functions
//    This output is re-organized to let it appear as if the output comes
//    from a single node called "master".
// 2) Output from RUNNERS functions
//    This output is re-organized to let it appear as if the output comes
//    from a single node called "master".


export class Output {

  static isOutputFormatAllowed (pRequestedOutputFormat) {
    const outputFormats = Utils.getStorageItem("session", "output_formats", "doc,saltguihighstate,json");
    const items = outputFormats.split(",");
    return items.includes(pRequestedOutputFormat);
  }

  static isStateOutputSelected (pRequestedStateOutput) {
    const stateOutput = Utils.getStorageItem("session", "state_output", "full");
    return stateOutput.includes(pRequestedStateOutput);
  }

  // Re-organize the output to let it appear as if the output comes
  // from a single node called "RUNNER" or "MASTER".
  // This way all responses are organized by minion
  static _addVirtualMinion (pResponse, pCommand) {

    if (pCommand.startsWith("runners.")) {
      // Add a new level in the object
      return {"RUNNER": pResponse};
    }

    if (pCommand.startsWith("wheel.")) {
      // Add a new level in the object
      return {"WHEEL": pResponse};
    }

    // otherwise return the original
    return pResponse;
  }

  // compose the host/minion-name label that is shown with each response
  static getMinionIdHtml (pMinionId, pClassName = "") {
    const span = Utils.createSpan("minion-id", pMinionId);
    if (pClassName) {
      span.classList.add(pClassName);
    }
    return span;
  }

  // the output is only text
  // note: do not return a text-node
  static _getTextOutput (pMinionResponse) {
    // strip trailing whitespace
    pMinionResponse = pMinionResponse.replace(/[\n\r ]+$/g, ""); // NOSONAR S8786

    // replace all returned JIDs to links
    // typically found in the output of an async job
    if (ParseCommandLine.getPatJid().test(pMinionResponse)) {
      const link = Utils.createElem("a", "", pMinionResponse);
      link.href = "?id=" + encodeURIComponent(pMinionResponse) + "#job";
      return link;
    }

    // all regular text
    return Utils.createSpan("", pMinionResponse);
  }


  // format an object in the preferred style
  static formatObject (pObject) {
    if (Output.isOutputFormatAllowed("json")) {
      return OutputJson.formatJSON(pObject);
    }

    if (Output.isOutputFormatAllowed("nested")) {
      return OutputNested.formatNESTED(pObject);
    }

    if (Output.isOutputFormatAllowed("yaml")) {
      return OutputYaml.formatYAML(pObject);
    }

    // when nothing is allowed, JSON is always allowed
    return OutputJson.formatJSON(pObject);
  }

  static setHighlightObject (pParent, pObject, pStyleWhiteSpace = "pre-wrap", pLanguage = null) {
    const code = Utils.createElem("code");
    code.style.whiteSpace = pStyleWhiteSpace;

    if (pLanguage !== null) {
      const outputFormats = Utils.getStorageItem("session", "output_formats");
      Utils.setStorageItem("session", "output_formats", pLanguage);
      code.innerHTML = hljs.highlight(Output.formatObject(pObject), {language:pLanguage}).value;
      Utils.setStorageItem("session", "output_formats", outputFormats);
    } else if (Output.isOutputFormatAllowed("json")) {
      code.innerHTML = hljs.highlight(Output.formatObject(pObject), {language:'json'}).value;
    } else if (Output.isOutputFormatAllowed("nested")) {
      // yes, yaml
      code.innerHTML = hljs.highlight(Output.formatObject(pObject), {language:'yaml'}).value;
    } else if (Output.isOutputFormatAllowed("yaml")) {
      code.innerHTML = hljs.highlight(Output.formatObject(pObject), {language:'yaml'}).value;
    } else {
      code.innerText = Output.formatObject(pObject);
    }

    if (pParent.firstElementChild) {
      pParent.replaceChild(code, pParent.firstElementChild);
    } else {
      // empty or only a text-node
      pParent.innerText = "";
      pParent.appendChild(code);
    }
  }

  // this is the default output form
  // just format the returned objects
  // note: do not return a text-node
  static _getNormalOutput (pMinionResponse) {
    const content = Output.formatObject(pMinionResponse);
    const isMultiLineString = Utils.isMultiLineString(content);
    return Utils.createElem(isMultiLineString ? "div" : "span", "", content);
  }


  static _hasProperties (pObject, pPropArr) {
    if (!pObject || typeof pObject !== "object") {
      return false;
    }
    for (const prop of pPropArr) {
      if (pObject[prop] === undefined) {
        return false;
      }
    }
    return true;
  }


  static _isAsyncOutput (pResponse) {
    const keys = Object.keys(pResponse);
    if (keys.length !== 2) {
      return false;
    }
    keys.sort(Utils.mySortFunction);
    if (keys[0] !== "jid") {
      return false;
    }
    if (keys[1] !== "minions") {
      return false;
    }
    return true;
  }

  static _nDigits (pValue, pNrDigits) {
    let digits = pValue.toString();
    while (digits.length < pNrDigits) {
      digits = "0" + digits;
    }
    return digits;
  }

  // reformat a date-time string
  // supported formats:
  // (time) 19:05:01.561754
  // (datetime) 2019, Jan 26 19:05:22.808348
  // current action is (only):
  // - reduce the number of digits for the fractional seconds

  // some older browsers cannot produce formatted datetime this way
  // toLocaleString/toLocaleTimeString then return "Invalid Date"
  // silently ignore that, provide an alternative and then do not produce a tooltip
  static _clampFractionDigits (pDigits) {
    // stick to the min/max values without complaining
    if (pDigits < 0) {
      return 0;
    }
    if (pDigits > 6) {
      return 6;
    }
    return pDigits;
  }

  static _extractFractionSeconds (pDtStr, pFractionDigits) {
    let fractionSecondsPart = pDtStr.replace(/^[^.]*$/, "");
    // leave nothing when there are no fractional seconds
    // remove everything until '.'
    // assume the last '.' is a decimal separator
    // and that all others (if any) are just field separators
    fractionSecondsPart = fractionSecondsPart.replace(/^.*[.]/, "");
    // remove everything after the digits
    fractionSecondsPart = fractionSecondsPart.replace(/[^0-9].*$/, ""); // NOSONAR S6353
    const originalFractionSecondsPart = fractionSecondsPart;
    // truncate digits to maximum length
    fractionSecondsPart = fractionSecondsPart.substring(0, pFractionDigits);

    // format the decimal number 1.1 and see which separator is used
    const decimalSeparator = 1.1.toLocaleString().substring(1, 2);
    const formatted = fractionSecondsPart !== "" ? decimalSeparator + fractionSecondsPart : "";
    const formattedOriginal = originalFractionSecondsPart !== "" ? decimalSeparator + originalFractionSecondsPart : "";

    return { formatted, formattedOriginal, original: originalFractionSecondsPart };
  }

  static _formatDateTime (pDateObj, pDtStr, pTimeOnly, pRepresentationChoice) {
    const isTimeOnly = pTimeOnly || pRepresentationChoice === "local-utctime";
    const formatter = isTimeOnly ? "toLocaleTimeString" : "toLocaleString";
    let dt = pDateObj[formatter](undefined, {"timeZone": "UTC", "timeZoneName": "short"});

    if (dt.search("Invalid") >= 0) {
      // but not the verbose timezone name
      dt = isTimeOnly ? pDateObj.toTimeString().replace(/ *[(][^)]*[)]$/, "") : pDateObj.toString().replace(/ *[(][^)]*[)]$/, ""); // NOSONAR S8786
    }

    if (dt.search("Invalid") >= 0) {
      dt = pDtStr.replace(/^[-0-9]*T/, "").replace(/^1999, Sep 9 /, "");
    }

    return dt;
  }

  static _formatLocalDateTime (pDateObj, pDtStr, pTimeOnly, pRepresentationChoice) {
    const isTimeOnly = pTimeOnly || pRepresentationChoice === "utc-localtime";
    const formatter = isTimeOnly ? "toLocaleTimeString" : "toLocaleString";
    let dt = pDateObj[formatter](undefined, {"timeZoneName": "short"});

    if (dt.search("Invalid") >= 0) {
      dt = isTimeOnly ? pDateObj.toString().replace(/ *[(][^)]*[)]$/, "") : pDateObj.toString().replace(/ *[(][^)]*[)]$/, ""); // NOSONAR S8786
    }

    if (dt.search("Invalid") >= 0) {
      dt = pDtStr.replace(/^[-0-9]*T/, "").replace(/^1999, Sep 9 /, "");
    }

    return dt;
  }

  static _formatRepresentation (pUtcDT, pLocalDT, pLocalTZ, pRepresentation) {
    switch (pRepresentation) {
    case "utc":
      return pUtcDT;
    case "local":
      return pLocalDT + " " + pLocalTZ;
    case "utc-localtime":
      return pUtcDT + " (" + pLocalDT + " " + pLocalTZ + ")";
    case "local-utctime":
      return pLocalDT + " " + pLocalTZ + " (" + pUtcDT + ")";
    default:
      // unknown format, use traditional representation
      return pUtcDT;
    }
  }

  static dateTimeStr (pDtStr, pDateTimeField = null, pDateTimeStyle = "bottom-center", pTimeOnly = false) {

    // no available setting, then return the original
    let dateTimeFractionDigits = Utils.getStorageItemInteger("session", "datetime_fraction_digits", 6);
    dateTimeFractionDigits = Output._clampFractionDigits(dateTimeFractionDigits);

    const dateTimeRepresentation = Utils.getStorageItem("session", "datetime_representation", "utc");

    if (typeof pDtStr === "number") {
      pTimeOnly = pDtStr < 100 * 86400;
      pDtStr = new Date(pDtStr * 1000);
    }

    if (typeof pDtStr === "object") {
      // assume it is a Date
      // 2019, Jan 26 19:05:22.808348
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      pDtStr = pDtStr.getUTCFullYear() + ", " + months[pDtStr.getUTCMonth()] + " " + pDtStr.getUTCDate() + " " + Output._nDigits(pDtStr.getUTCHours(), 2) + ":" + Output._nDigits(pDtStr.getUTCMinutes(), 2) + ":" + Output._nDigits(pDtStr.getUTCSeconds(), 2) + "." + Output._nDigits(pDtStr.getUTCMilliseconds(), 3);
    }

    const fractionData = Output._extractFractionSeconds(pDtStr, dateTimeFractionDigits);

    // remove the fraction from the original
    pDtStr = pDtStr.replace(/[.][0-9]*$/, ""); // NOSONAR S6353

    // original was formatted as iso-date-time
    if (/T/.test(pDtStr)) {
      pDtStr += "Z";
    } else {
      pDtStr += " UTC";
    }

    // the timestamps from the SaltAPI are always UTC
    // "When the time zone offset is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as local time."
    // therefore add the explicit time-zone "Z" (=UTC)
    const milliSecondsSinceEpoch = Date.parse(pDtStr);
    const dateObj = new Date(milliSecondsSinceEpoch);

    let utcDT = Output._formatDateTime(dateObj, pDtStr, pTimeOnly, dateTimeRepresentation);
    utcDT = utcDT.replace(/ *UTC$/, ""); // NOSONAR S8786

    let localDT = Output._formatLocalDateTime(dateObj, pDtStr, pTimeOnly, dateTimeRepresentation);
    const localTZ = localDT.replace(/^.* /, "");
    localDT = localDT.replace(/ [^ ]*$/, "");

    if (milliSecondsSinceEpoch >= 86400 * 1000 && milliSecondsSinceEpoch < 100 * 86400 * 1000) {
      const days = Math.trunc(milliSecondsSinceEpoch / (86400 * 1000)) + "d ";
      utcDT = days + utcDT;
      localDT = days + localDT;
    }

    // put the milliseconds in the proper location
    const utcDTms = utcDT.replace(/( [a-zA-Z.]*)?( [-A-Z0-9]*|Z)?$/, fractionData.formatted + "$&");
    const localDTms = localDT.replace(/( [a-zA-Z.]*)?( [-A-Z0-9]*|Z)?$/, fractionData.formatted + "$&");

    const ret = Output._formatRepresentation(utcDTms, localDTms, localTZ, dateTimeRepresentation);

    if (pDateTimeField) {
      utcDT = dateObj.toLocaleString(undefined, {"timeZone": "UTC", "timeZoneName": "short"});
      // place the milliseconds after the seconds (before am/pm indicator and timezone)
      utcDT = utcDT.replace(/( [a-zA-Z.]*)? [-A-Z0-9]*$/, fractionData.formattedOriginal + "$&");
      localDT = dateObj.toLocaleString(undefined, {"timeZoneName": "short"});
      localDT = localDT.replace(/( [a-zA-Z.]*)? [-A-Z0-9+]*$/, fractionData.formattedOriginal + "$&");
      pDateTimeField.innerText = ret;
      const txt = utcDT + "\n" + localDT;
      if (txt.search("Invalid") < 0) {
        Utils.addToolTip(pDateTimeField, txt, pDateTimeStyle);
      }
    }

    return ret;
  }

  static getDuration (pMilliSeconds) {
    if (pMilliSeconds < 1000) {
      return Utils.txtZeroOneMany(Math.round(pMilliSeconds),
        "{0} ms", "{0} ms", "{0} ms");
    }
    return Utils.txtZeroOneMany(Math.round(pMilliSeconds) / 1000, "", "{0} s", "{0} s");
  }

  static isHiddenTask (pTask) {
    const isStateVerbose = Utils.getStorageItemBoolean("session", "state_verbose", true);
    /* eslint-disable curly */
    if (isStateVerbose) return false;
    if (pTask.result !== true) return false;
    if (!pTask.changes) return true;
    if (typeof pTask.changes !== "object") return false;
    if (Array.isArray(pTask.changes) && pTask.changes.length === 0) return true;
    if (Object.keys(pTask.changes).length === 0) return true;
    /* eslint-enable curly */
    return false;
  }

  static getTaskNrChanges (pTask) {
    if (!pTask.changes) {
      return 0;
    }
    if (typeof pTask.changes !== "object") {
      return 1;
    }
    if (Array.isArray(pTask.changes)) {
      return pTask.changes.length;
    }
    if (Object.keys(pTask.changes).length === 0) {
      // empty changes object does not count as real change
      return 0;
    }
    return 1;
  }

  static getTaskCharacter (pTask) {
    if (!pTask.changes) {
      return Character.BLACK_CIRCLE;
    }
    if (typeof pTask.changes !== "object") {
      return Character.BLACK_DIAMOND;
    }
    if (Array.isArray(pTask.changes)) {
      return pTask.changes.length === 0 ? Character.BLACK_CIRCLE : Character.BLACK_DIAMOND;
    }
    if (Object.keys(pTask.changes).length === 0) {
      // empty changes object does not count as real change
      return Character.BLACK_CIRCLE;
    }
    return Character.BLACK_DIAMOND;
  }

  static _getTaskChanges (pTask) {
    if (!pTask.changes) {
      return "";
    }
    if (typeof pTask.changes !== "object") {
      return "\n'changes' has type " + typeof pTask.changes;
    }
    if (Array.isArray(pTask.changes)) {
      const nrChanges = pTask.changes.length;
      return Utils.txtZeroOneMany(
        nrChanges,
        "\n'changes' is an empty array",
        "\n'changes' is an array\n" + nrChanges + " change",
        "\n'changes' is an array\n" + nrChanges + " changes");
    }
    if (Object.keys(pTask.changes).length === 0) {
      // empty changes object does not count as real change
      return "";
    }
    return "\nchanged";
  }

  static getTaskClass (pTask) {
    let className;

    if (pTask.result === null) {
      className = "task-skipped";
    } else if (pTask.result === false) {
      className = "task-failure";
    } else {
      className = "task-success";
    }

    if (Output.getTaskNrChanges(pTask) > 0) {
      className += "-changes";
    }

    return className;
  }

  static _shouldSkipTaskKey (pKey, pTask) {
    const skippedKeys = {
      "___key___": true,
      "__id__": true,
      "__jid__": true,
      "__orchestration__": true,
      "__run_num__": true,
      "__sls__": true,
      "_stamp": true,
      "changes": true,
      "comment": true,
      "duration": true,
      "fun": true,
      "id": true,
      "jid": true,
      "name": true,
      "pchanges": true,
      "return": true,
      "skip_watch": true,
      "start_time": true,
      "success": true,
    };

    if (skippedKeys[pKey]) {
      return true;
    }

    // skip trivial info: result = true or result = null
    if (pKey === "result" && (pTask[pKey] === true || pTask[pKey] === null)) {
      return true;
    }

    return false;
  }

  static _addTaskPropertyTooltip (pTxt, pKey, pTask) {
    pTxt += "\n" + pKey + " = ";
    if (typeof pTask.changes === "object") {
      pTxt += JSON.stringify(pTask[pKey]);
    } else {
      pTxt += pTask[pKey];
    }
    return pTxt;
  }

  static _buildTaskTooltipText (pTask) {
    let txt = "";

    if ("__sls__" in pTask && pTask.__sls__) {
      txt += "\n" + pTask.__sls__.replaceAll(".", "/") + ".sls";
    }

    if ("__id__" in pTask && pTask.__id__ !== pTask.name) {
      txt += "\n" + pTask.__id__;
    }

    if ("name" in pTask) {
      txt += "\n" + pTask.name;
    }

    if ("___key___" in pTask) {
      const components = pTask.___key___.split("_|-");
      const functionName = components[0] + "." + components[3];
      txt += "\n" + functionName;
    }

    txt += Output._getTaskChanges(pTask);

    if (Output.isHiddenTask(pTask)) {
      txt += "\nhidden";
    }

    for (const key in pTask) {
      if (!Output._shouldSkipTaskKey(key, pTask)) {
        txt = Output._addTaskPropertyTooltip(txt, key, pTask);
      }
    }

    return txt.trim();
  }

  static setTaskToolTip (pSpan, pTask) {

    if (typeof pTask !== "object") {
      return;
    }

    const txt = Output._buildTaskTooltipText(pTask);

    pSpan.className = "taskcircle";
    pSpan.classList.add(Output.getTaskClass(pTask));
    pSpan.innerText = Output.getTaskCharacter(pTask);

    Utils.addToolTip(pSpan, txt);
  }

  // add the status summary
  static _addHighStateSummary (pMinionRow, pMinionDiv, pMinionId, pTasks) {

    let nr = 0;
    const summarySpan = Utils.createSpan("task-summary", "");

    for (const task of pTasks) {

      nr += 1;

      const span = Utils.createSpan("", Character.BLACK_CIRCLE);

      Output.setTaskToolTip(span, task);

      const myNr = nr;
      span.addEventListener("click", (pClickEvent) => {

        // show the output, it might be hidden
        const triangle = pMinionDiv.querySelector("span.triangle");
        triangle.innerText = Character.WHITE_DOWN_POINTING_TRIANGLE;
        const outputDiv = pMinionDiv.querySelector("div");
        outputDiv.style.display = "";

        const showId = Utils.getIdFromMinionId(pMinionId + "." + myNr);
        const taskDiv = pMinionDiv.querySelector("#" + showId);

        if (taskDiv === null) {
          // probably hidden due to state_hidden
          return;
        }

        // show where the information is
        taskDiv.classList.add("highlight-task");
        window.setTimeout(() => {
          taskDiv.classList.remove("highlight-task");
          if (!taskDiv.classList.length) {
            taskDiv.removeAttribute("class");
          }
        }, 1000);

        // behavior: smooth is ok, the destination is nearby
        // block: since block is below our summary, nearest is equivalent to end
        taskDiv.scrollIntoView({"behavior": "smooth", "block": "nearest"});

        pClickEvent.stopPropagation();
      });

      summarySpan.append(span);
    }

    const stateCompressIds = Utils.getStorageItemBoolean("session", "state_compress_ids");
    if (stateCompressIds) {
      summarySpan.append(Utils.createSpan("state-details-compressed", Character.NO_BREAK_SPACE + "(state details may be compressed)"));
    }

    pMinionRow.append(summarySpan);
  }

  static getIsSuccess (pMinionResponse) {
    if (Output._hasProperties(pMinionResponse, ["data", "tag"])) {
      // e.g. wheel.keys.list_all
      pMinionResponse = pMinionResponse.data;
    }
    if (Output._hasProperties(pMinionResponse, ["return", "success"])) {
      // e.g. wheel.keys.list_all (after data+tag reduction above)
      // and even wheel.keys.aap (after data+tag reduction above)
      return pMinionResponse.success === true;
    }
    if (Output._hasProperties(pMinionResponse, ["retcode"])) {
      // note that really old minions do not return 'retcode'
      return pMinionResponse.retcode === 0;
    }
    if (pMinionResponse?.Error) { // NOSONAR S1126
      // e.g. runners.jobs.list_job blahblah
      return false;
    }
    return true;
  }

  static _getMinionResponse (pCommand, pMinionResponse) {
    if (Output._hasProperties(pMinionResponse, ["data", "tag"])) {
      // e.g. wheel.keys.list_all
      pMinionResponse = pMinionResponse.data;
    }
    if (Output._hasProperties(pMinionResponse, ["return", "success"])) {
      // e.g. wheel.keys.list_all (after data+tag reduction above)
      return pMinionResponse.return;
    }
    if (pCommand.startsWith("runner.") && pMinionResponse?.return !== undefined) {
      // ???
      return pMinionResponse.return.return;
    }
    if (Output._hasProperties(pMinionResponse, ["ret"])) {
      // ???
      return pMinionResponse.ret;
    }
    return pMinionResponse;
  }

  static getMinionLabelClass (pIsSuccess, pResponse) {
    // the standard label is the minionId,
    // TODO: colored based on the retcode
    if (!pIsSuccess) {
      return "host-failure";
    }
    if (pResponse === undefined) {
      return "host-no-response";
    }
    return "host-success";
  }

  static _addDownload (pParentDiv, pJobId, pObject, pFormatFunction, pTypeLabel, pContentType, pFilenameExtension) {
    const downloadA = Utils.createElem("a", "no-print");
    downloadA.innerText = pTypeLabel;
    downloadA.style = "float:right; margin-left:10px";
    downloadA.addEventListener("click", (pClickEvent) => {
      // based on one of the answers in:
      // https://stackoverflow.com/questions/4184944/javascript-download-data-to-file-from-content-within-the-page
      const dummyA = Utils.createElem("a");
      const blob = new Blob([pFormatFunction(pObject)], {"type": pContentType});
      /* eslint-disable compat/compat */
      /* URL is not supported in op_mini all, IE 11  compat/compat */
      dummyA.href = window.URL.createObjectURL(blob);
      /* eslint-enable compat/compat */
      if (pJobId) {
        dummyA.download = "job-" + pJobId + "." + pFilenameExtension;
      } else {
        dummyA.download = "job." + pFilenameExtension;
      }
      dummyA.click();
      pClickEvent.stopPropagation();
    });
    pParentDiv.appendChild(downloadA);
  }

  static _addJID (pParentDiv, pJobId) {
    const downloadA = Utils.createElem("a");
    downloadA.innerText = pJobId;
    downloadA.style = "float:right; margin-left:10px";
    downloadA.addEventListener("click", (pClickEvent) => {
      Output.router.goTo("job", {"id": pJobId});
      pClickEvent.stopPropagation();
    });
    pParentDiv.appendChild(downloadA);
  }

  static _checkMinionForStartTime (pMinionResponse) {
    for (const key in pMinionResponse) {
      const result = pMinionResponse[key];
      if (result !== null && typeof result === "object" && !Array.isArray(result) && typeof result.start_time === "string") {
        return true;
      }
    }
    return false;
  }

  static _hasStartTimeField (pResponse) {
    if (typeof pResponse !== "object" || Array.isArray(pResponse)) {
      // not even a valid response
      return false;
    }

    for (const minionId in pResponse) {
      let minionResponse = pResponse[minionId];
      if (typeof minionResponse !== "object" || Array.isArray(minionResponse)) {
        continue;
      }

      if (minionResponse["return"] !== undefined) {
        // with full_return, there is an extra level
        minionResponse = minionResponse["return"];
        if (typeof minionResponse !== "object" || Array.isArray(minionResponse)) {
          continue;
        }
      }

      if (Output._checkMinionForStartTime(minionResponse)) {
        return true;
      }
    }

    return false;
  }

  static _buildSummaryStatistics (pResponse, pMinionData) {
    const summary = {};
    for (const minionId in pResponse) {
      const result = pResponse[minionId];
      if (result === null || typeof result !== "object" || !("success" in result)) {
        continue;
      }
      const key = (result.success ? "0-" : "1-") + result.retcode;
      summary[key] = (summary[key] ?? 0) + 1;
    }

    let txt = "";
    for (const key of Object.keys(summary).sort(Utils.mySortFunction)) {
      txt += ", " + (key.startsWith("0-") ?
        Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes") :
        Utils.txtZeroOneMany(summary[key], "", "{0} failure", "{0} failures"));
      if (key !== "0-0" && key !== "1-1") {
        txt += "(" + key.substring(2) + ")";
      }
    }

    return { extraResponses: Object.keys(pResponse).filter(minionId => !pMinionData.includes(minionId)).length, missingResponses: pMinionData.filter(minionId => !(minionId in pResponse)).length, summaryText: txt };
  }

  static _buildSummaryText (pResponse, pMinionData, pCntResponses) {
    let txt = Utils.txtZeroOneMany(pCntResponses, "", ", {0} response", ", {0} responses");

    const stats = Output._buildSummaryStatistics(pResponse, pMinionData);
    txt += stats.summaryText;

    const cntMissingResponses = stats.missingResponses;
    const cntExtraResponses = stats.extraResponses;

    if (cntMissingResponses > 0) {
      txt += Utils.txtZeroOneMany(cntMissingResponses, "", ", {0} no response", ", {0} no responses");
    }
    if (cntExtraResponses > 0 && cntExtraResponses !== pCntResponses) {
      txt += Utils.txtZeroOneMany(cntExtraResponses, "", ", {0} unexpected response", ", {0} unexpected responses");
    }

    const cntTotal = pCntResponses + cntMissingResponses;
    if (cntTotal !== pCntResponses && cntTotal !== cntMissingResponses && cntTotal !== cntExtraResponses) {
      txt += ", " + cntTotal + " total";
    }

    return txt;
  }

  static _addResponseSummary (pTopSummaryDiv, pCommand, pResponse, pMinionData, pInitialStatus) {
    if (pCommand.startsWith("runners.") || pCommand.startsWith("wheel.") || Output._isAsyncOutput(pResponse)) {
      return;
    }

    const summaryJobsActiveSpan = Utils.createSpan("", pInitialStatus, "summary-jobs-active");
    const summaryJobsListJobSpan = Utils.createSpan("", "", "summary-list-job");
    const cntResponses = Object.keys(pResponse).length;

    const txt = Output._buildSummaryText(pResponse, pMinionData, cntResponses);

    pTopSummaryDiv.appendChild(summaryJobsActiveSpan);
    summaryJobsListJobSpan.innerText = txt;
    pTopSummaryDiv.appendChild(summaryJobsListJobSpan);
  }

  static _addExtraInfo (pOutputContainer, pExtraInfo) {
    if (pExtraInfo) {
      for (const str of pExtraInfo) {
        const div = Utils.createDiv("", str);
        div.style.lineBreak = "anywhere";
        pOutputContainer.appendChild(div);
      }
    }
  }

  static _addMasterTriangle (pTopSummaryDiv, pOutputContainer, pCntMinions) {
    const masterTriangle = Utils.createSpan();
    masterTriangle.innerText = pCntMinions > 50 ?
      Character.WHITE_RIGHT_POINTING_TRIANGLE :
      Character.WHITE_DOWN_POINTING_TRIANGLE;
    masterTriangle.style.cursor = "pointer";
    pTopSummaryDiv.appendChild(masterTriangle);
    pOutputContainer.appendChild(pTopSummaryDiv);

    masterTriangle.addEventListener("click", (pClickEvent) => {
      masterTriangle.innerText = masterTriangle.innerText === Character.WHITE_DOWN_POINTING_TRIANGLE ?
        Character.WHITE_RIGHT_POINTING_TRIANGLE :
        Character.WHITE_DOWN_POINTING_TRIANGLE;

      for (const div of pOutputContainer.childNodes) {
        const childs = div.getElementsByClassName("triangle");
        if (childs.length !== 1 || childs[0] === masterTriangle) {
          continue;
        }
        if (childs[0].innerText === masterTriangle.innerText) {
          continue;
        }
        const clickEvent = new MouseEvent("click", {});
        childs[0].dispatchEvent(clickEvent);
      }
      pClickEvent.stopPropagation();
    });

    return masterTriangle;
  }

  static _prepareResponseData (pContext) {
    if (pContext.pResponse.RUNNER?.outputter === "highstate") {
      pContext.pResponse = pContext.pResponse.RUNNER.data;
      pContext.pMinionData = Object.keys(pContext.pResponse);
    }

    const originalMinionData = [...pContext.pMinionData];
    for (const key in pContext.pResponse) {
      if (!pContext.pMinionData.includes(key)) {
        pContext.pMinionData.push(key);
      }
    }
    pContext.originalMinionData = originalMinionData;

    let jid;
    if (Object.values(pContext.pResponse)?.[0]?.jid) {
      jid = Object.values(pContext.pResponse)[0].jid;
    } else if (pContext.pResponse.RUNNER?.data?.jid) {
      pContext.pResponse.RUNNER = pContext.pResponse.RUNNER.data.return;
    } else if (pContext.pResponse.WHEEL?.data?.jid) {
      pContext.pResponse.WHEEL = pContext.pResponse.WHEEL.data.return;
    }

    if (jid) {
      Output._addJID(pContext.topSummaryDiv, jid);
      const downloadLabel = Utils.createSpan("", "view as job:");
      downloadLabel.style = "float:right; margin-left: 20px";
      pContext.topSummaryDiv.appendChild(downloadLabel);
    }

    Output._addDownload(pContext.topSummaryDiv, pContext.pJobId, pContext.downloadObject,
      JSON.stringify, "RAW-JSON", "application/json", "raw.json");
    Output._addDownload(pContext.topSummaryDiv, pContext.pJobId, pContext.downloadObject,
      OutputYaml.formatYAML, "YAML", "text/vnd.yaml", "yaml");
    Output._addDownload(pContext.topSummaryDiv, pContext.pJobId, pContext.downloadObject,
      OutputNested.formatNESTED, "NESTED", "text/plain", "nested.txt");
    Output._addDownload(pContext.topSummaryDiv, pContext.pJobId, pContext.downloadObject,
      OutputJson.formatJSON, "JSON", "application/json", "json");

    const downloadLabel = Utils.createSpan("no-print", "download as:");
    downloadLabel.style = "float:right";
    pContext.topSummaryDiv.appendChild(downloadLabel);

    if (Output._hasStartTimeField(pContext.pResponse)) {
      const span = Utils.createDiv("", "\n" + Character.CIRCLED_INFORMATION_SOURCE + " start-time of tasks is using local-time from the minion");
      pContext.topSummaryDiv.append(span);
    }
  }

  static _processMinionResponses (pContext) {
    let nrMultiLineBlocks = 0;
    for (const minionId of [...pContext.pMinionData].sort(Utils.mySortFunction)) {
      const result = Output._processSingleMinion(pContext, minionId);
      if (result.minionMultiLine) {
        nrMultiLineBlocks += 1;
      }
    }
    return nrMultiLineBlocks;
  }

  static _processSingleMinion (pContext, pMinionId) {
    let minionResponse = pContext.pResponse[pMinionId];

    if (pContext.commandCmd === "runner.state.orchestrate" && minionResponse.return?.return?.data) {
      minionResponse = minionResponse.return.return.data[pMinionId];
    }
    if (pContext.commandCmd === "runner.state.orchestrate_single" && typeof minionResponse.return?.return === "object") {
      minionResponse = Object.values(minionResponse.return.return)[0];
    }

    const isSuccess = Output.getIsSuccess(minionResponse);
    minionResponse = Output._getMinionResponse(pContext.pCommand, minionResponse);
    pContext.downloadObject[pMinionId] = minionResponse;

    let minionLabel = Output.getMinionIdHtml(pMinionId, Output.getMinionLabelClass(isSuccess, minionResponse));
    let minionOutput = Output._determineMinionOutput(minionResponse, pContext.pResponse[pMinionId]);
    let minionMultiLine = false;
    const isHighStateOutput = OutputHighstate.isHighStateOutput(pContext.commandCmd, minionResponse);
    const tasks = Output._extractTasks(isHighStateOutput, minionResponse);
    const { addSummaryFlag, multiLine: isMultiLine, output: finalOutput } = Output._selectMinionOutput(
      minionOutput, isHighStateOutput, pContext, pMinionId, tasks);

    if (pContext.originalMinionData.length > 0 && !pContext.originalMinionData.includes(pMinionId)) {
      minionLabel.innerText += " (unexpected)";
    }

    if (!finalOutput) {
      minionOutput = Output._getNormalOutput(minionResponse);
      minionMultiLine = typeof minionOutput === "string" && Utils.isMultiLineString(minionOutput) || minionOutput.tagName === "DIV";
    } else {
      minionOutput = finalOutput;
      minionMultiLine = isMultiLine;
    }

    Output._renderMinionOutput(pContext, pMinionId, minionLabel, minionOutput, minionMultiLine, isHighStateOutput, { addSummaryFlag, tasks });

    return { minionMultiLine };
  }

  static _determineMinionOutput (pMinionResponse, pOriginalResponse) {
    if (pOriginalResponse === undefined) {
      const output = Output._getTextOutput("(no response)");
      output.classList.add("noresponse");
      return output;
    }

    if (typeof pMinionResponse === "string") {
      return Output._getTextOutput(pMinionResponse);
    }

    if (typeof pMinionResponse !== "object" || pMinionResponse === null) {
      return Output._getNormalOutput(pMinionResponse);
    }

    if (Array.isArray(pMinionResponse)) {
      return Output._getNormalOutput(pMinionResponse);
    }

    return null;
  }

  static _extractTasks (pIsHighState, pMinionResponse) {
    if (!pIsHighState) {
      return [];
    }

    const tasks = [];
    Object.keys(pMinionResponse).forEach((taskKey) => {
      if (typeof pMinionResponse[taskKey] === "object") {
        pMinionResponse[taskKey].___key___ = taskKey;
        tasks.push(pMinionResponse[taskKey]);
      }
    });
    tasks.sort((aa, bb) => aa.__run_num__ - bb.__run_num__);
    return tasks;
  }

  static _selectMinionOutput (pInitialOutput, pIsHighState, pContext, pMinionId, pTasks) {
    if (pInitialOutput) {
      return { addSummaryFlag: false, multiLine: false, output: pInitialOutput };
    }

    if (!pIsHighState) {
      return { addSummaryFlag: false, multiLine: false, output: null };
    }

    const usesSaltGuiFormat = Output.isOutputFormatAllowed("saltguihighstate");
    const usesHighstateFormat = Output.isOutputFormatAllowed("highstate");

    if (usesSaltGuiFormat || usesHighstateFormat) {
      const minionLabel = OutputHighstate.getHighStateLabel(pMinionId, pContext.pResponse[pMinionId]);
      const minionOutput = OutputHighstate.getHighStateOutput(pMinionId, pTasks, pContext.pJobId);
      return { addSummaryFlag: true, minionLabel, multiLine: true, output: minionOutput };
    }

    return { addSummaryFlag: false, multiLine: false, output: null };
  }

  static _renderMinionOutput (pContext, pMinionId, pMinionLabel, pMinionOutput, pMinionMultiLine, pIsHighState, pTaskInfo) {
    const div = Utils.createDiv("", "", Utils.getIdFromMinionId(pMinionId));
    const minionRow = Utils.createSpan();
    minionRow.append(pMinionLabel);
    minionRow.appendChild(document.createTextNode(":"));

    if (pMinionMultiLine) {
      const triangle = pMinionId === pContext.pHighlightMinionId ?
        Utils.createSpan("triangle", Character.WHITE_DOWN_POINTING_TRIANGLE) :
        Utils.createSpan("triangle", pContext.masterTriangle.innerText);
      triangle.style.cursor = "pointer";
      triangle.addEventListener("click", (pClickEvent) => {
        if (triangle.innerText === Character.WHITE_DOWN_POINTING_TRIANGLE) {
          triangle.innerText = Character.WHITE_RIGHT_POINTING_TRIANGLE;
          pMinionOutput.style.display = "none";
        } else {
          triangle.innerText = Character.WHITE_DOWN_POINTING_TRIANGLE;
          pMinionOutput.style.display = "";
        }
        pClickEvent.stopPropagation();
      });
      minionRow.appendChild(triangle);

      if (pTaskInfo.addSummaryFlag) {
        Output._addHighStateSummary(minionRow, div, pMinionId, pTaskInfo.tasks);
      }
    }

    div.append(minionRow);
    if (pMinionMultiLine) {
      div.appendChild(Utils.createBr());
    }

    if (pIsHighState) {
      pMinionOutput.addEventListener("click", (pClickEvent) => {
        minionRow.classList.add("highlight-task");
        window.setTimeout(() => {
          minionRow.classList.remove("highlight-task");
          if (!minionRow.classList.length) {
            minionRow.removeAttribute("class");
          }
        }, 1000);

        div.scrollIntoView({"behavior": "smooth", "block": "start"});
        pClickEvent.stopPropagation();
      });
    }

    pMinionOutput.classList.add("minion-output", pMinionMultiLine ? "minion-output-multiple" : "minion-output-single");
    div.append(pMinionOutput);
    pContext.pOutputContainer.append(div);
  }

  static _finalizeOutput (pContext, pNrMultiLineBlocks) {
    if (pContext.pHighlightMinionId) {
      const div = pContext.pOutputContainer.querySelector("#" + Utils.getIdFromMinionId(pContext.pHighlightMinionId));
      if (div) {
        const minionRow = div.querySelector("span");
        minionRow.classList.add("highlight-task");
        window.setTimeout(() => {
          minionRow.classList.remove("highlight-task");
          if (!minionRow.classList.length) {
            minionRow.removeAttribute("class");
          }
        }, 1000);

        div.scrollIntoView({"behavior": "smooth", "block": "start"});
      }
    }

    if (pNrMultiLineBlocks <= 1) {
      pContext.masterTriangle.style.display = "none";
    }

    if (!Object.keys(pContext.pMinionData).length) {
      pContext.pOutputContainer.innerText = "No minions matched the target. No command was sent, no jid was assigned.\nERROR: No return received";
    }
  }

  // the orchestrator for the output
  // determines what format should be used and uses that
  static _handleEarlyReturns (pOutputContainer, pResponse, pCommand) {
    // reformat runner/wheel output into regular output
    pResponse = Output._addVirtualMinion(pResponse, pCommand);

    if (typeof pResponse === "string") {
      // do not format a string as an object
      pOutputContainer.innerText = pResponse;
      return { handled: true, response: pResponse };
    }

    if (typeof pResponse !== "object" || Array.isArray(pResponse)) {
      pOutputContainer.innerText = Output.formatObject(pResponse);
      return { handled: true, response: pResponse };
    }

    // it might be documentation
    const commandCmd = pCommand.trim().replace(/ .*/, "");
    const commandArg = pCommand.trim().replace(/^[a-z.]* */i, "");
    const isDocumentationOutput = OutputDocumentation.isDocumentationOutput(pResponse, commandCmd, commandArg);
    if (isDocumentationOutput) {
      OutputDocumentation.reduceDocumentationOutput(pResponse, commandArg, commandArg);
      OutputDocumentation.addDocumentationOutput(pOutputContainer, pResponse);
      return { handled: true, response: pResponse };
    }

    return { commandArg, commandCmd, handled: false, response: pResponse };
  }

  static addResponseOutput (pOutputContainer, pMinionData, pResponse, pCommand, pOptions = {}) {
    const pJobId = pOptions.jobId;
    const pInitialStatus = pOptions.initialStatus;
    const pHighlightMinionId = pOptions.highlightMinionId;
    const pExtraInfo = pOptions.extraInfo;

    // remove old content
    pOutputContainer.innerText = "";

    const earlyReturn = Output._handleEarlyReturns(pOutputContainer, pResponse, pCommand);
    if (earlyReturn.handled) {
      return;
    }

    pResponse = earlyReturn.response;
    const commandCmd = earlyReturn.commandCmd;

    const topSummaryDiv = Utils.createDiv("no-search");
    const cntMinions = pMinionData.length;
    const downloadObject = {};

    Output._addResponseSummary(topSummaryDiv, pCommand, pResponse, pMinionData, pInitialStatus);

    Output._addExtraInfo(pOutputContainer, pExtraInfo);
    const masterTriangle = Output._addMasterTriangle(topSummaryDiv, pOutputContainer, cntMinions);

    const context = {
      commandCmd,
      downloadObject,
      masterTriangle,
      pCommand,
      pHighlightMinionId,
      pJobId,
      pMinionData,
      pOutputContainer,
      pResponse,
      topSummaryDiv,
    };

    Output._prepareResponseData(context);
    const nrMultiLineBlocks = Output._processMinionResponses(context);
    Output._finalizeOutput(context, nrMultiLineBlocks);
  }
}
