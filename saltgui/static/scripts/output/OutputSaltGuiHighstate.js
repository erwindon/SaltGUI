import {Output} from './Output.js';
import {Utils} from '../Utils.js';

export class OutputSaltGuiHighstate {

  // no separate `isHighStateOutput` here
  // the implementation from OutputHighstate is (re)used

  static getDurationClause(millis) {
    if(millis < 1000) {
      return Utils.txtZeroOneMany(millis,
        "{0} milliseconds", "{0} millisecond", "{0} milliseconds");
    }
    return Utils.txtZeroOneMany(millis / 1000, "", "{0} second", "{0} seconds");
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

  static addChangesInfo(taskDiv, task, indent) {
    if(!task.hasOwnProperty("changes")) {
      return 0;
    }

    if(typeof task.changes !== "object" || Array.isArray(task.changes)) {
      taskDiv.append(document.createElement("br"));
      taskDiv.append(document.createTextNode(indent + JSON.stringify(task.changes)));
      return 0;
    }

    let changes = 0;
    for(const key of Object.keys(task.changes).sort()) {

      changes = changes + 1;

      const change = task.changes[key];

      if(typeof change === "string" && Utils.isMultiLineString(change)) {
        taskDiv.append(document.createElement("br"));
        // show multi-line text as a separate block
        taskDiv.append(document.createTextNode(indent + key + ":"));
        const lines = change.trim().split("\n");
        for(const line of lines) {
          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode("      " + line));
        }
        continue;
      }

      if(Array.isArray(change)) {
        for(const idx in change) {
          const task = change[idx];
          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode(
            indent + key + "[" + idx + "]: " + JSON.stringify(task)));
        }
        continue;
      }

      if(typeof change !== "object") {
        // show all other non-objects in a simple way
        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(
          indent + key + ": " +
          JSON.stringify(change)));
        continue;
      }

      // treat old->new first
      if(change.hasOwnProperty("old") && change.hasOwnProperty("new")) {
        taskDiv.append(document.createElement("br"));
        // place changes on one line
        // 25BA = BLACK RIGHT-POINTING POINTER
        // don't use arrows here, these are higher than a regular
        // text-line and disturb the text-flow
        taskDiv.append(document.createTextNode(
          indent + key + ": " +
          JSON.stringify(change.old) + " \u25BA " +
          JSON.stringify(change.new)));
      }
      // then show whatever remains
      for(const taskkey of Object.keys(change).sort()) {

        // we already provided this as summary: old->new
        if(taskkey === "old" && change.hasOwnProperty("new")) continue;
        if(taskkey === "new" && change.hasOwnProperty("old")) continue;

        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(
          indent + key + ": " + taskkey + ": " +
          JSON.stringify(change[taskkey])));
      }
    }
    return changes;
  }

  static getHighStateOutput(pMinionId, pJobId, pTasks) {

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

      const taskDiv = document.createElement("div");
      taskDiv.id = Utils.getIdFromMinionId(pMinionId + "." + nr);

      const span = document.createElement("span");
      if(task.result === null) {
        // 2714 = HEAVY CHECK MARK
        span.style.color = "yellow";
        span.innerText = "\u2714";
        skipped += 1;
      } else if(task.result) {
        // 2714 = HEAVY CHECK MARK
        span.style.color = "green";
        span.innerText = "\u2714";
        succeeded += 1;
      } else {
        // 2718 = HEAVY BALLOT X
        span.style.color = "red";
        span.innerText = "\u2718";
        failed += 1;
      }
      taskDiv.append(span);

      taskDiv.append(document.createTextNode(" "));

      if(task.name) {
        taskDiv.append(document.createTextNode(task.name));
      } else {
        // make sure that the checkbox/ballot-x is on a reasonable line
        // also for the next "from" clause (if any)
        taskDiv.append(document.createTextNode("(anonymous task)"));
      }

      if(task.__id__ && task.__id__ !== task.name) {
        taskDiv.append(document.createTextNode(" id=" + encodeURIComponent(task.__id__)));
      }

      if(task.__sls__) {
        taskDiv.append(document.createTextNode(
          " (from " + task.__sls__.replace(".", "/") + ".sls)"));
      }

      const components = task.___key___.split("_|-");
      taskDiv.append(document.createElement("br"));
      taskDiv.append(document.createTextNode(
        indent + "Function is " + components[0] + "." + components[3]));

      if(task.comment) {
        taskDiv.append(document.createElement("br"));
        let txt = task.comment;
        // trim extra whitespace
        txt = txt.replace(/[ \r\n]+$/g, "");
        // indent extra lines
        txt = txt.replace(/[\n]+/g, "\n" + indent);
        taskDiv.append(document.createTextNode(indent + txt));
      }

      changes += OutputSaltGuiHighstate.addChangesInfo(taskDiv, task, indent);

      if(task.hasOwnProperty("start_time")) {
        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(
          indent + "Started at " + Output.dateTimeStr(task.start_time)));
      }

      if(task.hasOwnProperty("duration")) {
        const millis = Math.round(task.duration);
        total_millis += millis;
        if(millis >= 10) {
          // anything below 10ms is not worth reporting
          // report only the "slow" jobs
          // it still counts for the grand total thought
          taskDiv.append(document.createElement("br"));
          taskDiv.append(document.createTextNode(
            indent + "Duration " + OutputSaltGuiHighstate.getDurationClause(millis)));
        }
      }

      // show any unknown attribute of a task
      // do not use Object.entries, that is not supported by the test framework
      for(const key of Object.keys(task)) {
        const item = task[key];
        if(key === "___key___") continue; // ignored, generated by us
        if(key === "__id__") continue; // handled
        if(key === "__jid__") continue; // internal use
        if(key === "__orchestration__") continue; // internal use
        if(key === "__sls__") continue; // handled
        if(key === "__run_num__") continue; // handled, not shown
        if(key === "changes") continue; // handled
        if(key === "comment") continue; // handled
        if(key === "duration") continue; // handled
        if(key === "host") continue; // ignored, same as host
        if(key === "id" && item === pMinionId) continue; // trivial
        if(key === "jid" && item === pJobId) continue; // trivial
        if(key === "name") continue; // handled
        if(key === "pchanges") continue; // ignored, also ignored by cli
        if(key === "result") continue; // handled
        if(key === "skip_watch") continue; // related to onlyif
        if(key === "start_time") continue; // handled
        taskDiv.append(document.createElement("br"));
        taskDiv.append(document.createTextNode(
          indent + key + " = " + JSON.stringify(item)));
      }

      div.append(taskDiv);
    }

    // add a summary line
    let line = "";

    if(succeeded) line += ", " + succeeded + " succeeded";
    if(skipped) line += ", " + skipped + " skipped";
    if(failed) line += ", " + failed + " failed";
    const total = succeeded + skipped + failed;
    if(total !== succeeded && total !== skipped && total !== failed) {
      line += ", " + (succeeded + skipped + failed) + " total";
    }

    // note that the number of changes may be higher or lower
    // than the number of tasks. tasks may contribute multiple
    // changes, or tasks may have no changes.
    line += Utils.txtZeroOneMany(changes, "", ", {0} change", ", {0} changes");

    // multiple durations and significant?
    if(total > 1 && total_millis >= 10) {
      line += ", " + OutputSaltGuiHighstate.getDurationClause(total_millis);
    }

    if(line) {
      div.append(document.createTextNode(line.substring(2)));
    }

    return div;
  }

}
