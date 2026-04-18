import crypto from 'crypto';

/**
 * URL 문자열을 파싱하고 정규화합니다.
 * - 프로토콜(http, https) 및 www. 제거
 * - trailing slash 제거
 * - 유튜브 등 특정 도메인의 불필요한 쿼리 파라미터 제거 (예: v만 남김)
 */
export function normalizeUrl(urlStr: string): string {
  try {
    const withProtocol = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    const url = new URL(withProtocol);

    let host = url.hostname;
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }

    let pathname = url.pathname;
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }
    if (pathname === '/') {
      pathname = '';
    }

    const params = new URLSearchParams();
    if (host === 'youtube.com' || host === 'youtu.be') {
      const v = url.searchParams.get('v');
      if (v) params.set('v', v);
    }

    const search = params.toString() ? `?${params.toString()}` : '';

    return `${host}${pathname}${search}`;
  } catch (error) {
    // 파싱 실패 시 기본적인 문자열 처리로 대체
    return urlStr.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }
}

/**
 * 정규화된 URL을 기반으로 고유 식별자(threadId)를 생성합니다.
 */
export function getThreadId(url: string): string {
  const normalized = normalizeUrl(url);
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}
