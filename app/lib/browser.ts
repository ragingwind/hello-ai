// TODO rename this file to browser.ts

import chromium from '@sparticuz/chromium-min';
import puppeteerCore, {
  type Browser as PuppeteerBrowser,
  type Page as PuppeteerPage,
} from 'puppeteer-core';

async function getChromeExecutablePath() {
  const chromeBinPath = {
    sparticuz:
      'https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar',
    win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    linux: '/usr/bin/google-chrome',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  };

  return process.env.VERCEL
    ? await chromium.executablePath(chromeBinPath.sparticuz)
    : chromeBinPath[process.platform as keyof typeof chromeBinPath];
}

export class Page {
  page: PuppeteerPage | null = null;

  constructor(page: PuppeteerPage) {
    this.page = page;
  }

  async textContent(element: string) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const body = await this.page.$(element);
    return (await body?.evaluate((el: Element) => el.textContent)) ?? '';
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

  async document() {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return await this.page.evaluate(() => document);
  }

  async html() {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return await this.page.content();
  }
}

export class Browser {
  browser: PuppeteerBrowser | null = null;
  pages: Record<string, Page> = {};

  async launch() {
    const options: any = {
      args: [
        ...chromium.args,
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--disable-extensions',
      ],
      headless: true,
      executablePath: await getChromeExecutablePath(),
      defaultViewport: chromium.defaultViewport,
    };

    if (!this.browser) {
      this.browser = await puppeteerCore.launch(options);
    }

    this.pages = {};
  }

  async newPage() {
    const page = await this.browser?.newPage();
    if (!page) {
      throw new Error('Failed to create new page');
    }
    return new Page(page);
  }

  async open(url: string) {
    if (!this.browser) {
      await this.launch();
    }

    const page = this.pages[url] ?? (await this.newPage());
    await page.goto(url);

    this.pages[url] = page;

    return page;
  }
}
