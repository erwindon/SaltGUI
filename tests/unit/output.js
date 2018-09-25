const assert = require('chai').assert;

const Output = require('../../saltgui/static/scripts/output');

describe('Unittests for output.js', function() {

  it('test isDocumentationOutput', done => {

    let outputData, result;

    // ok, normal documentation case
    outputData = { "host1": {"keyword": "explanation"} };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isTrue(result);

    // wrong, does not match requested documentation
    outputData = { "host1": {"keyword": "explanation"} };
    result = Output.isDocumentationOutput(outputData, "another");
    assert.isFalse(result);

    // wrong, no resulting documentation
    outputData = { "host1": {"keyword": null} };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, value is not text
    outputData = { "host1": {"keyword": 123} };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, returned structure is not a dict
    outputData = { "host1": ["something"] };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, returned structure is not a dict
    outputData = { "host1": 123 };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // wrong, returned structure is not a dict
    outputData = { "host1": "hello" };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isFalse(result);

    // first host ignored, second host ok
    outputData = { "host1": null, "host2": {"keyword": "explanation"} };
    result = Output.isDocumentationOutput(outputData, "keyword");
    assert.isTrue(result);

    done();
  });

  it('test isDocuKeyMatch', done => {

    let result;

    // all documentation
    result = Output.isDocuKeyMatch("anything", null);
    assert.isTrue(result);

    // all documentation
    result = Output.isDocuKeyMatch("anything", "");
    assert.isTrue(result);

    // match one word
    result = Output.isDocuKeyMatch("foo.bar", "foo");
    assert.isTrue(result);

    // match two words
    result = Output.isDocuKeyMatch("foo.bar", "foo.bar");
    assert.isTrue(result);

    // wrong match
    result = Output.isDocuKeyMatch("foo", "bar");
    assert.isFalse(result);

    // wrong match (even though text prefix)
    result = Output.isDocuKeyMatch("food", "foo");
    assert.isFalse(result);

    done();
  });

  it('test reduceDocumentationOutput', done => {
    let out;

    // normal case, hostname replaced by search key
    out = {"host1": {"topic": "explanation"}};
    Output.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // removed irrelevant documentation parts
    out = {"host1": {"topic": "explanation", "othertopic": "otherexplanation"} };
    Output.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // removed hosts with same answer
    out = {"host1": {"topic": "explanation"}, "host2": {"topic": "explanation"} };
    Output.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // ignore hosts with incorrectly formatted answer
    out = {"host1": null, "host2": {"topic": "explanation"} };
    Output.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    // ignore hosts with incorrectly formatted answer
    out = {"host1": 123, "host2": {"topic": "explanation"} };
    Output.reduceDocumentationOutput(out, "DUMMY", "topic");
    assert.deepEqual(out, {"DUMMY": {"topic": "explanation"}});

    done();
  });

  it('test documentation external link conversion', done => {
    // external links will be converted to html
    const container = {"innerHTML": ""};
    const output = {"host1": {"pkg.install": "`systemd-run(1)`_\n .. _`systemd-run(1)`: https://www.freedesktop.org/software/systemd/man/systemd-run.html"}};
    Output.addDocumentationOutput(container, output);

    assert.isTrue(
      container.innerHTML.includes(
        "<a href='https://www.freedesktop.org/software/systemd/man/systemd-run.html' target='_blank'><span style='color: yellow'>systemd-run(1)</span></a>"));
    done();
  });


});
