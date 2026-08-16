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
      this.removeCategory("minion-older");
      this.removeCategory("minion-newer");
      this.removeCategory("minion-bug");
      this.removeCategory("master-bug");
      this.removeCategory("versions");
      this._handleManageVersions(ok_RunnerManageVersions);
      this.readyCategory(pPanel, "minion-older", msg);
      this.readyCategory(pPanel, "minion-newer", msg);
      this.readyCategory(pPanel, "minion-bug", msg);
      this.readyCategory(pPanel, "master-bug", msg);
      return true;
    }, (_error_RunnerManageVersions) => {
      this.removeCategory("minion-older");
      this.removeCategory("minion-newer");
      this.removeCategory("minion-bug");
      this.removeCategory("master-bug");
      this.setIssueMsg("versions", "retrieving", "Could not retrieve list of versions");
      this.setIssueErr("versions", "retrieving", _error_RunnerManageVersions);
      this.readyCategory(pPanel, "minion-older", msg);
      this.readyCategory(pPanel, "minion-newer", msg);
      this.readyCategory(pPanel, "minion-bug", msg);
      this.readyCategory(pPanel, "master-bug", msg);
      return false;
    });

    return runnerManageVersionsPromise;
  }

  _handleManageVersions (pRunnerManageVersionsData) {
    const versionList = pRunnerManageVersionsData.return[0];
    const masterVersion = versionList["Master"];

    this._addMasterBugIssues(masterVersion);
    this._processCategoryVersions(versionList, masterVersion);
  }

  _addMasterBugIssues (masterVersion) {
    const masterBugs = MinionsPanel.getCveBugs(masterVersion, MASTER);

    for (const bug in masterBugs) {
      this.setIssueMsg("master-bug", bug, "Master is vulnerable due to " + bug + Character.NO_BREAK_SPACE + Character.HEAVY_NORTH_EAST_ARROW);
      this.addIssueUrl("master-bug", bug, "CVE report", "https://www.cve.org/CVERecord/SearchResults?query=" + bug);
    }
  }

  _processCategoryVersions (versionList, masterVersion) {
    for (const cat in versionList) {
      if (cat === "Master") {
        continue;
      }

      const details = versionList[cat];
      this._processCategoryVersionDifferences(cat, details, masterVersion);
      this._processMinionBugIssues(details);
    }
  }

  _processCategoryVersionDifferences (category, details, masterVersion) {
    if (category === "Up to date" || category === "Minion offline") {
      return;
    }

    if (category === "Minion requires update") {
      this._addMinionVersionIssues("minion-older", details, masterVersion, "is older than");
    } else if (category === "Minion newer than master") {
      this._addMinionVersionIssues("minion-newer", details, masterVersion, "is newer than");
    } else {
      this._addUnknownCategoryIssues(category, details, masterVersion);
    }
  }

  _addMinionVersionIssues (issueCategory, details, masterVersion, compareText) {
    for (const [minionId, version] of Object.entries(details)) {
      this.setIssueMsg(issueCategory, minionId, "Minion '" + minionId + "' (" + version + ") " + compareText + " the Master (" + masterVersion + ")");
    }
  }

  _addUnknownCategoryIssues (category, details, masterVersion) {
    for (const [minionId, version] of Object.entries(details)) {
      this.setIssueMsg("minion-newer", minionId, "Minion '" + minionId + "' (" + version + ") vs Master (" + masterVersion + "): " + category);
    }
  }

  _processMinionBugIssues (details) {
    for (const [minionId, version] of Object.entries(details)) {
      const minionBugs = MinionsPanel.getCveBugs(version, MINION);
      for (const bug in minionBugs) {
        const issueId = minionId + "-" + bug;
        this.setIssueMsg("minion-bug", issueId, "Minion '" + minionId + "' is vulnerable due to " + bug + Character.NO_BREAK_SPACE + Character.HEAVY_NORTH_EAST_ARROW);
        this.addIssueUrl("minion-bug", issueId, "CVE report", "https://www.cve.org/CVERecord/SearchResults?query=" + bug);
      }
    }
  }
}
