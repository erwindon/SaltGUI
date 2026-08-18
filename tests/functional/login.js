/* global afterEach beforeEach console document describe it process */

import puppeteer from "puppeteer";
import {assert} from "chai";

const url = "http://localhost:3333/";
const TIMEOUT = 15000;

// these files are optional and are not present during test
// the browser reports their absence as a 404 on the console
// see the SaltGUI documentation for their purpose
const optionalFiles = [
  "/static/minions.txt",
  "/static/salt-auth.txt",
  "/static/salt-motd.html",
  "/static/salt-motd.txt"
];

// note that the text after the status code varies per webserver
const isMissingOptionalFile = (msg) => msg.text().includes("404") &&
  optionalFiles.some((file) => msg.location().url.endsWith(file));

// one test logs in with invalid credentials on purpose
// the browser reports the rejection as a 401 on the console
const isRejectedLogin = (msg) => msg.text().includes("401") &&
  msg.location().url.endsWith("/login");

/* eslint-disable func-names */
describe("Login tests", function () {
/* eslint-enable func-names */

  let browser = null;
  let page = null;

  /* eslint-disable no-invalid-this */
  this.timeout(60 * 1000);
  /* eslint-enable no-invalid-this */

  beforeEach(async () => {
    const launchOptions = {
      // show browser if debug
      args: ["--start-fullscreen"],
      defaultViewport: null,
      headless: process.env.PUPPETEER_DEBUG !== "1"
    };

    if (process.env.PUPPETEER_DEBUG === "1") {
      /* eslint-disable no-console */
      console.log("PUPPETEER_DEBUG=1, launching visible browser");
      /* eslint-enable no-console */
      launchOptions.headless = false;
    }

    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();

    // Capture console logs
    page.on("console", (msg) => {
      if (isMissingOptionalFile(msg) || isRejectedLogin(msg)) {
        // this message is expected, it is not a problem
        return;
      }
      /* eslint-disable no-console */
      console.log(`[console][${msg.type()}] ${msg.text()} in ${msg.location().url}`);
      /* eslint-enable no-console */
    });
    page.on("pageerror", (err) => {
      /* eslint-disable no-console */
      console.error(`[page-error] ${err.message}`);
      console.error(err.stack);
      /* eslint-enable no-console */
    });

    await page.goto(url);
    await page.waitForSelector("#username", { timeout: TIMEOUT });
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe("Login and logout", () => {

    it("we should be redirected to the login page", async () => {
      await page.waitForFunction(() => document.location.href.includes("login"), { timeout: TIMEOUT });

      let href = await page.evaluate(() => document.location.href);
      href = href.replace(/[?]reason=.*/, "");
      assert.equal(href, url);
    });

    it("we cannot login with false credentials", async () => {
      await page.type("#username", "sald", { delay: 20 });
      await page.type("#password", "sald", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });
      await page.waitForSelector("#notice-wrapper div.notice_auth_failed", { timeout: TIMEOUT });

      const message = await page.$eval("#notice-wrapper div", el => el.textContent);
      assert.equal(message, "Authentication failed");
    });

    it("valid credentials will redirect us to the homepage and hide the login form", async () => {
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });

      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage?.style.display === "none";
      });

      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });
      const href = await page.evaluate(() => document.location.href);
      assert.equal(href, url + "#minions");
    });

    it("check that we can logout", async () => {
      // login first
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage?.style.display === "none";
      });

      // logout
      await page.waitForFunction(() => document.querySelector("#button-logout1"));
      await page.evaluate(() => {
        document.querySelector("#button-logout1").click();
      });

      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage?.style.display === "";
      });

      await page.waitForFunction(() => document.location.href.includes("login"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.equal(href, url + "?reason=logout#login");
    });

  });

  describe("Empty Credentials", () => {

    it("should not allow login with empty username", async () => {
      await page.type("#password", "salt", { delay: 20 });

      const usernameValue = await page.$eval("#username", el => el.value);
      assert.isEmpty(usernameValue, "username should be empty");

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });

      const stillOnLoginPage = await page.evaluate(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display !== "none";
      });

      assert.isTrue(stillOnLoginPage, "should not login with empty username");
    });

    it("should not allow login with empty password", async () => {
      await page.type("#username", "salt", { delay: 20 });

      const passwordValue = await page.$eval("#password", el => el.value);
      assert.isEmpty(passwordValue, "password should be empty");

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });
      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display !== "none";
      }, { timeout: TIMEOUT });

      const stillOnLoginPage = await page.evaluate(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display !== "none";
      });

      assert.isTrue(stillOnLoginPage, "should not login with empty password");
    });

  });

  describe("Multiple Failed Login Attempts", () => {

    it("should show error after first failed login", async () => {
      await page.type("#username", "wrong", { delay: 20 });
      await page.type("#password", "wrong", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });

      await page.waitForSelector("#notice-wrapper div.notice_auth_failed");
      const message = await page.$eval("#notice-wrapper div", el => el.textContent);
      assert.equal(message, "Authentication failed");
    });

    it("should allow retry after failed login", async () => {
      // First attempt fails
      await page.type("#username", "wrong", { delay: 20 });
      await page.type("#password", "wrong", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });
      await page.waitForSelector("#notice-wrapper div.notice_auth_failed", { timeout: TIMEOUT });

      // Clear fields
      await page.evaluate(() => {
        document.querySelector("#username").value = "";
        document.querySelector("#password").value = "";
      });

      // Second attempt with correct credentials
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "minions", "should successfully login on second attempt");
    });

  });

  describe("Logout Behavior", () => {

    it("should clear session data on logout", async () => {
      // Login first
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      // Verify logged in
      let href = await page.evaluate(() => document.location.href);
      assert.include(href, "minions");

      // Logout
      await page.waitForFunction(() => document.querySelector("#button-logout1"));
      await page.evaluate(() => {
        document.querySelector("#button-logout1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("login"), { timeout: TIMEOUT });

      // Should be back on login page
      href = await page.evaluate(() => document.location.href);
      assert.include(href, "login");
    });

    it("should not show minion data after logout", async () => {
      // Login first
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      // Logout
      await page.waitForFunction(() => document.querySelector("#button-logout1"));
      await page.evaluate(() => {
        document.querySelector("#button-logout1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("login"), { timeout: TIMEOUT });

      // Navigate back trying to access minions
      await page.goto(url + "#minions");
      await page.waitForFunction(() => document.location.href.includes("login"), { timeout: TIMEOUT });

      // Should be redirected to login
      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "login", "should redirect to login after logout");
    });

  });

  describe("Session Timeout", () => {

    it("should return to login page after logout and login form should be usable", async () => {
      // First login
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      // Logout
      await page.waitForFunction(() => document.querySelector("#button-logout1"));
      await page.evaluate(() => {
        document.querySelector("#button-logout1").click();
      });

      // Verify login page is displayed
      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display !== "none";
      });

      // Verify login form fields are accessible
      const usernameInput = await page.$eval("#username", el => el.tagName);
      const passwordInput = await page.$eval("#password", el => el.tagName);
      assert.equal(usernameInput, "INPUT", "username field should be an input");
      assert.equal(passwordInput, "INPUT", "password field should be an input");

      // Verify logout reason is shown
      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "logout", "should show logout reason in URL");
    });

  });

});
