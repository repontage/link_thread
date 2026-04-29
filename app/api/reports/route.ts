import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '../../../lib/prisma';



export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId, reason } = await req.json();

    if (!commentId || !reason) {
      return NextResponse.json({ error: 'Missing commentId or reason' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        commentId,
        reporterId: session.user.id,
        reason,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to submit report:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
