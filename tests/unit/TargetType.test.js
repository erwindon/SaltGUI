const assert = require("chai").assert;

import {TargetType} from "../../saltgui/static/scripts/TargetType.js";

describe("Unittests for TargetType.js", function() {

  it("test makeTargetText", done => {

    let result;

    // list of target-types from:
    // https://docs.saltstack.com/en/latest/ref/clients/index.html#salt.client.LocalClient.cmd

    // glob - Bash glob completion - Default
    result = TargetType.makeTargetText("glob", "*");
    assert.equal(result, "*");

    // pcre - Perl style regular expression
    result = TargetType.makeTargetText("pcre", ".*");
    assert.equal(result, "pcre .*");

    // list - Python list of hosts
    result = TargetType.makeTargetText("list", "a,b,c");
    assert.equal(result, "a,b,c");

    // grain - Match based on a grain comparison
    result = TargetType.makeTargetText("grain", "os:*");
    assert.equal(result, "grain os:*");

    // grain_pcre - Grain comparison with a regex
    result = TargetType.makeTargetText("grain_pcre", "os:.*");
    assert.equal(result, "grain_pcre os:.*");

    // pillar - Pillar data comparison
    result = TargetType.makeTargetText("pillar", "p1:*");
    assert.equal(result, "pillar p1:*");

    // pillar_pcre - Pillar data comparison with a regex
    result = TargetType.makeTargetText("pillar_pcre", "p1:.*");
    assert.equal(result, "pillar_pcre p1:.*");

    // nodegroup - Match on nodegroup
    result = TargetType.makeTargetText("nodegroup", "ng3");
    assert.equal(result, "nodegroup ng3");

    // range - Use a Range server for matching
    result = TargetType.makeTargetText("range", "a-z");
    assert.equal(result, "range a-z");

    // compound - Pass a compound match string
    result = TargetType.makeTargetText("compound", "webserv* and G@os:Debian or E@web-dc1-srv.*");
    assert.equal(result, "compound webserv* and G@os:Debian or E@web-dc1-srv.*");

    // ipcidr - Match based on Subnet (CIDR notation) or IPv4 address.
    result = TargetType.makeTargetText("ipcidr", "10.0.0.0/24");
    assert.equal(result, "ipcidr 10.0.0.0/24");

    done();
  });

});
