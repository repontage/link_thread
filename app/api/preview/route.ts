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
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'LinkThreadBot/1.0',
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
