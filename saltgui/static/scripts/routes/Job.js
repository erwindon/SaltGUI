/* global document window */

import {DropDownMenu} from "../DropDown.js";
import {JobPanel} from "../panels/Job.js";
import {PageRoute} from "./Page.js";
import {Utils} from "../Utils.js";

export class JobRoute extends PageRoute {

  constructor (pRouter) {
    super("job", "Job", "page-job", "button-jobs", pRouter);

    this.job = new JobPanel();
    super.addPanel(this.job);
  }

  onShow () {
    this.job.onShow();
  }

  handleRunnerJobsActive (pJobId, pData) {
    const summaryJobsActiveSpan = document.getElementById("summary-jobs-active");
    if (!summaryJobsActiveSpan) {
      return;
    }

    if (typeof pData !== "object") {
      summaryJobsActiveSpan.innerText = "(error)";
      Utils.addToolTip(summaryJobsActiveSpan, pData, "bottom-left");
      return;
    }

    const info = pData.return[0][pJobId];

    // when the job is already completely done, nothing is returned
    if (!info) {
      summaryJobsActiveSpan.innerText = "done";
      if (this.terminateJobMenuItem) {
        // nothing left to terminate
        this.terminateJobMenuItem.style.display = "none";
      }
      if (this.killJobMenuItem) {
        // nothing left to kill
        this.killJobMenuItem.style.display = "none";
      }
      if (this.signalJobMenuItem) {
        // nothing left to signal
        this.signalJobMenuItem.style.display = "none";
      }
      return;
    }

    summaryJobsActiveSpan.innerText = info.Running.length + " active";
    summaryJobsActiveSpan.insertBefore(Utils.createJobStatusSpan(pJobId), summaryJobsActiveSpan.firstChild);
    summaryJobsActiveSpan.addEventListener("click", () => {
      window.location.reload();
    });
    summaryJobsActiveSpan.style.cursor = "pointer";
    Utils.addToolTip(summaryJobsActiveSpan, "Click to refresh", "bottom-left");

    // update the minion details
    for (const minionInfo of info.Running) {
      // each minionInfo is like {'minion': pid}
      for (const minionId in minionInfo) {
        const pid = minionInfo[minionId];
        const noResponseSpan = this.div.querySelector("div#" + Utils.getIdFromMinionId(minionId) + " span.noresponse");
        if (!noResponseSpan) {
          continue;
        }

        // show that this minion is still active on the request
        noResponseSpan.innerText = "(active) ";

        const menu = new DropDownMenu(noResponseSpan);
        menu.addMenuItem("Show&nbsp;process&nbsp;info...", (pClickEvent) => {
          this.runFullCommand(pClickEvent, "list", minionId, "ps.proc_info " + pid);
        });
        menu.addMenuItem("Terminate&nbsp;process...", (pClickEvent) => {
          this.runFullCommand(pClickEvent, "list", minionId, "ps.kill_pid " + pid + " signal=15");
        });
        menu.addMenuItem("Kill&nbsp;process...", (pClickEvent) => {
          this.runFullCommand(pClickEvent, "list", minionId, "ps.kill_pid " + pid + " signal=9");
        });
        menu.addMenuItem("Signal&nbsp;process...", (pClickEvent) => {
          this.runFullCommand(pClickEvent, "list", minionId, "ps.kill_pid " + pid + " signal=<signalnumber>");
        });

        noResponseSpan.classList.remove("noresponse");
        noResponseSpan.classList.add("active");
      }
    }
  }

  handleSaltJobRetEvent (pData) {
    this.job.handleSaltJobRetEvent(pData);
  }
}
