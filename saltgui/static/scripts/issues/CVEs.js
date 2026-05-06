/* global */

import {Character} from "../Character.js";
import {Issues} from "./Issues.js";
import {MinionsPanel} from "../panels/Minions.js";

const MASTER = 1;
const MINION = 2;

export class CveIssues extends Issues {

  onGetIssues (pPanel) {

    const msg = super.onGetIssues(pPanel, "VERSIONS");

    const runnerManageVersionsPromise = this.api.getRunnerManageVersions();

    runnerManageVersionsPromise.then((pRunnerManageVersionsData) => {
      Issues.removeCategory(pPanel, "minion-older");
      Issues.removeCategory(pPanel, "minion-newer");
      Issues.removeCategory(pPanel, "minion-bug");
      Issues.removeCategory(pPanel, "master-bug");
      Issues.removeCategory(pPanel, "versions");
      CveIssues._handleManageVersions(pPanel, pRunnerManageVersionsData);
      Issues.readyCategory(pPanel, msg);
      return true;
    }, (pRunnerManageVersionsMsg) => {
      Issues.removeCategory(pPanel, "minion-older");
      Issues.removeCategory(pPanel, "minion-newer");
      Issues.removeCategory(pPanel, "minion-bug");
      Issues.removeCategory(pPanel, "master-bug");
      const tr = Issues.addIssue(pPanel, "versions", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of versions");
      Issues.addIssueErr(tr, pRunnerManageVersionsMsg);
      Issues.readyCategory(pPanel, msg);
      return false;
    });

    return runnerManageVersionsPromise;
  }

  static _handleManageVersions (pPanel, pRunnerManageVersionsData) {
    const versionList = pRunnerManageVersionsData.return[0];

    const masterVersion = versionList["Master"];
    const masterBugs = MinionsPanel._getCveBugs(masterVersion, MASTER);

    // part 1: CVEs for the master

    for (const bug in masterBugs) {
      const tr = Issues.addIssue(pPanel, "master-bug", bug);
      Issues.addIssueMsg(tr, "Master is vulnerable due to " + bug + Character.NO_BREAK_SPACE + Character.HEAVY_NORTH_EAST_ARROW);
      Issues.addIssueUrl(tr, "CVE report", "https://www.cve.org/CVERecord/SearchResults?query=" + bug);
    }

    for (const cat in versionList) {
      if (cat === "Master") {
        // Master is not even a category, ignore it
        continue;
      }

      const details = versionList[cat];

      // part 1a: differences between master and each minion

      if (cat === "Up to date") {
        // nothing to report when in this state
      } else if (cat === "Minion offline") {
        // this is already reported elsewhere
      } else if (cat === "Minion requires update") {
        for (const [minionId,version] of Object.entries(details)) {
          const tr = Issues.addIssue(pPanel, "minion-older", minionId);
          Issues.addIssueMsg(tr, "Minion '" + minionId + "' (" + version + ") is older than the Master (" + masterVersion + ")");
        }
      } else if (cat === "Minion newer than master") {
        for (const [minionId,version] of Object.entries(details)) {
          const tr = Issues.addIssue(pPanel, "minion-newer", minionId);
          Issues.addIssueMsg(tr, "Minion '" + minionId + "' (" + version + ") is newer than the Master (" + masterVersion + ")");
        }
      } else {
        // unknown category, just show it
        for (const [minionId,version] of Object.entries(details)) {
          const tr = Issues.addIssue(pPanel, "minion-newer", minionId);
          Issues.addIssueMsg(tr, "Minion '" + minionId + "' (" + version + ") vs Master (" + masterVersion + "): " + cat);
        }
      }

      // part 2b: CVEs for each minion

      for (const [minionId,version] of Object.entries(details)) {
        const minionBugs = MinionsPanel._getCveBugs(version, MINION);
        for (const bug in minionBugs) {
          const tr = Issues.addIssue(pPanel, "minion-bug", minionId + "-" + bug);
          Issues.addIssueMsg(tr, "Minion '" + minionId + "' is vulnerable due to " + bug + Character.NO_BREAK_SPACE + Character.HEAVY_NORTH_EAST_ARROW);
          Issues.addIssueUrl(tr, "CVE report", "https://www.cve.org/CVERecord/SearchResults?query=" + bug);
        }
      }
    }
  }
}
