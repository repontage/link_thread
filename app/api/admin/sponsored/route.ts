import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/sponsored — list all sponsored links (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const sponsoredLinks = await prisma.sponsoredLink.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: sponsoredLinks });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST /api/admin/sponsored — create or update sponsored link
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { id, url, title, description, sponsorName, imageUrl, active } = body;

    if (!url || !title || !sponsorName) {
      return NextResponse.json({ error: 'url, title, and sponsorName are required' }, { status: 400 });
    }

    if (id) {
      // Update existing
      const updated = await prisma.sponsoredLink.update({
        where: { id },
        data: { url, title, description: description || null, sponsorName, imageUrl: imageUrl || null, active: active ?? true },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Create new
    const created = await prisma.sponsoredLink.create({
      data: {
        url,
        title,
        description: description || null,
        sponsorName,
        imageUrl: imageUrl || null,
        active: active ?? true,
      },
    });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/sponsored — delete a sponsored link
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.sponsoredLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
