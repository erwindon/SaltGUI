/* global document window */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {JobPanel} from "./Job.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

// for now these are static
// changing these will affect the server load while loading this page
// in any case, the details are only loaded for visible jobs
// max number of background jobs to get job details
// set to 0 to disable the automatic loading of job details
const MAX_CNT_LOADING = 3;
// start 1 background job every interval until MAX is reached
// new jobs can be started when older ones are done
const LOADING_INTERVAL_IN_MS = 1000;

// how many jobs to load in the basic view
const MAX_JOBS_DETAILS = 50;

export class JobsDetailsPanel extends JobsPanel {

  constructor () {
    super("jobs");

    this.addTitle("Recent Jobs");
    this.addSettingsMenu();
    this._addSettingsMenuItemShowSome();
    this._addSettingsMenuItemShowEligible();
    this._addSettingsMenuItemShowAll();
    this.addSearchButton();
    this.addPlayPauseButton();
    this.addHelpButton([
      "Entries for jobs that are primarily used by SaltGUI are normally hidden.",
      "It is possible to define exceptions on that, and also to define additions to that.",
      "See README.md for more details."
    ]);
    this.addTable(["-menu-", "JID", "Target", "Function", "Start Time", "Status", "Details"], "data-list-jobs");
    this.setTableSortable("JID", "desc");
    this.setTableClickable("page");
    this.addMsg();
  }

  onShow () {
    const patInteger = /^(?:(?:0)|(?:[-+]?[1-9][0-9]*))$/; // NOSONAR S6353

    let cnt = decodeURIComponent(Utils.getQueryParam("cnt", String(MAX_JOBS_DETAILS)));
    if (cnt === "eligible") {
      cnt = 10000;
    } else if (cnt === "all") {
      // magic value to ignore all filters
      cnt = 99999;
    } else if (patInteger.test(cnt)) {
      cnt = Number.parseInt(cnt, 10);
    } else {
      // pretend parameter was not present
      cnt = MAX_JOBS_DETAILS;
    }
    this.settingsMenu._value = cnt;

    super.onShow(cnt);
  }

  onHide () {
    super.onHide();

    if (this.updateNextJobInterval) {
      // stop the timer when nobody is looking
      window.clearInterval(this.updateNextJobInterval);
      this.updateNextJobInterval = null;
    }
  }

  jobsListIsReady () {
    this.nrErrors = 0;

    if (MAX_CNT_LOADING <= 0) {
      return;
    }

    // to update details
    // interval should be larger than the retrieval time
    // to prevent many of such jobs to appear
    this.updateNextJobInterval = window.setInterval(() => {
      this._updateNextJob();
    }, LOADING_INTERVAL_IN_MS);
  }

  _addSettingsMenuItemShowSome () {
    this.settingsMenu.addMenuItem(() => {
      let title = "Show first " + MAX_JOBS_DETAILS + " jobs";
      const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
      if (cnt === "undefined" || cnt === String(MAX_JOBS_DETAILS)) {
        title = Character.BLACK_CIRCLE + " " + title;
      }
      return title;
    }, () => {
      this.router.goTo("jobs", {"cnt": MAX_JOBS_DETAILS});
    });
  }

