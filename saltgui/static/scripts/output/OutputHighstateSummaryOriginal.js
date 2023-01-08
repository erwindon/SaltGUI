import {Output} from "./Output.js";
import {Utils} from "../Utils.js";

export class OutputHighstateSummaryOriginal {

  static addPercentage (pCount, pTotal) {
    return (100 * pCount / pTotal).toLocaleString(undefined, {"maximumFractionDigits": 1, "minimumFractionDigits": 1}) + "%";
  }

  static addSummarySpan (pDiv, pMinionId, pSucceeded, pFailed, pSkipped, pTotalMilliSeconds, pChangesSummary) {

    let txt = "\nSummary for " + pMinionId;
    txt += "\n------------";
    const summarySpan = Utils.createSpan("", txt);
    summarySpan.style.color = "aqua";
    pDiv.append(summarySpan);

    const total = pSucceeded + pSkipped + pFailed;

    txt = "\nSucceeded: " + pSucceeded;
    const succeededSpan = Utils.createSpan("task-success", txt);
    pDiv.append(succeededSpan);

    if (pChangesSummary > 0) {
      txt = " (";
      const oSpan = Utils.createSpan("", txt);
      oSpan.style.color = "white";
      pDiv.append(oSpan);

      txt = "changed=" + pChangesSummary;
      const changedSpan = Utils.createSpan("task-changes", txt);
      pDiv.append(changedSpan);

      txt = ")";
      const cSpan = Utils.createSpan("", txt);
      cSpan.style.color = "white";
      pDiv.append(cSpan);
    }

    txt = "\nFailed:    " + pFailed;
    const failedSpan = Utils.createSpan("", txt);
    if (pFailed > 0) {
      failedSpan.classList.add("task-failure");
    } else {
      failedSpan.style.color = "aqua";
    }
    pDiv.append(failedSpan);

    const stateOutputPct = Utils.getStorageItemBoolean("session", "state_output_pct");
    if (stateOutputPct) {
      txt = "\nSuccess %: " + OutputHighstateSummaryOriginal.addPercentage(pSucceeded, total);
      const successSpan = Utils.createSpan("task-success", txt);
      pDiv.append(successSpan);

      txt = "\nFailure %: " + OutputHighstateSummaryOriginal.addPercentage(pFailed, total);
      const failureSpan = Utils.createSpan("", txt);
      if (pFailed > 0) {
        failureSpan.classList.add("task-failure");
      } else {
        failureSpan.style.color = "aqua";
      }
      pDiv.append(failureSpan);
    }

    txt = "\n------------";
    txt += "\nTotal states run: " + total;
    txt += "\nTotal run time: " + Output.getDuration(pTotalMilliSeconds);
    const totalsSpan = Utils.createSpan("", txt);
    totalsSpan.style.color = "aqua";
    pDiv.append(totalsSpan);
    pDiv.style.cursor = "pointer";
  }
}
