import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {TargetType} from '../TargetType.js';
import {Utils} from '../Utils.js';

export class JobsRoute extends PageRoute {

  constructor(pRouter) {
    super("^[\/]jobs$", "Jobs", "#page-jobs", "#button-jobs", pRouter);

    this._getJobDetails = this._getJobDetails.bind(this);
  }

  onShow() {
    const myThis = this;

    const patInteger = /^((0)|([-+]?[1-9][0-9]*))$/;

    const maxJobs = 50;
    let cnt = decodeURIComponent(Utils.getQueryParam("cnt", "" + maxJobs));
    if(cnt === "eligible")
      cnt = 10000;
    else if(cnt === "all")
      // magic value to ignore all filters
      cnt = 99999;
    else if(cnt.match(patInteger))
      cnt = parseInt(cnt);
    else
      // pretend parameter was not present
      cnt = maxJobs;

    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    const panel = document.getElementById("jobs-panel");
    const menu = new DropDownMenu(panel);
    this._addMenuItemShowSomeWhenNeeded(menu);
    this._addMenuItemShowEligibleWhenNeeded(menu);
    this._addMenuItemShowAllWhenNeeded(menu);

    // new menus are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const titleElement = document.getElementById("jobs-title");
    panel.insertBefore(menu.menuDropdown, titleElement.nextSibling);

    runnerJobsListJobsPromise.then(pData => {
      myThis._handleRunnerJobsListJobs(pData, true, cnt);
      runnerJobsActivePromise.then(pData => {
        myThis._handleRunnerJobsActive(pData);
      }, pData => {
        myThis._handleRunnerJobsActive(JSON.stringify(pData));
      });
    }, pData => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(pData));
    }); 
  }

  _addMenuItemShowSomeWhenNeeded(pMenu) {
    const maxJobs = 50;
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if(cnt === ""+maxJobs) return;
    pMenu.addMenuItem("Show&nbsp;first&nbsp;" + maxJobs + "&nbsp;jobs", function(pClickEvent) {
      window.location.assign("jobs?cnt=" + maxJobs);
    }.bind(this));
  }

  _addMenuItemShowEligibleWhenNeeded(pMenu) {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if(cnt === "eligible") return;
    pMenu.addMenuItem("Show&nbsp;eligible&nbsp;jobs", function(pClickEvent) {
      window.location.assign("jobs?cnt=eligible");
    }.bind(this));
  }

  _addMenuItemShowAllWhenNeeded(pMenu) {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if(cnt === "all") return;
    pMenu.addMenuItem("Show&nbsp;all&nbsp;jobs", function(pClickEvent) {
      window.location.assign("jobs?cnt=all");
    }.bind(this));
  }

  _addJob(pContainer, job) {
    const tr = document.createElement("tr");
    tr.id = Utils.getIdFromJobId(job.id);
    const jobIdText = job.id;
    tr.appendChild(Route._createTd(Utils.getIdFromJobId(job.id), jobIdText));

    let targetText = TargetType.makeTargetText(job["Target-type"], job.Target);
    const maxTextLength = 50;
    if(targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Route._createTd("target", targetText));

    const argumentsText = this._decodeArgumentsText(job.Arguments);
    let functionText = job.Function + argumentsText;
    if(functionText.length > maxTextLength) {
      // prevent column becoming too wide
      functionText = functionText.substring(0, maxTextLength) + "...";
    }
    tr.appendChild(Route._createTd("function", functionText));

    const startTimeText = Output.dateTimeStr(job.StartTime);
    tr.appendChild(Route._createTd("starttime", startTimeText));

    const menu = new DropDownMenu(tr);
    this._addMenuItemShowDetails(menu, job);
    this._addMenuItemRerunJob(menu, job, argumentsText);

    const statusTd = Route._createTd("status", "");
    const statusSpan = Route._createSpan("status2", "loading...");
    statusSpan.classList.add("no-status");
    statusSpan.addEventListener("click", pClickEvent => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-status");
      statusSpan.innerText = "loading...";
      this._startRunningJobs();
      pClickEvent.stopPropagation();
    });
    statusTd.appendChild(statusSpan);
    tr.appendChild(statusTd);

    this._addMenuItemUpdateStatus(menu, statusSpan);

    const detailsTd = Route._createTd("details", "");
    const detailsSpan = Route._createSpan("details2", "(click)");
    detailsSpan.classList.add("no-status");
    detailsSpan.addEventListener("click", pClickEvent => {
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
    while(tr.cells.length < pContainer.parentElement.tHead.rows[0].cells.length) {
      tr.appendChild(Route._createTd("", ""));
    }

    pContainer.appendChild(tr);

    tr.addEventListener("click", pClickEvent =>
      window.location.assign("/job?id=" + encodeURIComponent(job.id))
    );
  }

  _addMenuItemShowDetails(pMenu, job) {
    pMenu.addMenuItem("Show&nbsp;details", function(pClickEvent) {
      window.location.assign("/job?id=" + encodeURIComponent(job.id));
    }.bind(this));
  }

  _addMenuItemRerunJob(pMenu, job, argumentsText) {
    // 2011 = NON-BREAKING HYPHEN
    pMenu.addMenuItem("Re&#x2011;run&nbsp;job...", function(pClickEvent) {
      this._runFullCommand(pClickEvent, job["Target-type"], job.Target, job.Function + argumentsText);
    }.bind(this));
  }

  _addMenuItemUpdateStatus(pMenu, pStatusSpan) {
    pMenu.addMenuItem("Update&nbsp;status", function(pClickEvent) {
      pStatusSpan.classList.add("no-status");
      pStatusSpan.innerText = "loading...";
      this._startRunningJobs();
    }.bind(this));
  }

  _addMenuItemUpdateDetails(pMenu, pDetailsSpan, job) {
    pMenu.addMenuItem("Update&nbsp;details", function(pClickEvent) {
      pDetailsSpan.classList.add("no-status");
      pDetailsSpan.innerText = "loading...";
      this._getJobDetails(job.id);
    }.bind(this));
  }

  _handleRunnerJobsActive(pData) {

    if(!pData) return;

    if(typeof pData !== "object") {
      // update all jobs (page) with the error message
      const tbody = this.pageElement.querySelector("table#jobs tbody");
      for(const tr of tbody.rows) {
        const statusField = tr.querySelector("td.status span.no-status");
        if(!statusField) continue;
        statusField.classList.remove("no-status");
        statusField.innerText = "(error)";
        Utils.addToolTip(statusField, pData);
      }
      return;
    }

    const jobs = pData.return[0];

    // update all running jobs
    for(const k in jobs)
    {
      const job = jobs[k];

      let targetText = "";
      const targetField = this.pageElement.querySelector(".jobs tr#" + Utils.getIdFromJobId(k) + " td.status span");
      const maxTextLength = 50;
      if(targetText.length > maxTextLength) {
        // prevent column becoming too wide
        // yes, the addition of running/returned may again make
        // the string longer than 50 characters, we accept that
        targetText = targetText.substring(0, maxTextLength) + "...";
      }
      // then add the operational statistics
      if(job.Running && job.Running.length > 0)
        targetText = targetText + job.Running.length + " running";
      if(job.Returned && job.Returned.length > 0)
        targetText = targetText + ", " + job.Returned.length + " returned";

      // the field may not (yet) be on the screen
      if(!targetField) continue;
      targetField.classList.remove("no-status");
      targetField.innerText = targetText;
      targetField.insertBefore(Utils.createJobStatusSpan(k), targetField.firstChild);
      Utils.addToolTip(targetField, "Click to refresh column");
    }

    // update all finished jobs (page)
    const tbody = this.pageElement.querySelector("table#jobs tbody");
    for(const tr of tbody.rows) {
      const statusField = tr.querySelector("td.status span.no-status");
      if(!statusField) continue;
      statusField.classList.remove("no-status");
      statusField.innerText = "done";
      // we show the tooltip here so that the user is invited to click on this
      // the user then sees other rows being updated without becoming invisible
      Utils.addToolTip(statusField, "Click to refresh column");
    }
  }

  _getJobDetails(pJobId) {
    const myThis = this;

    const runnerJobsListJobPromise = this.router.api.getRunnerJobsListJob(pJobId);

    runnerJobsListJobPromise.then(pData => {
      myThis._handleRunnerJobsListJob(pJobId, pData);
    }, pData => {
      myThis._handleRunnerJobsListJob(pJobId, JSON.stringify(pData));
    });
  }

  _handleRunnerJobsListJob(pJobId, pData) {

    const detailsSpan = this.pageElement.querySelector(".jobs #" + Utils.getIdFromJobId(pJobId) + " td.details span");
    if(!detailsSpan) return;

    if(typeof pData !== "object") {
      detailsSpan.innerText = "(error)";
      detailsSpan.classList.remove("no-status");
      Utils.addToolTip(detailsSpan, pData);
      return;
    }

    pData = pData.return[0];

    if(pData.Error) {
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
    if(keyCount === pData.Minions.length)
      detailsTxt += "<span style='color: green'>";
    else
      detailsTxt += "<span style='color: red'>";
    detailsTxt += Utils.txtZeroOneMany(keyCount,
      "no results", "{0} result", "{0} results");
    detailsTxt += "</span>";

    const summary = { };
    for(const minionId in pData.Result) {
      const result = pData.Result[minionId];
      // use keys that can conveniently be sorted
      const key = (result.success ? "0-" : "1-") + result.retcode;
      if(!summary.hasOwnProperty(key)) summary[key] = 0;
      summary[key] += 1;
    }

    const keys = Object.keys(summary).sort();
    for(const key of keys) {
      detailsTxt += ", ";
      if(key === "0-0") {
        detailsTxt += "<span style='color: green'>";
        detailsTxt += Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes");
      } else if(key.startsWith("0-")) {
        detailsTxt += "<span style='color: orange'>";
        detailsTxt += Utils.txtZeroOneMany(summary[key], "", "{0} success", "{0} successes");
      } else { // if(key.startsWith("1-"))
        detailsTxt += "<span style='color: red'>";
        detailsTxt += Utils.txtZeroOneMany(summary[key], "", "{0} failure", "{0} failures");
      }
      if(key !== "0-0") {
        // don't show the retcode for real success
        detailsTxt += "(" + key.substr(2) + ")";
      }
      detailsTxt += "</span>";
    }

    detailsSpan.innerText = "";
    detailsSpan.appendChild(Utils.createJobStatusSpan(pJobId));
    const statusSpan = Route._createSpan("", "");
    statusSpan.innerHTML = detailsTxt;
    detailsSpan.appendChild(statusSpan);
    detailsSpan.classList.remove("no-status");
    Utils.addToolTip(detailsSpan, "Click to refresh");
  }

}
