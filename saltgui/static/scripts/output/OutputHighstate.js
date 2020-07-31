import {Output} from "./Output.js";
import {OutputNested} from "./OutputNested.js";
import {Route} from "../routes/Route.js";
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

    const div = Route.createDiv("", "");

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let totalMilliSeconds = 0;
    let changes = 0;
    let nr = 0;
    for (const task of pTasks) {

      nr += 1;
      if (task.result === null) {
        skipped += 1;
      } else if (task.result) {
        succeeded += 1;
      } else {
        failed += 1;
      }

      const components = task.___key___.split("_|-");

      let txt = "----------";

      if (task.name) {
        txt += "\n          ID: " + task.name;
      } else {
        txt += "\n          ID: (anonymous task)";
      }

      txt += "\n    Function: " + components[0] + "." + components[3];

      txt += "\n      Result: " + JSON.stringify(task.result);

      if (task.comment) {
        txt += "\n     Comment: " + task.comment;
      }

      if (task.start_time) {
        txt += "\n     Started: " + task.start_time;
      }

      if (task.duration) {
        txt += "\n    Duration: " + OutputHighstate._getDurationClauseMillis(task.duration);
        totalMilliSeconds += task.duration;
      }

      txt += "\n     Changes:";

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
          txt += "\n" + OutputNested.formatNESTED(changes, 14);
          changes += 1;
        }
      }

      const taskSpan = Route.createSpan("", txt);
      if (!task.result) {
        taskSpan.style.color = "red";
      } else if (hasChanges) {
        taskSpan.style.color = "aqua";
      } else {
        taskSpan.style.color = "lime";
      }
      const taskDiv = Route.createDiv("", "");
      taskDiv.id = Utils.getIdFromMinionId(pMinionId + "." + nr);
      taskDiv.append(taskSpan);

      div.append(taskDiv);
    }

    let txt = "\nSummary for " + pMinionId;
    txt += "\n------------";
    const summarySpan = Route.createSpan("", txt);
    summarySpan.style.color = "aqua";
    div.append(summarySpan);

    txt = "\nSucceeded: " + succeeded;
    const succeededSpan = Route.createSpan("", txt);
    succeededSpan.style.color = "lime";
    div.append(succeededSpan);

    if (changes > 0) {
      txt = " (";
      const oSpan = Route.createSpan("", txt);
      oSpan.style.color = "white";
      div.append(oSpan);

      txt = "changed=" + changes;
      const changedSpan = Route.createSpan("", txt);
      changedSpan.style.color = "lime";
      div.append(changedSpan);

      txt = ")";
      const cSpan = Route.createSpan("", txt);
      cSpan.style.color = "white";
      div.append(cSpan);
    }

    txt = "\nFailed:    " + failed;
    const failedSpan = Route.createSpan("", txt);
    if (failed > 0) {
      failedSpan.style.color = "red";
    } else {
      failedSpan.style.color = "aqua";
    }
    div.append(failedSpan);

    txt = "\n------------";
    txt += "\nTotal states run: " + (succeeded + skipped + failed);
    txt += "\nTotal run time: " + OutputHighstate._getDurationClauseSecs(totalMilliSeconds);
    const totalsSpan = Route.createSpan("", txt);
    totalsSpan.style.color = "aqua";
    div.append(totalsSpan);

    return div;
  }

}
