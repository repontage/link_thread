import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'today';

  let dateFilter = new Date();
  if (period === 'today') {
    dateFilter.setDate(dateFilter.getDate() - 1);
  } else if (period === 'month') {
    dateFilter.setMonth(dateFilter.getMonth() - 1);
  } else if (period === 'year') {
    dateFilter.setFullYear(dateFilter.getFullYear() - 1);
  }

  try {
    const trending = await prisma.comment.groupBy({
      by: ['url'],
      _count: { url: true },
      where: {
        createdAt: { gte: dateFilter },
        url: { not: '', notIn: [''] }
      },
      orderBy: { _count: { url: 'desc' } },
      take: 5
    });

    return NextResponse.json({ success: true, trending });
  } catch (error) {
    console.error('Trending API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending data', details: String(error) }, { status: 500 });
  }
}
