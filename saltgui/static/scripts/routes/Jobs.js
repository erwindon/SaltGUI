import {DropDownMenu} from '../DropDown.js';
import {Output} from '../output/Output.js';
import {PageRoute} from './Page.js';
import {Route} from './Route.js';
import {TargetType} from '../TargetType.js';
import {Utils} from '../Utils.js';

export class JobsRoute extends PageRoute {

  constructor(router) {
    super("^[\/]jobs$", "Jobs", "#page_jobs", "#button_jobs", router);

    this._getJobDetails = this._getJobDetails.bind(this);
  }

  onShow() {
    const myThis = this;

    const patInteger = /^((0)|([-+]?[1-9][0-9]*))$/;

    const maxJobs = 50;
    let cnt = decodeURIComponent(Utils.getQueryParam("cnt", "" + maxJobs));
    if(cnt === "all")
      cnt = 10000;
    else if(cnt.match(patInteger))
      cnt = parseInt(cnt);
    else
      // pretend parameter was not present
      cnt = maxJobs;

    const runnerJobsListJobsPromise = this.router.api.getRunnerJobsListJobs();
    const runnerJobsActivePromise = this.router.api.getRunnerJobsActive();

    const page = document.getElementById("jobs_page");
    const menu = new DropDownMenu(page);
    this._addMenuItemShowAllWhenNeeded(menu);
    this._addMenuItemShowSomeWhenNeeded(menu);

    // new menu's are always added at the bottom of the div
    // fix that by re-adding it to its proper place
    const title = document.getElementById("jobs_title");
    page.insertBefore(menu.menuDropdown, title.nextSibling);

    runnerJobsListJobsPromise.then(data => {
      myThis._handleRunnerJobsListJobs(data, true, cnt);
      runnerJobsActivePromise.then(data => {
        myThis._handleRunnerJobsActive(data);
      }, data => {
        myThis._handleRunnerJobsActive(JSON.stringify(data));
      });
    }, data => {
      myThis._handleRunnerJobsListJobs(JSON.stringify(data));
    }); 
  }

  _addMenuItemShowAllWhenNeeded(menu) {
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if(cnt === "all") return;
    menu.addMenuItem("Show&nbsp;all&nbsp;jobs", function(evt) {
      window.location.assign("jobs?cnt=all");
    }.bind(this));
  }

  _addMenuItemShowSomeWhenNeeded(menu) {
    const maxJobs = 50;
    const cnt = decodeURIComponent(Utils.getQueryParam("cnt"));
    if(cnt === ""+maxJobs) return;
    menu.addMenuItem("Show&nbsp;first&nbsp;" + maxJobs + "&nbsp;jobs", function(evt) {
      window.location.assign("jobs?cnt=" + maxJobs);
    }.bind(this));
  }

  _addJob(container, job) {
    const tr = document.createElement("tr");
    tr.id = "job" + job.id;
    const jidText = job.id;
    tr.appendChild(Route._createTd("job" + job.id, jidText));

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

    const tdStatus = Route._createTd("status", "");
    const spanStatus = Route._createSpan("status2", "loading...");
    spanStatus.classList.add("no_status");
    spanStatus.addEventListener("click", evt => {
      // show "loading..." only once, but we are updating the whole column
      spanStatus.classList.add("no_status");
      spanStatus.innerText = "loading...";
      this._startRunningJobs();
      evt.stopPropagation();
    });
    tdStatus.appendChild(spanStatus);
    tr.appendChild(tdStatus);

    this._addMenuItemUpdateStatus(menu, spanStatus);

    const tdDetails = Route._createTd("details", "");
    const spanDetails = Route._createSpan("details2", "(click)");
    spanDetails.classList.add("no_status");
    spanDetails.addEventListener("click", evt => {
      spanDetails.classList.add("no_status");
      spanDetails.innerText = "loading...";
      this._getJobDetails(job.id);
      evt.stopPropagation();
    });
    Utils.addToolTip(spanDetails, "Click to refresh");
    tdDetails.appendChild(spanDetails);
    tr.appendChild(tdDetails);

    this._addMenuItemUpdateDetails(menu, spanDetails, job);

    // fill out the number of columns to that of the header
    while(tr.cells.length < container.parentElement.tHead.rows[0].cells.length) {
      tr.appendChild(Route._createTd("", ""));
    }

    container.appendChild(tr);

    tr.addEventListener("click", evt => window.location.assign("/job?id=" + encodeURIComponent(job.id)));
  }

  _addMenuItemShowDetails(menu, job) {
    menu.addMenuItem("Show&nbsp;details", function(evt) {
      window.location.assign("/job?id=" + encodeURIComponent(job.id));
    }.bind(this));
  }

  _addMenuItemRerunJob(menu, job, argumentsText) {
    // 2011 = NON-BREAKING HYPHEN
    menu.addMenuItem("Re&#x2011;run&nbsp;job...", function(evt) {
      this._runFullCommand(evt, job["Target-type"], job.Target, job.Function + argumentsText);
    }.bind(this));
  }

