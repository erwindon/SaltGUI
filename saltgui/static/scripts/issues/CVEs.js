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

    runnerManageVersionsPromise.then((ok_RunnerManageVersions) => {
      Issues.removeCategory(pPanel, "minion-older");
      Issues.removeCategory(pPanel, "minion-newer");
      Issues.removeCategory(pPanel, "minion-bug");
      Issues.removeCategory(pPanel, "master-bug");
      Issues.removeCategory(pPanel, "versions");
      CveIssues._handleManageVersions(pPanel, ok_RunnerManageVersions);
      Issues.readyCategory(pPanel, msg);
      return true;
    }, (_error_RunnerManageVersions) => {
      Issues.removeCategory(pPanel, "minion-older");
      Issues.removeCategory(pPanel, "minion-newer");
      Issues.removeCategory(pPanel, "minion-bug");
      Issues.removeCategory(pPanel, "master-bug");
      const tr = Issues.addIssue(pPanel, "versions", "retrieving");
      Issues.addIssueMsg(tr, "Could not retrieve list of versions");
      Issues.addIssueErr(tr, _error_RunnerManageVersions);
      Issues.readyCategory(pPanel, msg);
      return false;
    });

    return runnerManageVersionsPromise;
  }

  static _handleManageVersions (pPanel, pRunnerManageVersionsData) {
    const versionList = pRunnerManageVersionsData.return[0];
    const masterVersion = versionList["Master"];

    CveIssues._addMasterBugIssues(pPanel, masterVersion);
    CveIssues._processCategoryVersions(pPanel, versionList, masterVersion);
  }

  static _addMasterBugIssues (pPanel, masterVersion) {
    const masterBugs = MinionsPanel.getCveBugs(masterVersion, MASTER);

    for (const bug in masterBugs) {
      const tr = Issues.addIssue(pPanel, "master-bug", bug);
      Issues.addIssueMsg(tr, "Master is vulnerable due to " + bug + Character.NO_BREAK_SPACE + Character.HEAVY_NORTH_EAST_ARROW);
      Issues.addIssueUrl(tr, "CVE report", "https://www.cve.org/CVERecord/SearchResults?query=" + bug);
    }
  }

  static _processCategoryVersions (pPanel, versionList, masterVersion) {
    for (const cat in versionList) {
      if (cat === "Master") {
        continue;
      }

      const details = versionList[cat];
      CveIssues._processCategoryVersionDifferences(pPanel, cat, details, masterVersion);
      CveIssues._processMinionBugIssues(pPanel, details);
    }
  }

  static _processCategoryVersionDifferences (pPanel, category, details, masterVersion) {
    if (category === "Up to date" || category === "Minion offline") {
      return;
    }

    if (category === "Minion requires update") {
      CveIssues._addMinionVersionIssues(pPanel, "minion-older", details, masterVersion, "is older than");
    } else if (category === "Minion newer than master") {
      CveIssues._addMinionVersionIssues(pPanel, "minion-newer", details, masterVersion, "is newer than");
    } else {
      CveIssues._addUnknownCategoryIssues(pPanel, category, details, masterVersion);
    }
  }

  static _addMinionVersionIssues (pPanel, issueCategory, details, masterVersion, compareText) {
    for (const [minionId, version] of Object.entries(details)) {
      const tr = Issues.addIssue(pPanel, issueCategory, minionId);
      Issues.addIssueMsg(tr, "Minion '" + minionId + "' (" + version + ") " + compareText + " the Master (" + masterVersion + ")");
    }
  }

  static _addUnknownCategoryIssues (pPanel, category, details, masterVersion) {
    for (const [minionId, version] of Object.entries(details)) {
      const tr = Issues.addIssue(pPanel, "minion-newer", minionId);
      Issues.addIssueMsg(tr, "Minion '" + minionId + "' (" + version + ") vs Master (" + masterVersion + "): " + category);
    }
  }

  static _processMinionBugIssues (pPanel, details) {
    for (const [minionId, version] of Object.entries(details)) {
      const minionBugs = MinionsPanel.getCveBugs(version, MINION);
      for (const bug in minionBugs) {
        const tr = Issues.addIssue(pPanel, "minion-bug", minionId + "-" + bug);
        Issues.addIssueMsg(tr, "Minion '" + minionId + "' is vulnerable due to " + bug + Character.NO_BREAK_SPACE + Character.HEAVY_NORTH_EAST_ARROW);
        Issues.addIssueUrl(tr, "CVE report", "https://www.cve.org/CVERecord/SearchResults?query=" + bug);
      }
    }
  }
}
