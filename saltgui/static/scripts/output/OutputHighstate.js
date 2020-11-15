import {Output} from "./Output.js";
import {OutputNested} from "./OutputNested.js";
import {Utils} from "../Utils.js";

export class OutputHighstate {

  static isHighStateOutput (pCommand, pResponse) {

    if (!Output.isOutputFormatAllowed("highstate")) {
      return false;
    }

    if (typeof pResponse !== "object") {
      return false;
    }
    if (Array.isArray(pResponse)) {
      return false;
    }
    switch (pCommand) {
    case "state.apply":
    case "state.high":
    case "state.highstate":
    case "state.sls":
    case "state.sls_id":
    case "runners.state.orchestrate":
      break;
    case "state.low":
      // almost, but it is only one task
      // and we can handle only an object with tasks
      return false;
    default:
      return false;
    }
    for (const taskKey of Object.keys(pResponse)) {
      const components = taskKey.split("_|-");
      if (components.length !== 4) {
        return false;
      }
    }
    return true;
  }

  static _getDurationClauseMillis (pMilliSeconds) {
    // discard the microseconds
    const nrMilliSeconds = Math.round(pMilliSeconds * 1000) / 1000;
    return `${nrMilliSeconds} ms`;
  }

  static _getDurationClauseSecs (pMilliSeconds) {
    const nrSeconds = Math.round(pMilliSeconds) / 1000;
    return `${nrSeconds} s`;
  }

  static getHighStateLabel (pMinionId, pMinionResponse) {
    let anyFailures = false;
    let anySkips = false;
    // do not use Object.entries, that is not supported by the test framework
    for (const taskKey of Object.keys(pMinionResponse)) {
      const task = pMinionResponse[taskKey];
      if (task.result === null) {
        anySkips = true;
      } else if (!task.result) {
        anyFailures = true;
      }
    }

    if (anyFailures) {
      return Output.getMinionIdHtml(pMinionId, "host-failure");
    }
    if (anySkips) {
      return Output.getMinionIdHtml(pMinionId, "host-skips");
    }
    return Output.getMinionIdHtml(pMinionId, "host-success");
  }

  static getHighStateOutput (pMinionId, pTasks) {

    const div = Utils.createDiv();

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let totalMilliSeconds = 0;
    let changes = 0;
    let hidden = 0;
    let nr = 0;
    for (const task of pTasks) {

      nr += 1;

      if (Output.isHiddenTask(task)) {
        hidden += 1;
        continue;
      }

      if (task.result === null) {
        skipped += 1;
      } else if (task.result) {
        succeeded += 1;
      } else {
        failed += 1;
      }

      const components = task.___key___.split("_|-");

      let tTxt = "----------";

      if (task.name) {
        tTxt += "\n          ID: " + task.name;
      } else {
        tTxt += "\n          ID: (anonymous task)";
      }

      tTxt += "\n    Function: " + components[0] + "." + components[3];

      tTxt += "\n      Result: " + JSON.stringify(task.result);

      if (task.comment) {
        tTxt += "\n     Comment: " + task.comment;
      }

      if (task.start_time) {
        tTxt += "\n     Started: " + task.start_time;
      }

      if (task.duration) {
        tTxt += "\n    Duration: " + OutputHighstate._getDurationClauseMillis(task.duration);
        totalMilliSeconds += task.duration;
      }

      tTxt += "\n     Changes:";

      let hasChanges = false;
      if (task["changes"] !== undefined) {
        changes = task.changes;
        const keys = Object.keys(changes);
        if (keys.length === 2 && keys[0] === "out" && keys[1] === "ret") {
          changes = changes["ret"];
        }
        const str = JSON.stringify(changes);
        if (str !== "{}") {
          hasChanges = true;
          tTxt += "\n" + OutputNested.formatNESTED(changes, 14);
          changes += 1;
        }
      }

      const taskSpan = Utils.createSpan("", tTxt);
      if (!task.result) {
        taskSpan.style.color = "red";
      } else if (hasChanges) {
        taskSpan.style.color = "aqua";
      } else {
        taskSpan.style.color = "lime";
      }
      const taskDiv = Utils.createDiv("", "", Utils.getIdFromMinionId(pMinionId + "." + nr));
      taskDiv.append(taskSpan);

      div.append(taskDiv);
    }

    let sTxt = "\nSummary for " + pMinionId;
    sTxt += "\n------------";
    const summarySpan = Utils.createSpan("", sTxt);
    summarySpan.style.color = "aqua";
    div.append(summarySpan);

    sTxt = "\nSucceeded: " + (succeeded + hidden);
    const succeededSpan = Utils.createSpan("", sTxt);
    succeededSpan.style.color = "lime";
    div.append(succeededSpan);

    if (changes > 0) {
      sTxt = " (";
      const oSpan = Utils.createSpan("", sTxt);
      oSpan.style.color = "white";
      div.append(oSpan);

      sTxt = "changed=" + changes;
      const changedSpan = Utils.createSpan("", sTxt);
      changedSpan.style.color = "lime";
      div.append(changedSpan);

      sTxt = ")";
      const cSpan = Utils.createSpan("", sTxt);
      cSpan.style.color = "white";
      div.append(cSpan);
    }

    sTxt = "\nFailed:    " + failed;
    const failedSpan = Utils.createSpan("", sTxt);
    if (failed > 0) {
      failedSpan.style.color = "red";
    } else {
      failedSpan.style.color = "aqua";
    }
    div.append(failedSpan);

    sTxt = "\n------------";
    sTxt += "\nTotal states run: " + (succeeded + skipped + failed + hidden);
    sTxt += "\nTotal run time: " + OutputHighstate._getDurationClauseSecs(totalMilliSeconds);
    const totalsSpan = Utils.createSpan("", sTxt);
    totalsSpan.style.color = "aqua";
    div.append(totalsSpan);

    return div;
  }

}
