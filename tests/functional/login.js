/* global afterEach beforeEach describe it process */

import Nightmare from "nightmare";
import {assert} from "chai";

const url = "http://localhost:3333/";

/* eslint-disable func-names */
describe("Funtional tests", function () {
/* eslint-enable func-names */

  let browser = null;

  // the global electron timeout
  /* eslint-disable no-invalid-this */
  this.timeout(60 * 1000);
  /* eslint-enable no-invalid-this */

  beforeEach(() => {
    const options = {
      "fullscreen": true,
      // to make the typed input much faster
      "typeInterval": 20,
      // the wait function has a timeout as well
      "waitTimeout": 60 * 1000
    };

    if (process.env.NIGHTMARE_DEBUG === "1") {
      console.log("NIGHTMARE_DEBUG=1, setting additional options");

      // show the browser and the debug window
      options.openDevTools = true;
      // to show in a separate window
      // options.openDevTools = { mode: "detach" };
    }

    browser = new Nightmare(options);

    browser.on('console', (type, message) => {
      console.log(`[console][${type}] ` + JSON.stringify(message, null, 2));
    });

    browser.on('page', (type, message, stack) => {
      console.error(`[page-error][${type}] ${JSON.stringify(message)}`);
      if (stack) {
        console.error('stack:', stack);
      }
    });

    return browser.
      goto(url).
      wait(1000);
  });

  /* eslint-disable arrow-body-style */
  afterEach(() => {
    return browser.end();
  });
  /* eslint-enable arrow-body-style */

  describe("Login and logout", () => {

    it("we should be redirected to the login page", (done) => {
      browser.
        wait(() => document.location.href.includes("login")).
        wait(500).
        evaluate(() => document.location.href).
        then((href) => {
          href = href.replace(/[?]reason=.*/, "");
          assert.equal(href, url);
        }).
        then(done).
        catch((err) => done(err));
    });

    it("we cannot login with false credentials", (done) => {
      browser.
        insert("#username", "sald").
        wait(500).
        insert("#password", "sald").
        wait(500).
        click("#login-button").
        wait(500).
        wait("#notice-wrapper div.notice_auth_failed").
        wait(1000).
        evaluate(() => document.querySelector("#notice-wrapper div").textContent).
        then((message) => {
          assert.equal(message, "Authentication failed");
        }).
        then(done).
        catch(done);
    });

    it("valid credentials will redirect us to the homepage and hide the loginform", (done) => {
      browser.
        insert("#username", "salt").
        wait(500).
        insert("#password", "salt").
        wait(500).
        click("#login-button").
        wait(500).
        wait(() => {
          // we wait here for the loginpage to be hidden
          const loginpage = document.querySelector("#page-login");
          return loginpage.style.display === "none";
        }).
        wait(1000).
        evaluate(() => document.location.href).
        then((href) => {
          assert.equal(href, url + "#minions");
        }).
        then(done).
        catch(done);
    });

    it("check that we can logout", (done) => {
      browser.
        insert("#username", "salt").
        wait(500).
        insert("#password", "salt").
        wait(500).
        click("#login-button").
        wait(500).
        wait("#notice-wrapper div.notice_please_wait").
        wait(5000).
        wait(() => {
          // we wait here for the loginpage to be hidden
          const loginpage = document.querySelector("#page-login");
          return loginpage.style.display === "none";
        }).
        click("#button-logout1").
        wait(500).
        wait(() => {
          // we wait here for the loginpage to be shown
          const loginpage = document.querySelector("#page-login");
          return loginpage.style.display === "";
        }).
        wait(() => document.location.href.includes("login")).
        wait(1000).
        evaluate(() => document.location.href).
        then((href) => {
          // and we redirected to the login page
          assert.equal(href, url + "?reason=logout#login");
        }).
        then(done).
        catch(done);
    });

  });

});
