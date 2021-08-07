/* global */

import {BeaconsIssues} from "../issues/Beacons.js";
import {JobsRunningIssues} from "../issues/JobsRunning.js";
import {KeysIssues} from "../issues/Keys.js";
import {NotConnectedIssues} from "../issues/NotConnected.js";
import {Panel} from "./Panel.js";
import {SchedulesIssues} from "../issues/Schedules.js";
import {StateIssues} from "../issues/State.js";
import {Utils} from "../Utils.js";

export class IssuesPanel extends Panel {

  constructor () {
    super("issues");

    this.addTitle("Issues");
    this.addSearchButton();
    this.addPlayPauseButton("none");
    this.addHelpButton([
      "This page contains an overview of problems",
      "that are observed in various categories."
    ]);
    // this.addTable(["Key", "-menu-", "Description"]);
    this.addTable(["-menu-", "Description"]);
    this.setTableClickable();
    this.addMsg();

    // cannot use this now since we are loading
    // the data in random order
    // this.setTableSortable("Key", "asc");

    this.keysIssues = new KeysIssues();
    this.jobsIssues = new JobsRunningIssues();
    this.beaconsIssues = new BeaconsIssues();
    this.schedulesIssues = new SchedulesIssues();
    this.notConnectedIssues = new NotConnectedIssues();
    this.lowStateIssues = new StateIssues();
  }

  onShow () {
    this.keysIssues.api = this.api;
    const issuesStatusKeys = this.makeIssuesStatus("KEYS");
    const p1 = this.keysIssues.onGetIssues(this, issuesStatusKeys);
    this.jobsIssues.api = this.api;
    const issuesStatusJobsRunning = this.makeIssuesStatus("JOBS-RUNNING");
    const p2 = this.jobsIssues.onGetIssues(this, issuesStatusJobsRunning);
    this.beaconsIssues.api = this.api;
    const issuesStatusBeacons = this.makeIssuesStatus("BEACONS");
    const p3 = this.beaconsIssues.onGetIssues(this, issuesStatusBeacons);
    this.schedulesIssues.api = this.api;
    const issuesStatusSchedules = this.makeIssuesStatus("SCHEDULES");
    const p4 = this.schedulesIssues.onGetIssues(this, issuesStatusSchedules);
    this.notConnectedIssues.api = this.api;
    const issuesStatusNotConnected = this.makeIssuesStatus("NOT-CONNECTED");
    const p5 = this.notConnectedIssues.onGetIssues(this, issuesStatusNotConnected);
    this.lowStateIssues.api = this.api;
    const issuesStatusState = this.makeIssuesStatus("STATE");
    const p6 = this.lowStateIssues.onGetIssues(this, issuesStatusState);

    /* eslint-disable compat/compat */
    /* Promise.all() is not supported in op_mini all, IE 11  compat/compat */
    const allPromise = Promise.all([p1, p2, p3, p4, p5, p6]);
    /* eslint-enable compat/compat */
    allPromise.then(() => {
      this.setTableSortable("Description", "asc");
    }, (error) => {
      console.error(error);
    });
  }

  updateFooter () {
    const txt = Utils.txtZeroOneMany(
      this.table.tBodies[0].children.length,
      "No issues", "{0} issue", "{0} issues");
    this.setMsg(txt);
  }

  makeIssuesStatus (pTitle) {
    const msg = document.createElement("div");
    msg.classList.add("msg");
    msg.innerText = "(loading info for " + pTitle + ")";
    this.div.appendChild(msg);
    return msg;
  }
}
