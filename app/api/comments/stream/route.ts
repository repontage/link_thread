import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getThreadId } from '@/lib/url-parser';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new Response('Missing URL', { status: 400 });
  }

  const threadId = getThreadId(url);
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let lastCheckedId = '';
      
      // 처음 연결 시 가장 최신 댓글 1개의 ID를 기억
      const latest = await prisma.comment.findFirst({
        where: { threadId, parentId: null },
        orderBy: { createdAt: 'desc' }
      });
      if (latest) lastCheckedId = latest.id;

      // 10초 간격으로 새 댓글 확인 (Push 에뮬레이션)
      const interval = setInterval(async () => {
        try {
          const newComments = await prisma.comment.findMany({
            where: {
              threadId,
              parentId: null,
              createdAt: { gt: latest?.createdAt || new Date(0) }
            },
            orderBy: { createdAt: 'desc' },
            include: { children: { include: { reactions: true } }, reactions: true }
          });

          // 새 댓글이 있으면 클라이언트 측으로 이벤트 푸시
          if (newComments.length > 0 && newComments[0].id !== lastCheckedId) {
            lastCheckedId = newComments[0].id;
            const data = JSON.stringify(newComments);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        } catch (e) {
          // Ignore
        }
      }, 10000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}