import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { rateLimit } from '@/lib/rate-limit';
import { checkSSRF } from '@/lib/ssrf-check';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 20, 60000)) { // 20 requests per minute
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json({ error: '유효한 URL 파라미터가 필요합니다.' }, { status: 400 });
  }

  try {
    // SSRF 방지: DNS 해석 기반 내부 IP 접근 차단
    const safe = await checkSSRF(url);
    if (!safe) {
      return NextResponse.json({ error: '허용되지 않는 URL입니다.' }, { status: 403 });
    }

    const validUrl = new URL(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'VoidSayBot/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const getMetaTag = (name: string) => 
      $(`meta[property="${name}"]`).attr('content') || 
      $(`meta[name="${name}"]`).attr('content') || 
      $(`meta[property="og:${name}"]`).attr('content') || 
      $(`meta[name="og:${name}"]`).attr('content') || 
      '';

    const title = getMetaTag('og:title') || $('title').text() || url;
    const description = getMetaTag('og:description') || getMetaTag('description');
    const image = getMetaTag('og:image') || getMetaTag('image');

    return NextResponse.json({
      title,
      description,
      image,
      url,
    });
  } catch (_error) {
    return NextResponse.json({ title: url, url, error: 'Failed to generate preview' }, { status: 400 });
  }
}
