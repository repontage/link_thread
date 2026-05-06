import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json({ error: '유효한 URL 파라미터가 필요합니다.' }, { status: 400 });
  }

  try {
    const validUrl = new URL(url); // URL 파싱 테스트
    
    // SSRF 방지: 내부 IP 및 private 도메인 접근 차단
    const hostname = validUrl.hostname;
    const isPrivateIp = (ip: string) => {
      const parts = ip.split('.');
      if (parts.length !== 4) return false;
      const [p1, p2] = parts.map(Number);
      return (
        p1 === 10 ||
        (p1 === 172 && p2 >= 16 && p2 <= 31) ||
        (p1 === 192 && p2 === 168) ||
        p1 === 127 ||
        p1 === 0 ||
        p1 === 169
      );
    };

    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      isPrivateIp(hostname)
    ) {
      return NextResponse.json({ error: '허용되지 않는 URL입니다.' }, { status: 403 });
    }

    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'VoidSayBot/1.0',
      },
      // Some sites might be slow, so add a reasonable timeout or just let fetch handle it.
    });

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
  } catch (error) {
    return NextResponse.json({ title: url, url, error: 'Failed to generate preview' }, { status: 400 });
  }
}
