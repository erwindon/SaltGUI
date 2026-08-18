/* global document */

import {Character} from "../Character.js";
import {Output} from "./Output.js";
import {Utils} from "../Utils.js";

export class OutputHighstateTaskSaltGui {

  static _shouldSkipChange (pKey, pChange) {
    /* eslint-disable line-comment-position,no-inline-comments,curly */
    if (pKey === "out" && pChange === "highstate") return true; // typical for orchestration
    if (pKey === "retcode" && pChange === 0) return true; // typical for cmd.run
    if (pKey === "stderr" && pChange === "") return true; // typical for cmd.run
    if (pKey === "stdout" && pChange === "") return true; // typical for cmd.run
    /* eslint-enable line-comment-position,no-inline-comments,curly */
    return false;
  }

  static _displayMultilineStringChange (pTaskDiv, pKey, pChange, pIndent) {
    pTaskDiv.append(Utils.createBr());
    // show multi-line text as a separate block
    pTaskDiv.append(document.createTextNode(pIndent + pKey + ":"));
    const lines = pChange.trim().split("\n");
    for (const line of lines) {
      pTaskDiv.append(Utils.createBr());
      pTaskDiv.append(document.createTextNode("      " + line));
    }
  }

  static _displayArrayChange (pTaskDiv, pKey, pChange, pIndent) {
    for (const idx in pChange) {
      const task = pChange[idx];
      pTaskDiv.append(Utils.createBr());
      pTaskDiv.append(document.createTextNode(
        pIndent + pKey + "[" + idx + "]: " + JSON.stringify(task)));
    }
  }

  static _displaySimpleChange (pTaskDiv, pKey, pChange, pIndent) {
    // show all other non-objects in a simple way
    pTaskDiv.append(Utils.createBr());
    pTaskDiv.append(document.createTextNode(
      pIndent + pKey + ": " +
      JSON.stringify(pChange)));
  }

  static _displayObjectChange (pTaskDiv, pKey, pChange, pIndent) {
    // treat old->new first
    if (pChange["old"] !== undefined && pChange["new"] !== undefined) {
      pTaskDiv.append(Utils.createBr());
      // place changes on one line
      // don't use arrows here, these are higher than a regular
      // text-line and disturb the text-flow
      pTaskDiv.append(document.createTextNode(
        pIndent + pKey + ": " +
        JSON.stringify(pChange.old) + " " +
        Character.BLACK_RIGHT_POINTING_POINTER + " " +
        JSON.stringify(pChange.new)));
    }
    // then show whatever remains
    for (const taskkey of Object.keys(pChange).sort(Utils.mySortFunction)) {

      // we already provided this as summary: old->new
      if (taskkey === "old" && pChange["new"] !== undefined) {
        continue;
      }
      if (taskkey === "new" && pChange["old"] !== undefined) {
        continue;
      }

      pTaskDiv.append(Utils.createBr());
      pTaskDiv.append(document.createTextNode(
        pIndent + pKey + ": " + taskkey + ": " +
        JSON.stringify(pChange[taskkey])));
    }
  }

  static _addChangesInfo (pTaskDiv, pTask, pIndent) {
    if (pTask["changes"] === undefined) {
      return;
    }

    if (typeof pTask.changes !== "object" || Array.isArray(pTask.changes)) {
      pTaskDiv.append(Utils.createBr());
      pTaskDiv.append(document.createTextNode(pIndent + JSON.stringify(pTask.changes)));
      return;
    }

    for (const key of Object.keys(pTask.changes).sort(Utils.mySortFunction)) {

      const change = pTask.changes[key];

      if (OutputHighstateTaskSaltGui._shouldSkipChange(key, change)) {
        continue;
      }

      if (typeof change === "string" && Utils.isMultiLineString(change)) {
        OutputHighstateTaskSaltGui._displayMultilineStringChange(pTaskDiv, key, change, pIndent);
      } else if (Array.isArray(change)) {
        OutputHighstateTaskSaltGui._displayArrayChange(pTaskDiv, key, change, pIndent);
      } else if (change === null || typeof change !== "object") {
        OutputHighstateTaskSaltGui._displaySimpleChange(pTaskDiv, key, change, pIndent);
      } else {
        OutputHighstateTaskSaltGui._displayObjectChange(pTaskDiv, key, change, pIndent);
      }
    }
  }

