const assert = require('chai').assert;

import {OutputDocumentation} from '../../saltgui/static/scripts/output/OutputDocumentation.js';
import {OutputJson} from '../../saltgui/static/scripts/output/OutputJson.js';
import {OutputNested} from '../../saltgui/static/scripts/output/OutputNested.js';
import {OutputYaml} from '../../saltgui/static/scripts/output/OutputYaml.js';

describe('Unittests for Output.js', function() {

  it('test formatJSON', done => {

    let outputData, result;

    outputData = null;
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "null");

    outputData = undefined;
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "undefined");

    outputData = 123;
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "123");

    outputData = true;
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "true");

    outputData = "txt";
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "\"txt\"");

    outputData = [];
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "[ ]");

    outputData = [1];
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "[ 1 ]");

    outputData = [1,2];
    result = OutputJson.formatJSON(outputData);
    assert.equal(result,
      "[\n" +
      "    1,\n" +
      "    2\n" +
      "]");

    outputData = [1,2,3,4,5];
    result = OutputJson.formatJSON(outputData);
    assert.equal(result,
      "[\n" +
      "    1,\n" +
      "    2,\n" +
      "    3,\n" +
      "    4,\n" +
      "    5\n" +
      "]");

    outputData = {};
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "{ }");

    outputData = {"a":11};
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "{ \"a\": 11 }");

    // unordered input
    outputData = {"a":11,"c":22,"b":33};
    result = OutputJson.formatJSON(outputData);
    // ordered output
    assert.equal(result,
      "{\n" +
      "    \"a\": 11,\n" +
      "    \"b\": 33,\n" +
      "    \"c\": 22\n" +
      "}");

    // a more complex object, unordered input
    outputData = {"ip6_interfaces":{"lo":["::1"],"eth0":["fe80::20d:3aff:fe38:576b"]}};
    result = OutputJson.formatJSON(outputData);
    // ordered output
    assert.equal(result, 
      // "{\n" +
      // "    \"ip6_interfaces\": {\n" +
      // "        \"eth0\": [\n" +
      // "            \"fe80::20d:3aff:fe38:576b\"\n" +
      // "        ],\n" +
      // "        \"lo\": [\n" +
      // "            \"::1\"\n" +
      // "        ]\n" +
      // "    }\n" +
      // "}");
      "{\n" +
      "    \"ip6_interfaces\": {\n" +
      "        \"eth0\": [ \"fe80::20d:3aff:fe38:576b\" ],\n" +
      "        \"lo\": [ \"::1\" ]\n" +
      "    }\n" +
      "}");

    done();
  });

  it('test formatYAML', done => {

    let outputData, result;

    outputData = null;
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "null");

    outputData = undefined;
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "undefined");

    outputData = false;
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "false");

    outputData = 123;
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "123");

    outputData = "txt";
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "txt");

    outputData = " ";
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "' '");

    outputData = "";
    result = OutputJson.formatJSON(outputData);
    assert.equal(result, "\"\"");

    outputData = [];
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "[ ]");

    outputData = [1];
    result = OutputYaml.formatYAML(outputData);
    // 00A0 = NO-BREAK SPACE
    assert.equal(result, "-\u00A01");

    outputData = [1,2,3,4,5];
    result = OutputYaml.formatYAML(outputData);
    // 00A0 = NO-BREAK SPACE
    assert.equal(result,
      "-\u00A01\n" +
      "-\u00A02\n" +
      "-\u00A03\n" +
      "-\u00A04\n" +
      "-\u00A05");

    outputData = {};
    result = OutputYaml.formatYAML(outputData);
    assert.equal(result, "{ }");

    // unordered input
    outputData = {"a":11,"c":22,"b":null};
    result = OutputYaml.formatYAML(outputData);
    // ordered output
    assert.equal(result,
      "a: 11\n" +
      "b: null\n" +
      "c: 22");

    // a more complex object, unordered input
    outputData = {"ip6_interfaces":{"lo":["::1"],"eth0":["fe80::20d:3aff:fe38:576b"]}};
    result = OutputYaml.formatYAML(outputData);
    // ordered output
    // 00A0 = NO-BREAK SPACE
    assert.equal(result, 
      "ip6_interfaces:\n" +
      "  eth0:\n" +
      "  -\u00A0fe80::20d:3aff:fe38:576b\n" +
      "  lo:\n" +
      "  -\u00A0::1");

    done();
  });

  it('test formatNESTED', done => {

    let outputData, result;

    outputData = null;
    result = OutputNested.formatNESTED(outputData);
    assert.equal(result, "None");

    outputData = undefined;
    result = OutputNested.formatNESTED(outputData);
    assert.equal(result, "undefined");

    outputData = 123;
    result = OutputNested.formatNESTED(outputData);
    assert.equal(result, "123");

    outputData = "txt";
    result = OutputNested.formatNESTED(outputData);
    assert.equal(result, "txt");

    outputData = ["txt1\ntxt2\ntxt3"];
    result = OutputNested.formatNESTED(outputData);
    // 00A0 = NO-BREAK SPACE
    assert.equal(result, "-\u00A0txt1\n  txt2\n  txt3");

    outputData = [];
    result = OutputNested.formatNESTED(outputData);
    assert.equal(result, "");

    outputData = [1];
    result = OutputNested.formatNESTED(outputData);
    // 00A0 = NO-BREAK SPACE
    assert.equal(result, "-\u00A01");

    outputData = [1,2,3,4,5];
    result = OutputNested.formatNESTED(outputData);
    // 00A0 = NO-BREAK SPACE
    assert.equal(result,
      "-\u00A01\n" +
      "-\u00A02\n" +
      "-\u00A03\n" +
      "-\u00A04\n" +
      "-\u00A05");

    outputData = [{"a":1},{"a":1},[1,2],7,{"a":""},{"a":null}];
    result = OutputNested.formatNESTED(outputData);
    // 00A0 = NO-BREAK SPACE
    assert.equal(result,
      "|_\n" +
      "  ----------\n" +
      "  a:\n" +
      "      1\n" +
      "|_\n" +
      "  ----------\n" +
      "  a:\n" +
      "      1\n" +
      "|_\n" +
      "  -\u00A01\n" +
      "  -\u00A02\n" +
      "-\u00A07\n" +
      "|_\n" +
      "  ----------\n" +
      "  a:\n" +
      "|_\n" +
      "  ----------\n" +
      "  a:");

    outputData = {};
    result = OutputNested.formatNESTED(outputData);
    assert.equal(result, "");

    // unordered input
    outputData = {"a":11,"c":22,"b":33};
    result = OutputNested.formatNESTED(outputData);
    // ordered output
    assert.equal(result,
      "a:\n" +
      "    11\n" +
      "b:\n" +
      "    33\n" +
      "c:\n" +
      "    22");

    // a more complex object, unordered input
    outputData = {"ip6_interfaces":{"lo":["::1"],"eth0":["fe80::20d:3aff:fe38:576b"]}};
    result = OutputNested.formatNESTED(outputData);
    // ordered output
    // 00A0 = NO-BREAK SPACE
    assert.equal(result, 
      "ip6_interfaces:\n" +
      "    ----------\n" +
      "    eth0:\n" +
      "        -\u00A0fe80::20d:3aff:fe38:576b\n" +
      "    lo:\n" +
      "        -\u00A0::1");

    done();
  });

  it('test isDocumentationOutput', done => {

    let outputData, result;

    // ok, normal documentation case
    outputData = { "host1": {"keyword": "explanation"} };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isTrue(result);

    // wrong, does not match requested documentation
    outputData = { "host1": {"keyword": "explanation"} };
    result = OutputDocumentation.isDocumentationOutput(outputData, "another");
    assert.isFalse(result);

    // wrong, no resulting documentation
    outputData = { "host1": {"keyword": null} };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, value is not text
    outputData = { "host1": {"keyword": 123} };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, returned structure is not a dict
    outputData = { "host1": ["something"] };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, returned structure is not a dict
    outputData = { "host1": 123 };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, returned structure is not a dict
    outputData = { "host1": "hello" };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // first host ignored, second host ok
    outputData = { "host1": null, "host2": {"keyword": "explanation"} };
    result = OutputDocumentation.isDocumentationOutput(outputData, "keyword");
    assert.isTrue(result);

    done();
  });

  it('test isDocuKeyMatch', done => {

    let result;

    // all documentation
    result = OutputDocumentation._isDocuKeyMatch("anything", null);
    assert.isTrue(result);

    // all documentation
    result = OutputDocumentation._isDocuKeyMatch("anything", "");
    assert.isTrue(result);

    // match one word
    result = OutputDocumentation._isDocuKeyMatch("foo.bar", "foo");
    assert.isTrue(result);

    // match two words
    result = OutputDocumentation._isDocuKeyMatch("foo.bar", "foo.bar");
    assert.isTrue(result);

    // wrong match
    result = OutputDocumentation._isDocuKeyMatch("foo", "bar");
    assert.isFalse(result);

    // wrong match (even though text prefix)
    result = OutputDocumentation._isDocuKeyMatch("food", "foo");
    assert.isFalse(result);

    done();
  });

  it('test reduceDocumentationOutput', done => {
    let out;

    // normal case, hostname replaced by search key
    out = {"host1": {"topic": "explanation"}};
    OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // removed irrelevant documentation parts
    out = {"host1": {"topic": "explanation", "othertopic": "otherexplanation"} };
    OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // removed hosts with same answer
    out = {"host1": {"topic": "explanation"}, "host2": {"topic": "explanation"} };
    OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // ignore hosts with incorrectly formatted answer
    out = {"host1": null, "host2": {"topic": "explanation"} };
    OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // ignore hosts with incorrectly formatted answer
    out = {"host1": 123, "host2": {"topic": "explanation"} };
    OutputDocumentation.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    done();
  });

  it('test documentation external link conversion', done => {
    // external links will be converted to html
    const container = {"innerHTML": ""};
    const output = {"host1": {"pkg.install": "`systemd-run(1)`_\n .. _`systemd-run(1)`: https://www.freedesktop.org/software/systemd/man/systemd-run.html"}};
    OutputDocumentation.addDocumentationOutput(container, output);
    assert.isTrue(
      container.innerHTML.includes(
        "<a href='https://www.freedesktop.org/software/systemd/man/systemd-run.html' target='_blank'><span style='color: yellow'>systemd-run(1)</span></a>"));

    done();
  });


});
