import { NextRequest, NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// async function screenshot(url: string) {
//   const options = process.env.AWS_REGION
//     ? {
//         args: chrome.args,
//         executablePath: await chrome.executablePath,
//         headless: chrome.headless
//       }
//     : {
//         args: [],
//         executablePath:
//           process.platform === 'win32'
//             ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
//             : process.platform === 'linux'
//             ? '/usr/bin/google-chrome'
//             : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
//       };
//   const browser = await puppeteer.launch(options);
//   const page = await browser.newPage();
//   await page.setViewport({ width: 2000, height: 1000 });
//   await page.goto(url, { waitUntil: 'networkidle0' });
//   return await page.screenshot({ type: 'png' });
// }

async function getBrowser() {
  const executablePath =
    process.platform === "win32"
      ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "linux"
      ? "/usr/bin/google-chrome"
      : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  // const executablePath = await chromium.executablePath();

  const browser = await puppeteerCore.launch({
    // args: chromium.args,
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
      // '--single-process', // to fix 
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });

  return browser;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url') || 'https://example.com';

  const browser = await getBrowser();
  console.log("Browser launched");

  const page = await browser.newPage();
  console.log("Page created");

  await page.setViewport({ width: 2000, height: 1000 });

  console.log(`Navigating to ${targetUrl}`);

  await page.goto(targetUrl);
  const bodyText = await page.evaluate(() => {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());
    
    // Get the body text
    return document.body.innerText;
  });
  
  await browser.close();
  
  console.log("Extracted text:", bodyText);
  
  return new NextResponse(bodyText);
}
