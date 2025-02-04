import { NextRequest, NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { log } from "console";

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

export async function GET(req: Request, res: Response) {
  const browser = await getBrowser();
  console.log("Browser launched", browser);

  const page = await browser.newPage();
  console.log("Page created", page);

  await page.setViewport({ width: 2000, height: 1000 });

  console.log("Navigating to example.com");

  await page.goto("https://example.com");
  const body = await page.$("title");
  // const pdf = await page.pdf();
  // const ss = await page.screenshot({ type: 'png' })
  await browser.close();

  
  log("Body", body?.toString());
  // return new NextResponse(ss, {
  //   headers: {
  //     "Content-Type": "application/octet-stream",
  //   },
  // });

  return new NextResponse(body?.toString());
}
