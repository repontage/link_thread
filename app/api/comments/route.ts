import { NextRequest, NextResponse } from 'next/server';
import { getThreadId, normalizeUrl } from '../../../lib/url-parser';
import prisma from '../../../lib/prisma';
import { auth } from '@/auth';

// 트리를 구성하는 헬퍼 함수
const buildCommentTree = (comments: any[]): any[] => {
  const map = new Map<string, any>();
  const roots: any[] = [];

  // 각 코멘트 초기화 및 맵에 추가
  comments.forEach(comment => {
    map.set(comment.id, { ...comment, children: [] });
  });

  // 트리 구조 형성
  comments.forEach(comment => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.children.push(map.get(comment.id));
      } else {
        // 부모가 없으면 루트로 간주
        roots.push(map.get(comment.id));
      }
    } else {
      roots.push(map.get(comment.id));
    }
  });

  return roots;
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json({ error: '유효한 url 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }

  try {
    const normalized = normalizeUrl(url);
    const threadId = getThreadId(url);
    
    // Prisma를 통해 데이터베이스에서 코멘트 조회
    const rawComments = await prisma.comment.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });

    const comments = buildCommentTree(rawComments);

    return NextResponse.json({ 
      success: true, 
      threadId, 
      normalizedUrl: normalized, 
      comments 
    });
  } catch (error) {
    return NextResponse.json({ error: 'URL 처리 중 오류가 발생했습니다.' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { url, parentId, author, content } = body;

    if (!url || !author || !content) {
      return NextResponse.json({ error: '필수 항목(url, author, content)이 누락되었습니다.' }, { status: 400 });
    }

    const threadId = getThreadId(url);

    const newComment = await prisma.comment.create({
      data: {
        threadId,
        parentId: parentId || null,
        author,
        content,
        userId: userId,
      }
    });

    return NextResponse.json({ success: true, data: { ...newComment, children: [] } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: '댓글 ID가 필요합니다.' }, { status: 400 });
    }

    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return NextResponse.json({ error: '존재하지 않는 댓글입니다.' }, { status: 404 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: updatedComment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
