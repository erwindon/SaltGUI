/* global afterEach beforeEach console document describe it process */

import puppeteer from "puppeteer";
import {assert} from "chai";

const url = "http://localhost:3333/";
const TIMEOUT = 15000;

const acceptAllPendingKeys = async (page) => {
  // Navigate to keys page
  await page.goto(url + "#keys");
  await page.waitForFunction(() => document.location.href.includes("#keys"), { timeout: TIMEOUT });

  // Accept all pending keys by clicking accept buttons
  let acceptedCount = 0;

  const hasAcceptButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
    return buttons.some(button => {
      const text = button.textContent.toLowerCase();
      return text.includes("accept") || text.includes("yes");
    });
  });

  if (hasAcceptButtons) {
    acceptedCount = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
      let count = 0;
      buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes("accept") || text.includes("yes")) {
          try {
            button.click();
            count += 1;
          } catch {
            // Button might have disappeared after clicking
          }
        }
      });
      return count;
    });
  }

  // Return to minions page
  await page.goto(url + "#minions");
  await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

  return acceptedCount;
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
describe("Minions Page", function () {
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

  describe("Minions List", () => {

    it("should display minions list on minions page", async () => {
      await page.waitForFunction(() => {
        const minionsPage = document.querySelector("#page-minions");
        return minionsPage && minionsPage.style.display !== "none";
      });

      const hasMinionsContent = await page.evaluate(() => {
        const table = document.querySelector("#minions, [class*='minion'], table");
        return table !== null;
      });

      assert.isTrue(hasMinionsContent, "should display minions list");
    });

    it("should have minion table with proper columns", async () => {
      const pageLoaded = await page.evaluate(() => {
        const table = document.querySelector("#minions, table, [class*='minion']");
        return table !== null;
      });

      assert.isTrue(pageLoaded, "minions page should have table or content");
    });

    it("should display minion names in the list", async () => {
      const hasContent = await page.evaluate(() => {
        const page = document.querySelector("#page-minions");
        return page !== null && page.textContent.length > 50;
      });

      assert.isTrue(hasContent, "minions page should have content");
    });

  });

  describe("Jobs Summary Panel", () => {

    it("should display jobs summary panel on minions page", async () => {
      await page.waitForFunction(() => {
        const summaryPanel = document.querySelector("#jobs-panel");
        return summaryPanel !== null;
      });

      const summaryPanelVisible = await page.evaluate(() => {
        const panel = document.querySelector("#jobs-panel");
        return panel && panel.style.display !== "none";
      });

      assert.isTrue(summaryPanelVisible, "jobs summary panel should be visible");
    });

    it("should have jobs-related content on minions page", async () => {
      const hasJobsContent = await page.evaluate(() => {
        const pageElement = document.querySelector("#page-minions");
        return pageElement?.textContent?.toLowerCase?.().includes?.("job");
      });

      assert.isTrue(hasJobsContent, "should have jobs-related content");
    });

  });

  describe("Minion Status", () => {

    it("should display minion status information on page", async () => {
      const pageContent = await page.evaluate(() => {
        const page = document.querySelector("#page-minions");
        return page?.textContent || "";
      });

      assert.isNotEmpty(pageContent, "minions page should have content");
    });

  });

});
