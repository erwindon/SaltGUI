const Nightmare = require('nightmare');
const assert = require('chai').assert;

const url = 'http://localhost:3333/';


describe('Login tests', function() {

  this.timeout('10s');

  let browser = null;

  beforeEach( () => {
    browser = new Nightmare({ 
      // uncomment this to show the browser and the debug window
      // openDevTools: {
      //   mode: "detach"
      // },
      // show: true 
    });
    browser
      .goto(url);
  });

  describe('Login', () => {
  
    it('we should be redirected to the login page', done => {
      browser
        .end()
        .evaluate( () => { return document; } )
        .then(function (document) { 
          assert.equal(document.location.href, 'http://localhost:3333/login');
          done();
        })
        .catch(done);
    });

    it('we cannot login with false credentials', done => {
      var selector = '.notice-wrapper';
      browser
        .type('#username', 'sald')
        .type('#password', 'sald')
        .click('#login-submit')
        .wait('.notice')
        .end()
        .evaluate(selector => {
          return document.querySelector('.notice-wrapper div').textContent;
        }, selector)
        .then(function (message) {
          assert.equal(message, 'Authentication failed');
          done() ;
        })
        .catch(error => {
          console.log(error);
        });
    });

  });

});
