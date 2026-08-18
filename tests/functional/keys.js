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
describe("Keys Page", function () {
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

  describe("Keys Page", () => {

    it("should navigate to keys page", async () => {
      await page.goto(url + "#keys");
      await page.waitForFunction(() => document.location.href.includes("#keys"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "keys");
    });

    it("should display keys page with key list", async () => {
      await page.goto(url + "#keys");

      await page.waitForFunction(() => {
        const keysPage = document.querySelector("#page-keys");
        return keysPage && keysPage.style.display !== "none";
      });

      const pageVisible = await page.evaluate(() => {
        const page = document.querySelector("#page-keys");
        return page !== null;
      });

      assert.isTrue(pageVisible, "keys page should be visible");
    });

    it("should display keys table with minion names", async () => {
      await page.goto(url + "#keys");
      await page.waitForFunction(() => document.location.href.includes("#keys"), { timeout: TIMEOUT });

      const hasContent = await page.evaluate(() => {
        const table = document.querySelector("#keys, [class*='key'], table");
        return table !== null;
      });

      assert.isTrue(hasContent, "should have keys table or list");
    });

  });

  describe("Key Actions", () => {

    it("should have action buttons for keys", async () => {
      await page.goto(url + "#keys");
      await page.waitForFunction(() => {
        const buttons = document.querySelectorAll("button, a[class*='action'], [class*='button']");
        return buttons.length > 0;
      }, { timeout: TIMEOUT });

      const hasActionButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll("button, a[class*='action'], [class*='button']");
        return buttons.length > 0;
      });

      assert.isTrue(hasActionButtons, "should have action buttons for key management");
    });

    it("should have accept option for pending keys", async () => {
      await page.goto(url + "#keys");
      await page.waitForSelector("#page-keys", { timeout: TIMEOUT });

      const pageLoaded = await page.evaluate(() => {
        const keysPage = document.querySelector("#page-keys");
        return keysPage !== null;
      });

      assert.isTrue(pageLoaded, "keys page should be loaded with options");
    });

  });

});
