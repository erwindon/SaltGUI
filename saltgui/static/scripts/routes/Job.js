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

    // ignore the most common events until someone complains
    if (pData.fun === "saltutil.find_job") {
      return;
    }
    if (pData.fun === "saltutil.running") {
      return;
    }

    // { fun_args: […], jid: "20190704194624366796", return: true, retcode: 0, success: true, cmd: "_return", fun: "test.rand_sleep", id: "autobuild-it-4092", _stamp: "2019-07-04T17:46:28.448689" }
    const jid = pData.jid;
    if (!jid) {
      return;
    }

    let newLevel = -1;
    if (pData.success === true && pData.retcode === 0) {
      newLevel = 0;
    } else if (pData.success === true) {
      newLevel = 1;
    } else {
      newLevel = 2;
    }

    // This element only exists when the user happens to look at the output of that jobId.
    const span = document.getElementById("status" + jid);
    if (span) {
      let oldLevel = span.dataset.level;
      if (oldLevel === undefined) {
        oldLevel = -1;
      }
      if (newLevel > oldLevel) {
        span.dataset.level = newLevel;
        if (newLevel === 0) {
          span.style.color = "green";
        } else if (newLevel === 1) {
          // orange instead of yellow due to readability on white background
          span.style.color = "orange";
        } else if (newLevel === 2) {
          span.style.color = "red";
        }
      }
      span.style.removeProperty("display");
    }
  }
}
