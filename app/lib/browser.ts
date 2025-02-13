// TODO rename this file to browser.ts
import puppeteerCore, { Browser as PuppeteerBrowser, Page as PuppeteerPage } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const CHROME_PATH = {
  win32: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  linux: "/usr/bin/google-chrome",
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
};

export class Page {
  page: PuppeteerPage | null = null;

  constructor(page: PuppeteerPage) {
    this.page = page;
  }

  async textContent(element: string) {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    const body = await this.page.$(element);
    return await body?.evaluate((el: Element) => el.textContent) ?? "";
  }

  async goto(url: string) {
    await this.page?.goto(url);
  }

  async close() {
    if (!this.page?.isClosed) {
      await this.page?.close();
      this.page = null;
    }
  }
}

export class Browser {
  browser: PuppeteerBrowser | null = null;
  pages: Record<string, Page> = {}; 

  async launch() {
    const executablePath =
      CHROME_PATH[process.platform as keyof typeof CHROME_PATH];

    if (!executablePath) {
      throw new Error(`Unsupported platform: ${process.platform}`);
    }

    if (!this.browser) {
      this.browser = await puppeteerCore.launch({
        // args: chromium.args, // TODO: check if this is needed
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-first-run",
          "--no-sandbox",
          "--no-zygote",
          "--deterministic-fetch",
          "--disable-features=IsolateOrigins",
          "--disable-site-isolation-trials",
          // '--single-process', // TODO: to fix or remove
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: true,
      });
    }

    this.pages = {};
  }

  async newPage(url: string) {
    const page = await this.browser!.newPage();
    return new Page(page);
  }

  async open(url: string) {
    if (!this.browser) {
      await this.launch();
    }

    const page = this.pages[url] ?? await this.newPage(url);
    await page.goto(url);

    this.pages[url] = page;

    return page;
  }
}