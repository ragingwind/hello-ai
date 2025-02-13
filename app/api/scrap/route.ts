import { NextRequest, NextResponse } from 'next/server';
import { Browser } from '../../lib/browser';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  const browser = new Browser();
  const page = await browser.open(url);
  const content = await page.textContent("body");
  
  return new NextResponse(content);
}
