/* global afterEach beforeEach console document describe it MouseEvent process */

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
describe("Navigation and Menu", function () {
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

  describe("Page Navigation", () => {

    it("Minions page should be default after login", async () => {
      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "minions");
    });

    it("should navigate to Keys page via menu button", async () => {
      await page.waitForFunction(() => document.querySelector("#button-keys1"));
      await page.evaluate(() => {
        document.querySelector("#button-keys1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("#keys"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "keys");
    });

    it("should navigate to Jobs page via menu button", async () => {
      await page.waitForFunction(() => document.querySelector("#button-jobs1"));
      await page.evaluate(() => {
        document.querySelector("#button-jobs1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("#jobs"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "jobs");
    });

    it("should navigate to Grains page via menu button", async () => {
      await page.waitForFunction(() => document.querySelector("#button-grains1"));
      await page.evaluate(() => {
        document.querySelector("#button-grains1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("#grains"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "grains");
    });

    it("should navigate to Pillars page via menu button", async () => {
      await page.waitForFunction(() => document.querySelector("#button-pillars1"));
      await page.evaluate(() => {
        document.querySelector("#button-pillars1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("#pillars"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "pillars");
    });

    it("should navigate to Options page via Ctrl+click on logo", async () => {
      await page.evaluate(() => {
        const event = new MouseEvent("click", { bubbles: true, ctrlKey: true });
        document.querySelector("#logo").dispatchEvent(event);
      });
      await page.waitForFunction(() => document.location.href.includes("#options"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "options");
    });

    it("should navigate via URL hash directly", async () => {
      await page.goto(url + "#keys");
      await page.waitForFunction(() => document.location.href.includes("#keys"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "keys");
    });

    it("should return to Minions when clicking minions button", async () => {
      await page.waitForFunction(() => document.querySelector("#button-jobs1"));
      await page.evaluate(() => {
        document.querySelector("#button-jobs1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("#jobs"), { timeout: TIMEOUT });

      await page.waitForFunction(() => document.querySelector("#button-minions1"));
      await page.evaluate(() => {
        document.querySelector("#button-minions1").click();
      });
      await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

      const href = await page.evaluate(() => document.location.href);
      assert.include(href, "minions");
    });

  });

});
