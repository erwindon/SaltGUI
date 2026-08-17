/* global describe it beforeEach */

import {Documentation} from "../../saltgui/static/scripts/Documentation.js";
import {assert} from "chai";

describe("Unittests for Documentation.js", () => {

  beforeEach(() => {
    // Reset PROVIDERS for each test
    Documentation.PROVIDERS = {};
  });

  describe("_getKeywordFragments", () => {
    it("test with empty command line", () => {
      const result = Documentation._getKeywordFragments("");
      assert.deepEqual(result, ["modules"]);
    });

    it("test with single module command", () => {
      const result = Documentation._getKeywordFragments("test.echo hello");
      assert.deepEqual(result, ["modules", "test", "echo"]);
    });

    it("test with runners prefix", () => {
      const result = Documentation._getKeywordFragments("runners.jobs.list");
      assert.deepEqual(result, ["runners", "jobs", "list"]);
    });

    it("test with wheel prefix", () => {
      const result = Documentation._getKeywordFragments("wheel.key.finger");
      assert.deepEqual(result, ["wheel", "key", "finger"]);
    });

    it("test with modules prefix explicit", () => {
      const result = Documentation._getKeywordFragments("modules.test.echo");
      assert.deepEqual(result, ["modules", "test", "echo"]);
    });

    it("test with trailing dots removed", () => {
      const result = Documentation._getKeywordFragments("test.echo...");
      assert.deepEqual(result, ["modules", "test", "echo"]);
    });

    it("test with unknown category becomes modules", () => {
      const result = Documentation._getKeywordFragments("unknown.category.command");
      assert.deepEqual(result, ["modules", "unknown", "category", "command"]);
    });
  });

  describe("_correctProviderKey", () => {
    it("test with simple key and value", () => {
      const result = Documentation._correctProviderKey("pkg", "apt");
      assert.equal(result, "pkg");
    });

    it("test removes cpython-35 suffix", () => {
      const result = Documentation._correctProviderKey("key.cpython-35", "value");
      assert.equal(result, "key");
    });

    it("test applies known Windows correction for vsphere", () => {
      const result = Documentation._correctProviderKey("__init__", "vsphere");
      assert.equal(result, "vsphere");
    });

    it("test applies known Windows correction for win_lgpo", () => {
      const result = Documentation._correctProviderKey("configparser", "lgpo");
      assert.equal(result, "win_lgpo");
    });

    it("test applies known Windows correction for win_pkg", () => {
      const result = Documentation._correctProviderKey("functools", "pkg");
      assert.equal(result, "win_pkg");
    });

    it("test handles travisci module misreporting with parse", () => {
      const result = Documentation._correctProviderKey("parse", "travisci");
      assert.equal(result, "travisci");
    });

    it("test handles travisci module misreporting with urlparse", () => {
      const result = Documentation._correctProviderKey("urlparse", "travisci");
      assert.equal(result, "travisci");
    });
  });

  describe("_addProvider", () => {
    it("test adds provider to empty PROVIDERS", () => {
      Documentation._addProvider("module_name", "provider_key");
      assert.deepEqual(Documentation.PROVIDERS["module_name"], ["provider_key"]);
    });

    it("test prevents duplicate providers", () => {
      Documentation._addProvider("module", "key");
      Documentation._addProvider("module", "key");
      assert.deepEqual(Documentation.PROVIDERS["module"], ["key"]);
    });

    it("test adds multiple providers to same module", () => {
      Documentation._addProvider("module", "key1");
      Documentation._addProvider("module", "key2");
      assert.deepEqual(Documentation.PROVIDERS["module"], ["key1", "key2"]);
    });

    it("test maintains order of insertion", () => {
      Documentation._addProvider("mod", "first");
      Documentation._addProvider("mod", "second");
      Documentation._addProvider("mod", "third");
      assert.deepEqual(Documentation.PROVIDERS["mod"], ["first", "second", "third"]);
    });
  });

});
