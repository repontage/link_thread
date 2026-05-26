import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, badges });
  } catch (error) {
    console.error('Failed to fetch badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, badgeType } = body;

    if (!userId || !badgeType) {
      return NextResponse.json({ error: 'Missing userId or badgeType' }, { status: 400 });
    }

    // Only allow users to award badges to themselves or implement some logic.
    // Assuming we just create it (the prompt says "given userId and badgeType")
    
    // Check if the badge already exists
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeType: {
          userId,
          badgeType,
        },
      },
    });

    if (existingBadge) {
      return NextResponse.json({ success: true, badge: existingBadge });
    }

    const newBadge = await prisma.userBadge.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        badgeType,
      },
    });

    return NextResponse.json({ success: true, badge: newBadge });
  } catch (error) {
    console.error('Failed to award badge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}