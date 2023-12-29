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

  it("test makeTargetText", (done) => {

    let result;

    // list of target-types from:
    // https://docs.saltstack.com/en/latest/ref/clients/index.html#salt.client.LocalClient.cmd

    // glob - Bash glob completion - Default
    result = testTargetType("glob", "*");
    assert.equal(result, "*");

    // pcre - Perl style regular expression
    result = testTargetType("pcre", ".*");
    assert.equal(result, "pcre .*");

    // list - Python list of hosts
    result = testTargetType("list", "a,b,c");
    assert.equal(result, "a,b,c");

    // grain - Match based on a grain comparison
    result = testTargetType("grain", "os:*");
    assert.equal(result, "grain os:*");

    // grain_pcre - Grain comparison with a regex
    result = testTargetType("grain_pcre", "os:.*");
    assert.equal(result, "grain_pcre os:.*");

    // pillar - Pillar data comparison
    result = testTargetType("pillar", "p1:*");
    assert.equal(result, "pillar p1:*");

    // pillar_pcre - Pillar data comparison with a regex
    result = testTargetType("pillar_pcre", "p1:.*");
    assert.equal(result, "pillar_pcre p1:.*");

    // nodegroup - Match on nodegroup
    result = testTargetType("nodegroup", "ng3");
    assert.equal(result, "nodegroup ng3");

    // range - Use a Range server for matching
    result = testTargetType("range", "a-z");
    assert.equal(result, "range a-z");

    // compound - Pass a compound match string
    result = testTargetType("compound", "webserv* and G@os:Debian or E@web-dc1-srv.*");
    assert.equal(result, "compound webserv* and G@os:Debian or E@web-dc1-srv.*");

    // ipcidr - Match based on Subnet (CIDR notation) or IPv4 address.
    result = testTargetType("ipcidr", "10.0.0.0/24");
    assert.equal(result, "ipcidr 10.0.0.0/24");

    done();
  });

});
