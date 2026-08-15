/* global describe it beforeEach */

import {HTTPError, API} from "../../saltgui/static/scripts/Api.js";
import {Utils} from "../../saltgui/static/scripts/Utils.js";
import {assert} from "chai";

describe("Unittests for Api.js", () => {

  beforeEach(() => {
    Utils.clearStorage("local");
    Utils.clearStorage("session");
  });

  describe("HTTPError", () => {
    it("test constructor with status and message", () => {
      const error = new HTTPError(404, "Not Found");
      assert.equal(error.status, 404);
      assert.equal(error.message, "Not Found");
    });

    it("test with status 401", () => {
      const error = new HTTPError(401, "Unauthorized");
      assert.equal(error.status, 401);
      assert.equal(error.message, "Unauthorized");
    });

    it("test with status 500", () => {
      const error = new HTTPError(500, "Internal Server Error");
      assert.equal(error.status, 500);
      assert.equal(error.message, "Internal Server Error");
    });

    it("test is instanceof Error", () => {
      const error = new HTTPError(500, "Error");
      assert.instanceOf(error, Error);
    });
  });

  describe("_cleanStorage", () => {
    it("test clears local storage", () => {
      Utils.setStorageItem("local", "testkey", "testvalue");
      API._cleanStorage();
      const result = Utils.getStorageItem("local", "testkey");
      assert.isNull(result);
    });

    it("test clears session storage", () => {
      Utils.setStorageItem("session", "testkey", "testvalue");
      API._cleanStorage();
      const result = Utils.getStorageItem("session", "testkey");
      assert.isNull(result);
    });

    it("test preserves local eauth setting", () => {
      Utils.setStorageItem("local", "eauth", "pam");
      Utils.setStorageItem("local", "otherkey", "othervalue");
      API._cleanStorage();
      const eauth = Utils.getStorageItem("local", "eauth");
      const other = Utils.getStorageItem("local", "otherkey");
      assert.equal(eauth, "pam");
      assert.isNull(other);
    });

    it("test preserves local runtype setting", () => {
      Utils.setStorageItem("local", "runtype", "async");
      Utils.setStorageItem("local", "otherkey", "othervalue");
      API._cleanStorage();
      const runtype = Utils.getStorageItem("local", "runtype");
      const other = Utils.getStorageItem("local", "otherkey");
      assert.equal(runtype, "async");
      assert.isNull(other);
    });

    it("test preserves both eauth and runtype", () => {
      Utils.setStorageItem("local", "eauth", "ldap");
      Utils.setStorageItem("local", "runtype", "normal");
      Utils.setStorageItem("local", "other", "value");
      API._cleanStorage();
      const eauth = Utils.getStorageItem("local", "eauth");
      const runtype = Utils.getStorageItem("local", "runtype");
      const other = Utils.getStorageItem("local", "other");
      assert.equal(eauth, "ldap");
      assert.equal(runtype, "normal");
      assert.isNull(other);
    });

    it("test handles missing eauth gracefully", () => {
      Utils.setStorageItem("local", "runtype", "async");
      API._cleanStorage();
      const eauth = Utils.getStorageItem("local", "eauth");
      const runtype = Utils.getStorageItem("local", "runtype");
      assert.isNull(eauth);
      assert.equal(runtype, "async");
    });

    it("test handles missing runtype gracefully", () => {
      Utils.setStorageItem("local", "eauth", "pam");
      API._cleanStorage();
      const eauth = Utils.getStorageItem("local", "eauth");
      const runtype = Utils.getStorageItem("local", "runtype");
      assert.equal(eauth, "pam");
      assert.isNull(runtype);
    });
  });

});
