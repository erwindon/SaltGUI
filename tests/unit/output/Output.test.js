/* global describe it beforeEach */

import {Output} from "../../../saltgui/static/scripts/output/Output.js";
import {Utils} from "../../../saltgui/static/scripts/Utils.js";
import {assert} from "chai";

describe("Unittests for output/Output.js", () => {

  beforeEach(() => {
    Utils.clearStorage("session");
    Utils.clearStorage("local");
  });

  describe("isOutputFormatAllowed", () => {
    it("test with default formats", () => {
      const result = Output.isOutputFormatAllowed("json");
      assert.equal(result, true);
    });

    it("test with doc format", () => {
      const result = Output.isOutputFormatAllowed("doc");
      assert.equal(result, true);
    });

    it("test with saltguihighstate format", () => {
      const result = Output.isOutputFormatAllowed("saltguihighstate");
      assert.equal(result, true);
    });

    it("test with custom formats", () => {
      Utils.setStorageItem("session", "output_formats", "custom,other");
      const result = Output.isOutputFormatAllowed("custom");
      assert.equal(result, true);
    });

    it("test with non-matching format", () => {
      Utils.setStorageItem("session", "output_formats", "doc,json");
      const result = Output.isOutputFormatAllowed("yaml");
      assert.equal(result, false);
    });
  });

  describe("isStateOutputSelected", () => {
    it("test with default full", () => {
      const result = Output.isStateOutputSelected("full");
      assert.equal(result, true);
    });

    it("test with terse", () => {
      Utils.setStorageItem("session", "state_output", "terse");
      const result = Output.isStateOutputSelected("terse");
      assert.equal(result, true);
    });

    it("test with non-matching state", () => {
      Utils.setStorageItem("session", "state_output", "terse");
      const result = Output.isStateOutputSelected("full");
      assert.equal(result, false);
    });
  });

  describe("_addVirtualMinion", () => {
    it("test with runners command", () => {
      const response = {test: "data"};
      const result = Output._addVirtualMinion(response, "runners.jobs.active");
      assert.deepEqual(result, {RUNNER: {test: "data"}});
    });

    it("test with wheel command", () => {
      const response = {test: "data"};
      const result = Output._addVirtualMinion(response, "wheel.key.list");
      assert.deepEqual(result, {WHEEL: {test: "data"}});
    });

    it("test with regular command", () => {
      const response = {test: "data"};
      const result = Output._addVirtualMinion(response, "cmd.run");
      assert.deepEqual(result, {test: "data"});
    });
  });

  describe("_hasProperties", () => {
    it("test with all properties present", () => {
      const obj = {aa: 1, bb: 2, cc: 3};
      const result = Output._hasProperties(obj, ["aa", "bb"]);
      assert.equal(result, true);
    });

    it("test with missing properties", () => {
      const obj = {aa: 1, bb: 2};
      const result = Output._hasProperties(obj, ["aa", "xx"]);
      assert.equal(result, false);
    });

    it("test with empty property array", () => {
      const obj = {aa: 1};
      const result = Output._hasProperties(obj, []);
      assert.equal(result, true);
    });
  });

  describe("_isAsyncOutput", () => {
    it("test with valid async response", () => {
      const response = {jid: "123", minions: ["a", "b"]};
      const result = Output._isAsyncOutput(response);
      assert.equal(result, true);
    });

    it("test with invalid response (wrong keys)", () => {
      const response = {jid: "123", other: "value"};
      const result = Output._isAsyncOutput(response);
      assert.equal(result, false);
    });

    it("test with single key", () => {
      const response = {jid: "123"};
      const result = Output._isAsyncOutput(response);
      assert.equal(result, false);
    });

    it("test with three keys", () => {
      const response = {extra: "data", jid: "123", minions: []};
      const result = Output._isAsyncOutput(response);
      assert.equal(result, false);
    });
  });

  describe("_nDigits", () => {
    it("test with fewer digits than required", () => {
      const result = Output._nDigits(5, 3);
      assert.equal(result, "005");
    });

    it("test with exact number of digits", () => {
      const result = Output._nDigits(123, 3);
      assert.equal(result, "123");
    });

    it("test with more digits than required", () => {
      const result = Output._nDigits(12345, 3);
      assert.equal(result, "12345");
    });

    it("test with zero", () => {
      const result = Output._nDigits(0, 2);
      assert.equal(result, "00");
    });
  });

  describe("getDuration", () => {
    it("test with milliseconds", () => {
      const result = Output.getDuration(500);
      assert.isString(result);
      assert.isTrue(result.includes("s"));
    });

    it("test with seconds", () => {
      const result = Output.getDuration(1500);
      assert.isString(result);
      assert.isTrue(result.includes("s"));
    });

    it("test with minutes", () => {
      const result = Output.getDuration(65000);
      assert.isString(result);
    });
  });

  describe("isHiddenTask", () => {
    it("test with successful task and no changes", () => {
      Utils.setStorageItem("session", "state_verbose", "false");
      const task = {result: true};
      const result = Output.isHiddenTask(task);
      assert.equal(result, true);
    });

    it("test with successful task and empty changes object", () => {
      Utils.setStorageItem("session", "state_verbose", "false");
      const task = {changes: {}, result: true};
      const result = Output.isHiddenTask(task);
      assert.equal(result, true);
    });

    it("test with verbose mode on", () => {
      Utils.setStorageItem("session", "state_verbose", "true");
      const task = {changes: {}, result: true};
      const result = Output.isHiddenTask(task);
      assert.equal(result, false);
    });

    it("test with failed task", () => {
      Utils.setStorageItem("session", "state_verbose", "false");
      const task = {changes: {}, result: false};
      const result = Output.isHiddenTask(task);
      assert.equal(result, false);
    });

    it("test with changes present", () => {
      Utils.setStorageItem("session", "state_verbose", "false");
      const task = {changes: {aa: 1}, result: true};
      const result = Output.isHiddenTask(task);
      assert.equal(result, false);
    });
  });

  describe("getTaskNrChanges", () => {
    it("test with changes", () => {
      const task = {changes: {aa: 1, bb: 2, cc: 3}};
      const result = Output.getTaskNrChanges(task);
      assert.isAtLeast(result, 0);
    });

    it("test without changes", () => {
      const task = {result: "success"};
      const result = Output.getTaskNrChanges(task);
      assert.equal(result, 0);
    });
  });

  describe("getIsSuccess", () => {
    it("test with retcode 0", () => {
      const response = {retcode: 0};
      const result = Output.getIsSuccess(response);
      assert.equal(result, true);
    });

    it("test with retcode non-zero", () => {
      const response = {retcode: 1};
      const result = Output.getIsSuccess(response);
      assert.equal(result, false);
    });

    it("test with Error property", () => {
      const response = {Error: "Job not found"};
      const result = Output.getIsSuccess(response);
      assert.equal(result, false);
    });

    it("test with return and success true", () => {
      const response = {return: "value", success: true};
      const result = Output.getIsSuccess(response);
      assert.equal(result, true);
    });

    it("test with return and success false", () => {
      const response = {return: "value", success: false};
      const result = Output.getIsSuccess(response);
      assert.equal(result, false);
    });

    it("test with default case (no recognized fields)", () => {
      const response = {output: "some data"};
      const result = Output.getIsSuccess(response);
      assert.equal(result, true);
    });
  });

});
