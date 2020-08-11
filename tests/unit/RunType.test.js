/* global describe it beforeEach */

import {RunType} from "../../saltgui/static/scripts/RunType.js";
import {Utils} from "../../saltgui/static/scripts/Utils.js";
import {assert} from "chai";

describe("Unittests for RunType.js", () => {

  beforeEach(() => {
    Utils.clearStorage("local");
    RunType.menuRunType = {
      _defaultValue: undefined,
      _value: null,
      getValue () {
        if (this._value === null) {
          return this._defaultValue;
        }
        return this._value;
      },
      menuDropdownContent: {children: []},
      setDefaultValue (pDefaultValue) {
        this._defaultValue = pDefaultValue;
      },
      setTitle: () => {},
      setValue (pValue) {
        this._value = pValue;
      }
    };
  });

  describe("getRunType", () => {
    it("test with no stored value defaults to normal", () => {
      const result = RunType.getRunType();
      assert.equal(result, "normal");
    });

    it("test with stored normal value", () => {
      Utils.setStorageItem("local", "runtype", "normal");
      const result = RunType.getRunType();
      assert.equal(result, "normal");
    });

    it("test with stored async value", () => {
      Utils.setStorageItem("local", "runtype", "async");
      const result = RunType.getRunType();
      assert.equal(result, "async");
    });

    it("test menu value takes precedence over storage", () => {
      Utils.setStorageItem("local", "runtype", "normal");
      RunType.menuRunType._value = "async";
      const result = RunType.getRunType();
      assert.equal(result, "async");
    });
  });

  describe("setRunTypeDefault", () => {
    it("test with no prior stored value uses normal", () => {
      RunType.setRunTypeDefault();
      const stored = Utils.getStorageItem("local", "runtype");
      assert.equal(stored, "normal");
    });

    it("test preserves previously stored async", () => {
      Utils.setStorageItem("local", "runtype", "async");
      RunType.setRunTypeDefault();
      const stored = Utils.getStorageItem("local", "runtype");
      assert.equal(stored, "async");
    });

    it("test with invalid stored value resets to normal", () => {
      Utils.setStorageItem("local", "runtype", "invalid");
      RunType.setRunTypeDefault();
      const stored = Utils.getStorageItem("local", "runtype");
      assert.equal(stored, "normal");
    });

    it("test with empty string defaults to normal", () => {
      Utils.setStorageItem("local", "runtype", "");
      RunType.setRunTypeDefault();
      const stored = Utils.getStorageItem("local", "runtype");
      assert.equal(stored, "normal");
    });
  });

});
