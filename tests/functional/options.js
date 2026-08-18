/* global afterEach beforeEach console document describe it process */

import puppeteer from "puppeteer";
import {assert} from "chai";

const url = "http://localhost:3333/";
const TIMEOUT = 15000;

const acceptAllPendingKeys = async (page) => {
  await page.goto(url + "#keys");
  await page.waitForFunction(() => document.location.href.includes("#keys"), { timeout: TIMEOUT });

  const hasAcceptButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
    return buttons.some(button => {
      const text = button.textContent.toLowerCase();
      return text.includes("accept") || text.includes("yes");
    });
  });

  if (hasAcceptButtons) {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
      buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes("accept") || text.includes("yes")) {
          try {
            button.click();
          } catch {
            // Button might have disappeared
          }
        }
      });
    });
  }

  await page.goto(url + "#minions");
  await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });
};

const optionalFiles = [
  "/static/minions.txt",
  "/static/salt-auth.txt",
  "/static/salt-motd.html",
  "/static/salt-motd.txt"
];

const isMissingOptionalFile = (msg) => msg.text().includes("404") &&
  optionalFiles.some((file) => msg.location().url.endsWith(file));

/* eslint-disable func-names */
describe("Options Page", function () {
/* eslint-enable func-names */

  let browser = null;
  let page = null;

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

    page.on("console", (msg) => {
      if (isMissingOptionalFile(msg)) {
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

    // Login first
    await page.type("#username", "salt", { delay: 20 });
    await page.type("#password", "salt", { delay: 20 });
    await page.evaluate(() => {
      document.querySelector("#login-button").click();
    });
    await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

    // Accept all pending keys
    await acceptAllPendingKeys(page);
  });

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe("Options Page Display", () => {

    it("should navigate to options page", async () => {
      await page.goto(url + "#options");
      await page.waitForFunction(() => document.location.href.includes("#options"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "options");
    });

    it("should display options page with content", async () => {
      await page.goto(url + "#options");
      await page.waitForFunction(() => document.location.href.includes("#options"), { timeout: TIMEOUT });

      await page.waitForFunction(() => {
        const optionsPage = document.querySelector("#page-options");
        return optionsPage && optionsPage.style.display !== "none";
      });

      const pageVisible = await page.evaluate(() => {
        const page = document.querySelector("#page-options");
        return page !== null;
      });

      assert.isTrue(pageVisible, "options page should be visible");
    });

  });

  describe("Options Configuration", () => {

    it("should display option controls or form", async () => {
      await page.goto(url + "#options");
      await page.waitForFunction(() => document.location.href.includes("#options"), { timeout: TIMEOUT });

      const hasControls = await page.waitForFunction(() => {
        const table = document.querySelector("#options-panel table");
        const inputs = document.querySelectorAll("#options-panel input, #options-panel select, #options-panel textarea");
        return table !== null || inputs.length > 0;
      }, { timeout: TIMEOUT });

      assert.isTrue(!!hasControls, "should display form controls or table for options");
    });

    it("should have input controls for options", async () => {
      await page.goto(url + "#options");
      await page.waitForFunction(() => document.location.href.includes("#options"), { timeout: TIMEOUT });

      const hasInputs = await page.waitForFunction(() => {
        const inputs = document.querySelectorAll("#options-panel input, #options-panel select");
        return inputs.length > 0;
      }, { timeout: TIMEOUT });

      assert.isTrue(!!hasInputs, "should have input fields for changing options");
    });

  });

});
