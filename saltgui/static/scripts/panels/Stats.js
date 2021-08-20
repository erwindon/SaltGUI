/* global document */

import {Character} from "../Character.js";
import {Output} from "../output/Output.js";
import {Panel} from "./Panel.js";

export class StatsPanel extends Panel {

  constructor () {
    super("stats");

    this.addTitle("Stats");
    this.addTable(["/stats"]);
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
  _shortenedDate (dateInMs) {
    // get the regular data fomat
    const str = new Date(dateInMs * 1000) + "";
    // remove the named timezone part
    return str.replace(/ *[(].*[)]/, "");
  }

  _handleStats (pStatsData) {

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

      const ct = appData["Current Time"];
      appData["Current Time"] = ct + " (=" + this._shortenedDate(ct) + ")";

      const st = appData["Start Time"];
      appData["Start Time"] = st + " (=" + this._shortenedDate(ct) + ")";

      const ut = appData["Uptime"];
      // remove the date prefix and the millisecond suffix
      let ut2 = new Date(ut).toISOString().substr(11, 8);
      if (ut >= 86400) {
        // add the number of days (when there are any)
        ut2 = Math.floor(ut / 86400) + "d " + ut2;
      }
      appData["Uptime"] = ut + " (=" + ut2 + ")";
    }

    this.statsTd.innerText = Output.formatObject(pStatsData);
  }
}
