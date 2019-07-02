import {Output} from './Output.js';
import {OutputNested} from './OutputNested.js';
import {Route} from '../routes/Route.js';
import {Utils} from '../Utils.js';

export class OutputHighstate {

  static isHighStateOutput(pCommand, pResponse) {

    if(!Output.isOutputFormatAllowed("highstate")) return false;

    if(typeof pResponse !== "object") return false;
    if(Array.isArray(pResponse)) return false;
    if(pCommand !== "state.apply" && pCommand !== "state.highstate") return false;
    for(const taskKey of Object.keys(pResponse)) {
      const components = taskKey.split("_|-");
      if(components.length !== 4) return false;
    }
    return true;
  }

  static getDurationClauseMillis(pMilliSeconds) {
    const ms = Math.round(pMilliSeconds * 1000) / 1000;
    return `${ms} ms`;
  }

  static getDurationClauseSecs(pMilliSeconds) {
    const s = Math.round(pMilliSeconds) / 1000;
    return `${s} s`;
  }

  static getHighStateLabel(pMinionId, pMinionResponse) {
    let anyFailures = false;
    let anySkips = false;
    // do not use Object.entries, that is not supported by the test framework
    for(const taskKey of Object.keys(pMinionResponse)) {
      const task = pMinionResponse[taskKey];
      if(task.result === null) anySkips = true;
      else if(!task.result) anyFailures = true;
    }

    if(anyFailures) {
      return Output.getMinionIdHtml(pMinionId, "host-failure");
    }
    if(anySkips) {
      return Output.getMinionIdHtml(pMinionId, "host-skips");
    }
    return Output.getMinionIdHtml(pMinionId, "host-success");
  }

  static getHighStateOutput(pMinionId, pTasks) {

    const div = Route._createDiv("", "");

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let totalMilliSeconds = 0;
    let changes = 0;
    let nr = 0;
    for(const task of pTasks) {

      nr += 1;
      if(task.result === null) {
        skipped += 1;
      } else if(task.result) {
        succeeded += 1;
      } else {
        failed += 1;
      }

      const components = task.___key___.split("_|-");

      let txt = "----------";

      if(task.name)
        txt += "\n          ID: " + task.name;
      else
        txt += "\n          ID: (anonymous task)";

      txt += "\n    Function: " + components[0] + "." + components[3];

      txt += "\n      Result: " + JSON.stringify(task.result);

      if(task.comment)
        txt += "\n     Comment: " + task.comment;

      if(task.start_time)
        txt += "\n     Started: " + task.start_time;

      if(task.duration) {
        txt += "\n    Duration: " + OutputHighstate.getDurationClauseMillis(task.duration);
        totalMilliSeconds += task.duration;
      }

      txt += "\n     Changes:";

      let hasChanges = false;
      if(task.hasOwnProperty("changes")) {
        const str = JSON.stringify(task.changes);
        if(str !== "{}") {
          hasChanges = true;
          txt += "\n" + OutputNested.formatNESTED(task.changes, 14);
          changes += 1;
        }
      }

      const taskSpan = Route._createSpan("", txt);
      if(!task.result) {
        taskSpan.style.color = "red";
      } else if(hasChanges) {
        taskSpan.style.color = "aqua";
      } else {
        taskSpan.style.color = "lime";
      }
      const taskDiv = Route._createDiv("", "");
      taskDiv.id = Utils.getIdFromMinionId(pMinionId + "." + nr);
      taskDiv.append(taskSpan);

      div.append(taskDiv);
    }

    let txt = "\nSummary for " + pMinionId;
    txt += "\n------------";
    const summarySpan = Route._createSpan("", txt);
    summarySpan.style.color = "aqua";
    div.append(summarySpan);

    txt = "\nSucceeded: " + succeeded;
    const succeededSpan = Route._createSpan("", txt);
    succeededSpan.style.color = "lime";
    div.append(succeededSpan);

    if(changes > 0) {
      txt = " (";
      const oSpan = Route._createSpan("", txt);
      oSpan.style.color = "white";
      div.append(oSpan);

      txt = "changed=" + changes;
      const changedSpan = Route._createSpan("", txt);
      changedSpan.style.color = "lime";
      div.append(changedSpan);

      txt = ")";
      const cSpan = Route._createSpan("", txt);
      cSpan.style.color = "white";
      div.append(cSpan);
    }

    txt = "\nFailed:    " + failed;
    const failedSpan = Route._createSpan("", txt);
    if(failed > 0) {
      failedSpan.style.color = "red";
    } else {
      failedSpan.style.color = "aqua";
    }
    div.append(failedSpan);

    txt = "\n------------";
    txt += "\nTotal states run: " + (succeeded + skipped + failed);
    txt += "\nTotal run time: " + OutputHighstate.getDurationClauseSecs(totalMilliSeconds);
    const totalsSpan = Route._createSpan("", txt);
    totalsSpan.style.color = "aqua";
    div.append(totalsSpan);

    return div;
  }

}
