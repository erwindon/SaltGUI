import {Output} from "./Output.js";
import {Utils} from "../Utils.js";

export class OutputHighstateTaskTerse {

  static getStateOutput (pTask, pTaskName, pFunctionName) {

    let txt = "Name: " + pTaskName;
    txt += " - Function: " + pFunctionName;
    txt += " - Result: ";
    if (JSON.stringify(pTask["changes"]) !== "{}") {
      txt += "Changed";
    } else if (pTask["result"] === false) {
      txt += "Failed";
    } else if (pTask["result"] === undefined) {
      txt += "Differs";
    } else {
      txt += "Clean";
    }
    if (pTask.start_time) {
      // start_time is set by the original minion in its own timezone
      // we have no knowledge of that timezone, so no enhanced presentation here
      const startTime = Output.dateTimeStr("1999, Sep 9 " + pTask.start_time, null, null, true);
      txt += " - Started: " + startTime;
    }
    if (pTask.duration >= 10) {
      txt += " - Duration: " + Output.getDuration(pTask.duration);
    }

    return Utils.createSpan("", txt);
  }
}
