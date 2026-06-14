import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// POST /api/follow — follow or unfollow a user
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { followingId, action } = body; // action: 'follow' | 'unfollow'

    if (!followingId) {
      return NextResponse.json({ error: 'followingId is required' }, { status: 400 });
    }

    if (userId === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Verify the user exists
    const targetUser = await prisma.user.findUnique({ where: { id: followingId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'follow') {
      const existing = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId } },
      });

      if (existing) {
        return NextResponse.json({ success: true, data: { following: true } });
      }

      await prisma.follow.create({
        data: { followerId: userId, followingId },
      });

      return NextResponse.json({ success: true, data: { following: true } }, { status: 201 });
    } else if (action === 'unfollow') {
      await prisma.follow.deleteMany({
        where: { followerId: userId, followingId },
      });

      return NextResponse.json({ success: true, data: { following: false } });
    }

    return NextResponse.json({ error: 'Invalid action. Use "follow" or "unfollow"' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// GET /api/follow — check follow status or get followers/following
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const type = searchParams.get('type'); // 'followers' | 'following'
  const checkFollowing = searchParams.get('checkFollowing'); // userId to check if current user follows

  try {
    if (checkFollowing) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ following: false });
      }
      const currentUserId = (session.user as any).id;
      const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: checkFollowing } },
      });
      return NextResponse.json({ following: !!follow });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (type === 'followers') {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: { select: { id: true, name: true, username: true, image: true, isPro: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json({ success: true, data: followers });
    } else if (type === 'following') {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: { select: { id: true, name: true, username: true, image: true, isPro: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json({ success: true, data: following });
    }

    // Return counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { followersCount, followingCount },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