  _addSettingsMenuItemShowEligible () {
    this.settingsMenu.addMenuItem(() => {
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

  _addSettingsMenuItemShowAll () {
    this.settingsMenu.addMenuItem(() => {
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
    // but when we find MAX_CNT_LOADING "loading..." items, the system is
    // probably overloaded and we skip a cycle
    const result = this._findAndProcessNextJob(tbody);

    if (!result.workLeft) {
      this.setPlayPauseButton("none");
      this.updateFooter();
      window.clearInterval(this.updateNextJobInterval);
    }
  }

  _findAndProcessNextJob (pTbody) {
    let cntLoading = 0;
    let workLeft = false;

    for (const tr of pTbody.rows) {
      const detailsField = tr.querySelector("td.details span");
      if (!detailsField) {
        continue;
      }

      const skipResult = JobsDetailsPanel._checkIfShouldSkip(tr, cntLoading);
      if (skipResult.shouldReturn) {
        return {workLeft: false};
      }
      if (skipResult.shouldContinue) {
        if (skipResult.isLoading) {
          cntLoading += 1;
        } else if (skipResult.isOutOfViewPort) {
          workLeft = true;
        }
        continue;
      }

      this._processJobRow(tr, detailsField);
      // only update one item at a time
      return {workLeft: true};
    }

    return {workLeft};
  }

  static _checkIfShouldSkip (pTr, pCntLoading) {
    if (pTr.dataset.isLoading === "true") {
      const isOverloaded = pCntLoading >= MAX_CNT_LOADING;
      return {
        isLoading: true,
        isOutOfViewPort: false,
        shouldContinue: true,
        shouldReturn: isOverloaded
      };
    }

    if (pTr.dataset.detailsUnknown === undefined) {
      return {
        isLoading: false,
        isOutOfViewPort: false,
        shouldContinue: true,
        shouldReturn: false
      };
    }

    const isOutOfViewPort = !JobsDetailsPanel._isInsideViewPort(pTr);
    return {
      isLoading: false,
      isOutOfViewPort,
      shouldContinue: isOutOfViewPort,
      shouldReturn: false
    };
  }

  _processJobRow (pTr, pDetailsField) {
    pDetailsField.classList.add("no-job-details");
    pDetailsField.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
    pTr.dataset.isLoading = "true";
    const jobId = pTr.dataset.jobid;

    if (this.nrErrors >= 3) {
      // don't bother getting more data
      // may show more then 3 errors when some are still in-flight
      this._handleJobsRunnerJobsListJob(jobId, "skipped");
      return;
    }

    this._getJobDetails(jobId);
  }

  _getJobDetails (pJobId) {
    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(pJobId);

    runnerJobsListJobPromise.then((ok_RunnerJobsListJob) => {
      this._handleJobsRunnerJobsListJob(pJobId, ok_RunnerJobsListJob);
      return true;
    }, (_error_RunnerJobsListJob) => {
      this.nrErrors += 1;
      this._handleJobsRunnerJobsListJob(pJobId, JSON.stringify(_error_RunnerJobsListJob));
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

    if (!JobsDetailsPanel._handleJobsDataValidation(pData, detailsSpan)) {
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

    let detailsHTML = JobsDetailsPanel._buildDetailsHtmlHeader(pData);
    const summary = JobsDetailsPanel._buildResultSummary(pData);
    detailsHTML += JobsDetailsPanel._buildDetailsHtmlSummary(summary);

    const keyCount = Object.keys(pData.Result).length;
    const refreshVisible = JobsDetailsPanel._shouldShowRefreshButton(pData, keyCount, jobTr);
    JobsDetailsPanel._populateDetailsSpan(detailsSpan, pJobId, detailsHTML, refreshVisible);
  }

  static _handleJobsDataValidation (pData, detailsSpan) {
    if (typeof pData !== "object") {
      if (pData === "skipped") {
        detailsSpan.innerText = "(skipped)";
        Utils.addToolTip(detailsSpan, "skipped due to too many previous errors");
      } else {
        detailsSpan.innerText = "(error)";
        Utils.addToolTip(detailsSpan, pData);
      }
      detailsSpan.classList.remove("no-job-details");
      return false;
    }
    return true;
  }

  static _buildDetailsHtmlHeader (pData) {
    const keyCount = Object.keys(pData.Result).length;
    let detailsHTML = Utils.txtZeroOneMany(pData.Minions.length,
      "no minions", "{0} minion", "{0} minions");

    detailsHTML += ", ";
    if (pData.Minions.length === 0) {
      detailsHTML += "<span>";
    } else if (keyCount === pData.Minions.length) {
      detailsHTML += "<span style='color: green'>";
    } else {
      detailsHTML += "<span style='color: red'>";
    }
    detailsHTML += Utils.txtZeroOneMany(keyCount,
      "no results", "{0} result", "{0} results");
    detailsHTML += "</span>";

    if (keyCount < pData.Minions.length) {
      detailsHTML += ", <span style='color: red'>";
      detailsHTML += pData.Minions.length - keyCount;
      detailsHTML += " missing</span>";
    }

    return detailsHTML;
  }

  static _buildResultSummary (pData) {
    const summary = {};
    for (const minionId in pData.Result) {
      const result = pData.Result[minionId];
      // use keys that can conveniently be sorted
      let key = (result.success ? "0-" : "1-") + result.retcode;
      if (key === "1-undefined") {
        // that information was not presnet
        key = "2-unknown";
      }
      if (summary[key] === undefined) {
        summary[key] = 0;
      }
      summary[key] += 1;
    }
    return summary;
  }

  static _buildDetailsHtmlSummary (summary) {
    let detailsHTML = "";
    const keys = Object.keys(summary).sort(Utils.mySortFunction);
    for (const key of keys) {
      detailsHTML += JobsDetailsPanel._buildSummaryItem(key, summary[key]);
    }
    return detailsHTML;
  }

  static _buildSummaryItem (key, count) {
    let html = ", ";
    if (key === "0-0") {
      html += "<span style='color: green'>";
      html += Utils.txtZeroOneMany(count, "", "{0} success", "{0} successes");
    } else if (key.startsWith("0-")) {
      html += "<span style='color: orange'>";
      html += Utils.txtZeroOneMany(count, "", "{0} success", "{0} successes");
    } else if (key.startsWith("1-")) {
      html += "<span style='color: red'>";
      html += Utils.txtZeroOneMany(count, "", "{0} failure", "{0} failures");
    } else {
      // if (key.startsWith("2-"))
      html += "<span>";
      html += Utils.txtZeroOneMany(count, "", "{0} unknown result", "{0} unknown results");
    }
    if (key !== "0-0" && key !== "1-1" && key !== "2-unknown") {
      // don't show the retcode for expected combinations
      html += "(" + key.substring(2) + ")";
    }
    html += "</span>";
    return html;
  }

  static _shouldShowRefreshButton (pData, keyCount, jobTr) {
    if (keyCount === pData.Minions.length) {
      // we have results for each minion
      return false;
    }
    const statusSpan = jobTr.querySelector("td span.job-status");
    if (statusSpan?.innerText === "done") {
      // the system said that the job was done
      // but still maybe some results are missing
      // but these are not underway
      return false;
    }
    return true;
  }

  static _populateDetailsSpan (detailsSpan, pJobId, detailsHTML, refreshVisible) {
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
    const tr = Utils.createTr();
    tr.id = Utils.getIdFromJobId(job.id);
    tr.dataset.jobid = job.id;

    const menu = new DropDownMenu(tr, "smaller");

    tr.appendChild(Utils.createTd("", job.id));

    let targetText = TargetType.makeTargetText(job);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
    }
    tr.appendChild(Utils.createTd("target", targetText));

    const argumentsText = JobPanel.decodeArgumentsArray(job.Arguments);
    let functionText = job.Function + argumentsText;
    if (functionText.length > maxTextLength) {
      // prevent column becoming too wide
      functionText = functionText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
    }
    tr.appendChild(Utils.createTd("function", functionText));

    const startTimeTd = Utils.createTd();
    const startTimeSpan = Utils.createSpan("starttime");
    Output.dateTimeStr(job.StartTime, startTimeSpan);
    startTimeTd.appendChild(startTimeSpan);
    tr.appendChild(startTimeTd);

    this._addJobsMenuItemShowDetails(menu, job);
    this._addMenuItemJobsRerunJob(menu, job, argumentsText);

    const statusTd = Utils.createTd();
    const statusSpan = Utils.createSpan(["job-status", "no-job-status"], "loading" + Character.HORIZONTAL_ELLIPSIS);
    statusSpan.addEventListener("click", (pClickEvent) => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
      this.startRunningJobs();
      pClickEvent.stopPropagation();
    });
    statusTd.appendChild(statusSpan);
    tr.appendChild(statusTd);

    this._addJobsMenuItemUpdateStatus(menu, statusSpan);

    tr.dataset.detailsUnknown = "true";
    const detailsTd = Utils.createTd("details");
    const detailsSpan = Utils.createSpan(["details2", "no-job-details"], "(click)");
    detailsSpan.addEventListener("click", (pClickEvent) => {
      detailsSpan.classList.add("no-job-details");
      detailsSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
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
      this.router.goTo("job", {"id": job.id}, undefined, pClickEvent);
      pClickEvent.stopPropagation();
    });
  }

  _addJobsMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show details", (pClickEvent) => {
      this.router.goTo("job", {"id": job.id}, undefined, pClickEvent);
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
      pStatusSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
      this.startRunningJobs();
    });
  }

  _addMenuItemUpdateDetails (pMenu, pDetailsSpan, job) {
    pMenu.addMenuItem("Update details", () => {
      pDetailsSpan.classList.add("no-job-details");
      pDetailsSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
      this._getJobDetails(job.id);
    });
  }
}
