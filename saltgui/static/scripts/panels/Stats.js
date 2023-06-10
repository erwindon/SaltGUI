/* global */

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

    this.onShowNow();

    this.updateStatsTimer = window.setInterval(() => {
      this.onShowNow();
    }, 5000);
  }

  onShowNow () {
    const statsPromise = this.api.getStats();

    statsPromise.then((pStatsData) => {
      this._handleStats(pStatsData);
      return true;
    }, (pStatsMsg) => {
      this._handleStats(JSON.stringify(pStatsMsg));
      return false;
    });
  }

  onHide () {
    if (this.updateStatsTimer) {
      // stop the timer when noone is looking
      window.clearInterval(this.updateStatsTimer);
      this.updateStatsTimer = null;
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
      window.clearInterval(this.updateStatsTimer);
      this.updateStatsTimer = null;
      return;
    }

    this.setMsg(null);

    for (const topKey in pStatsData) {

      // this section should not contain threads
      if (topKey === "CherryPy Applications") {
        continue;
      }

      // loop over all threads
      const workerThreads = pStatsData[topKey]["Worker Threads"];
      if (!workerThreads) {
        continue;
      }

      let first = true;
      /* eslint-disable no-labels */
      nextThread: for (const threadName of Object.keys(workerThreads).sort((aa, bb) => aa.localeCompare(bb, "en", {"numeric": true}))) {
        if (first) {
          // always show the first item
          // so that the structure is known even when all threads show zeroes
          first = false;
          continue;
        }
        const thread = workerThreads[threadName];
        // find threads with all-zero statistics
        for (const counterName in thread) {
          if (counterName === "Enabled") {
            // not a counter
            continue;
          }
          if (thread[counterName] !== 0) {
            continue nextThread;
          }
        }
        // thread has all-zero statistics, remove that part
        workerThreads[threadName] = Character.HORIZONTAL_ELLIPSIS;
      }
      /* eslint-enable no-labels */
    }

    const appData = pStatsData["CherryPy Applications"];
    if (appData) {
      // annotate 3 fields that have a huge integer value
      // this turns the fields into strings (was number)
      // we'll ignore that now

      appData["Current Time"] = StatsPanel._explainDateTime(appData["Current Time"]);

      appData["Start Time"] = StatsPanel._explainDateTime(appData["Start Time"]);

      appData["Uptime"] = StatsPanel._explainDateTime(appData["Uptime"]);

      const requests = appData["Requests"];
      for (const key in requests) {
        requests[key]["Start Time"] = StatsPanel._explainDateTime(requests[key]["Start Time"]);
        requests[key]["End Time"] = StatsPanel._explainDateTime(requests[key]["End Time"]);
      }

      const slowQueries = appData["Slow Queries"];
      for (const key in slowQueries) {
        slowQueries[key]["Start Time"] = StatsPanel._explainDateTime(slowQueries[key]["Start Time"]);
        slowQueries[key]["End Time"] = StatsPanel._explainDateTime(slowQueries[key]["End Time"]);
      }
    }

    this.statsTd.innerText = Output.formatObject(pStatsData);
  }
}
