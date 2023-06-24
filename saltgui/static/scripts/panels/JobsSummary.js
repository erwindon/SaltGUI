/* global */

import {Character} from "../Character.js";
import {DropDownMenu} from "../DropDown.js";
import {JobsPanel} from "./Jobs.js";
import {Output} from "../output/Output.js";
import {TargetType} from "../TargetType.js";
import {Utils} from "../Utils.js";

// how many jobs to load in the side panel
const MAX_JOBS_SUMMARY = 7;

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
    super.onShow(MAX_JOBS_SUMMARY);
  }

  /* eslint-disable class-methods-use-this */
  jobsListIsReady () {
    // VOID
  }
  /* eslint-enable class-methods-use-this */

  addJob (job) {
    const tr = Utils.createTr();
    tr.id = Utils.getIdFromJobId(job.id);

    const td = Utils.createTd();

    let targetText = TargetType.makeTargetText(job);
    const maxTextLength = 50;
    if (targetText.length > maxTextLength) {
      // prevent column becoming too wide
      targetText = targetText.substring(0, maxTextLength) + Character.HORIZONTAL_ELLIPSIS;
    }
    const targetDiv = Utils.createDiv("target", targetText);
    td.appendChild(targetDiv);

    const functionText = job.Function;
    const functionDiv = Utils.createDiv("function", functionText);
    td.appendChild(functionDiv);

    const statusSpan = Utils.createSpan(["job-status", "no-job-status"], "loading" + Character.HORIZONTAL_ELLIPSIS);
    // effectively also the whole column, but it does not look like a column on screen
    statusSpan.addEventListener("click", (pClickEvent) => {
      // show "loading..." only once, but we are updating the whole column
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
      this.startRunningJobs();
      pClickEvent.stopPropagation();
    });
    td.appendChild(statusSpan);

    const startTimeDiv = Utils.createDiv("time");
    const startTimeSpan = Utils.createSpan();
    Output.dateTimeStr(job.StartTime, startTimeSpan);
    startTimeDiv.appendChild(startTimeSpan);
    td.appendChild(startTimeDiv);

    tr.appendChild(td);

    const menu = new DropDownMenu(tr, true);
    this._addMenuItemShowDetails(menu, job);
    this._addMenuItemUpdateStatus(menu, statusSpan);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.router.goTo("job", {"id": job.id});
      pClickEvent.stopPropagation();
    });
  }

  _addMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItem("Show details", () => {
      this.router.goTo("job", {"id": job.id});
    });
  }

  _addMenuItemUpdateStatus (pMenu, statusSpan) {
    pMenu.addMenuItem("Update status", () => {
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
      this.startRunningJobs();
    });
  }
}
