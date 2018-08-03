const assert = require('chai').assert;

// create a global window so we can unittest the window.<x> functions
if (!global.window)
   global.window = new Object({});

require('../../saltgui/static/scripts/parsecmdline');


describe('Unittests for parsecmdline.js', function() {
  
  it('test parseCommandLine', done => {
    // null means: it was all ok
    result = window.parseCommandLine("test", ["something"]);
    assert.isNull(result);

    // broken json will return a readable error message
    result = window.parseCommandLine("{'test'");
    assert.equal(result, "No valid dictionary found");

    // ... please add MUCH MORE tests here

    done();
  });

});
