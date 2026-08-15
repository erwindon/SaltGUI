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
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("en-US", 50, 100), "50.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("nl-NL", 50, 100), "50,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("de-DE", 50, 100), "50,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("tr-TR", 50, 100), "%50,0");
    });

    it("test with different value", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("en-US", 25, 100), "25.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("nl-NL", 25, 100), "25,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("de-DE", 25, 100), "25,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("tr-TR", 25, 100), "%25,0");
    });

    it("test with fractional result", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("en-US", 1, 3), "33.3%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("nl-NL", 1, 3), "33,3%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("de-DE", 1, 3), "33,3" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("tr-TR", 1, 3), "%33,3");
    });

    it("test with zero count", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("en-US", 0, 100), "0.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("nl-NL", 0, 100), "0,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("de-DE", 0, 100), "0,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("tr-TR", 0, 100), "%0,0");
    });

    it("test with 100 percent", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("en-US", 100, 100), "100.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("nl-NL", 100, 100), "100,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("de-DE", 100, 100), "100,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("tr-TR", 100, 100), "%100,0");
    });

    it("test with small fraction", () => {
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("en-US", 1, 100), "1.0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("nl-NL", 1, 100), "1,0%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("de-DE", 1, 100), "1,0" + Character.NO_BREAK_SPACE + "%");
      assert.equal(OutputHighstateSummaryOriginal.addPercentage("tr-TR", 1, 100), "%1,0");
    });
  });

});

describe("Unittests for output/OutputHighstateSummarySaltGui.js", () => {

  /* during testing, variable state_output_pct is not in the session-store */
  /* therefore we always assume "state_output_pct: false" */
  /* this leads to a simplified representation */

  describe("addPercentage", () => {
    it("test without percentage", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("en-US", 50, 100), "50");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("nl-NL", 50, 100), "50");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("de-DE", 50, 100), "50");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("tr-TR", 50, 100), "50");
    });

    it("test with zero count", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("en-US", 0, 100), "0");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("nl-NL", 0, 100), "0");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("de-DE", 0, 100), "0");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("tr-TR", 0, 100), "0");
    });

    it("test with full count", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("en-US", 100, 100), "100");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("nl-NL", 100, 100), "100");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("de-DE", 100, 100), "100");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("tr-TR", 100, 100), "100");
    });

    it("test with single item", () => {
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("en-US", 1, 1), "1");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("nl-NL", 1, 1), "1");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("de-DE", 1, 1), "1");
      assert.equal(OutputHighstateSummarySaltGui.addPercentage("tr-TR", 1, 1), "1");
    });
  });

});
