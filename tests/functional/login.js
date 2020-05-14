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
      waitTimeout: 60 * 1000,
      fullscreen: true
    };

    if (process.env.NIGHTMARE_DEBUG === '1') {
      // show the browser and the debug window
      options.openDevTools = true;
      // to show in a separate window
      //options.openDevTools = { mode: "detach" };
      options.show = true;
    }

    browser = new Nightmare(options);
    browser
      .goto(url)
      .wait(1000);
  });

  describe('Login and logout', () => {

    it('we should be redirected to the login page', done => {
      browser
        .wait( () => {
          return document.location.href.includes('login');
        })
        .evaluate( () => { return document.location.href; } )
        .end()
        .then( href => {
          assert.equal(href, url + 'login?reason=no-session');
        })
        .then(done)
        .catch(done);
    });

    it('we cannot login with false credentials', done => {
      browser
        .insert('#username', 'sald')
        .insert('#password', 'sald')
        .click('#login-submit')
        .wait('#notice-wrapper div.notice_auth_failed')
        .evaluate( () => {
          return document.querySelector('#notice-wrapper div').textContent;
        })
        .end()
        .then( message => {
          assert.equal(message, 'Authentication failed');
        })
        .then(done)
        .catch(done);
    });

    it('valid credentials will redirect us to the homepage and hide the loginform', done => {
      browser
        .insert('#username', 'salt')
        .insert('#password', 'salt')
        .click('#login-submit')
        .wait( () => {
          // we wait here for the loginpage to be hidden
          const loginpage = document.querySelector('#page-login');
          return loginpage.style.display === 'none';
        })
        .evaluate( () => { return document.location.href; })
        .end()
        .then( href => {
          assert.equal(href, url);
        })
        .then(done)
        .catch(done);
    });

    it('check that we can logout', done => {
      browser
        .insert('#username', 'salt')
        .insert('#password', 'salt')
        .click('#login-submit')
        .wait('#notice-wrapper div.notice_please_wait')
        .wait(5000)
        .wait( () => {
          // we wait here for the loginpage to be hidden
          const loginpage = document.querySelector('#page-login');
          return loginpage.style.display === 'none';
        })
        .click('#button-logout1')
        .wait( () => {
          // we wait here for the loginpage to be shown
          const loginpage = document.querySelector('#page-login');
          return loginpage.style.display === '';
        })
        .wait( () => {
          return document.location.href.includes('login');
        })
        .evaluate( () => { return document.location.href; })
        .end()
        .then( href => {
          // and we redirected to the login page
          assert.equal(href, url + 'login?reason=logout');
        })
        .then(done)
        .catch(done);
    });

  });

});
