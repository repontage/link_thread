import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/community/[slug]/threads — list threads in a community
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    const threads = await prisma.communityThread.findMany({
      where: { communityId: community.id },
      orderBy: { addedAt: 'desc' },
      include: {
        addedBy: { select: { id: true, name: true, username: true, image: true } },
      },
      take: 50,
    });

    return NextResponse.json({ success: true, data: threads });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST /api/community/[slug]/threads — add a thread to community
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 10, 60000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { url, title } = body;

    if (!url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    const existing = await prisma.communityThread.findUnique({
      where: { communityId_url: { communityId: community.id, url } },
    });

    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const thread = await prisma.communityThread.create({
      data: {
        communityId: community.id,
        url,
        title: title || null,
        addedById: userId,
      },
      include: {
        addedBy: { select: { id: true, name: true, username: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, data: thread }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
