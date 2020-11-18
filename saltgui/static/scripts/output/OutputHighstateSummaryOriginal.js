import {Output} from "./Output.js";
import {Utils} from "../Utils.js";

export class OutputHighstateSummaryOriginal {

  static addSummarySpan (pDiv, pMinionId, pSucceeded, pFailed, pSkipped, pTotalMilliSeconds, pChanges) {

    let txt = "\nSummary for " + pMinionId;
    txt += "\n------------";
    const summarySpan = Utils.createSpan("", txt);
    summarySpan.style.color = "aqua";
    pDiv.append(summarySpan);

    txt = "\nSucceeded: " + pSucceeded;
    const succeededSpan = Utils.createSpan("", txt);
    succeededSpan.style.color = "lime";
    pDiv.append(succeededSpan);

    if (pChanges > 0) {
      txt = " (";
      const oSpan = Utils.createSpan("", txt);
      oSpan.style.color = "white";
      pDiv.append(oSpan);

      txt = "changed=" + pChanges;
      const changedSpan = Utils.createSpan("", txt);
      changedSpan.style.color = "lime";
      pDiv.append(changedSpan);

      txt = ")";
      const cSpan = Utils.createSpan("", txt);
      cSpan.style.color = "white";
      pDiv.append(cSpan);
    }

    txt = "\nFailed:    " + pFailed;
    const failedSpan = Utils.createSpan("", txt);
    if (pFailed > 0) {
      failedSpan.style.color = "red";
    } else {
      failedSpan.style.color = "aqua";
    }
    pDiv.append(failedSpan);

    txt = "\n------------";
    txt += "\nTotal states run: " + (pSucceeded + pSkipped + pFailed);
    txt += "\nTotal run time: " + Output.getDuration(pTotalMilliSeconds);
    const totalsSpan = Utils.createSpan("", txt);
    totalsSpan.style.color = "aqua";
    pDiv.append(totalsSpan);
  }
}
