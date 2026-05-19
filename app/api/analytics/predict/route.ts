import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request: Request) {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Get comments from the last 24 hours including upvotes sum
    const recentStats = await prisma.comment.groupBy({
      by: ['url'],
      _count: { url: true },
      _sum: { upvotes: true },
      where: {
        createdAt: { gte: oneDayAgo },
        url: { not: null }
      }
    });

    // Get comments from 24h-48h ago
    const previousStats = await prisma.comment.groupBy({
      by: ['url'],
      _count: { url: true },
      _sum: { upvotes: true },
      where: {
        createdAt: { gte: twoDaysAgo, lt: oneDayAgo },
        url: { not: null }
      }
    });

    const previousCountMap = new Map(previousStats.map(s => [String(s.url), s._count.url]));
    const previousUpvotesMap = new Map(previousStats.map(s => [String(s.url), s._sum.upvotes || 0]));

    const predictions = recentStats.map(recent => {
      const url = String(recent.url);
      const prevCount = previousCountMap.get(url) || 0;
      const recentCount = recent._count.url;
      
      const prevUpvotes = previousUpvotesMap.get(url) || 0;
      const recentUpvotes = recent._sum.upvotes || 0;
      
      // Calculate growth velocity for comments and upvotes
      const commentVelocity = recentCount - prevCount;
      const upvoteVelocity = recentUpvotes - prevUpvotes;
      
      const growthRate = prevCount > 0 ? (commentVelocity / prevCount) * 100 : 100;
      
      // Trend score is a combination of volume, velocity, and upvotes
      const trendScore = (recentCount * 0.5) + (commentVelocity * 1.5) + (recentUpvotes * 2.0) + (upvoteVelocity * 1.0);

      return {
        url,
        recentCount,
        prevCount,
        commentVelocity,
        recentUpvotes,
        prevUpvotes,
        upvoteVelocity,
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
