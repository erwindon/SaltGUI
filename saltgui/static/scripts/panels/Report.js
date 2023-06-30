/* global */

import {OutputJson} from "../output/OutputJson.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class ReportPanel extends Panel {

  constructor () {
    super("report");

    this.addTitle("Report - ...");
    this.title.style.marginBottom = "10px";

    this.addCloseButton();
    this.addConsole();
    this.addMsg();
  }

  onShow () {
    const reportId = decodeURIComponent(Utils.getQueryParam("id"));
    this.updateTitle("Report - " + reportId);

    const staticReportTxtPromise = this.api.getStaticFile(reportId + ".html");
    const localGrainsItemsPromise = this.api.getLocalGrainsItems();
    const localPillarItemsPromise = this.api.getLocalPillarItems();
    const wheelKeyFingerPromise = this.api.getWheelKeyFinger();

    staticReportTxtPromise.then((pTemplateTxt) => {
      this.templateTxt = pTemplateTxt;
      return true;
    }, (pTemplateError) => {
      this.console.innerHTML = ReportPanel._reportError(reportId, "Report '" + reportId + "' could not be opened because file '" + reportId + ".html' could not be opened", pTemplateError);
      this.setMsg("(error)");
      return true;
    });

    localGrainsItemsPromise.then((pLocalGrainsItemsData) => {
      this.localGrainsItems = pLocalGrainsItemsData.return[0];
      return true;
    }, (pLocalGrainsItemsMsg) => {
      this.localGrainsItems = {};
      this.console.innerHTML = ReportPanel._reportError(reportId, "Grains could not be loaded", pLocalGrainsItemsMsg);
      this.setMsg("(error)");
      return true;
    });

    localPillarItemsPromise.then((pLocalPillarItemsData) => {
      this.localPillarItems = pLocalPillarItemsData.return[0];
      return true;
    }, (pLocalPillarItemsMsg) => {
      this.localPillarItems = {};
      this.console.innerHTML = ReportPanel._reportError(reportId, "Pillars could not be loaded", pLocalPillarItemsMsg);
      this.setMsg("(error)");
      return true;
    });

    wheelKeyFingerPromise.then((pWheelKeyFingerData) => {
      const wheelKeyFingerData = pWheelKeyFingerData.return[0].data.return;
      this.keysInfo = {};
      for (const status in wheelKeyFingerData) {
        for (const minionId in wheelKeyFingerData[status]) {
          const key = wheelKeyFingerData[status][minionId];
          this.keysInfo[minionId] = {"key": key, "status": status};
        }
      }
      return true;
    }, (pWheelKeyFingerMsg) => {
      this.keysInfo = {};
      this.console.innerHTML = ReportPanel._reportError(reportId, "Keys could not be loaded", pWheelKeyFingerMsg);
      this.setMsg("(error)");
      return true;
    });

    /* eslint-disable compat/compat */
    /* Promise.all is not supported in op_mini all, IE 11 */
    const allPromise = Promise.all([staticReportTxtPromise, localGrainsItemsPromise, localPillarItemsPromise, wheelKeyFingerPromise]);
    /* eslint-enable compat/compat */
    allPromise.then(() => {
      try {
        this.console.innerHTML = this._processReport();
        this.setMsg("");
      } catch (err) {
        this.console.innerHTML = err;
        this.setMsg("(error)");
      }
    }, (err) => {
      this.console.innerHTML = err;
      this.setMsg("(error)");
    });
  }

  static _reportError (pReportId, pError, pAdditional) {
    let ret = "";
    ret += "<h1 style='color:red'>Error</h1>";
    ret += "<p>Error in report '" + pReportId + "' / file '" + pReportId + ".html'</p>";
    ret += "<p>" + pError + "</p>";
    if (pAdditional) {
      ret += "<p>Additional info:</p>";
      ret += "<p>" + pAdditional + "</p>";
    }
    return ret;
  }

  static _simpleDataAsString (pData) {
    if (typeof pData === "object") {
      return OutputJson.formatJSON(pData);
    }
    return String(pData);
  }

  static _keyCodeAsString (pKeyCode) {
    if (typeof pKeyCode === "object") {
      return OutputJson.formatJSON(pKeyCode);
    }
    if (pKeyCode === "local") {
      return "local";
    }
    if (pKeyCode === "minions") {
      return "<span class='accepted'>accepted</span>";
    }
    if (pKeyCode === "minions_pre") {
      return "<span class='unaccepted'>unaccepted</span>";
    }
    if (pKeyCode === "minions_denied") {
      return "<span class='denied'>denied</span>";
    }
    if (pKeyCode === "minions_rejected") {
      return "<span class='rejected'>rejected</span>";
    }
    return pKeyCode + "???";
  }

  _expandLine (line) {
    for (;;) {
      const startPos = line.indexOf("{{");
      if (startPos < 0) {
        return line;
      }
      const endPos = line.indexOf("}}", startPos);
      if (endPos < 0) {
        throw new Error("Unbalanced {{ ... }}");
      }
      const frag = line.substring(startPos + 2, endPos).trim();
      let replacement = "{?" + frag + "?}";
      if (frag === "minionid") {
        replacement = this.minionId;
      } else if (frag.startsWith("grain.")) {
        const grainName = frag.substring(6);
        const grainValue = this.localGrainsItem[grainName];
        replacement = ReportPanel._simpleDataAsString(grainValue);
      } else if (frag.startsWith("pillar.")) {
        const pillarName = frag.substring(7);
        const pillarValue = this.localPillarItem[pillarName];
        replacement = ReportPanel._simpleDataAsString(pillarValue);
      } else if (frag === "key.status") {
        const keyStatus = this.keyInfo.status;
        replacement = ReportPanel._keyCodeAsString(keyStatus);
      } else if (frag === "key.key" || frag === "key.fingerprint") {
        const key = this.keyInfo.key;
        replacement = "<span class='fingerprint'>" + ReportPanel._simpleDataAsString(key) + "</span>";
      } else {
        throw new Error("Unknown token '{{" + frag + "}}'");
      }
      if (replacement.indexOf("{{") >= 0 || replacement.indexOf("}}") >= 0) {
        throw new Error("Replacement string cannot contain '{{' or '}}'");
      }
      line = line.substring(0, startPos) + replacement + line.substring(endPos + 2);
    }
  }

  _processReportMinions (pTemplateLines, pReportLines) {

    // get the per-minion block
    const minionsBlock = [];
    while (pTemplateLines.length > 0) {
      const line = pTemplateLines.shift();
      if (line === "{% endfor %}") {
        break;
      }
      minionsBlock.push(line);
    }
    if (pTemplateLines.length === 0) {
      throw new Error("missing: {% endfor %}");
    }

    // use GrainsItems to provide the list of minions
    for (const minionId of Object.keys(this.localGrainsItems).sort()) {
      this.minionId = minionId;
      this.localGrainsItem = this.localGrainsItems[minionId];
      this.localPillarItem = this.localPillarItems[minionId];
      for (const line of minionsBlock) {
        pReportLines.push(this._expandLine(line));
      }
    }
    this.minionId = null;
    this.localGrainsItem = {};
    this.localPillarItem = {};
  }

  _processReportKeys (pTemplateLines, pReportLines) {

    // get the per-key block
    const keyBlock = [];
    while (pTemplateLines.length > 0) {
      const line = pTemplateLines.shift();
      if (line === "{% endfor %}") {
        break;
      }
      keyBlock.push(line);
    }
    if (pTemplateLines.length === 0) {
      throw new Error("missing: {% endfor %}");
    }

    // use WheelKeyFinger to provide the list of keys
    for (const minionId of Object.keys(this.keysInfo).sort()) {
      this.minionId = minionId;
      this.keyInfo = this.keysInfo[minionId];
      if (this.keyInfo.status === "local") {
        continue;
      }
      for (const line of keyBlock) {
        pReportLines.push(this._expandLine(line));
      }
    }
    this.minionId = null;
    this.keyInfo = {};
  }

  _processReport () {
    const templateLines = this.templateTxt.split(/\r|\n|\r\n/);
    const reportLines = [];

    while (templateLines.length > 0) {
      const line = templateLines.shift();
      if (line === "{% for all minions %}") {
        this._processReportMinions(templateLines, reportLines);
      } else if (line === "{% for all keys %}") {
        this._processReportKeys(templateLines, reportLines);
      } else {
        reportLines.push(line);
      }
    }

    return reportLines.join("\n");
  }
}
