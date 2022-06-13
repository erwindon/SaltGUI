/* global document window */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {JobPanel} from "./Job.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

export class JobsDetailsPanel extends JobsPanel {

  constructor () {
    super("jobs");

    this.addTitle("Recent Jobs");
    this.addPanelMenu();
    this._addPanelMenuItemShowSome();
    this._addPanelMenuItemShowEligible();
    this._addPanelMenuItemShowAll();
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "Entries for jobs that are primarily used by SaltGUI are normally hidden.",
      "It is possible to define exceptions on that, and also to define additions to that.",
      "See README.md for more details."
    ]);
    this.addTable(["JID", "Target", "Function", "Start Time", "-menu-", "Status", "Details"], "data-list-jobs");
    this.setTableSortable("JID", "desc");
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const patInteger = /^(?:(?:0)|(?:[-+]?[1-9][0-9]*))$/;

    const maxJobs = 50;
    let cnt = decodeURIComponent(Utils.getQueryParam("cnt", String(maxJobs)));
    if (cnt === "eligible") {
      cnt = 10000;
    } else if (cnt === "all") {
      // magic value to ignore all filters
      cnt = 99999;
    } else if (cnt.match(patInteger)) {
      cnt = parseInt(cnt, 10);
    } else {
      // pretend parameter was not present
      cnt = maxJobs;
    }
    this.panelMenu._value = cnt;

    super.onShow(cnt);
  }

  jobsListIsReady () {
    this.nrErrors = 0;

    // to update details
    // interval should be larger than the retrieval time
    // to prevent many of such jobs to appear
    this.updateNextJobInterval = window.setInterval(() => {
      this._updateNextJob();
    }, 1000);
  }

  _addPanelMenuItemShowSome () {
    const maxJobs = 50;
    this.panelMenu.addMenuItem(() => {
      let title = "Show first " + maxJobs + " jobs";
      const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
      if (cnt === "undefined" || cnt === String(maxJobs)) {
        title = Character.BLACK_CIRCLE + " " + title;
      }
      return title;
    }, () => {
      this.router.goTo("jobs", {"cnt": maxJobs});
    });
  }

  _addPanelMenuItemShowEligible () {
    this.panelMenu.addMenuItem(() => {
      const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
      let title = "Show eligible jobs";
      if (cnt === "eligible") {
        title = Character.BLACK_CIRCLE + " " + title;
      }
      return title;
    }, () => {
      this.router.goTo("jobs", {"cnt": "eligible"});
    });
  }

  _addPanelMenuItemShowAll () {
    this.panelMenu.addMenuItem(() => {
      const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
      let title = "Show all jobs";
      if (cnt === "all") {
        title = Character.BLACK_CIRCLE + " " + title;
      }
      return title;
    }, () => {
      this.router.goTo("jobs", {"cnt": "all"});
    });
  }

  static _isInsideViewPort (pElement) {
    const rect = pElement.getBoundingClientRect();
    if (rect.bottom < 0) {
      return false;
    }
    if (rect.right < 0) {
      return false;
    }
    if (rect.top >= (window.innerHeight || document.documentElement.clientHeight)) {
      return false;
    }
    if (rect.left >= (window.innerWidth || document.documentElement.clientWidth)) {
      return false;
    }
    return true;
  }

  _updateNextJob () {

    // user can decide
    // system can decide to remove the play/pause button
    if (this.playOrPause !== "play") {
      return;
    }

    const tbody = this.table.tBodies[0];
    // find an item still marked as "(click)"
    // but when we find 3 "loading..." items, the system is
    // probably overloaded and we skip a cycle
    let cntLoading = 0;
    let workLeft = false;
    for (const tr of tbody.rows) {
      const detailsField = tr.querySelector("td.details span");
      if (!detailsField) {
        continue;
      }
      if (tr.dataset.isLoading === "true") {
        cntLoading += 1;
        if (cntLoading >= 3) {
          // too many already running
          return;
        }
        continue;
      }
      if (tr.dataset.detailsUnknown === undefined) {
        continue;
      }
      if (!JobsDetailsPanel._isInsideViewPort(tr)) {
        workLeft = true;
        continue;
      }
      detailsField.classList.add("no-job-details");
      detailsField.innerText = "loading...";
      tr.dataset.isLoading = "true";
      const jobId = tr.dataset.jobid;

      if (this.nrErrors >= 3) {
        // don't bother getting more data
        // may show more then 3 errors when some are stil in-flight
        this._handleJobsRunnerJobsListJob(jobId, "skipped");
        continue;
      }

      this._getJobDetails(jobId);
      // only update one item at a time
      return;
    }
    if (!workLeft) {
      this.setPlayPauseButton("none");
      this.updateFooter();
      window.clearInterval(this.updateNextJobInterval);
    }
  }

  _getJobDetails (pJobId) {
    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(pJobId);

    runnerJobsListJobPromise.then((pRunnerJobsListJobData) => {
      this._handleJobsRunnerJobsListJob(pJobId, pRunnerJobsListJobData);
      return true;
    }, (pRunnerJobsListJobMsg) => {
      this.nrErrors += 1;
      this._handleJobsRunnerJobsListJob(pJobId, JSON.stringify(pRunnerJobsListJobMsg));
      return false;
    });
  }

  _handleJobsRunnerJobsListJob (pJobId, pData) {

    const jobTr = this.table.querySelector("#" + Utils.getIdFromJobId(pJobId));
    if (!jobTr) {
      return;
    }
    // don't process this one again
    delete jobTr.dataset.detailsUnknown;
    delete jobTr.dataset.isLoading;

    const detailsSpan = jobTr.querySelector("td.details span");
    if (!detailsSpan) {
      return;
    }

    if (typeof pData !== "object") {
      if (pData === "skipped") {
        detailsSpan.innerText = "(skipped)";
        Utils.addToolTip(detailsSpan, "skipped due to too many previous errors");
      } else {
        detailsSpan.innerText = "(error)";
        Utils.addToolTip(detailsSpan, pData);
      }
      detailsSpan.classList.remove("no-job-details");
      return;
    }

    pData = pData.return[0];

    if (typeof pData !== "object") {
      Utils.addErrorToTableCell(detailsSpan.parentElement, pData);
      return;
    }
    if (pData.Error) {
      // typically happens for jobs that are expired from jobs-cache
      Utils.addErrorToTableCell(detailsSpan.parentElement, pData.Error);
      return;
    }

    if (!pData.Minions) {
      // We've seen cases where this part is missing
      pData.Minions = [];
    }

    let detailsHTML = Utils.txtZeroOneMany(pData.Minions.length,
      "no minions", "{0} minion", "{0} minions");

    const keyCount = Object.keys(pData.Result).length;
    detailsHTML += ", ";
    if (keyCount === pData.Minions.length) {
      detailsHTML += "<span style='color: green'>";
    } else {
      detailsHTML += "<span style='color: red'>";
    }
    detailsHTML += Utils.txtZeroOneMany(keyCount,
      "no results", "{0} result", "{0} results");
    detailsHTML += "</span>";

    const summary = {};
    for (const minionId in pData.Result) {
      const result = pData.Result[minionId];
      // use keys that can conveniently be sorted
      const key = (result.success ? "0-" : "1-") + result.retcode;
      if (summary[key] === undefined) {
        summary[key] = 0;
      }
      summary[key] += 1;
    }

    const keys = Object.keys(summary).sort();
    for (const key of keys) {
      detailsHTML += ", ";
      if (key === "0-0") {
        detailsHTML += "<span style='color: green'>";
        detailsHTML += Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes");
      } else if (key.startsWith("0-")) {
        detailsHTML += "<span style='color: orange'>";
        detailsHTML += Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes");
      } else {
        // if (key.startsWith("1-"))
        detailsHTML += "<span style='color: red'>";
        detailsHTML += Utils.txtZeroOneMany(summary[key], "", "{0} failure", "{0} failures");
      }
      if (key !== "0-0" && key !== "1-1") {
        // don't show the retcode for expected combinations
        detailsHTML += "(" + key.substring(2) + ")";
      }
      detailsHTML += "</span>";
    }

    let refreshVisible = true;
    if (keyCount === pData.Minions.length) {
      // we have results for each minion
      refreshVisible = false;
    }
    const statusSpan = jobTr.querySelector("td span.job-status");
    if (statusSpan && statusSpan.innerText === "done") {
      // the system said that the job was done
      // but still maybe some results are missing
      // but these are not underway
      refreshVisible = false;
    }
    const span = Utils.createJobStatusSpan(pJobId, refreshVisible);
    detailsSpan.innerText = "";
    detailsSpan.appendChild(span);
    const details2Span = Utils.createSpan();
    details2Span.innerHTML = detailsHTML;
    detailsSpan.appendChild(details2Span);
    detailsSpan.classList.remove("no-job-details");
    Utils.addToolTip(detailsSpan, "Click to refresh");
  }

  addJob (job) {
    const tr = document.createElement("tr");
    tr.id = Utils.getIdFromJobId(job.id);
    tr.dataset.jobid = job.id;
    tr.appendChild(Utils.createTd("", job.id));

    let targetText = TargetType.makeTargetText(job);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Utils.createTd("target", targetText));

    const argumentsText = JobPanel.decodeArgumentsArray(job.Arguments);
    let functionText = job.Function + argumentsText;
    if (functionText.length > maxTextLength) {
      // prevent column becoming too wide
      functionText = functionText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Utils.createTd("function", functionText));

    const startTimeTd = Utils.createTd();
    const startTimeSpan = Utils.createSpan("starttime");
    Output.dateTimeStr(job.StartTime, startTimeSpan);
    startTimeTd.appendChild(startTimeSpan);
    tr.appendChild(startTimeTd);

    const menu = new DropDownMenu(tr, true);
    this._addJobsMenuItemShowDetails(menu, job);
    this._addMenuItemJobsRerunJob(menu, job, argumentsText);

    const statusTd = Utils.createTd();
    const statusSpan = Utils.createSpan("job-status", "loading...");
    statusSpan.classList.add("no-job-status");
    statusSpan.addEventListener("click", (pClickEvent) => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading...";
      this.startRunningJobs();
      pClickEvent.stopPropagation();
    });
    statusTd.appendChild(statusSpan);
    tr.appendChild(statusTd);

    this._addJobsMenuItemUpdateStatus(menu, statusSpan);

    tr.dataset.detailsUnknown = "true";
    const detailsTd = Utils.createTd("details");
    const detailsSpan = Utils.createSpan("details2", "(click)");
    detailsSpan.classList.add("no-job-details");
    detailsSpan.addEventListener("click", (pClickEvent) => {
      detailsSpan.classList.add("no-job-details");
      detailsSpan.innerText = "loading...";
      this._getJobDetails(job.id);
      pClickEvent.stopPropagation();
    });
    Utils.addToolTip(detailsSpan, "Click to refresh");
    detailsTd.appendChild(detailsSpan);
    tr.appendChild(detailsTd);

    this._addMenuItemUpdateDetails(menu, detailsSpan, job);

    // fill out the number of columns to that of the header
    while (tr.cells.length < this.table.tHead.rows[0].cells.length) {
      tr.appendChild(Utils.createTd());
    }

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.router.goTo("job", {"id": job.id});
      pClickEvent.stopPropagation();
    });
  }

  _addJobsMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show details", () => {
      this.router.goTo("job", {"id": job.id});
    });
  }

  _addMenuItemJobsRerunJob (pMenu, job, argumentsText) {
    pMenu.addMenuItem("Re-run job...", () => {
      const cmdStr = job.Function + argumentsText;
      this.runCommand(job["Target-type"], job.Target, cmdStr);
    });
  }

  _addJobsMenuItemUpdateStatus (pMenu, pStatusSpan) {
    pMenu.addMenuItem("Update status", () => {
      pStatusSpan.classList.add("no-job-status");
      pStatusSpan.innerText = "loading...";
      this.startRunningJobs();
    });
  }

  _addMenuItemUpdateDetails (pMenu, pDetailsSpan, job) {
    pMenu.addMenuItem("Update details", () => {
      pDetailsSpan.classList.add("no-job-details");
      pDetailsSpan.innerText = "loading...";
      this._getJobDetails(job.id);
    });
  }
}
