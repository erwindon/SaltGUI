const assert = require('chai').assert;

// create a global window so we can unittest the window.<x> functions
if (!global.window)
  global.window = new Object({});

require('../../saltgui/static/scripts/parsecmdline');


describe('Unittests for parsecmdline.js', function() {

  it('test parseCommandLine', done => {
    let args = [], params = {}, result;

    // GENERAL ERROR HANDLING

    // null means: it was all ok
    args = []; params = {};
    result = window.parseCommandLine("test", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "test");
    assert.equal(Object.keys(params).length, 0);

    // broken json will return a readable error message
    args = []; params = {};
    result = window.parseCommandLine("{\"test\"", args, params);
    assert.equal(result, "No valid dictionary found");

    // GENERAL WHITESPACE HANDLING

    args = []; params = {};
    result = window.parseCommandLine(" name=true", args, params);
    assert.isNull(result);
    assert.equal(args.length, 0);
    assert.equal(Object.keys(params).length, 1);
    assert.equal(params.name, true);

    args = []; params = {};
    result = window.parseCommandLine("name=true ", args, params);
    assert.isNull(result);
    assert.equal(args.length, 0);
    assert.equal(Object.keys(params).length, 1);
    assert.equal(params.name, true);

    // NAMED PARAMETERS

    // name-value-pair without value is not ok
    args = []; params = {};
    result = window.parseCommandLine("test=", args, params);
    assert.equal(result, "Must have value for named parameter 'test'");

    // name-value-pair without value is not ok
    // make sure it does not confuse it with furher parameters
    args = []; params = {};
    result = window.parseCommandLine("test= arg2 arg3", args, params);
    assert.equal(result, "Must have value for named parameter 'test'");

    // DICTIONARY

    // a regular dictionary
    args = []; params = {};
    result = window.parseCommandLine("{\"a\":1}", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.deepEqual(args[0], {"a":1});
    assert.equal(Object.keys(params).length, 0);

    // a broken dictionary
    args = []; params = {};
    result = window.parseCommandLine("{\"a}\":1", args, params);
    assert.equal(result, "No valid dictionary found");

    // a regular dictionary with } in its name
    // test that the parser is not confused
    args = []; params = {};
    result = window.parseCommandLine("{\"a}\":1}", args, params);
    assert.equal(result, null);

    // a regular dictionary with } after its value
    args = []; params = {};
    result = window.parseCommandLine("{\"a}\":1}}", args, params);
    assert.equal(result, "Valid dictionary, but followed by text:}...");

    // ARRAYS

    // a simple array
    args = []; params = {};
    result = window.parseCommandLine("[1,2]", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.deepEqual(args[0], [1,2]);
    assert.equal(Object.keys(params).length, 0);

    // a simple array that is not closed
    args = []; params = {};
    result = window.parseCommandLine("[1,2", args, params);
    assert.equal(result, "No valid array found");

    // STRINGS WITHOUT QUOTES

    // a simple string
    args = []; params = {};
    result = window.parseCommandLine("string", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "string");
    assert.equal(Object.keys(params).length, 0);

    // a number that looks like a jobid
    args = []; params = {};
    result = window.parseCommandLine("20180820003411338317", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "20180820003411338317");
    assert.equal(Object.keys(params).length, 0);

    // DOUBLE-QUOTED-STRINGS

    // a simple string
    args = []; params = {};
    result = window.parseCommandLine("\"string\"", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "string");
    assert.equal(Object.keys(params).length, 0);

    // an unclosed string
    args = []; params = {};
    result = window.parseCommandLine("\"string", args, params);
    assert.equal(result, "No valid double-quoted-string found");

    // SINGLE-QUOTED-STRINGS (never supported!)

    // a single-quoted string is not supported
    // it evalueates as a string (the whole thing)
    args = []; params = {};
    result = window.parseCommandLine("\'string\'", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], "\'string\'");
    assert.equal(Object.keys(params).length, 0);

    // a single-quoted string is not supported
    // it evalueates as a string (the whole thing)
    // even when that looks rediculous
    args = []; params = {};
    result = window.parseCommandLine("\'string", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], "\'string");
    assert.equal(Object.keys(params).length, 0);

    // INTEGER

    args = []; params = {};
    result = window.parseCommandLine("0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);

    // an integer that almost looks like a jobid, but one digit less
    args = []; params = {};
    result = window.parseCommandLine("2018082000341133831", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 2018082000341133831);
    assert.equal(Object.keys(params).length, 0);

    // an integer that almost looks like a jobid, but one digit more
    args = []; params = {};
    result = window.parseCommandLine("201808200034113383170", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 201808200034113383170);
    assert.equal(Object.keys(params).length, 0);

    // an integer that almost looks like a jobid, just not a true date-time
    args = []; params = {};
    result = window.parseCommandLine("20182820003411338317", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 20182820003411338317);
    assert.equal(Object.keys(params).length, 0);

    // FLOAT

    args = []; params = {};
    result = window.parseCommandLine("0.", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine(".0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("0.0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], 0.0);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("0.0.0", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "0.0.0");
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine(".", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], ".");
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("-1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], -1e99);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("+1e99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("1e-99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e-99);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("1e+99", args, params);
    assert.equal(result, null);
    assert.equal(args.length, 1);
    assert.equal(args[0], 1e99);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("1e999", args, params);
    assert.equal(result, "Numeric argument has overflowed or is infinity");

    // NULL

    args = []; params = {};
    result = window.parseCommandLine("null", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("Null", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("NULL", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("NUll", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NUll");
    assert.equal(Object.keys(params).length, 0);

    // NONE

    args = []; params = {};
    result = window.parseCommandLine("none", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "none");
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("None", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], null);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("NONE", args, params);

    // GENERAL WHITESPACE HANDLING

    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NONE");
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("NOne", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "NOne");
    assert.equal(Object.keys(params).length, 0);

    // BOOLEAN

    args = []; params = {};
    result = window.parseCommandLine("true", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("True", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("TRUE", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], true);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("TRue", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "TRue");
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("false", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("False", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("FALSE", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], false);
    assert.equal(Object.keys(params).length, 0);

    args = []; params = {};
    result = window.parseCommandLine("FAlse", args, params);
    assert.isNull(result);
    assert.equal(args.length, 1);
    assert.equal(args[0], "FAlse");
    assert.equal(Object.keys(params).length, 0);

    done();
  });

});