  _addMenuItemUpdateStatus(menu, spanStatus) {
    menu.addMenuItem("Update&nbsp;status", function(evt) {
      spanStatus.classList.add("no_status");
      spanStatus.innerText = "loading...";
      this._startRunningJobs();
    }.bind(this));
  }

  _addMenuItemUpdateDetails(menu, spanDetails, job) {
    menu.addMenuItem("Update&nbsp;details", function(evt) {
      spanDetails.classList.add("no_status");
      spanDetails.innerText = "loading...";
      this._getJobDetails(job.id);
    }.bind(this));
  }

  _handleRunnerJobsActive(data) {

    if(typeof data !== "object") {
      // update all jobs (page) with the error message
      for(const tr of this.page_element.querySelector("table#jobs tbody").rows) {
        const statusField = tr.querySelector("td.status span.no_status");
        if(!statusField) continue;
        statusField.classList.remove("no_status");
        statusField.innerText = "(error)";
        Utils.addToolTip(statusField, data);
      }
      return;
    }

    const jobs = data.return[0];

    // update all running jobs
    for(const k in jobs)
    {
      const job = jobs[k];

      let targetText = "";
      const targetField = this.page_element.querySelector(".jobs tr#job" + k + " td.status span");
      const maxTextLength = 50;
      if(targetText.length > maxTextLength) {
        // prevent column becoming too wide
        // yes, the addition of running/returned may again make
        // the string longer than 50 characters, we accept that
        targetText = targetText.substring(0, maxTextLength) + "...";
      }
      // then add the operational statistics
      if(job.Running.length > 0)
        targetText = targetText + job.Running.length + " running";
      if(job.Returned.length > 0)
        targetText = targetText + ", " + job.Returned.length + " returned";

      // the field may not (yet) be on the screen
      if(!targetField) continue;
      targetField.classList.remove("no_status");
      targetField.innerText = targetText;
      Utils.addToolTip(targetField, "Click to refresh column");
    }

    // update all finished jobs (page)
    for(const tr of this.page_element.querySelector("table#jobs tbody").rows) {
      const statusField = tr.querySelector("td.status span.no_status");
      if(!statusField) continue;
      statusField.classList.remove("no_status");
      statusField.innerText = "done";
      // we show the tooltip here so that the user is invited to click on this
      // the user then sees other rows being updated without becoming invisible
      Utils.addToolTip(statusField, "Click to refresh column");
    }
  }

  _getJobDetails(jobid) {
    const myThis = this;

    const runnerJobsListJobPromise = this.router.api.getRunnerJobsListJob(jobid);

    runnerJobsListJobPromise.then(data => {
      myThis._handleRunnerJobsListJob(jobid, data);
    }, data => {
      myThis._handleRunnerJobsListJob(jobid, JSON.stringify(data));
    });
  }

  _handleRunnerJobsListJob(jobid, data) {

    if(typeof data !== "object") {
      const detailsSpan = this.page_element.querySelector(".jobs #job" + jobid + " td.details span");
      if(!detailsSpan) return;
      detailsSpan.innerText = "(error)";
      detailsSpan.classList.remove("no_status");
      Utils.addToolTip(detailsSpan, data);
      return;
    }

    data = data.return[0];

    let str = "";

    if(data.Minions.length === 1)
      str = "1 minion";
    else
      str = data.Minions.length + " minions";

    const keyCount = Object.keys(data.Result).length;
    str += ", ";
    if(keyCount === data.Minions.length)
      str += "<span style='color: green'>";
    else
      str += "<span style='color: red'>";
    if(keyCount === 1)
      str += "1 result";
    else
      str += "" + keyCount + " results";
    str += "</span>";

    const summary = { };
    for(const minion in data.Result) {
      const result = data.Result[minion];
      // use keys that can conveniently be sorted
      const key = (result.success ? "0-" : "1-") + result.retcode;
      if(!summary.hasOwnProperty(key)) summary[key] = 0;
      summary[key] += 1;
    }

    const keys = Object.keys(summary).sort();
    for(const key of keys) {
      str += ", ";
      if(key === "0-0") {
        // don't show the retcode here
        str += "<span style='color: green'>";
        str += summary[key] + " success";
        str += "</span>";
      } else if(key.startsWith("0-")) {
        str += "<span style='color: orange'>";
        str += summary[key] + " success(" + key.substr(2) + ")";
        str += "</span>";
      } else { // if(key.startsWith("1-"))
        str += "<span style='color: red'>";
        str += summary[key] + " failure(" + key.substr(2) + ")";
        str += "</span>";
      }
    }

    const detailsSpan = this.page_element.querySelector(".jobs #job" + jobid + " td.details span");
    if(!detailsSpan) return;
    detailsSpan.innerHTML = str;
    detailsSpan.classList.remove("no_status");
    Utils.addToolTip(detailsSpan, "Click to refresh");
  }

}
