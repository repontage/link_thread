import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        comment: {
          select: { id: true, content: true, author: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { reportId, status } = await req.json();

    if (!reportId || !['PENDING', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Failed to update report status:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
