const assert = require('chai').assert;

import {Utils} from '../../saltgui/static/scripts/Utils.js';

describe('Unittests for Utils.js', function() {
  
  it('test getQueryParam2', done => {
    let result;

    // no parameters
    result = Utils._getQueryParam2("http://host/url", "aap");
    assert.equal(result, undefined);

    // no parameters
    result = Utils._getQueryParam2("http://host/url?", "aap");
    assert.equal(result, undefined);

    // one parameter, match
    result = Utils._getQueryParam2("http://host/url?aap=1", "aap");
    assert.equal(result, "1");

    // one parameter, no match
    result = Utils._getQueryParam2("http://host/url?aap=1", "noot");
    assert.equal(result, undefined);

    // one parameter, illegal format
    result = Utils._getQueryParam2("http://host/url?aap", "aap");
    assert.equal(result, undefined);

    // one parameter, illegal format
    result = Utils._getQueryParam2("http://host/url?aap=1=2", "aap");
    assert.equal(result, undefined);

    // more parameters, match
    result = Utils._getQueryParam2("http://host/url?aap=1&noot=2", "aap");
    assert.equal(result, "1");

    // more parameters, match
    result = Utils._getQueryParam2("http://host/url?aap=1&noot=2", "noot");
    assert.equal(result, "2");

    // more parameters, no match
    result = Utils._getQueryParam2("http://host/url?aap=1&noot=2", "mies");
    assert.equal(result, undefined);

    // mark function as used
    // it has implicit parameter windows.location which we will not fake
    result = Utils.getQueryParam("lkhlkfhlaskdhfljk");
    assert.equal(result, undefined);

    done();
  });

});
