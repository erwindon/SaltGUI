const assert = require('chai').assert;

// create a global window so we can unittest the window.<x> functions
if (!global.window)
  global.window = new Object({});

require('../../saltgui/static/scripts/utils');


describe('Unittests for utils.js', function() {
  
  it('test elapsedToString with valid values', done => {
    const now = new Date();
    let result;

    result = window.elapsedToString(now);
    assert.equal(result, "A few moments ago");

    now.setSeconds(now.getSeconds() - 110);
    result = window.elapsedToString(now);
    assert.equal(result, "A few minutes ago");

    now.setMinutes(now.getMinutes() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "3 minute(s) ago");

    now.setHours(now.getHours() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "1 hour(s) ago");

    now.setHours(now.getHours() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "2 hour(s) ago");

    now.setHours(now.getHours() - 24);
    result = window.elapsedToString(now);
    assert.equal(result, "Yesterday");

    now.setHours(now.getHours() - 240);
    result = window.elapsedToString(now);
    assert.equal(result, "11 days ago");

    now.setHours(now.getHours() - 2400);
    result = window.elapsedToString(now);
    assert.equal(result, "A long time ago, in a galaxy far, far away");

    done();
  });

  it('test elapsedToString with invalid values', done => {
    const now = new Date();
    let result;

    // a time in the future?
    now.setSeconds(now.getSeconds() + 110);
    result = window.elapsedToString(now);
    assert.equal(result, "Magic happened in the future");

    // and something which is not a date at all
    result = window.elapsedToString("I'm not a date");
    assert.equal(result, "It did happen, when I don't know");

    done();
  });

  it('test makeTargetText', done => {

    let result;

    // list of target-types from:
    // https://docs.saltstack.com/en/latest/ref/clients/index.html#salt.client.LocalClient.cmd

    // glob - Bash glob completion - Default
    result = window.makeTargetText("glob", "*");
    assert.equal(result, "*");

    // pcre - Perl style regular expression
    result = window.makeTargetText("pcre", ".*");
    assert.equal(result, "pcre .*");

    // list - Python list of hosts
    result = window.makeTargetText("list", "a,b,c");
    assert.equal(result, "a,b,c");

    // grain - Match based on a grain comparison
    result = window.makeTargetText("grain", "os:*");
    assert.equal(result, "grain os:*");

    // grain_pcre - Grain comparison with a regex
    result = window.makeTargetText("grain_pcre", "os:.*");
    assert.equal(result, "grain_pcre os:.*");

    // pillar - Pillar data comparison
    result = window.makeTargetText("pillar", "p1:*");
    assert.equal(result, "pillar p1:*");

    // pillar_pcre - Pillar data comparison with a regex
    result = window.makeTargetText("pillar_pcre", "p1:.*");
    assert.equal(result, "pillar_pcre p1:.*");

    // nodegroup - Match on nodegroup
    result = window.makeTargetText("nodegroup", "ng3");
    assert.equal(result, "nodegroup ng3");

    // range - Use a Range server for matching
    result = window.makeTargetText("range", "a-z");
    assert.equal(result, "range a-z");

    // compound - Pass a compound match string
    result = window.makeTargetText("compound", "webserv* and G@os:Debian or E@web-dc1-srv.*");
    assert.equal(result, "compound webserv* and G@os:Debian or E@web-dc1-srv.*");

    // ipcidr - Match based on Subnet (CIDR notation) or IPv4 address.
    result = window.makeTargetText("ipcidr", "10.0.0.0/24");
    assert.equal(result, "ipcidr 10.0.0.0/24");

    done();
  });

});
