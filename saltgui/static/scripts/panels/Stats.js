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
    const statsPromise = this.api.getStats();

    statsPromise.then((pStatsData) => {
      this._handleStats(pStatsData);
      return true;
    }, (pStatsMsg) => {
      this._handleStats(JSON.stringify(pStatsMsg));
      return false;
    });
  }

  _handleStats (pStatsData) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");

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
      nextThread: for (const threadName of Object.keys(workerThreads).sort()) {
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

    td.innerText = Output.formatObject(pStatsData);
    tr.appendChild(td);
    this.table.tBodies[0].appendChild(tr);
  }
}
