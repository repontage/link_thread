import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/messages — get messages for current user
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const withUserId = searchParams.get('withUserId'); // conversation partner
  const limit = parseInt(searchParams.get('limit') || '50');
  const cursor = searchParams.get('cursor');

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    if (withUserId) {
      // Get conversation between current user and withUserId
      const whereClause: any = {
        OR: [
          { senderId: userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: userId },
        ],
      };

      if (cursor) {
        whereClause.createdAt = { lt: new Date(cursor) };
      }

      const messages = await prisma.message.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        include: {
          sender: { select: { id: true, name: true, username: true, image: true } },
          receiver: { select: { id: true, name: true, username: true, image: true } },
        },
      });

      const hasMore = messages.length > limit;
      const data = hasMore ? messages.slice(0, limit) : messages;

      // Mark unread messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: userId,
          senderId: withUserId,
          readAt: null,
        },
        data: { readAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        data: data.reverse(), // chronological order
        hasMore,
        nextCursor: hasMore && data.length > 0 ? data[data.length - 1].createdAt.toISOString() : null,
      });
    }

    // Get conversation list (latest message from each conversation)
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, username: true, image: true, isPro: true } },
        receiver: { select: { id: true, name: true, username: true, image: true, isPro: true } },
      },
      take: 100,
    });

    // Group by conversation partner
    const partnerMap = new Map<string, { partner: any; lastMessage: any; unreadCount: number }>();

    for (const msg of conversations) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!partnerMap.has(partner.id)) {
        partnerMap.set(partner.id, { partner, lastMessage: msg, unreadCount: 0 });
      }
      if (msg.receiverId === userId && !msg.readAt) {
        partnerMap.get(partner.id)!.unreadCount++;
      }
    }

    const conversationList = Array.from(partnerMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());

    return NextResponse.json({ success: true, data: conversationList });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST /api/messages — send a message
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 30, 60000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'receiverId and content are required' }, { status: 400 });
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content too long (max 5000 characters)' }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, username: true, image: true } },
        receiver: { select: { id: true, name: true, username: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// PATCH /api/messages — mark messages as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { senderId } = body;

    if (!senderId) {
      return NextResponse.json({ error: 'senderId is required' }, { status: 400 });
    }

    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
