import {Output} from "./Output.js";
import {Utils} from "../Utils.js";

export class OutputHighstateSummarySaltGui {

  static addPercentage (pCount, pTotal) {
    const stateOutputPct = Utils.getStorageItemBoolean("session", "state_output_pct");

    if (!stateOutputPct) {
      return pCount;
    }

    return pCount + " (" + (100 * pCount / pTotal).toLocaleString(undefined, {"maximumFractionDigits": 1, "minimumFractionDigits": 1}) + "%)";
  }

  static addSummarySpan (pDiv, pSucceeded, pFailed, pSkipped, pTotalMilliSeconds, pChangesDetail, pHidden) {

    // add a summary line
    let line = "";

    const total = pSucceeded + pSkipped + pFailed;

    if (pSucceeded) {
      line += ", " + OutputHighstateSummarySaltGui.addPercentage(pSucceeded, total) + " succeeded";
    }
    if (pSkipped) {
      line += ", " + OutputHighstateSummarySaltGui.addPercentage(pSkipped, total) + " skipped";
    }
    if (pFailed) {
      line += ", " + OutputHighstateSummarySaltGui.addPercentage(pFailed, total) + " failed";
    }
    if (pHidden) {
      line += ", " + OutputHighstateSummarySaltGui.addPercentage(pHidden, total) + " hidden";
    }
    if (total !== pSucceeded && total !== pSkipped && total !== pFailed) {
      // not a trivial total
      line += ", " + total + " total";
    }

    // note that the number of changes may be higher or lower
    // than the number of tasks. tasks may contribute multiple
    // changes, or tasks may have no changes.
    line += Utils.txtZeroOneMany(pChangesDetail, "", ", {0} change", ", {0} changes");

    // multiple durations and significant?
    if (total > 1 && pTotalMilliSeconds >= 10) {
      line += ", " + Output.getDuration(pTotalMilliSeconds);
    }

    if (line) {
      const txtDiv = Utils.createDiv("", line.substring(2));
      pDiv.append(txtDiv);
    }
  }
}
