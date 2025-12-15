/* global afterEach beforeEach describe it process */

import puppeteer from "puppeteer";
import {assert} from "chai";

const url = "http://localhost:3333/";

/* eslint-disable compat/compat */
/* Promise is not supported in op_mini all */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/* eslint-enable compat/compat */

/* eslint-disable func-names */
describe("Functional tests", function () {
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
    await sleep(1000);
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe("Login and logout", () => {

    it("we should be redirected to the login page", async () => {
      await page.waitForFunction(() => document.location.href.includes("login"));
      await sleep(500);

      let href = await page.evaluate(() => document.location.href);
      href = href.replace(/[?]reason=.*/, "");
      assert.equal(href, url);
    });

    it("we cannot login with false credentials", async () => {
      await page.type("#username", "sald", { delay: 20 });
      await sleep(500);
      await page.type("#password", "sald", { delay: 20 });
      await sleep(500);

      await page.click("#login-button");
      await sleep(500);
      await page.waitForSelector("#notice-wrapper div.notice_auth_failed");
      await sleep(1000);

      const message = await page.$eval("#notice-wrapper div", el => el.textContent);
      assert.equal(message, "Authentication failed");
    });

    it("valid credentials will redirect us to the homepage and hide the login form", async () => {
      await page.type("#username", "salt", { delay: 20 });
      await sleep(500);
      await page.type("#password", "salt", { delay: 20 });
      await sleep(500);

      await page.click("#login-button");
      await sleep(500);

      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display === "none";
      });

      await sleep(1000);
      const href = await page.evaluate(() => document.location.href);
      assert.equal(href, url + "#minions");
    });

    it("check that we can logout", async () => {
      // login first
      await page.type("#username", "salt", { delay: 20 });
      await sleep(500);
      await page.type("#password", "salt", { delay: 20 });
      await sleep(500);

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait");
      await sleep(5000);

      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display === "none";
      });

      // logout
      await page.waitForFunction(() => document.querySelector("#button-logout1"));
      await page.evaluate(() => {
        document.querySelector("#button-logout1").click();
      });
      await sleep(500);

      await page.waitForFunction(() => {
        const loginpage = document.querySelector("#page-login");
        return loginpage && loginpage.style.display === "";
      });

      await page.waitForFunction(() => document.location.href.includes("login"));
      await sleep(1000);

      const href = await page.evaluate(() => document.location.href);
      assert.equal(href, url + "?reason=logout#login");
    });

  });

});
