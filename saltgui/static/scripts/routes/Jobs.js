/* global config document window */

import {DropDownMenu} from "../DropDown.js";
import {Output} from "../output/Output.js";
import {PageRoute} from "./Page.js";
import {Route} from "./Route.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

export class JobsRoute extends PageRoute {

  constructor (pRouter) {
    super("jobs", "Jobs", "page-jobs", "button-jobs", pRouter);

    this._getJobDetails = this._getJobDetails.bind(this);
    this._updateNextJob = this._updateNextJob.bind(this);

    Utils.makeTableSortable(this.getPageElement(), true);
    Utils.makeTableSearchable(this.getPageElement(), "jobs-search-button", "jobs-table");
  }

  onShow () {
    const that = this;

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

    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    const panel = document.getElementById("jobs-panel");
    const menu = new DropDownMenu(panel);

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const titleElement = document.getElementById("jobs-title");
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);
    this._addMenuItemShowSome(menu);
    this._addMenuItemShowEligible(menu);
    this._addMenuItemShowAll(menu);

    runnerJobsListJobsPromise.then((pRunnerJobsListJobsData) => {
      that.handleRunnerJobsListJobs(pRunnerJobsListJobsData, cnt);
      runnerJobsActivePromise.then((pRunnerJobsActiveData) => {
        that.handleRunnerJobsActive(pRunnerJobsActiveData);
      }, (pRunnerJobsActiveMsg) => {
        that.handleRunnerJobsActive(JSON.stringify(pRunnerJobsActiveMsg));
      });
    }, (pRunnerJobsListJobsMsg) => {
      that.handleRunnerJobsListJobs(JSON.stringify(pRunnerJobsListJobsMsg));
    });

