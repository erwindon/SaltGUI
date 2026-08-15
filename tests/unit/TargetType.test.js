/* global describe it */

import {TargetType} from "../../saltgui/static/scripts/TargetType.js";
import {assert} from "chai";

/* eslint-disable func-names */
const testTargetType = function (targetType, targetPattern) {
  const obj = {};
  obj["Target-type"] = targetType;
  obj.Target = targetPattern;
  return TargetType.makeTargetText(obj);
};
/* eslint-enable func-names */

describe("Unittests for TargetType.js", () => {

  describe("makeTargetText", () => {
    it("test with glob target", () => {
      const result = testTargetType("glob", "*");
      assert.equal(result, "*");
    });

    it("test with pcre target", () => {
      const result = testTargetType("pcre", ".*");
      assert.equal(result, "pcre .*");
    });

    it("test with list target", () => {
      const result = testTargetType("list", "a,b,c");
      assert.equal(result, "a,b,c");
    });

    it("test with grain target", () => {
      const result = testTargetType("grain", "os:*");
      assert.equal(result, "grain os:*");
    });

    it("test with grain_pcre target", () => {
      const result = testTargetType("grain_pcre", "os:.*");
      assert.equal(result, "grain_pcre os:.*");
    });

    it("test with pillar target", () => {
      const result = testTargetType("pillar", "p1:*");
      assert.equal(result, "pillar p1:*");
    });

    it("test with pillar_pcre target", () => {
      const result = testTargetType("pillar_pcre", "p1:.*");
      assert.equal(result, "pillar_pcre p1:.*");
    });

    it("test with nodegroup target", () => {
      const result = testTargetType("nodegroup", "ng3");
      assert.equal(result, "nodegroup ng3");
    });

    it("test with range target", () => {
      const result = testTargetType("range", "a-z");
      assert.equal(result, "range a-z");
    });

    it("test with compound target", () => {
      const result = testTargetType("compound", "webserv* and G@os:Debian or E@web-dc1-srv.*");
      assert.equal(result, "compound webserv* and G@os:Debian or E@web-dc1-srv.*");
    });

    it("test with ipcidr target", () => {
      const result = testTargetType("ipcidr", "10.0.0.0/24");
      assert.equal(result, "ipcidr 10.0.0.0/24");
    });
  });

  describe("getTargetTypeFromTarget", () => {
    it("test with array", () => {
      const result = TargetType.getTargetTypeFromTarget(["host1", "host2"]);
      assert.equal(result, "list");
    });

    it("test with compound target containing @", () => {
      const result = TargetType.getTargetTypeFromTarget("L@host1 and G@os:debian");
      assert.equal(result, "compound");
    });

    it("test with compound target containing space", () => {
      const result = TargetType.getTargetTypeFromTarget("host 1");
      assert.equal(result, "compound");
    });

    it("test with compound target containing parentheses", () => {
      const result = TargetType.getTargetTypeFromTarget("(G@os:linux)");
      assert.equal(result, "compound");
    });

    it("test with list target", () => {
      const result = TargetType.getTargetTypeFromTarget("host1,host2,host3");
      assert.equal(result, "list");
    });

    it("test with nodegroup", () => {
      const result = TargetType.getTargetTypeFromTarget("#mygroup");
      assert.equal(result, "nodegroup");
    });

    it("test with glob", () => {
      const result = TargetType.getTargetTypeFromTarget("host*");
      assert.equal(result, "glob");
    });

    it("test with simple hostname", () => {
      const result = TargetType.getTargetTypeFromTarget("host1");
      assert.equal(result, "glob");
    });
  });

});
