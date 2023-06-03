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
    this.addPlayPauseButton();
    this.addHelpButton([
      "This page contains an overview of problems",
      "that are observed in various categories."
    ]);
    this.addTable(["-menu-", "Description"]);
    this.setTableClickable();
    this.addMsg();

    // keep the list of "loading..." messages
    const msg2 = Utils.createDiv();
    this.div.appendChild(msg2);
    this.msg2 = msg2;

    // cannot use this now since we are loading
    // the data in random order
    // this.setTableSortable("Description", "asc");

    this.keysIssues = new KeysIssues();
    this.jobsIssues = new JobsRunningIssues();
    this.beaconsIssues = new BeaconsIssues();
    this.schedulesIssues = new SchedulesIssues();
    this.notConnectedIssues = new NotConnectedIssues();
    this.lowStateIssues = new StateIssues();
  }

  updateFooter () {
    const txt = this.issuesStatus;
    super.updateFooter(txt ? txt : "(loading)");
  }

  onShow () {
    const p1 = this.keysIssues.onGetIssues(this);
    const p2 = this.jobsIssues.onGetIssues(this);
    const p3 = this.beaconsIssues.onGetIssues(this);
    const p4 = this.schedulesIssues.onGetIssues(this);
    const p5 = this.notConnectedIssues.onGetIssues(this);
    const p6 = this.lowStateIssues.onGetIssues(this);

    /* eslint-disable compat/compat */
    /* Promise.all is not supported in op_mini all, IE 11 */
    const allPromise = Promise.all([p1, p2, p3, p4, p5, p6]);
    /* eslint-enable compat/compat */
    allPromise.then(() => {
      // VOID
    }, (pErrorMsg) => {
      this.setMsg("(error)");
      Utils.addToolTip(this.msgDiv, pErrorMsg);
    });
  }
}
