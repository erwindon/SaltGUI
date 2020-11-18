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
      txt += " - Started: " + Output.dateTimeStr(pTask.start_time);
    }
    if (pTask.duration >= 10) {
      txt += " - Duration: " + Output.getDuration(pTask.duration);
    }

    const span = Utils.createSpan();
    span.innerText = txt;
    return span;
  }
}
