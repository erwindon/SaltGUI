/* global describe it */

import {Character} from "../../../saltgui/static/scripts/Character.js";
import {OutputHighstate} from "../../../saltgui/static/scripts/output/OutputHighstate.js";
import {OutputHighstateSummaryOriginal} from "../../../saltgui/static/scripts/output/OutputHighstateSummaryOriginal.js";
import {OutputHighstateSummarySaltGui} from "../../../saltgui/static/scripts/output/OutputHighstateSummarySaltGui.js";
import {assert} from "chai";

describe("Unittests for output/OutputHighstate.js", () => {

  describe("isHighStateOutput", () => {
    it("test with valid state.highstate", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with valid state.apply", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.apply", response));
    });

    it("test with valid runner.state.orchestrate", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("runner.state.orchestrate", response));
    });

    it("test with valid runners.state.orchestrate", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("runners.state.orchestrate", response));
    });

    it("test with invalid command", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isFalse(OutputHighstate.isHighStateOutput("test.invalid", response));
    });

    it("test with non-object response", () => {
      assert.isFalse(OutputHighstate.isHighStateOutput("state.highstate", "not an object"));
    });

    it("test with array response", () => {
      assert.isFalse(OutputHighstate.isHighStateOutput("state.highstate", []));
    });

    it("test with invalid task format", () => {
      const response = {
        "invalid_format": {
          "duration": 100,
          "result": true
        }
      };
      assert.isFalse(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with state.low command", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isFalse(OutputHighstate.isHighStateOutput("state.low", response));
    });

    it("test with multiple valid tasks", () => {
      const response = {
        "cmd_|-test1_|-echo test1_|-run": {
          "duration": 100,
          "result": true
        },
        "cmd_|-test2_|-echo test2_|-run": {
          "duration": 150,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with state.sls command", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.sls", response));
    });

    it("test with state.sls_id command", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.sls_id", response));
    });

    it("test with state.high command", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.high", response));
    });

    it("test with runner.state.orchestrate_single command", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("runner.state.orchestrate_single", response));
    });

    it("test with task having wrong component count", () => {
      const response = {
        "cmd_|-test_|-run": {
          "duration": 100,
          "result": true
        }
      };
      assert.isFalse(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with task having 5 components", () => {
      const response = {
        "cmd_|-test_|-echo test_|-run_|-extra": {
          "duration": 100,
          "result": true
        }
      };
      assert.isFalse(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with empty response", () => {
      const response = {};
      assert.isTrue(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with task having exactly 4 components", () => {
      const response = {
        "module_|-id_|-name_|-function": {
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with multiple tasks mixed validity", () => {
      const response = {
        "cmd_|-test1_|-echo test1_|-run": {
          "result": true
        },
        "invalid_format": {
          "result": true
        }
      };
      assert.isFalse(OutputHighstate.isHighStateOutput("state.highstate", response));
    });

    it("test with task names containing underscores", () => {
      const response = {
        "cmd_|-test_name_with_many_|-echo_test_|-run": {
          "result": true
        }
      };
      assert.isTrue(OutputHighstate.isHighStateOutput("state.highstate", response));
    });
  });

});

describe("Unittests for output/OutputHighstateSummaryOriginal.js", () => {

  describe("addPercentage", () => {
    it("test with a value", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(50, 100, "en-US"), "50.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(50, 100, "nl-NL"), "50,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(50, 100, "de-DE"), "50,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(50, 100, "tr-TR"), "%50,0");
    });

    it("test with different value", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(25, 100, "en-US"), "25.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(25, 100, "nl-NL"), "25,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(25, 100, "de-DE"), "25,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(25, 100, "tr-TR"), "%25,0");
    });

    it("test with fractional result", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 3, "en-US"), "33.3%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 3, "nl-NL"), "33,3%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 3, "de-DE"), "33,3" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 3, "tr-TR"), "%33,3");
    });

    it("test with zero count", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(0, 100, "en-US"), "0.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(0, 100, "nl-NL"), "0,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(0, 100, "de-DE"), "0,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(0, 100, "tr-TR"), "%0,0");
    });

    it("test with 100 percent", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(100, 100, "en-US"), "100.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(100, 100, "nl-NL"), "100,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(100, 100, "de-DE"), "100,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(100, 100, "tr-TR"), "%100,0");
    });

    it("test with small fraction", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 100, "en-US"), "1.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 100, "nl-NL"), "1,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 100, "de-DE"), "1,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage(1, 100, "tr-TR"), "%1,0");
    });
  });

});

describe("Unittests for output/OutputHighstateSummarySaltGui.js", () => {

  /* during testing, variable state_output_pct is not in the session-store */
  /* therefore we always assume "state_output_pct: false" */
  /* this leads to a simplified representation */

  describe("addPercentage", () => {
    it("test without percentage", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(50, 100, "en-US"), "50");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(50, 100, "nl-NL"), "50");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(50, 100, "de-DE"), "50");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(50, 100, "tr-TR"), "50");
    });

    it("test with zero count", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(0, 100, "en-US"), "0");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(0, 100, "nl-NL"), "0");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(0, 100, "de-DE"), "0");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(0, 100, "tr-TR"), "0");
    });

    it("test with full count", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(100, 100, "en-US"), "100");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(100, 100, "nl-NL"), "100");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(100, 100, "de-DE"), "100");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(100, 100, "tr-TR"), "100");
    });

    it("test with single item", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(1, 1, "en-US"), "1");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(1, 1, "nl-NL"), "1");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(1, 1, "de-DE"), "1");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage(1, 1, "tr-TR"), "1");
    });
  });

});
