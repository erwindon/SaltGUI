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
    browser.goto(url);
  });

  describe('Login and logout', () => {

    it('we should be redirected to the login page', done => {
      browser
        .end()
        .wait( () => {
          return document.location.href.includes('login');
        })
        .evaluate( () => { return document.location.href; } )
        .then(function (href) {
          assert.equal(href, url + 'login?reason=no-session');
          done();
        })
        .catch(done);
    });

    it('we cannot login with false credentials', done => {
      browser
        // TODO username is empty in single type - why?
        .type('#username', 'sald').type('#username', 'sald')
        .type('#password', 'sald')
        .click('#login-submit')
        .wait('#notice')
        .wait( () => {
          // need to wait until "no-session" notice disappeared
          const message = document.querySelector('#notice-wrapper div').textContent;
          return message !== 'Not logged in';
        })
        .end()
        .evaluate( () => {
          return document.querySelector('#notice-wrapper div').textContent;
        } )
        .then(function (message) {
          assert.equal(message, 'Authentication failed');
          done();
        })
        .catch(done);
    });

    it('valid credentials will redirect us to the homepage and hide the loginform', done => {
      browser
        // TODO username is empty in single type - why?
        .type('#username', 'salt').type('#username', 'salt')
        .type('#password', 'salt')
        .click('#login-submit')
        .wait('.dashboard')
        .end()
        .wait( () => {
          // wait for the redirection to the homepage
          console.log(document.location.href);
          return document.location.href === 'http://localhost:3333/';
        })
        .evaluate( () => {
          console.log(document.location.href);
          return document.location.href;
        } )
        .then(function (href) {
          assert.equal(href, url);
          done();
        })
        .catch(done);
    });

    it('check that we can logout', done => {
      browser
        // TODO username is empty in single type - why?
        .type('#username', 'salt').type('#username', 'salt')
        .type('#password', 'salt')
        .click('#login-submit')
        .wait( () => {
          // we wait here for the loginpage to be hidden
          const loginpage = document.querySelector('#page-login');
          return loginpage.style.display === 'none';
        })
        .click('#button-logout1')
        .wait( () => {
          // we wait here for the loginpage to be shown
          const loginpage = document.querySelector('#page-login');
          console.log(loginpage.style.display);
          return loginpage.style.display === '';
        })
        .wait( () => {
          return document.location.href.includes('login');
        })
        .end()
        .evaluate( () => { return document.location.href; })
        .then(function (href) {
          // and we a redirected to the login page
          assert.equal(href,'http://localhost:3333/login?reason=logout');
          done();
        })
        .catch(done);
    });

  });

});
