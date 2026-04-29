import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '../../../../lib/prisma';



export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [totalUsers, totalComments, totalReports] = await Promise.all([
      prisma.user.count(),
      prisma.comment.count(),
      prisma.report.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalComments,
      totalReports,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
