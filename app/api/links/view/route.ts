import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getThreadId } from '../../../../lib/url-parser';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const threadId = getThreadId(url);

    const stats = await prisma.linkStats.upsert({
      where: { threadId },
      update: {
        views: { increment: 1 },
      },
      create: { id: crypto.randomUUID(), url, threadId, views: 1, updatedAt: new Date() },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to update link views:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
