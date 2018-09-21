const Nightmare = require('nightmare');
const assert = require('chai').assert;

const url = 'http://localhost:3333/';


describe('Funtional tests', function() {

  let browser = null;

  // the global electron timeout
  this.timeout(60 * 1000);

  beforeEach( () => {
    const options = { 
      // to make the typed input much faster
      typeInterval: 20,
      // the wait function has a timeout as well
      waitTimeout: 60 * 1000
    };

    if (process.env.NIGHTMARE_DEBUG === '1') {
      // show the browser and the debug window
      options.openDevTools = {
        mode: "detach"
      };
      options.show = true;
    }

    browser = new Nightmare(options);
    browser
      .goto(url);
  });

  describe('Login and logout', () => {
  
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
      const selector = '.notice-wrapper';
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
          const loginpage = document.querySelector('#page_login');
          return loginpage.style.display === 'none';
        })
        .end()
        .evaluate( () => { return document.location.href; })
        .then(function (href) {
          assert.equal(href, url);
          done();
        })
        .catch(done);
    });

    it('check that we can logout', done => {
      browser
        .type('#username', 'salt')
        .type('#password', 'salt')
        .click('#login-submit')
        .wait( () => {
          // we wait here for the loginpage to be hidden
          const loginpage = document.querySelector('#page_login');
          return loginpage.style.display === 'none';
        })
        .click('#button_logout')
        .wait( () => {
          // we wait here for the loginpage to be shown
          const loginpage = document.querySelector('#page_login');
          console.log(loginpage.style.display);
          return loginpage.style.display === '';
        })
        .end()
        .evaluate( () => { return document.location.href; })
        .then(function (href) {
          // and we a redirected to the login page
          assert.equal(href,'http://localhost:3333/login');
          done();
        })
        .catch(done);
    });

  });

});
