/* global describe it */

import {StatsPanel} from "../../../saltgui/static/scripts/panels/Stats.js";
import {Character} from "../../../saltgui/static/scripts/Character.js";
import {assert} from "chai";

Character.init();

describe("Unittests for panels/Stats.js", () => {

  describe("_hasNonZeroStats", () => {

    it("test with all zero stats", () => {
      const thread = {
        "Accepts": 0,
        "Connections": 0,
        "Enabled": 1
      };
      const result = StatsPanel._hasNonZeroStats(thread);
      assert.equal(result, false);
    });

    it("test with non-zero stat", () => {
      const thread = {
        "Accepts": 0,
        "Connections": 5,
        "Enabled": 1
      };
      const result = StatsPanel._hasNonZeroStats(thread);
      assert.equal(result, true);
    });

    it("test with multiple non-zero stats", () => {
      const thread = {
        "Accepts": 10,
        "Connections": 5,
        "Enabled": 1
      };
      const result = StatsPanel._hasNonZeroStats(thread);
      assert.equal(result, true);
    });

    it("test with empty object", () => {
      const thread = {};
      const result = StatsPanel._hasNonZeroStats(thread);
      assert.equal(result, false);
    });

    it("test with only Enabled property", () => {
      const thread = {
        "Enabled": 1
      };
      const result = StatsPanel._hasNonZeroStats(thread);
      assert.equal(result, false);
    });

    it("test ignores Enabled property for stats", () => {
      const thread = {
        "Enabled": 99
      };
      const result = StatsPanel._hasNonZeroStats(thread);
      assert.equal(result, false);
    });

  });

  describe("_filterZeroThreads", () => {

    it("test with single thread (skipped)", () => {
      const workerThreads = {
        "MainThread": {Connections: 5}
      };
      StatsPanel._filterZeroThreads(workerThreads);
      assert.deepEqual(workerThreads, {
        "MainThread": {Connections: 5}
      });
    });

    it("test with multiple threads - all non-zero", () => {
      const workerThreads = {
        "MainThread": {Connections: 5},
        "Thread-1": {Connections: 3},
        "Thread-2": {Connections: 2}
      };
      StatsPanel._filterZeroThreads(workerThreads);
      // All have non-zero Connections, so none are replaced
      assert.isObject(workerThreads["MainThread"]);
      assert.isObject(workerThreads["Thread-1"]);
      assert.isObject(workerThreads["Thread-2"]);
    });

    it("test with zero-stat thread replaced by ellipsis", () => {
      const workerThreads = {
        "MainThread": {Connections: 5},
        "Thread-1": {Connections: 0, Enabled: 1},
        "Thread-2": {Connections: 2}
      };
      StatsPanel._filterZeroThreads(workerThreads);
      assert.equal(workerThreads["MainThread"].Connections, 5);
      assert.equal(workerThreads["Thread-1"], Character.HORIZONTAL_ELLIPSIS);
      assert.equal(workerThreads["Thread-2"].Connections, 2);
    });

    it("test with all zero stats except MainThread", () => {
      const workerThreads = {
        "MainThread": {Connections: 5},
        "Thread-1": {Connections: 0, Enabled: 1},
        "Thread-2": {Connections: 0, Enabled: 1}
      };
      StatsPanel._filterZeroThreads(workerThreads);
      assert.equal(workerThreads["MainThread"].Connections, 5);
      assert.equal(workerThreads["Thread-1"], Character.HORIZONTAL_ELLIPSIS);
      assert.equal(workerThreads["Thread-2"], Character.HORIZONTAL_ELLIPSIS);
    });

    it("test sorting of thread names", () => {
      const workerThreads = {
        "AppleThread": {Connections: 0, Enabled: 1},
        "MainThread": {Connections: 1},
        "ZebraThread": {Connections: 0, Enabled: 1}
      };
      StatsPanel._filterZeroThreads(workerThreads);
      // First thread in sorted order is skipped (AppleThread)
      // So only ZebraThread should be replaced
      assert.equal(typeof workerThreads["AppleThread"], "object");
      assert.equal(workerThreads["ZebraThread"], Character.HORIZONTAL_ELLIPSIS);
    });

  });

  describe("_processWorkerThreads", () => {

    it("test with no Worker Threads key", () => {
      const statsData = {
        "CherryPy Applications": {}
      };
      StatsPanel._processWorkerThreads(statsData);
      assert.deepEqual(statsData, {
        "CherryPy Applications": {}
      });
    });

    it("test with Worker Threads present", () => {
      const statsData = {
        "section1": {
          "Worker Threads": {
            "MainThread": {Connections: 5},
            "Thread-1": {Connections: 0, Enabled: 1}
          }
        }
      };
      StatsPanel._processWorkerThreads(statsData);
      // After processing, first thread in sorted order is skipped
      // MainThread comes before Thread-1 in sort order, so Thread-1 is replaced
      assert.equal(statsData["section1"]["Worker Threads"]["MainThread"].Connections, 5);
      assert.equal(statsData["section1"]["Worker Threads"]["Thread-1"], Character.HORIZONTAL_ELLIPSIS);
    });

    it("test preserves CherryPy Applications", () => {
      const statsData = {
        "CherryPy Applications": {app: "data"},
        "section1": {
          "Worker Threads": {
            "MainThread": {Connections: 5}
          }
        }
      };
      StatsPanel._processWorkerThreads(statsData);
      assert.deepEqual(statsData["CherryPy Applications"], {app: "data"});
    });

  });

  describe("_processCherryPyApplications", () => {

    it("test with no CherryPy Applications key", () => {
      const statsData = {
        "other_key": {}
      };
      // Should complete without error
      StatsPanel._processCherryPyApplications(statsData);
      assert.isDefined(statsData["other_key"]);
    });

  });

});
