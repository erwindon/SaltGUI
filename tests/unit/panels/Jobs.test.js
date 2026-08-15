/* global describe it */

import {JobsPanel} from "../../../saltgui/static/scripts/panels/Jobs.js";
import {assert} from "chai";

describe("Unittests for panels/Jobs.js", () => {

  describe("jobsToArray", () => {
    it("test with empty object", () => {
      const jobs = {};
      const result = JobsPanel.jobsToArray(jobs);
      assert.deepEqual(result, []);
    });

    it("test with single job", () => {
      const jobs = {
        "20190529175411210984": {
          "fun": "cmd.run",
          "jid": "20190529175411210984"
        }
      };
      const result = JobsPanel.jobsToArray(jobs);
      assert.equal(result.length, 1);
      assert.equal(result[0].id, "20190529175411210984");
      assert.equal(result[0].fun, "cmd.run");
    });

    it("test with multiple jobs", () => {
      const jobs = {
        "20190529175411210984": {fun: "cmd.run"},
        "20190530120000000000": {fun: "state.apply"}
      };
      const result = JobsPanel.jobsToArray(jobs);
      assert.equal(result.length, 2);
      assert.isTrue(result[0].id === "20190529175411210984" || result[0].id === "20190530120000000000");
      assert.isTrue(result[1].id === "20190529175411210984" || result[1].id === "20190530120000000000");
    });
  });

  describe("sortJobs", () => {
    it("test with empty array", () => {
      const jobs = [];
      JobsPanel.sortJobs(jobs);
      assert.deepEqual(jobs, []);
    });

    it("test with single job", () => {
      const jobs = [{id: "20190529175411210984"}];
      JobsPanel.sortJobs(jobs);
      assert.equal(jobs.length, 1);
      assert.equal(jobs[0].id, "20190529175411210984");
    });

    it("test with multiple jobs in descending order", () => {
      const jobs = [
        {id: "20190528000000000000"},
        {id: "20190530000000000000"},
        {id: "20190529000000000000"}
      ];
      JobsPanel.sortJobs(jobs);
      assert.equal(jobs[0].id, "20190530000000000000");
      assert.equal(jobs[1].id, "20190529000000000000");
      assert.equal(jobs[2].id, "20190528000000000000");
    });

    it("test maintains job data integrity", () => {
      const jobs = [
        {fun: "cmd.run", id: "20190528000000000000", status: "complete"},
        {fun: "state.apply", id: "20190529000000000000", status: "running"}
      ];
      JobsPanel.sortJobs(jobs);
      assert.equal(jobs[0].fun, "state.apply");
      assert.equal(jobs[0].status, "running");
      assert.equal(jobs[1].fun, "cmd.run");
      assert.equal(jobs[1].status, "complete");
    });
  });

});
