import {Output} from "./Output.js";
import {OutputNested} from "./OutputNested.js";
import {Utils} from "../Utils.js";

export class OutputHighstateTaskFull {

  static getStateOutput (pTask, pTaskId, pTaskName, pFunctionName) {

    let txt = "----------";

    txt += "\n          ID: " + pTaskId;

    txt += "\n    Function: " + pFunctionName;

    if (pTaskId !== pTaskName) {
      txt += "\n        Name: " + pTaskName;
    }

    txt += "\n      Result: " + JSON.stringify(pTask.result);

    if (pTask.comment) {
      txt += "\n     Comment: " + pTask.comment;
    }

    if (pTask.start_time) {
      const startTime = Output.dateTimeStr("1999, Sep 9 " + pTask.start_time, null, null, true);
      txt += "\n     Started: " + startTime;
    }

    if (pTask.duration >= 10) {
      txt += "\n    Duration: " + Output.getDuration(pTask.duration);
    }

    txt += "\n     Changes:";

    let hasChanges = false;
    let chgs = null;
    if (pTask["changes"] !== undefined) {
      chgs = pTask.changes;
      const keys = Object.keys(chgs);
      if (keys.length === 2 && keys[0] === "out" && keys[1] === "ret") {
        chgs = chgs["ret"];
      }
      const str = JSON.stringify(chgs);
      if (str !== "{}") {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      txt += "\n" + OutputNested.formatNESTED(chgs, 14);
    }

    return Utils.createSpan("", txt);
  }
}
