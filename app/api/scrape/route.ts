import { Readability } from '@paoramen/cheer-reader';
import { load } from 'cheerio';
import { NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { Browser } from '@/app/lib/browser';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('No target URL provided');
  }

  const browser = new Browser();
  const page = await browser.open(targetUrl);
  const html = await page.html();

  if (!html) {
    return new NextResponse('No content found');
  }

  const { content } = new Readability(load(html)).parse();

  if (!content) {
    return new NextResponse('No content found');
  }

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
  });

  const md = turndownService.turndown(content);

  return new NextResponse(md);
}
