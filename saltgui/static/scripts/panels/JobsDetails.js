/* global config document window */

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
    this._addMenuItemShowSome();
    this._addMenuItemShowEligible();
    this._addMenuItemShowAll();
    this.addSearchButton();
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

    // to update details
    // interval should be larger than the retrieval time
    // to prevent many of such jobs to appear
    window.setInterval(() => {
      this._updateNextJob();
    }, 1000);
  }

  _addMenuItemShowSome () {
    const maxJobs = 50;
    let title = "Show first " + maxJobs + " jobs";
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if (cnt === "undefined" || cnt === String(maxJobs)) {
      // 25CF = BLACK CIRCLE
      title = "\u25CF " + title;
    }
    this.panelMenu.addMenuItem(title, () => {
      window.location.assign(config.NAV_URL + "/jobs?cnt=" + maxJobs);
    });
  }

  _addMenuItemShowEligible () {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    let title = "Show eligible jobs";
    if (cnt === "eligible") {
      // 25CF = BLACK CIRCLE
      title = "\u25CF " + title;
    }
    this.panelMenu.addMenuItem(title, () => {
      window.location.assign(config.NAV_URL + "/jobs?cnt=eligible");
    });
  }

  _addMenuItemShowAll () {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    let title = "Show all jobs";
    if (cnt === "all") {
      // 25CF = BLACK CIRCLE
      title = "\u25CF " + title;
    }
    this.panelMenu.addMenuItem(title, () => {
      window.location.assign(config.NAV_URL + "/jobs?cnt=all");
    });
  }

  _updateNextJob () {
    const tbody = this.table.tBodies[0];
    // find an item still marked as "(click)"
    for (const tr of tbody.rows) {
      const detailsField = tr.querySelector("td.details span");
      if (!detailsField || detailsField.innerText !== "(click)") {
        continue;
      }
      const jobId = tr.querySelector("td").innerText;
      detailsField.classList.add("no-job-details");
      detailsField.innerText = "loading...";
      this._getJobDetails(jobId);
      // only update one item at a time
      return;
    }
  }

  _getJobDetails (pJobId) {
    const runnerJobsListJobPromise = this.api.getRunnerJobsListJob(pJobId);

    runnerJobsListJobPromise.then((pRunnerJobsListJobData) => {
      this._handleJobsRunnerJobsListJob(pJobId, pRunnerJobsListJobData);
      return true;
    }, (pRunnerJobsListJobMsg) => {
      this._handleJobsRunnerJobsListJob(pJobId, JSON.stringify(pRunnerJobsListJobMsg));
      return false;
    });
  }

  _handleJobsRunnerJobsListJob (pJobId, pData) {

    const detailsSpan = this.table.querySelector("#" + Utils.getIdFromJobId(pJobId) + " td.details span");
    if (!detailsSpan) {
      return;
    }

    if (typeof pData !== "object") {
      detailsSpan.innerText = "(error)";
      detailsSpan.classList.remove("no-job-details");
      Utils.addToolTip(detailsSpan, pData);
      return;
    }

    pData = pData.return[0];

    if (pData.Error) {
      // typically happens for jobs that are expired from jobs-cache
      detailsSpan.innerText = "(error)";
      detailsSpan.classList.remove("no-job-details");
      Utils.addToolTip(detailsSpan, pData.Error);
      return;
    }

    let detailsTxt = Utils.txtZeroOneMany(pData.Minions.length,
      "no minions", "{0} minion", "{0} minions");

    const keyCount = Object.keys(pData.Result).length;
    detailsTxt += ", ";
    if (keyCount === pData.Minions.length) {
      detailsTxt += "<span style='color: green'>";
    } else {
      detailsTxt += "<span style='color: red'>";
    }
    detailsTxt += Utils.txtZeroOneMany(keyCount,
      "no results", "{0} result", "{0} results");
    detailsTxt += "</span>";

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
      detailsTxt += ", ";
      if (key === "0-0") {
        detailsTxt += "<span style='color: green'>";
        detailsTxt += Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes");
      } else if (key.startsWith("0-")) {
        detailsTxt += "<span style='color: orange'>";
        detailsTxt += Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes");
      } else {
        // if (key.startsWith("1-"))
        detailsTxt += "<span style='color: red'>";
        detailsTxt += Utils.txtZeroOneMany(summary[key], "", "{0} failure", "{0} failures");
      }
      if (key !== "0-0") {
        // don't show the retcode for real success
        detailsTxt += "(" + key.substr(2) + ")";
      }
      detailsTxt += "</span>";
    }

    detailsSpan.innerText = "";
    detailsSpan.appendChild(Utils.createJobStatusSpan(pJobId));
    const statusSpan = Utils.createSpan("", "");
    statusSpan.innerHTML = detailsTxt;
    detailsSpan.appendChild(statusSpan);
    detailsSpan.classList.remove("no-job-details");
    Utils.addToolTip(detailsSpan, "Click to refresh");
  }

  addJob (job) {
    const tr = document.createElement("tr");
    tr.id = Utils.getIdFromJobId(job.id);
    const jobIdText = job.id;
    tr.appendChild(Utils.createTd(Utils.getIdFromJobId(job.id), jobIdText));

    let targetText = TargetType.makeTargetText(job);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Utils.createTd("target", targetText));

    const argumentsText = JobPanel.decodeArgumentsText(job.Arguments);
    let functionText = job.Function + argumentsText;
    if (functionText.length > maxTextLength) {
      // prevent column becoming too wide
      functionText = functionText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Utils.createTd("function", functionText));

    const startTimeText = Output.dateTimeStr(job.StartTime);
    tr.appendChild(Utils.createTd("starttime", startTimeText));

    const menu = new DropDownMenu(tr);
    JobsDetailsPanel._addJobsMenuItemShowDetails(menu, job);
    this._addMenuItemJobsRerunJob(menu, job, argumentsText);

    const statusTd = Utils.createTd("", "");
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

    const detailsTd = Utils.createTd("details", "");
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
      tr.appendChild(Utils.createTd("", ""));
    }

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  static _addJobsMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show details", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  _addMenuItemJobsRerunJob (pMenu, job, argumentsText) {
    pMenu.addMenuItem("Re-run job...", (pClickEvent) => {
      this.runFullCommand(pClickEvent, job["Target-type"], job.Target, job.Function + argumentsText);
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
