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
describe("HighState Page", function () {
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

  it("should navigate to highstate page", async () => {
    await page.goto(url + "#highstate");
    await page.waitForFunction(() => document.location.href.includes("#highstate"), { timeout: TIMEOUT });

    const href = await page.evaluate(() => document.location.href);
    assert.include(href, "highstate");
  });

  it("should display highstate page with content", async () => {
    await page.goto(url + "#highstate");

    await page.waitForFunction(() => {
      const highstatePage = document.querySelector("#page-highstate");
      return highstatePage && highstatePage.style.display !== "none";
    }, { timeout: TIMEOUT });

    const pageVisible = await page.evaluate(() => {
      const page = document.querySelector("#page-highstate");
      return page !== null;
    });

    assert.isTrue(pageVisible, "highstate page should be visible");
  });

  it("should display highstate content", async () => {
    await page.goto(url + "#highstate");
    await page.waitForFunction(() => document.location.href.includes("#highstate"), { timeout: TIMEOUT });

    const hasContent = await page.evaluate(() => {
      const content = document.querySelector("#page-highstate [class*='content'], #page-highstate table, #page-highstate div");
      return content !== null;
    });

    assert.isTrue(hasContent, "highstate page should display some content");
  });

});
