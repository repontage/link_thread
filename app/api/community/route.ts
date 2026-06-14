import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/community — list communities
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const community = await prisma.community.findUnique({
        where: { slug },
        include: {
          creator: { select: { id: true, name: true, username: true, image: true } },
          _count: { select: { threads: true } },
        },
      });
      if (!community) {
        return NextResponse.json({ error: 'Community not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: community });
    }

    const communities = await prisma.community.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, username: true, image: true } },
        _count: { select: { threads: true } },
      },
      take: 50,
    });

    return NextResponse.json({ success: true, data: communities });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST /api/community — create a community
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { slug, name, description } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: 'slug and name are required' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    const existing = await prisma.community.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Community slug already taken' }, { status: 409 });
    }

    const community = await prisma.community.create({
      data: {
        slug,
        name,
        description: description || null,
        creatorId: userId,
      },
    });

    return NextResponse.json({ success: true, data: community }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
