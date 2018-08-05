const Nightmare = require('nightmare');
const assert = require('chai').assert;

const url = 'http://localhost:3333/';


describe('Login tests', function() {

  this.timeout('60s');

  let browser = null;

  beforeEach( () => {
    browser = new Nightmare({ 
      // to make the typed input much faster
      typeInterval: 20,
      // uncomment this to show the browser and the debug window
      // openDevTools: {
      //   mode: "detach"
      // },
      // show: true 
    });
    browser
      .goto(url);
  });

  describe('Functional tests for login', () => {
  
    it('we should be redirected to the login page', done => {
      browser
        .end()
        .evaluate( () => { return document.location.href; } )
        .then(function (href) { 
          assert.equal(href, url + 'login');
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
          done();
        })
        .catch(done);
    });

    it('valid credentials will redirect us to the homepage and hide the loginform', done => {
      browser
        .type('#username', 'salt')
        .type('#password', 'salt')
        .click('#login-submit')
        .wait( () => {
          // we wait here for the loginpage to be hidden
          var loginpage = document.querySelector('#page_login');
          return loginpage.style.display == 'none';
        })
        .end()
        .evaluate( ()=> { return document.location.href; })
        .then(function (href) {
          assert.equal(href, url);
          done();
        })
        .catch(done);
    });

  });

});
