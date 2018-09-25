const assert = require('chai').assert;

const stringify = require('../../saltgui/static/scripts/stringify');

describe('Unittests for stringify.js', function() {
  
  it('test format', done => {
    const now = new Date();
    let result;

    // test the nicer presentation of [] ...
    result = stringify.format([]);
    assert.equal(result, "[&nbsp;]");

    // ... and {}
    result = stringify.format({});
    assert.equal(result, "{&nbsp;}");

    // but the nicer presentation for {}
    // does not work yet for nested objects
    result = stringify.format([{}]);
    assert.equal(result, "[\n  {}\n]");

    // but the nicer presentation for []
    // does not work yet for nested objects
    result = stringify.format({"a":[]});
    assert.equal(result, "{\n  \"a\": []\n}");

    // just a string value
    result = stringify.format("aap");
    assert.equal(result, "\"aap\"");

    // just an integer
    result = stringify.format(123);
    assert.equal(result, "123");

    // just a float
    result = stringify.format(123.45);
    assert.equal(result, "123.45");

    // just a boolean
    result = stringify.format(true);
    assert.equal(result, "true");

    done();
  });

});
