/* global describe it */

import {Character} from "../../saltgui/static/scripts/Character.js";
import {ParseCommandLine} from "../../saltgui/static/scripts/ParseCommandLine.js";
import {assert} from "chai";

Character.init();

describe("Unittests for ParseCommandLine.js", () => {

  describe("getCommandFromCommandLine", () => {
    it("test extract command from simple command line", () => {
      const result = ParseCommandLine.getCommandFromCommandLine("test");
      assert.isTrue(result.startsWith("test"));
    });

    it("test extract command from command line with parameters", () => {
      const result = ParseCommandLine.getCommandFromCommandLine("test arg1 arg2");
      assert.isTrue(result.startsWith("test"));
    });

    it("test extract command from command line with named parameters", () => {
      const result = ParseCommandLine.getCommandFromCommandLine("test x=5 y=10");
      assert.isTrue(result.startsWith("test"));
    });
  });

  describe("parseCommandLine", () => {
    it("test comprehensive parsing scenarios", () => {
      let tokens = [];
      let args = [];
      let params = {};
      let result;

      // GENERAL ERROR HANDLING

      // null means: it was all ok
      tokens = [];
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("test", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "test");
      assert.equal(Object.keys(params).length, 0);

      // broken json will return a readable error message
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("{\"test\"", tokens, args, params);
      assert.isTrue(result.startsWith("No valid dictionary found,"));

      // remaining placeholder
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("aap <noot> mies", tokens, args, params);
      assert.isTrue(result.startsWith("Must fill in all placeholders"));

      // GENERAL WHITESPACE HANDLING

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine(" name=true", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 0);
      assert.equal(Object.keys(params).length, 1);
      assert.equal(params.name, true);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("name=true ", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 0);
      assert.equal(Object.keys(params).length, 1);
      assert.equal(params.name, true);

      // NAMED PARAMETERS

      // name-value-pair without value is not ok
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("test=", tokens, args, params);
      assert.isTrue(result.startsWith("Must have value for named parameter\n"));
      assert.isTrue(result.includes("in: test"));

      // name-value-pair without value is not ok
      // make sure it does not confuse it with furher parameters
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("test= arg2 arg3", tokens, args, params);
      assert.isTrue(result.startsWith("Must have value for named parameter\n"));
      assert.isTrue(result.includes("in: test"));

      // duplicate named parameter
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("x=1 y=2 x=3", tokens, args, params);
      assert.isTrue(result.startsWith("Duplicate named variable\n"));
      assert.isTrue(result.includes("in: x"));

      // DICTIONARY

      // a regular dictionary
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("{\"a\":1}", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], {"a": 1});
      assert.equal(Object.keys(params).length, 0);

      // a broken dictionary
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("{\"a}\":1", tokens, args, params);
      assert.isTrue(result.startsWith("No valid dictionary found,"));

      // a regular dictionary with } in its name
      // test that the parser is not confused
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("{\"a}\":1}", tokens, args, params);
      assert.equal(result, null);

      // a regular dictionary with } after its value
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("{\"a}\":1}}", tokens, args, params);
      assert.isTrue(result.startsWith("Valid dictionary, but followed by text\n"));
      assert.isTrue(result.includes("in: {\"a}\":1"));

      // ARRAYS

      // a simple array
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("[1,2]", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.deepEqual(args[0], [1, 2]);
      assert.equal(Object.keys(params).length, 0);

      // a simple array that is not closed
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("[1,2", args, params);
      assert.isTrue(result.startsWith("No valid array found,"));

      // STRINGS WITHOUT QUOTES

      // a simple string
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("string", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "string");
      assert.equal(Object.keys(params).length, 0);

      // a number that looks like a jobid
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("20180820003411338317", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "20180820003411338317");
      assert.equal(Object.keys(params).length, 0);

      // DOUBLE-QUOTED-STRINGS

      // a simple string
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("\"string\"", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "string");
      assert.equal(Object.keys(params).length, 0);

      // an unclosed string
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("\"string", tokens, args, params);
      assert.isTrue(result.startsWith("No valid double-quoted-string found"));
      assert.isTrue(result.includes("in: \"string"));

      // TRIPLE-DOUBLE-QUOTED-STRINGS

      // a simple string
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("\"\"\"string\"\"\"", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "string");
      assert.equal(Object.keys(params).length, 0);

      // a simple string with embedded nasties
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("\"\"\"abc\"\"def\\ghi\"\"\"", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "abc\"\"def\\ghi");
      assert.equal(Object.keys(params).length, 0);

      // an unclosed string (no end quotes)
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("\"\"\"string", tokens, args, params);
      assert.isTrue(result.startsWith("No valid triple-quoted-string found"));
      assert.isTrue(result.includes("in: \"\"\"string"));

      // an unclosed string (too few endquotes)
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("\"\"\"string\"\"", tokens, args, params);
      assert.isTrue(result.startsWith("No valid triple-quoted-string found"));
      assert.isTrue(result.includes("in: \"\"\"string\"\""));

      // SINGLE-QUOTED-STRINGS (never supported!)

      // a single-quoted string is not supported
      // it evalueates as a string (the whole thing)
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("'string'", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], "'string'");
      assert.equal(Object.keys(params).length, 0);

      // a single-quoted string is not supported
      // it evalueates as a string (the whole thing)
      // even when that looks rediculous
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("'string", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], "'string");
      assert.equal(Object.keys(params).length, 0);

      // INTEGER

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0);
      assert.equal(Object.keys(params).length, 0);

      // an integer that almost looks like a jobid, but one digit less
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("2018082000341133831", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 2018082000341133831);
      assert.equal(Object.keys(params).length, 0);

      // an integer that almost looks like a jobid, but one digit more
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("201808200034113383170", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 201808200034113383170);
      assert.equal(Object.keys(params).length, 0);

      // an integer that almost looks like a jobid, just not a true date-time
      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("20182820003411338317", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 20182820003411338317);
      assert.equal(Object.keys(params).length, 0);

      // FLOAT

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0.", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine(".0", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0.0", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0.0);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0.0.0", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "0.0.0");
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine(".", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], ".");
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1e99", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], 1e99);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("-1e99", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], -1e99);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("+1e99", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], 1e99);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1e-99", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], 1e-99);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1e+99", tokens, args, params);
      assert.equal(result, null);
      assert.equal(args.length, 1);
      assert.equal(args[0], 1e99);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1e999", tokens, args, params);
      assert.isTrue(result.startsWith("Numeric argument has overflowed or is infinity"));

      // HEXADECIMAL

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0xFF", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 255);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0x10", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 16);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("-0x10", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], -16);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0x0", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0);
      assert.equal(Object.keys(params).length, 0);

      // BINARY

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0b1010", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 10);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0b101", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 5);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("-0b101", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], -5);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("0b0", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0);
      assert.equal(Object.keys(params).length, 0);

      // OCTAL

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("077", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 63);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("010", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 8);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("-010", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], -8);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("00", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 0);
      assert.equal(Object.keys(params).length, 0);

      // SEXAGESIMAL

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1:30", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 90);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1:30:45", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 5445);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("99:00", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], 5940);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("-1:30", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], -90);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1:99", tokens, args, params);
      assert.isTrue(result.startsWith("Sexagesimal component out of range (must be 0-59 after first component)"));

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("1:30:99", tokens, args, params);
      assert.isTrue(result.startsWith("Sexagesimal component out of range (must be 0-59 after first component)"));

      // NULL

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("null", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], null);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("Null", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], null);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("NULL", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], null);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("NUll", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "NUll");
      assert.equal(Object.keys(params).length, 0);

      // NONE

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("none", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "none");
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("None", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], null);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("NONE", tokens, args, params);

      // GENERAL WHITESPACE HANDLING

      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "NONE");
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("NOne", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "NOne");
      assert.equal(Object.keys(params).length, 0);

      // BOOLEAN

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("true", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], true);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("True", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], true);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("TRUE", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], true);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("TRue", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "TRue");
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("false", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], false);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("False", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], false);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("FALSE", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], false);
      assert.equal(Object.keys(params).length, 0);

      args = [];
      params = {};
      tokens = [];
      result = ParseCommandLine.parseCommandLine("FAlse", tokens, args, params);
      assert.isNull(result);
      assert.equal(args.length, 1);
      assert.equal(args[0], "FAlse");
      assert.equal(Object.keys(params).length, 0);
    });
  });

});
