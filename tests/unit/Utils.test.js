/* global describe it */

import {Utils} from "../../saltgui/static/scripts/Utils.js";
import {assert} from "chai";

describe("Unittests for Utils.js", () => {

  describe("getQueryParam2", () => {
    it("test with no parameters", () => {
      let result = Utils.getQueryParam2("http://host/url", "aap");
      assert.equal(result, undefined);
      result = Utils.getQueryParam2("http://host/url?", "aap");
      assert.equal(result, undefined);
    });

    it("test with one parameter match", () => {
      const result = Utils.getQueryParam2("http://host/url?aap=1", "aap");
      assert.equal(result, "1");
    });

    it("test with one parameter no match", () => {
      const result = Utils.getQueryParam2("http://host/url?aap=1", "noot");
      assert.equal(result, undefined);
    });

    it("test with illegal format", () => {
      let result = Utils.getQueryParam2("http://host/url?aap", "aap");
      assert.equal(result, undefined);
      result = Utils.getQueryParam2("http://host/url?aap=1=2", "aap");
      assert.equal(result, undefined);
    });

    it("test with multiple parameters match", () => {
      let result = Utils.getQueryParam2("http://host/url?aap=1&noot=2", "aap");
      assert.equal(result, "1");
      result = Utils.getQueryParam2("http://host/url?aap=1&noot=2", "noot");
      assert.equal(result, "2");
    });

    it("test with multiple parameters no match", () => {
      const result = Utils.getQueryParam2("http://host/url?aap=1&noot=2", "mies");
      assert.equal(result, undefined);
    });

    it("test with implicit window.location", () => {
      const result = Utils.getQueryParam("lkhlkfhlaskdhfljk");
      assert.equal(result, undefined);
    });
  });

  describe("Storage functions", () => {
    it("test basic", () => {
      Utils.setStorageItem("session", "testkey", "testvalue");
      const result = Utils.getStorageItem("session", "testkey");
      assert.equal(result, "testvalue");
    });

    it("test with default value", () => {
      const result = Utils.getStorageItem("session", "nonexistent", "default");
      assert.equal(result, "default");
    });

    it("test with object", () => {
      Utils.setStorageItem("session", "objkey", JSON.stringify({"a": 1, "b": 2}));
      const result = Utils.getStorageItemObject("session", "objkey");
      assert.deepEqual(result, {"a": 1, "b": 2});
    });

    it("test with non-object JSON", () => {
      Utils.setStorageItem("session", "invalidkey", JSON.stringify("not an object"));
      const result = Utils.getStorageItemObject("session", "invalidkey", {"default": true});
      assert.deepEqual(result, {"default": true});
    });

    it("test with default value", () => {
      const result = Utils.getStorageItemObject("session", "nonexistent");
      assert.deepEqual(result, {});
    });

    it("test with list", () => {
      Utils.setStorageItem("session", "listkey", JSON.stringify([1, 2, 3]));
      const result = Utils.getStorageItemList("session", "listkey");
      assert.deepEqual(result, [1, 2, 3]);
    });

    it("test list with default value", () => {
      const result = Utils.getStorageItemList("session", "nonexistent");
      assert.deepEqual(result, []);
    });

    it("test boolean with true", () => {
      Utils.setStorageItem("session", "boolkey", "true");
      const result = Utils.getStorageItemBoolean("session", "boolkey");
      assert.equal(result, true);
    });

    it("test boolean with false", () => {
      Utils.setStorageItem("session", "boolkey", "false");
      const result = Utils.getStorageItemBoolean("session", "boolkey");
      assert.equal(result, false);
    });

    it("test boolean with default value", () => {
      const result = Utils.getStorageItemBoolean("session", "nonexistent", true);
      assert.equal(result, true);
    });

    it("test boolean with non-boolean JSON", () => {
      Utils.setStorageItem("session", "invalidbool", JSON.stringify("not a boolean"));
      const result = Utils.getStorageItemBoolean("session", "invalidbool", false);
      assert.equal(result, false);
    });

    it("test integer", () => {
      Utils.setStorageItem("session", "intkey", "42");
      const result = Utils.getStorageItemInteger("session", "intkey");
      assert.equal(result, 42);
    });

    it("test integer with default value", () => {
      const result = Utils.getStorageItemInteger("session", "nonexistent", 99);
      assert.equal(result, 99);
    });

    it("test integer with invalid value", () => {
      Utils.setStorageItem("session", "invalidint", "not a number");
      const result = Utils.getStorageItemInteger("session", "invalidint", 10);
      assert.equal(result, 10);
    });
  });

  describe("mySortFunction", () => {
    it("test with strings", () => {
      const arr = ["c", "a", "b"];
      const result = arr.sort(Utils.mySortFunction);
      assert.deepEqual(result, ["a", "b", "c"]);
    });

    it("test with mixed case strings", () => {
      const arr = ["C", "a", "B"];
      const result = arr.sort(Utils.mySortFunction);
      assert.deepEqual(result, ["a", "B", "C"]);
    });
  });

  describe("txtZeroOneMany", () => {
    it("test with zero", () => {
      const result = Utils.txtZeroOneMany(0, "no items", "{0} item", "{0} items");
      assert.equal(result, "no items");
    });

    it("test with one", () => {
      const result = Utils.txtZeroOneMany(1, "no items", "{0} item", "{0} items");
      assert.equal(result, "1 item");
    });

    it("test with many", () => {
      const result = Utils.txtZeroOneMany(5, "no items", "{0} item", "{0} items");
      assert.equal(result, "5 items");
    });
  });

  describe("getIdFromJobId", () => {
    it("test with standard job id", () => {
      const result = Utils.getIdFromJobId("20190529175411210984");
      assert.equal(result, "j20190529175411210984");
    });

    it("test with different number", () => {
      const result = Utils.getIdFromJobId("20180820003411338317");
      assert.equal(result, "j20180820003411338317");
    });
  });

  describe("isMultiLineString", () => {
    it("test with newline", () => {
      const result = Utils.isMultiLineString("line1\nline2");
      assert.equal(result, true);
    });

    it("test with carriage return", () => {
      const result = Utils.isMultiLineString("line1\rline2");
      assert.equal(result, true);
    });

    it("test with both newline and carriage return", () => {
      const result = Utils.isMultiLineString("line1\r\nline2");
      assert.equal(result, true);
    });

    it("test with single line", () => {
      const result = Utils.isMultiLineString("single line");
      assert.equal(result, false);
    });

    it("test with empty string", () => {
      const result = Utils.isMultiLineString("");
      assert.equal(result, false);
    });
  });

});
