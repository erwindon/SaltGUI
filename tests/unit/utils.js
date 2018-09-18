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

});
