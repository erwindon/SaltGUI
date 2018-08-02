const assert = require('chai').assert;

// so we can import the utils for testing
global.window = new Object({});
require('../../saltgui/static/scripts/utils');


describe('Unittests for utils.js', function() {
  
  it('test elapsedToString', done => {
    var now = new Date();
    var result = window.elapsedToString(now);

    assert.equal(result, "A few moments ago");

    now.setSeconds(now.getSeconds() - 110);
    result = window.elapsedToString(now);
    assert.equal(result, "A few minutes ago");

    now.setMinutes(now.getMinutes() - 1);
    result = window.elapsedToString(now);
    assert.equal(result, "3 minutes ago");

    now.setHours(now.getHours() - 2);
    result = window.elapsedToString(now);
    assert.equal(result, "2 hours ago");

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

});
