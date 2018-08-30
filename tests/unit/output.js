const assert = require('chai').assert;

var Output = require('../../saltgui/static/scripts/output');

describe('Unittests for output.js', function() {

  it('test output', done => {

    let outputData, result;

    // isDocumentationOutput

    outputData = { "host1": {"keyword": "explanation"} };
    result = Output.isDocumentationOutput(outputData);
    assert.isTrue(result);

    outputData = { "host1": {"keywork": null} };
    result = Output.isDocumentationOutput(outputData);
    assert.isFalse(result);

    outputData = { "host1": {"keywork": 123} };
    result = Output.isDocumentationOutput(outputData);
    assert.isFalse(result);

    outputData = { "host1": 123 };
    result = Output.isDocumentationOutput(outputData);
    assert.isFalse(result);

    outputData = { "host1": "hello" };
    result = Output.isDocumentationOutput(outputData);
    assert.isFalse(result);

    // first host ignored, second host ok
    outputData = { "host1": null, "host2": {"keyword": "explanation"} };
    result = Output.isDocumentationOutput(outputData);
    assert.isTrue(result);

    done();
  });

});
