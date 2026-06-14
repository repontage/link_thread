import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/team — list teams or get single team
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('slug');

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    if (slug) {
      const team = await prisma.team.findUnique({
        where: { slug },
        include: {
          owner: { select: { id: true, name: true, username: true, image: true } },
          members: {
            include: {
              user: { select: { id: true, name: true, username: true, image: true, isPro: true } },
            },
            orderBy: { joinedAt: 'asc' },
          },
          _count: { select: { members: true } },
        },
      });

      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: team });
    }

    // List teams where user is a member
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            owner: { select: { id: true, name: true, username: true } },
            _count: { select: { members: true } },
          },
        },
      },
    });

    const teams = teamMemberships.map(m => m.team);

    return NextResponse.json({ success: true, data: teams });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST /api/team — create a team (Pro users only)
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 3, 60000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const isPro = (session.user as any).isPro;

    if (!isPro) {
      return NextResponse.json({ error: 'Pro subscription required to create teams' }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    const existing = await prisma.team.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Team slug already taken' }, { status: 409 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        description: description || null,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, username: true, image: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, username: true, image: true, isPro: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// PATCH /api/team — add/remove members or update team
export async function PATCH(req: NextRequest) {
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
    const { teamId, action, memberId } = body; // action: 'add_member' | 'remove_member'

    // Verify team ownership
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.ownerId === userId;
    const isAdmin = team.members.some(m => m.userId === userId && m.role === 'ADMIN');

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Only team owner or admin can manage members' }, { status: 403 });
    }

    if (action === 'add_member') {
      if (!memberId) {
        return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
      }

      const existingMember = team.members.find(m => m.userId === memberId);
      if (existingMember) {
        return NextResponse.json({ error: 'User is already a member' }, { status: 409 });
      }

      const member = await prisma.teamMember.create({
        data: {
          teamId,
          userId: memberId,
          role: 'MEMBER',
        },
        include: {
          user: { select: { id: true, name: true, username: true, image: true, isPro: true } },
        },
      });

      return NextResponse.json({ success: true, data: member }, { status: 201 });
    }

    if (action === 'remove_member') {
      if (!memberId) {
        return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
      }

      // Cannot remove the owner
      if (memberId === team.ownerId) {
        return NextResponse.json({ error: 'Cannot remove the team owner' }, { status: 400 });
      }

      await prisma.teamMember.deleteMany({
        where: { teamId, userId: memberId },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action. Use "add_member" or "remove_member"' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
