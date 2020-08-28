/* global config document window */

import {DropDownMenu} from "../DropDown.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

export class JobsSummaryPanel extends JobsPanel {

  constructor () {
    super("jobs");

    this.addTitle("Recent Jobs");
    this.addSearchButton();
    this.addTable(null);
    this.setTableClickable();
    this.addMsg();
  }

  onShow () {
    const maxJobs = 7;
    super.onShow(maxJobs);
  }

  addJob (job) {
    const tr = document.createElement("tr");

    const td = Utils.createTd("", "");
    td.id = Utils.getIdFromJobId(job.id);

    let targetText = TargetType.makeTargetText(job["Target-type"], job.Target);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + "...";
    }
    const targetDiv = Utils.createDiv("target", targetText);
    td.appendChild(targetDiv);

    const functionText = job.Function;
    const functionDiv = Utils.createDiv("function", functionText);
    td.appendChild(functionDiv);

    const statusSpan = Utils.createSpan("job-status", "loading...");
    statusSpan.classList.add("no-job-status");
    // effectively also the whole column, but it does not look like a column on screen
    statusSpan.addEventListener("click", (pClickEvent) => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading...";
      this.startRunningJobs();
      pClickEvent.stopPropagation();
    });
    td.appendChild(statusSpan);

    const startTimeText = Output.dateTimeStr(job.StartTime);
    const startTimeDiv = Utils.createDiv("time", startTimeText);
    td.appendChild(startTimeDiv);

    tr.appendChild(td);

    const menu = new DropDownMenu(tr);
    JobsSummaryPanel._addPageMenuItemShowDetails(menu, job);
    this._addPageMenuItemUpdateStatus(menu, statusSpan);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  static _addPageMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show&nbsp;details", () => {
      window.location.assign(config.NAV_URL + "/job?id=" + encodeURIComponent(job.id));
    });
  }

  _addPageMenuItemUpdateStatus (pMenu, statusSpan) {
    pMenu.addMenuItem("Update&nbsp;status", () => {
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading...";
      this.startRunningJobs();
    });
  }
}
