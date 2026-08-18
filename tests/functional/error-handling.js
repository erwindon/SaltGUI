/* global afterEach beforeEach console document describe it process */

import puppeteer from "puppeteer";
import {assert} from "chai";

const url = "http://localhost:3333/";
const TIMEOUT = 15000;

const optionalFiles = [
  "/static/minions.txt",
  "/static/salt-auth.txt",
  "/static/salt-motd.html",
  "/static/salt-motd.txt"
];

const isMissingOptionalFile = (msg) => msg.text().includes("404") &&
  optionalFiles.some((file) => msg.location().url.endsWith(file));

const isExpectedUnauthorized = (msg) => msg.text().includes("401") &&
  msg.location().url.endsWith("/login");

const isExpectedError = (msg) =>
  isMissingOptionalFile(msg) || isExpectedUnauthorized(msg);

/* eslint-disable func-names */
describe("Error Handling", function () {
/* eslint-enable func-names */

  let browser = null;
  let page = null;
  let consoleErrors = [];

  /* eslint-disable no-invalid-this */
  this.timeout(60 * 1000);
  /* eslint-enable no-invalid-this */

  beforeEach(async () => {
    const launchOptions = {
      args: ["--start-fullscreen"],
      defaultViewport: null,
      headless: process.env.PUPPETEER_DEBUG !== "1"
    };

    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();
    consoleErrors = [];

    page.on("console", (msg) => {
      if (isExpectedError(msg)) {
        return;
      }
      if (msg.type() === "error" || msg.type() === "warning") {
        consoleErrors.push(msg.text());
      }
      /* eslint-disable no-console */
      console.log(`[console][${msg.type()}] ${msg.text()} in ${msg.location().url}`);
      /* eslint-enable no-console */
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
      /* eslint-disable no-console */
      console.error(`[page-error] ${err.message}`);
      console.error(err.stack);
      /* eslint-enable no-console */
    });

    await page.goto(url);
    await page.waitForSelector("#login-button", { timeout: TIMEOUT });
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe("Invalid Credentials", () => {

    it("should show error message with invalid login", async () => {
      await page.type("#username", "invaliduser", { delay: 20 });
      await page.type("#password", "invalidpass", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });

      await page.waitForSelector("#notice-wrapper div.notice_auth_failed");
      const message = await page.$eval("#notice-wrapper div", el => el.textContent);
      assert.include(message.toLowerCase(), "auth", "should show authentication error");
    });

    it("should remain on login page after failed authentication", async () => {
      await page.type("#username", "wronguser", { delay: 20 });
      await page.type("#password", "wrongpass", { delay: 20 });

      await page.click("#login-button");

      const loginPage = await page.evaluate(() => {
        const element = document.querySelector("#page-login");
        return element && element.style.display !== "none";
      });

      assert.isTrue(loginPage, "should remain on login page after failed auth");
    });

  });

  describe("Session Management", () => {

    it("should login successfully with valid credentials", async () => {
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.click("#login-button");
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "minions", "should redirect to minions page after login");
    });

  });

  describe("Console Error Monitoring", () => {

    it("should not have unhandled exceptions during login", async () => {
      // Reset
      consoleErrors = [];

      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      // Filter out expected errors
      const unexpectedErrors = consoleErrors.filter(err =>
        !err.includes("404") && !err.includes("optional")
      );

      assert.isEmpty(unexpectedErrors, `should not have unexpected console errors, but got: ${unexpectedErrors.join(", ")}`);
    });

  });

  describe("Navigation to Non-existent Pages", () => {

    it("should handle navigation to invalid hash", async () => {
      await page.type("#username", "salt", { delay: 20 });
      await page.type("#password", "salt", { delay: 20 });

      await page.evaluate(() => {
        document.querySelector("#login-button").click();
      });
      await page.waitForSelector("#notice-wrapper div.notice_please_wait", { timeout: TIMEOUT });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      await page.goto(url + "#nonexistentpage");
      await page.waitForFunction(() => document.body.children.length > 0, { timeout: TIMEOUT });

      const pageLoaded = await page.evaluate(() =>
        document.body.children.length > 0
      );

      assert.isTrue(pageLoaded, "page should still be usable after invalid navigation");
    });

  });

});
