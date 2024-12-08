/* global */

import {Character} from "../Character.js";
import {DropDownMenuCmd} from "../DropDownCmd.js";
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
    this.addTable(["-dummy-", "-dummy-"]);
    this.setTableClickable("page");
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

    // menu on left side to prevent it from going past end of window
    const menu = new DropDownMenuCmd(tr, "smaller");

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

    // complete the menu
    this._addMenuItemShowDetails(menu, job);
    this._addMenuItemUpdateStatus(menu, statusSpan);

    const tbody = this.table.tBodies[0];
    tbody.appendChild(tr);

    tr.addEventListener("click", (pClickEvent) => {
      this.router.goTo("job", {"id": job.id}, undefined, pClickEvent);
      pClickEvent.stopPropagation();
    });
  }

  _addMenuItemShowDetails (pMenu, job) {
    pMenu.addMenuItemCmd("Show details", (pClickEvent) => {
      this.router.goTo("job", {"id": job.id}, undefined, pClickEvent);
    });
  }

  _addMenuItemUpdateStatus (pMenu, statusSpan) {
    pMenu.addMenuItemCmd("Update status", () => {
      statusSpan.classList.add("no-job-status");
      statusSpan.innerText = "loading" + Character.HORIZONTAL_ELLIPSIS;
      this.startRunningJobs();
    });
  }
}
