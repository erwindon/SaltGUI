import {Output} from "./Output.js";
import {OutputHighstateSummaryOriginal} from "./OutputHighstateSummaryOriginal.js";
import {OutputHighstateSummarySaltGui} from "./OutputHighstateSummarySaltGui.js";
import {OutputHighstateTaskFull} from "./OutputHighstateTaskFull.js";
import {OutputHighstateTaskSaltGui} from "./OutputHighstateTaskSaltGui.js";
import {OutputHighstateTaskTerse} from "./OutputHighstateTaskTerse.js";
import {Utils} from "../Utils.js";

export class OutputHighstate {

  static isHighStateOutput (pCommand, pResponse) {
    if (typeof pResponse !== "object") {
      return false;
    }
    if (Array.isArray(pResponse)) {
      return false;
    }
    switch (pCommand) {
    case "runner.state.orchestrate_single":
    case "state.apply":
    case "state.high":
    case "state.highstate":
    case "state.sls":
    case "state.sls_id":
      break;
    case "runner.state.orchestrate":
    case "runners.state.orchestrate":
      // we need command-names in both variants
      return true;
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

  static getHighStateLabel (pMinionId, pMinionResponse) {
    let anyFailures = false;
    let anySkips = false;
    for (const task of Object.values(pMinionResponse)) {
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

  static _compressStates (pTasks) {
    const tasks = {};
    for (const task of pTasks) {
      // group by this key
      const key = task.__id__ + "-" + task.result;
      if (key in tasks) {
        // not first time we see this entry, adjust some properties
        tasks[key].cnt += 1;
        // sum() of duration
        if (task.duration) {
          tasks[key].duration += task.duration;
        }
        // min() of start_time
        if (task["start_time"]) {
          tasks[key]["start_time"] = Math.min(tasks[key]["start_time"], task["start_time"]);
        }
      } else {
        // first time we see an entry, use all details and start counting at 1
        tasks[key] = task;
        tasks[key].cnt = 1;
      }
    }
    return Object.keys(tasks).map((key) => tasks[key]);
  }

  static _selectTaskOutput (pTask, pTaskId, pTaskName, pFunctionName, pMinionId, pJobId, pNrChanges) {
    if (Output.isStateOutputSelected("terse")) {
      return OutputHighstateTaskTerse.getStateOutput(pTask, pTaskName, pFunctionName);
    } else if (Output.isStateOutputSelected("mixed") && pTask.result) {
      return OutputHighstateTaskTerse.getStateOutput(pTask, pTaskName, pFunctionName);
    } else if (Output.isStateOutputSelected("changes") && pTask.result && pNrChanges) {
      return OutputHighstateTaskTerse.getStateOutput(pTask, pTaskName, pFunctionName);
    } else if (Output.isOutputFormatAllowed("saltguihighstate")) {
      return OutputHighstateTaskSaltGui.getStateOutput(pTask, pTaskId, pTaskName, pFunctionName, pMinionId, pJobId);
    } else {
      return OutputHighstateTaskFull.getStateOutput(pTask, pTaskId, pTaskName, pFunctionName);
    }
  }

  static _accumulateTaskStats (pTasks, pMinionId, pJobId, pDiv) {
    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let totalMilliSeconds = 0;
    let changesSummary = 0;
    let changesDetail = 0;
    let hidden = 0;
    let nr = 0;

    for (const task of pTasks) {
      nr += 1;

      if (task.duration) {
        totalMilliSeconds += task.duration;
      }

      if (task.result === null) {
        skipped += 1;
      } else if (task.result) {
        succeeded += 1;
      } else {
        failed += 1;
      }

      if (Output.isHiddenTask(task)) {
        hidden += 1;
        continue;
      }

      const components = task.___key___.split("_|-");
      const functionName = components[0] + "." + components[3];
      const nrChanges = Output.getTaskNrChanges(task);
      changesDetail += nrChanges;

      const taskId = components[1];
      let taskName = components[2];
      if (Output.isStateOutputSelected("_id")) {
        taskName = taskId;
      }
      // might be a grouped entry, then show the count
      if (task.cnt) {
        taskName += " (" + task.cnt + ")";
      }

      const taskSpan = OutputHighstate._selectTaskOutput(task, taskId, taskName, functionName, pMinionId, pJobId, nrChanges);
      taskSpan.classList.add(Output.getTaskClass(task));

      if (task.result && nrChanges) {
        changesSummary += 1;
      }

      const taskDiv = Utils.createDiv("", "", Utils.getIdFromMinionId(pMinionId + "." + nr));
      taskDiv.append(taskSpan);
      pDiv.append(taskDiv);
    }

    return { changesDetail, changesSummary, failed, hidden, skipped, succeeded, totalMilliSeconds };
  }

  static _addSummary (pDiv, pStats) {
    if (Output.isOutputFormatAllowed("saltguihighstate")) {
      OutputHighstateSummarySaltGui.addSummarySpan(pDiv, pStats.succeeded, pStats.failed, pStats.skipped, pStats.totalMilliSeconds, pStats.changesDetail, pStats.hidden);
    } else {
      OutputHighstateSummaryOriginal.addSummarySpan(pDiv, null, pStats.succeeded, pStats.failed, pStats.skipped, pStats.totalMilliSeconds, pStats.changesSummary);
    }
  }

  static getHighStateOutput (pMinionId, pTasks, pJobId) {

    const div = Utils.createDiv();

    // collapse states when requested
    const stateCompressIds = Utils.getStorageItemBoolean("session", "state_compress_ids");
    let tasks = pTasks;
    if (stateCompressIds) {
      tasks = OutputHighstate._compressStates(pTasks);
    }

    const stats = OutputHighstate._accumulateTaskStats(tasks, pMinionId, pJobId, div);
    OutputHighstate._addSummary(div, stats);

    return div;
  }
}
