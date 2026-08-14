/* global window */

import {Character} from "../Character.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class StatsPanel extends Panel {

  constructor () {
    super("stats");

    this.addTitle("Stats");
    this.addHelpButton([
      "Numeric fields representing a timestamp are visible as string.",
      "Numeric fields representing a duration are visible as string.",
      "Trivial information on worker threads may have been removed."
    ]);
    this.addTable(["/stats"]);
    this.addMsg();
  }

  onShow () {
    if (this.table.tBodies[0].children.length === 0) {
      // cannot do this in the constructor
      // since the framework removes all rows
      const tr = Utils.createTr();
      this.table.tBodies[0].appendChild(tr);
      const td = Utils.createTd();
      tr.appendChild(td);
      this.statsTd = td;
    }

    this._onShowNow();

    this.updateStatsInterval = window.setInterval(() => {
      this._onShowNow();
    }, 5000);
  }

  _onShowNow () {
    const statsPromise = this.api.getStats();

    statsPromise.then((ok_Stats) => {
      this._handleStats(ok_Stats);
      return true;
    }, (_error_Stats) => {
      this._handleStats(JSON.stringify(_error_Stats));
      return false;
    });
  }

  onHide () {
    super.onHide();

    if (this.updateStatsInterval) {
      // stop the timer when nobody is looking
      window.clearInterval(this.updateStatsInterval);
      this.updateStatsInterval = null;
    }
  }

  // provide a shortened date format for cases
  // where we see the timezone multiple times on one screen
  static _explainDateTime (pDateTimeInMs) {
    if (pDateTimeInMs === null) {
      return pDateTimeInMs;
    }
    return pDateTimeInMs + " (=" + Output.dateTimeStr(pDateTimeInMs) + ")";
  }

  _handleStats (pStatsData) {
    if (this.showErrorRowInstead(pStatsData)) {
      this.statsTd.innerHTML = "<span style='color:red'>this error is typically caused by using the <tt>collect_stats: True</tt> setting in the master configuration file, which is broken in at least the recent versions of salt-api</span>";
      window.clearInterval(this.updateStatsInterval);
      this.updateStatsInterval = null;
      return;
    }

    this.setMsgTxt(null);
    StatsPanel._processWorkerThreads(pStatsData);
    StatsPanel._processCherryPyApplications(pStatsData);
    this.statsTd.innerText = Output.formatObject(pStatsData);
  }

  static _processWorkerThreads (pStatsData) {
    for (const topKey in pStatsData) {
      if (topKey === "CherryPy Applications") {
        continue;
      }

      const workerThreads = pStatsData[topKey]["Worker Threads"];
      if (!workerThreads) {
        continue;
      }

      StatsPanel._filterZeroThreads(workerThreads);
    }
  }

  static _filterZeroThreads (workerThreads) {
    const sortedThreadNames = Object.keys(workerThreads).sort(Utils.mySortFunction);
    let first = true;
    for (const threadName of sortedThreadNames) {
      if (first) {
        first = false;
        continue;
      }
      if (!StatsPanel._hasNonZeroStats(workerThreads[threadName])) {
        workerThreads[threadName] = Character.HORIZONTAL_ELLIPSIS;
      }
    }
  }

  static _hasNonZeroStats (thread) {
    for (const counterName in thread) {
      if (counterName !== "Enabled" && thread[counterName] !== 0) {
        return true;
      }
    }
    return false;
  }

  static _processCherryPyApplications (pStatsData) {
    const appData = pStatsData["CherryPy Applications"];
    if (!appData) {
      return;
    }

    appData["Current Time"] = StatsPanel._explainDateTime(appData["Current Time"]);
    appData["Start Time"] = StatsPanel._explainDateTime(appData["Start Time"]);
    appData["Uptime"] = StatsPanel._explainDateTime(appData["Uptime"]);

    const requests = appData["Requests"];
    if (requests) {
      StatsPanel._processDateTimeFields(requests, ["Start Time", "End Time"]);
    }

    const slowQueries = appData["Slow Queries"];
    if (slowQueries) {
      StatsPanel._processDateTimeFields(slowQueries, ["Start Time", "End Time"]);
    }
  }

  static _processDateTimeFields (collection, dateFields) {
    for (const key in collection) {
      for (const field of dateFields) {
        collection[key][field] = StatsPanel._explainDateTime(collection[key][field]);
      }
    }
  }
}
