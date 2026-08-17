/* global describe it beforeEach */

import {Issues} from "../../../saltgui/static/scripts/issues/Issues.js";
import {assert} from "chai";

describe("Unittests for Issues.js", () => {

  let issues;

  beforeEach(() => {
    issues = new Issues();
  });

  describe("addIssue", () => {
    it("test creates new category and issue", () => {
      const result = issues.addIssue("security", "ssl_cert");
      assert.isObject(result);
      assert.deepEqual(result, {
        commands: [],
        errorMsg: null,
        message: "",
        navigations: [],
        urls: []
      });
    });

    it("test returns existing issue without duplication", () => {
      const first = issues.addIssue("security", "ssl_cert");
      first.message = "Custom message";
      const second = issues.addIssue("security", "ssl_cert");
      assert.equal(second.message, "Custom message");
    });

    it("test adds multiple issues to same category", () => {
      issues.addIssue("security", "cert1");
      issues.addIssue("security", "cert2");
      assert.equal(issues.issuesData.get("security").size, 2);
    });

    it("test adds issues to multiple categories", () => {
      issues.addIssue("security", "cert");
      issues.addIssue("performance", "slow");
      assert.equal(issues.issuesData.size, 2);
      assert.isTrue(issues.issuesData.has("security"));
      assert.isTrue(issues.issuesData.has("performance"));
    });
  });

  describe("removeIssue", () => {
    it("test removes existing issue", () => {
      issues.addIssue("security", "cert");
      issues.removeIssue("security", "cert");
      assert.equal(issues.issuesData.get("security").size, 0);
    });

    it("test ignores remove of non-existent issue", () => {
      issues.addIssue("security", "cert");
      issues.removeIssue("security", "nonexistent");
      assert.equal(issues.issuesData.get("security").size, 1);
    });

    it("test ignores remove of non-existent category", () => {
      issues.removeIssue("nonexistent", "issue");
      assert.equal(issues.issuesData.size, 0);
    });
  });

  describe("removeCategory", () => {
    it("test removes entire category", () => {
      issues.addIssue("security", "cert1");
      issues.addIssue("security", "cert2");
      issues.removeCategory("security");
      assert.equal(issues.issuesData.size, 0);
    });

    it("test ignores remove of non-existent category", () => {
      issues.addIssue("security", "cert");
      issues.removeCategory("nonexistent");
      assert.equal(issues.issuesData.size, 1);
    });
  });

  describe("setIssueMsg", () => {
    it("test sets message on new issue", () => {
      issues.setIssueMsg("security", "cert", "Certificate expired");
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.message, "Certificate expired");
    });

    it("test updates message on existing issue", () => {
      issues.setIssueMsg("security", "cert", "First message");
      issues.setIssueMsg("security", "cert", "Updated message");
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.message, "Updated message");
    });
  });

  describe("setIssueErr", () => {
    it("test sets error message on new issue", () => {
      issues.setIssueErr("network", "timeout", "Connection timeout");
      const issue = issues.issuesData.get("network").get("timeout");
      assert.equal(issue.errorMsg, "Connection timeout");
    });

    it("test updates error message on existing issue", () => {
      issues.setIssueErr("network", "timeout", "Error 1");
      issues.setIssueErr("network", "timeout", "Error 2");
      const issue = issues.issuesData.get("network").get("timeout");
      assert.equal(issue.errorMsg, "Error 2");
    });
  });

  describe("addIssueCmd", () => {
    it("test adds command to issue", () => {
      issues.addIssueCmd("security", "cert", "Fix cert", "*", "cmd.run");
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.commands.length, 1);
      assert.deepEqual(issue.commands[0], {
        command: "cmd.run",
        target: "*",
        title: "Fix cert"
      });
    });

    it("test adds multiple commands to same issue", () => {
      issues.addIssueCmd("security", "cert", "Fix 1", "*", "cmd1");
      issues.addIssueCmd("security", "cert", "Fix 2", "*", "cmd2");
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.commands.length, 2);
    });
  });

  describe("addIssueNav", () => {
    it("test adds navigation to issue", () => {
      issues.addIssueNav("security", "cert", "certificates", {id: "cert123"});
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.navigations.length, 1);
      assert.deepEqual(issue.navigations[0], {
        args: {id: "cert123"},
        page: "certificates"
      });
    });

    it("test adds multiple navigations to same issue", () => {
      issues.addIssueNav("security", "cert", "page1", {});
      issues.addIssueNav("security", "cert", "page2", {});
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.navigations.length, 2);
    });
  });

  describe("addIssueUrl", () => {
    it("test adds URL to issue", () => {
      issues.addIssueUrl("security", "cert", "Documentation", "https://example.com/cert");
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.urls.length, 1);
      assert.deepEqual(issue.urls[0], {
        title: "Documentation",
        url: "https://example.com/cert"
      });
    });

    it("test adds multiple URLs to same issue", () => {
      issues.addIssueUrl("security", "cert", "Doc", "https://example.com/1");
      issues.addIssueUrl("security", "cert", "Forum", "https://example.com/2");
      const issue = issues.issuesData.get("security").get("cert");
      assert.equal(issue.urls.length, 2);
    });
  });

});
