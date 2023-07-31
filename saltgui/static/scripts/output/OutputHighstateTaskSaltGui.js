/* global */

import {Character} from "../Character.js";
import {Output} from "./Output.js";
import {Utils} from "../Utils.js";

export class OutputHighstateTaskSaltGui {

  static _addChangesInfo (pTaskDiv, pTask, pIndent) {
    if (pTask["changes"] === undefined) {
      return;
    }

    if (typeof pTask.changes !== "object" || Array.isArray(pTask.changes)) {
      pTaskDiv.append(Utils.createBr());
      pTaskDiv.append(document.createTextNode(pIndent + JSON.stringify(pTask.changes)));
      return;
    }

    for (const key of Object.keys(pTask.changes).sort()) {

      const change = pTask.changes[key];

      /* eslint-disable line-comment-position,no-inline-comments,curly */
      if (key === "out" && change === "highstate") continue; // typical for orchestration
      if (key === "retcode" && change === 0) continue; // typical for cmd.run
      if (key === "stderr" && change === "") continue; // typical for cmd.run
      if (key === "stdout" && change === "") continue; // typical for cmd.run
      /* eslint-enable line-comment-position,no-inline-comments,curly */

      if (typeof change === "string" && Utils.isMultiLineString(change)) {
        pTaskDiv.append(Utils.createBr());
        // show multi-line text as a separate block
        pTaskDiv.append(document.createTextNode(pIndent + key + ":"));
        const lines = change.trim().split("\n");
        for (const line of lines) {
          pTaskDiv.append(Utils.createBr());
          pTaskDiv.append(document.createTextNode("      " + line));
        }
        continue;
      }

      if (Array.isArray(change)) {
        for (const idx in change) {
          const task = change[idx];
          pTaskDiv.append(Utils.createBr());
          pTaskDiv.append(document.createTextNode(
            pIndent + key + "[" + idx + "]: " + JSON.stringify(task)));
        }
        continue;
      }

      if (change === null || typeof change !== "object") {
        // show all other non-objects in a simple way
        pTaskDiv.append(Utils.createBr());
        pTaskDiv.append(document.createTextNode(
          pIndent + key + ": " +
          JSON.stringify(change)));
        continue;
      }

      // treat old->new first
      if (change["old"] !== undefined && change["new"] !== undefined) {
        pTaskDiv.append(Utils.createBr());
        // place changes on one line
        // don't use arrows here, these are higher than a regular
        // text-line and disturb the text-flow
        pTaskDiv.append(document.createTextNode(
          pIndent + key + ": " +
          JSON.stringify(change.old) + " " +
          Character.BLACK_RIGHT_POINTING_POINTER + " " +
          JSON.stringify(change.new)));
      }
      // then show whatever remains
      for (const taskkey of Object.keys(change).sort()) {

        // we already provided this as summary: old->new
        if (taskkey === "old" && change["new"] !== undefined) {
          continue;
        }
        if (taskkey === "new" && change["old"] !== undefined) {
          continue;
        }

        pTaskDiv.append(Utils.createBr());
        pTaskDiv.append(document.createTextNode(
          pIndent + key + ": " + taskkey + ": " +
          JSON.stringify(change[taskkey])));
      }
    }
  }

  static getStateOutput (pTask, pTaskId, pTaskName, pFunctionName, pMinionId, pJobId) {
    const taskDiv = Utils.createDiv();

    const span = Utils.createSpan("task-icon");
    if (pTask.result === null) {
      span.innerText = Character.HEAVY_CHECK_MARK;
      span.classList.add("task-skipped");
    } else if (pTask.result) {
      span.innerText = Character.HEAVY_CHECK_MARK;
      span.classList.add("task-success");
    } else {
      span.innerText = Character.HEAVY_BALLOT_X;
      span.classList.add("task-failure");
    }
    // don't use task-changes here
    taskDiv.append(span);

    taskDiv.append(document.createTextNode(pTaskName));

    if (pTaskId && pTaskId !== pTaskName) {
      taskDiv.append(document.createTextNode(" id=[" + pTaskId + "]"));
    }

    if (pTask.__sls__) {
      taskDiv.append(document.createTextNode(
        " (from " + pTask.__sls__.replace(".", "/") + ".sls)"));
    }

    const indent = "    ";

    taskDiv.append(Utils.createBr());
    taskDiv.append(document.createTextNode(
      indent + "Function is " + pFunctionName));

    if (pTask.comment) {
      taskDiv.append(Utils.createBr());
      let txt = pTask.comment;
      // trim extra whitespace
      txt = txt.replace(/[ \r\n]+$/g, "");
      // indent extra lines
      txt = txt.replace(/\n+/g, "\n" + indent);
      taskDiv.append(document.createTextNode(indent + txt));
    }

    OutputHighstateTaskSaltGui._addChangesInfo(taskDiv, pTask, indent);

    if (pTask["start_time"] !== undefined) {
      taskDiv.append(Utils.createBr());
      // start_time is set by the original minion in its own timezone
      // we have no knowledge of that timezone, so no enhanced presentation here
      const startTime = Output.dateTimeStr("1999, Sep 9 " + pTask.start_time, null, null, true);
      taskDiv.append(document.createTextNode(indent + "Started at " + startTime));
    }

    if (pTask["duration"] !== undefined) {
      const milliSeconds = Math.round(pTask.duration);
      if (milliSeconds >= 10) {
        // anything below 10ms is not worth reporting
        // report only the "slow" jobs
        // it still counts for the grand total thought
        taskDiv.append(Utils.createBr());
        taskDiv.append(document.createTextNode(
          indent + "Duration " + Output.getDuration(milliSeconds)));
      }
    }

    // show any unknown attribute of a task
    // do not use Object.entries, that is not supported by the test framework as it is ES8/2017
    for (const key of Object.keys(pTask)) {
      const item = pTask[key];
      /* eslint-disable line-comment-position,no-inline-comments,curly */
      if (key === "___key___") continue; // ignored, generated by us
      if (key === "__id__") continue; // handled
      if (key === "__jid__") continue; // internal use
      if (key === "__orchestration__") continue; // internal use
      if (key === "__run_num__") continue; // handled, not shown
      if (key === "__sls__") continue; // handled
      if (key === "__state_ran__") continue; // ignored, also in description
      if (key === "changes") continue; // handled
      if (key === "comment") continue; // handled
      if (key === "duration") continue; // handled
      if (key === "host") continue; // ignored, same as host
      if (key === "id" && item === pMinionId) continue; // trivial
      if (key === "jid" && item === pJobId) continue; // trivial
      if (key === "name") continue; // handled
      if (key === "pchanges") continue; // ignored, also ignored by cli
      if (key === "result") continue; // handled
      if (key === "skip_watch") continue; // related to onlyif
      if (key === "start_time") continue; // handled
      /* eslint-enable line-comment-position,no-inline-comments,curly */
      taskDiv.append(Utils.createBr());
      taskDiv.append(document.createTextNode(
        indent + key + " = " + JSON.stringify(item)));
    }

    return taskDiv;
  }
}
