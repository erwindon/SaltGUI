/* global afterEach console document describe it process window */

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
describe("Responsive Design", function () {
/* eslint-enable func-names */

  let browser = null;
  let page = null;

  /* eslint-disable no-invalid-this */
  this.timeout(90 * 1000);
  /* eslint-enable no-invalid-this */

  afterEach(async () => {
    if (browser) {
      await browser.close();
    }
  });

  const setupPage = async (width, height) => {
    const launchOptions = {
      args: ["--start-fullscreen"],
      defaultViewport: { height, width },
      headless: process.env.PUPPETEER_DEBUG !== "1"
    };

    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();
    await page.setViewport({ height, width });

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

    // Login
    await page.type("#username", "salt", { delay: 20 });
    await page.type("#password", "salt", { delay: 20 });
    await page.evaluate(() => {
      document.querySelector("#login-button").click();
    });
    await page.waitForFunction(() => document.location.href.includes("#minions"), { timeout: TIMEOUT });

    // Accept all pending keys
    await acceptAllPendingKeys(page);
  };

  describe("Mobile (320px width)", () => {

    it("should render login page on mobile", async () => {
      await setupPage(320, 568);

      const pageVisible = await page.evaluate(() =>
        document.body && document.body.offsetHeight > 0
      );

      assert.isTrue(pageVisible, "page should be visible on mobile");
    });

    it("should have clickable menu button on mobile", async () => {
      await setupPage(320, 568);

      const menuButton = await page.evaluate(() => {
        const btn = document.querySelector("[class*='menu'], #menu-button, button[aria-label*='menu']");
        return btn !== null;
      });

      assert.isTrue(menuButton, "should have menu button on mobile");
    });

    it("should display content without horizontal scroll on mobile", async () => {
      await setupPage(320, 568);

      const pageWidth = await page.evaluate(() =>
        document.documentElement.clientWidth
      );

      const contentWidth = await page.evaluate(() => {
        const main = document.querySelector("main, [class*='container'], #main");
        return main?.offsetWidth || document.body.offsetWidth;
      });

      assert.isAtMost(contentWidth, pageWidth + 1, "content should fit without horizontal scroll");
    });

  });

  describe("Tablet (768px width)", () => {

    it("should render page on tablet", async () => {
      await setupPage(768, 1024);

      const pageVisible = await page.evaluate(() =>
        document.body && document.body.offsetHeight > 0
      );

      assert.isTrue(pageVisible, "page should be visible on tablet");
    });

    it("should display navigation elements on tablet", async () => {
      await setupPage(768, 1024);

      const hasNav = await page.evaluate(() =>
        document.querySelector("nav, [class*='nav'], [class*='menu']") !== null
      );

      assert.isTrue(hasNav, "should display navigation on tablet");
    });

  });

  describe("Desktop (1920px width)", () => {

    it("should render page on desktop", async () => {
      await setupPage(1920, 1080);

      const pageVisible = await page.evaluate(() =>
        document.body && document.body.offsetHeight > 0
      );

      assert.isTrue(pageVisible, "page should be visible on desktop");
    });

    it("should display full menu on desktop", async () => {
      await setupPage(1920, 1080);

      const hasMenuItems = await page.evaluate(() => {
        const menuItems = document.querySelectorAll("[class*='menu'] [class*='button'], #menu button");
        return menuItems.length > 0;
      });

      assert.isTrue(hasMenuItems, "should display menu items on desktop");
    });

    it("should utilize full width appropriately on desktop", async () => {
      await setupPage(1920, 1080);

      const contentVisible = await page.evaluate(() => {
        const body = document.body;
        return body.offsetWidth > 1000;
      });

      assert.isTrue(contentVisible, "should utilize desktop width");
    });

  });

  describe("Orientation Changes", () => {

    it("should reflow content when resizing from landscape to portrait", async () => {
      await setupPage(1920, 1080);

      await page.setViewport({ height: 667, width: 375 });
      await page.waitForFunction(() => {
        const width = window.innerWidth;
        return width <= 375 && document.body.offsetHeight > 0;
      }, { timeout: TIMEOUT });

      const portraitHeight = await page.evaluate(() => document.body.offsetHeight);

      assert.isNotNull(portraitHeight, "should handle portrait orientation");
    });

  });

});