  static _isKnownAttribute (pKey, pValue, pMinionId, pJobId) {
    const knownAttrs = {
      "___key___": true,
      "__id__": true,
      "__jid__": true,
      "__orchestration__": true,
      "__run_num__": true,
      "__sls__": true,
      "__state_ran__": true,
      "changes": true,
      "comment": true,
      "duration": true,
      "host": true,
      "name": true,
      "pchanges": true,
      "result": true,
      "skip_watch": true,
      "start_time": true,
    };

    if (knownAttrs[pKey]) {
      return true;
    }

    if (pKey === "id" && pValue === pMinionId) {
      return true;
    }

    if (pKey === "jid" && pValue === pJobId) {
      return true;
    }

    return false;
  }

  static _addTaskTiming (pTaskDiv, pTask, pIndent) {
    if (pTask["start_time"] !== undefined) {
      pTaskDiv.append(Utils.createBr());
      // start_time is set by the original minion in its own timezone
      // we have no knowledge of that timezone, so no enhanced presentation here
      const startTime = Output.dateTimeStr("1999, Sep 9 " + pTask.start_time, null, null, true);
      pTaskDiv.append(document.createTextNode(pIndent + "Started at " + startTime));
    }

    if (pTask["duration"] !== undefined) {
      const milliSeconds = Math.round(pTask.duration);
      if (milliSeconds >= 10) {
        // anything below 10ms is not worth reporting
        // report only the "slow" jobs
        // it still counts for the grand total thought
        pTaskDiv.append(Utils.createBr());
        pTaskDiv.append(document.createTextNode(
          pIndent + "Duration " + Output.getDuration(milliSeconds)));
      }
    }
  }

  static _addTaskComment (pTaskDiv, pTask, pIndent) {
    if (pTask.comment) {
      pTaskDiv.append(Utils.createBr());
      let txt = pTask.comment;
      // trim extra whitespace
      txt = txt.replace(/[\n\r ]+$/g, ""); // NOSONAR S8786
      // indent extra lines
      txt = txt.replace(/\n+/g, "\n" + pIndent);
      pTaskDiv.append(document.createTextNode(pIndent + txt));
    }
  }

  static _addUnknownAttributes (pTaskDiv, pTask, pIndent, pMinionId, pJobId) {
    for (const [key, item] of Object.entries(pTask)) {
      if (!OutputHighstateTaskSaltGui._isKnownAttribute(key, item, pMinionId, pJobId)) {
        pTaskDiv.append(Utils.createBr());
        pTaskDiv.append(document.createTextNode(
          pIndent + key + " = " + JSON.stringify(item)));
      }
    }
  }

  static getStateOutput (pTask, pTaskId, pTaskName, pFunctionName, pMinionId, pJobId) {
    const taskDiv = Utils.createDiv();
    const indent = "    ";

    const span = Utils.createSpan("task-icon");
    span.innerText = Output.getTaskCharacter(pTask);
    span.classList.add(Output.getTaskClass(pTask));
    taskDiv.append(span);

    taskDiv.append(document.createTextNode(pTaskName));

    if (pTaskId && pTaskId !== pTaskName) {
      taskDiv.append(document.createTextNode(" id=[" + pTaskId + "]"));
    }

    if (pTask.__sls__) {
      taskDiv.append(document.createTextNode(
        " (from " + pTask.__sls__.replace(".", "/") + ".sls)"));
    }

    taskDiv.append(Utils.createBr());
    taskDiv.append(document.createTextNode(
      indent + "Function is " + pFunctionName));

    OutputHighstateTaskSaltGui._addTaskComment(taskDiv, pTask, indent);
    OutputHighstateTaskSaltGui._addChangesInfo(taskDiv, pTask, indent);
    OutputHighstateTaskSaltGui._addTaskTiming(taskDiv, pTask, indent);
    OutputHighstateTaskSaltGui._addUnknownAttributes(taskDiv, pTask, indent, pMinionId, pJobId);

    return taskDiv;
  }
}
