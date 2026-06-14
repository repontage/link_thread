import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/feed/following — comments from users the current user follows
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '20');
  const cursor = searchParams.get('cursor'); // createdAt timestamp for pagination

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get list of users being followed
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map(f => f.followingId);

    if (followingIds.length === 0) {
      return NextResponse.json({ success: true, data: [], hasMore: false });
    }

    const whereClause: any = {
      userId: { in: followingIds },
      isToxic: false,
    };

    if (cursor) {
      whereClause.createdAt = { lt: new Date(cursor) };
    }

    const comments = await prisma.comment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        User: { select: { id: true, name: true, username: true, image: true, isPro: true } },
        Reaction: true,
      },
    });

    const hasMore = comments.length > limit;
    const data = hasMore ? comments.slice(0, limit) : comments;

    return NextResponse.json({
      success: true,
      data,
      hasMore,
      nextCursor: hasMore && data.length > 0 ? data[data.length - 1].createdAt.toISOString() : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
