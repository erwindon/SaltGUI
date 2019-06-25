import {Output} from './Output.js';
import {OutputNested} from './OutputNested.js';
import {Utils} from '../Utils.js';

export class OutputHighstate {

  static isHighStateOutput(command, response) {

    if(!Output.isOutputFormatAllowed("highstate")) return false;

    if(typeof response !== "object") return false;
    if(Array.isArray(response)) return false;
    if(command !== "state.apply" && command !== "state.highstate") return false;
    for(const key of Object.keys(response)) {
      const components = key.split("_|-");
      if(components.length !== 4) return false;
    }
    return true;
  }

  static getDurationClauseMillis(millis) {
    const ms = Math.round(millis * 1000) / 1000;
    return `${ms} ms`;
  }

  static getDurationClauseSecs(millis) {
    const s = Math.round(millis) / 1000;
    return `${s} s`;
  }

  static getHighStateLabel(hostname, hostResponse) {
    let anyFailures = false;
    let anySkips = false;
    // do not use Object.entries, that is not supported by the test framework
    for(const key of Object.keys(hostResponse)) {
      const task = hostResponse[key];
      if(task.result === null) anySkips = true;
      else if(!task.result) anyFailures = true;
    }

    if(anyFailures) {
      return Output.getHostnameHtml(hostname, "host-failure");
    }
    if(anySkips) {
      return Output.getHostnameHtml(hostname, "host-skips");
    }
    return Output.getHostnameHtml(hostname, "host-success");
  }

  static getHighStateOutput(hostname, pTasks) {

    const indent = "    ";

    const div = document.createElement("div");

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let total_millis = 0;
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

      const taskDiv = document.createElement("div");
      taskDiv.id = Utils.getIdFromMinionId(hostname + "." + nr);

      const taskSpan = document.createElement("span");
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
        total_millis += task.duration;
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

      taskSpan.innerText = txt;
      if(!task.result) {
        taskSpan.style.color = "red";
      } else if(hasChanges) {
        taskSpan.style.color = "aqua";
      } else {
        taskSpan.style.color = "lime";
      }
      taskDiv.append(taskSpan);

      div.append(taskDiv);
    }

    const summarySpan = document.createElement("span");
    let txt = "\nSummary for " + hostname;
    txt += "\n------------";
    summarySpan.innerText = txt;
    summarySpan.style.color = "aqua";
    div.append(summarySpan);

    const succeededSpan = document.createElement("span");
    txt = "\nSucceeded: " + succeeded;
    succeededSpan.innerText = txt;
    succeededSpan.style.color = "lime";
    div.append(succeededSpan);

    if(changes > 0) {
      const oSpan = document.createElement("span");
      txt = " (";
      oSpan.innerText = txt;
      oSpan.style.color = "white";
      div.append(oSpan);

      const changedSpan = document.createElement("span");
      txt = "changed=" + changes;
      changedSpan.innerText = txt;
      changedSpan.style.color = "lime";
      div.append(changedSpan);

      const cSpan = document.createElement("span");
      txt = ")";
      cSpan.innerText = txt;
      cSpan.style.color = "white";
      div.append(cSpan);
    }

    const failedSpan = document.createElement("span");
    txt = "\nFailed:    " + failed;
    failedSpan.innerText = txt;
    if(failed > 0) {
      failedSpan.style.color = "red";
    } else {
      failedSpan.style.color = "aqua";
    }
    div.append(failedSpan);

    const totalsSpan = document.createElement("span");
    txt = "\n------------";
    txt += "\nTotal states run: " + (succeeded + skipped + failed);
    txt += "\nTotal run time: " + OutputHighstate.getDurationClauseSecs(total_millis);
    totalsSpan.innerText = txt;
    totalsSpan.style.color = "aqua";
    div.append(totalsSpan);

    return div;
  }

}
