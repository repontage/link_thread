import { NextRequest, NextResponse } from 'next/server';
import { getThreadId, normalizeUrl } from '../../../lib/url-parser';
import prisma from '../../../lib/prisma';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

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
      include: { 
        reactions: true,
        user: {
          include: { badges: true }
        }
      }
    });

    const comments = buildCommentTree(rawComments);

    return NextResponse.json({ 
      success: true, 
      threadId, 
      normalizedUrl: normalized, 
      comments 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'URL 처리 중 오류가 발생했습니다.', details: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 10, 60000)) { // 10 comments per minute
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const authorName = session.user.name || 'Anonymous';

    const body = await req.json();
    const { url, parentId, content } = body;

    if (!url || !content) {
      return NextResponse.json({ error: '필수 항목(url, content)이 누락되었습니다.' }, { status: 400 });
    }

    const threadId = getThreadId(url);


    let validImageUrls: string[] = [];
    if (body.imageUrls && Array.isArray(body.imageUrls)) {
      validImageUrls = body.imageUrls.filter((imgUrl: string) => {
        try {
          const parsedUrl = new URL(imgUrl);
          // Allow only http and https schemas to prevent XSS
          if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      });
    }

    const newComment = await prisma.comment.create({
      data: {
        threadId,
        parentId: parentId || null,
        author: authorName,
        content,
        userId: userId,
        timestamp: body.timestamp || null,
        imageUrls: validImageUrls.length > 0 ? validImageUrls.join(',') : null,
      }
    });

    // Handle Badges
    const userCommentsCount = await prisma.comment.count({ where: { userId } });
    if (userCommentsCount === 1) {
      await prisma.userBadge.upsert({
        where: { userId_badgeType: { userId, badgeType: 'First Comment' } },
        update: {},
        create: { userId, badgeType: 'First Comment' }
      });
    } else if (userCommentsCount === 10) {
      await prisma.userBadge.upsert({
        where: { userId_badgeType: { userId, badgeType: '10 Comments' } },
        update: {},
        create: { userId, badgeType: '10 Comments' }
      });
    }

    // Handle Reply Notification
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.userId && parentComment.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            type: 'reply',
            message: `${authorName}님이 회원님의 댓글에 답글을 남겼습니다: "${content.substring(0, 30)}..."`
          }
        });
      }
    }

    // Handle Mention Notifications
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = Array.from(new Set(Array.from(content.matchAll(mentionRegex), (m: any) => m[1])));
    if (mentions.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: { username: { in: mentions } }
      });
      const notificationsData = mentionedUsers
        .filter(u => u.id !== userId)
        .map(u => ({
          userId: u.id,
          type: 'mention',
          message: `${authorName}님이 댓글에서 회원님을 멘션했습니다: "${content.substring(0, 30)}..."`
        }));
      if (notificationsData.length > 0) {
        await prisma.notification.createMany({ data: notificationsData });
      }
    }

    return NextResponse.json({ success: true, data: { ...newComment, children: [] } }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 30, 60000)) { // 30 reactions/upvotes per minute
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, emoji } = body;

    if (!id) {
      return NextResponse.json({ error: '댓글 ID가 필요합니다.' }, { status: 400 });
    }
    
    const userId = (session.user as any).id;
    const authorName = session.user.name || 'Anonymous';

    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return NextResponse.json({ error: '존재하지 않는 댓글입니다.' }, { status: 404 });
    }

    if (emoji) {
      // Handle Emoji Reaction
      const existingReaction = await prisma.reaction.findUnique({
        where: { commentId_userId_emoji: { commentId: id, userId, emoji } }
      });

      if (existingReaction) {
        // Toggle off
        await prisma.reaction.delete({
          where: { id: existingReaction.id }
        });
      } else {
        await prisma.reaction.create({
          data: { commentId: id, userId, emoji }
        });
        
        // Notify
        if (existingComment.userId && existingComment.userId !== userId) {
          await prisma.notification.create({
            data: {
              userId: existingComment.userId,
              type: 'reaction',
              message: `${authorName}님이 회원님의 댓글에 ${emoji} 반응을 남겼습니다.`
            }
          });
        }
      }

      const updatedReactions = await prisma.reaction.findMany({ where: { commentId: id } });
      return NextResponse.json({ success: true, data: { ...existingComment, reactions: updatedReactions } }, { status: 200 });
    }

    // Legacy upvote fallback
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });

    if (existingComment.userId && existingComment.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: existingComment.userId,
          type: 'like',
          message: `누군가 회원님의 댓글을 좋아합니다.`
        }
      });
    }

    return NextResponse.json({ success: true, data: updatedComment }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