    // to update details
    // interval should be larger than the retrieval time
    // to prevent many of such jobs to appear
    window.setInterval(this._updateNextJob, 1000);
  }

  _updateNextJob () {
    const tbody = document.getElementById("jobs-table-tbody");
    // find an item still marked as "(click)"
    for (const tr of tbody.rows) {
      const detailsField = tr.querySelector("td.details span");
      if (!detailsField || detailsField.innerText !== "(click)") {
        continue;
      }
      const jobId = tr.querySelector("td").innerText;
      detailsField.classList.add("no-status");
      detailsField.innerText = "loading...";
      this._getJobDetails(jobId);
      // only update one item at a time
      return;
    }
  }

  _addMenuItemShowSome (pMenu) {
    const maxJobs = 50;
    let title = "Show&nbsp;first&nbsp;" + maxJobs + "&nbsp;jobs";
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if (cnt === "undefined" || cnt === String(maxJobs)) {
      // 25CF = BLACK CIRCLE
      title = "\u25CF " + title;
    }
    pMenu.addMenuItem(title, () => {
      window.location.assign(config.NAV_URL + "/jobs?cnt=" + maxJobs);
    });
  }

  _addMenuItemShowEligible (pMenu) {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    let title = "Show&nbsp;eligible&nbsp;jobs";
    if (cnt === "eligible") {
      // 25CF = BLACK CIRCLE
      title = "\u25CF " + title;
    }
    pMenu.addMenuItem(title, () => {
      window.location.assign(config.NAV_URL + "/jobs?cnt=eligible");
    });
  }

  _addMenuItemShowAll (pMenu) {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    let title = "Show&nbsp;all&nbsp;jobs";
    if (cnt === "all") {
      // 25CF = BLACK CIRCLE
      title = "\u25CF " + title;
    }
    pMenu.addMenuItem(title, () => {
      window.location.assign(config.NAV_URL + "/jobs?cnt=all");
    });
  }

  addJob (pContainer, job) {
    const tr = document.createElement("tr");
    tr.id = Utils.getIdFromJobId(job.id);
    const jobIdText = job.id;
    tr.appendChild(Route.createTd(Utils.getIdFromJobId(job.id), jobIdText));

    let targetText = TargetType.makeTargetText(job["Target-type"], job.Target);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Route.createTd("target", targetText));

    const argumentsText = this.decodeArgumentsText(job.Arguments);
    let functionText = job.Function + argumentsText;
    if (functionText.length > maxTextLength) {
      // prevent column becoming too wide
      functionText = functionText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Route.createTd("function", functionText));

    const startTimeText = Output.dateTimeStr(job.StartTime);
    tr.appendChild(Route.createTd("starttime", startTimeText));

    const menu = new DropDownMenu(tr);
    this._addJobsMenuItemShowDetails(menu, job);
    this._addMenuItemJobsRerunJob(menu, job, argumentsText);

    const statusTd = Route.createTd("status", "");
    const statusSpan = Route.createSpan("status2", "loading...");
    statusSpan.classList.add("no-status");
    statusSpan.addEventListener("click", (pClickEvent) => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-status");
      statusSpan.innerText = "loading...";
      this.startRunningJobs();
      pClickEvent.stopPropagation();
    });
    statusTd.appendChild(statusSpan);
    tr.appendChild(statusTd);

    this._addJobsMenuItemUpdateStatus(menu, statusSpan);

    const detailsTd = Route.createTd("details", "");
    const detailsSpan = Route.createSpan("details2", "(click)");
    detailsSpan.classList.add("no-status");
    detailsSpan.addEventListener("click", (pClickEvent) => {
      detailsSpan.classList.add("no-status");
      detailsSpan.innerText = "loading...";
      this._getJobDetails(job.id);
      pClickEvent.stopPropagation();
    });
    Utils.addToolTip(detailsSpan, "Click to refresh");
    detailsTd.appendChild(detailsSpan);
    tr.appendChild(detailsTd);

    this._addMenuItemUpdateDetails(menu, detailsSpan, job);

    // fill out the number of columns to that of the header
    while (tr.cells.length < pContainer.parentElement.tHead.rows[0].cells.length) {
      tr.appendChild(Route.createTd("", ""));
    }

    pContainer.appendChild(tr);

    tr.addEventListener("click", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  _addJobsMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show&nbsp;details", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  _addMenuItemJobsRerunJob (pMenu, job, argumentsText) {
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job...", (pClickEvent) => {
      this.runFullCommand(pClickEvent, job["Target-type"], job.Target, job.Function + argumentsText);
    });
  }

  _addJobsMenuItemUpdateStatus (pMenu, pStatusSpan) {
    pMenu.addMenuItem("Update&nbsp;status", () => {
      pStatusSpan.classList.add("no-status");
      pStatusSpan.innerText = "loading...";
      this.startRunningJobs();
    });
  }

  _addMenuItemUpdateDetails (pMenu, pDetailsSpan, job) {
    pMenu.addMenuItem("Update&nbsp;details", () => {
      pDetailsSpan.classList.add("no-status");
      pDetailsSpan.innerText = "loading...";
      this._getJobDetails(job.id);
    });
  }

  handleRunnerJobsActive (pData) {

    if (!pData) {
      return;
    }

    if (typeof pData !== "object") {
      // update all jobs (page) with the error message
      const tbody = document.getElementById("jobs-table-tbody");
      for (const tr of tbody.rows) {
        const statusField = tr.querySelector("td.status span.no-status");
        if (!statusField) {
          continue;
        }
        statusField.classList.remove("no-status");
        statusField.innerText = "(error)";
        Utils.addToolTip(statusField, pData);
      }
      return;
    }

    const jobs = pData.return[0];

    // update all running jobs
    for (const jobId in jobs) {
      const job = jobs[jobId];

      let targetText = "";
      const targetField = this.pageElement.querySelector(".jobs tr#" + Utils.getIdFromJobId(jobId) + " td.status span");
      const maxTextLength = 50;
      if (targetText.length > maxTextLength) {
        // prevent column becoming too wide
        // yes, the addition of running/returned may again make
        // the string longer than 50 characters, we accept that
        targetText = targetText.substring(0, maxTextLength) + "...";
      }
      // then add the operational statistics
      if (job.Running && job.Running.length > 0) {
        targetText = targetText + job.Running.length + " running";
      }
      if (job.Returned && job.Returned.length > 0) {
        targetText = targetText + ", " + job.Returned.length + " returned";
      }

      // the field may not (yet) be on the screen
      if (!targetField) {
        continue;
      }
      targetField.classList.remove("no-status");
      targetField.innerText = targetText;
      targetField.insertBefore(Utils.createJobStatusSpan(jobId), targetField.firstChild);
      Utils.addToolTip(targetField, "Click to refresh column");
    }

    // update all finished jobs (page)
    const tbody = document.getElementById("jobs-table-tbody");
    for (const tr of tbody.rows) {
      const statusField = tr.querySelector("td.status span.no-status");
      if (!statusField) {
        continue;
      }
      statusField.classList.remove("no-status");
      statusField.innerText = "done";
      // we show the tooltip here so that the user is invited to click on this
      // the user then sees other rows being updated without becoming invisible
      Utils.addToolTip(statusField, "Click to refresh column");
    }
  }

  _getJobDetails (pJobId) {
    const that = this;

    const runnerJobsListJobPromise = this.router.api.getRunnerJobsListJob(pJobId);

    runnerJobsListJobPromise.then((pRunnerJobsListJobData) => {
      that._handleJobsRunnerJobsListJob(pJobId, pRunnerJobsListJobData);
    }, (pRunnerJobsListJobMsg) => {
      that._handleJobsRunnerJobsListJob(pJobId, JSON.stringify(pRunnerJobsListJobMsg));
    });
  }

  _handleJobsRunnerJobsListJob (pJobId, pData) {

    const detailsSpan = this.pageElement.querySelector(".jobs tr#" + Utils.getIdFromJobId(pJobId) + " td.details span");
    if (!detailsSpan) {
      return;
    }

    if (typeof pData !== "object") {
      detailsSpan.innerText = "(error)";
      detailsSpan.classList.remove("no-status");
      Utils.addToolTip(detailsSpan, pData);
      return;
    }

    pData = pData.return[0];

    if (pData.Error) {
      // typically happens for jobs that are expired from jobs-cache
      detailsSpan.innerText = "(error)";
      detailsSpan.classList.remove("no-status");
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
    const statusSpan = Route.createSpan("", "");
    statusSpan.innerHTML = detailsTxt;
    detailsSpan.appendChild(statusSpan);
    detailsSpan.classList.remove("no-status");
    Utils.addToolTip(detailsSpan, "Click to refresh");
  }

}
