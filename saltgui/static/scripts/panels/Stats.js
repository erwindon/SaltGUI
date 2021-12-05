/* global document */

import {Character} from "../Character.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";

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
      const tr = document.createElement("tr");
      this.table.tBodies[0].appendChild(tr);
      const td = document.createElement("td");
      tr.appendChild(td);
      this.statsTd = td;
    }

    this.onShowNow();

    this.updateStatsTimer = setInterval(() => {
      this.onShowNow();
    }, 3000);
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
      clearInterval(this.updateStatsTimer);
      this.updateStatsTimer = null;
    }
  }

  // provide a shortened date format for cases
  // where we see the timezone multiple times on one screen
  static _shortenedDate (dateInMs) {
    if (dateInMs === null) {
      return dateInMs;
    }
    // get the regular data fomat
    let str = String(new Date(dateInMs * 1000));
    // remove the named timezone part
    str = str.replace(/ *[(].*[)]/, "");
    return dateInMs + " (=" + str + ")";
  }

  static _shortenedInterval (intervalInMs) {
    let str = new Date(intervalInMs * 1000).toISOString();
    // remove the date prefix and the millisecond suffix
    str = str.substr(11, 8);
    // add the number of days (when there are any)
    if (intervalInMs >= 86400) {
      str = Math.floor(intervalInMs / 86400) + "d " + str;
    }
    return intervalInMs + " (=" + str + ")";
  }

  _handleStats (pStatsData) {
    if (this.showErrorRowInstead(pStatsData)) {
      this.statsTd.innerText = "(error)";
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

      appData["Current Time"] = StatsPanel._shortenedDate(appData["Current Time"]);

      appData["Start Time"] = StatsPanel._shortenedDate(appData["Start Time"]);

      appData["Uptime"] = StatsPanel._shortenedInterval(appData["Uptime"]);

      const requests = appData["Requests"];
      for (const key in requests) {
        requests[key]["Start Time"] = StatsPanel._shortenedDate(requests[key]["Start Time"]);
        requests[key]["End Time"] = StatsPanel._shortenedDate(requests[key]["End Time"]);
      }

      const slowQueries = appData["Slow Queries"];
      for (const key in slowQueries) {
        slowQueries[key]["Start Time"] = StatsPanel._shortenedDate(slowQueries[key]["Start Time"]);
        slowQueries[key]["End Time"] = StatsPanel._shortenedDate(slowQueries[key]["End Time"]);
      }
    }

    this.statsTd.innerText = Output.formatObject(pStatsData);
  }
}
