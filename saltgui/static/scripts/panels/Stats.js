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

    this.statsTd.innerText = Output.formatObject(pStatsData);
  }
}
