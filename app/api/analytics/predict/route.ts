import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request: Request) {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Get comments from the last 24 hours
    const recentStats = await prisma.comment.groupBy({
      by: ['url'],
      _count: { url: true },
      where: {
        createdAt: { gte: oneDayAgo },
        url: { not: '' }
      }
    });

    // Get comments from 24h-48h ago
    const previousStats = await prisma.comment.groupBy({
      by: ['url'],
      _count: { url: true },
      where: {
        createdAt: { gte: twoDaysAgo, lt: oneDayAgo },
        url: { not: '' }
      }
    });

    const previousMap = new Map(previousStats.map(s => [s.url, s._count.url]));

    const predictions = recentStats.map(recent => {
      const prevCount = previousMap.get(recent.url) || 0;
      const recentCount = recent._count.url;
      
      // Calculate growth velocity
      const velocity = recentCount - prevCount;
      const growthRate = prevCount > 0 ? (velocity / prevCount) * 100 : 100;
      
      // Trend score is higher for higher growth rate and volume
      const trendScore = (recentCount * 0.5) + (velocity * 1.5);

      return {
        url: recent.url,
        recentCount,
        prevCount,
        velocity,
        growthRate,
        trendScore
      };
    });

    // Sort by highest trend score
    predictions.sort((a, b) => b.trendScore - a.trendScore);

    return NextResponse.json({ success: true, predictions: predictions.slice(0, 10) });
  } catch (error) {
    console.error('Prediction API Error:', error);
    return NextResponse.json({ error: 'Failed to predict trends', details: String(error) }, { status: 500 });
  }
}
