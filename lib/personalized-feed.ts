import prisma from "./prisma";
import { logger } from "./logger";

export interface FeedItem {
  url: string;
  threadId: string;
  title: string | null;
  commentCount: number;
  upvoteCount: number;
  lastActivity: Date;
  category: string | null;
  score: number;
  reason: string;
}

/**
 * Builds a personalized feed for a given user by analyzing their
 * past comment categories and upvoted threads, then scoring
 * matching content higher.
 */
export async function getPersonalizedFeed(
  userId: string,
  limit: number = 10
): Promise<FeedItem[]> {
  try {
    // 1. Gather user interests from past comments
    const userComments = await prisma.comment.findMany({
      where: { userId },
      select: { category: true, url: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // 2. Gather upvoted/interacted threads
    const userReactions = await prisma.reaction.findMany({
      where: { userId },
      select: {
        Comment: {
          select: { url: true, category: true, threadId: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // 3. Build interest profile: count category frequency
    const categoryWeights = new Map<string, number>();
    const seenUrls = new Set<string>();

    for (const c of userComments) {
      if (c.url) seenUrls.add(c.url);
      if (c.category) {
        categoryWeights.set(c.category, (categoryWeights.get(c.category) || 0) + 2);
      }
    }

    for (const r of userReactions) {
      if (r.Comment?.url) seenUrls.add(r.Comment.url);
      if (r.Comment?.category) {
        categoryWeights.set(
          r.Comment.category,
          (categoryWeights.get(r.Comment.category) || 0) + 3
        );
      }
    }

    // If user has no history, return general trending
    if (categoryWeights.size === 0) {
      return getTrendingFallback(limit);
    }

    // 4. Find threads matching user interests
    const maxCategory = [...categoryWeights.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const topCategories = [...categoryWeights.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    // 5. Query threads in matching categories, excluding user's own threads
    const matchingComments = await prisma.comment.findMany({
      where: {
        category: { in: topCategories },
        url: { not: null, notIn: [""] },
        ...(userComments.length > 0
          ? {
              NOT: {
                url: {
                  in: [...seenUrls],
                },
              },
            }
          : {}),
      },
      select: {
        url: true,
        category: true,
        upvotes: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // 6. Aggregate and score
    const urlMap = new Map<
      string,
      {
        url: string;
        category: string | null;
        totalUpvotes: number;
        count: number;
        lastActivity: Date;
        bestScore: number;
      }
    >();

    for (const c of matchingComments) {
      if (!c.url) continue;
      const existing = urlMap.get(c.url);
      const matchScore = calculateMatchScore(
        c.category,
        categoryWeights,
        c.upvotes,
        c.createdAt
      );
      if (existing) {
        existing.count += 1;
        existing.totalUpvotes += c.upvotes;
        if (c.createdAt > existing.lastActivity)
          existing.lastActivity = c.createdAt;
        if (matchScore > existing.bestScore) existing.bestScore = matchScore;
      } else {
        urlMap.set(c.url, {
          url: c.url,
          category: c.category,
          totalUpvotes: c.upvotes,
          count: 1,
          lastActivity: c.createdAt,
          bestScore: matchScore,
        });
      }
    }

    const sorted = [...urlMap.values()]
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, limit);

    return sorted.map((item) => ({
      url: item.url,
      threadId: item.url
        ? Buffer.from(item.url).toString("base64").slice(0, 32)
        : "",
      title: null,
      commentCount: item.count,
      upvoteCount: item.totalUpvotes,
      lastActivity: item.lastActivity,
      category: item.category,
      score: Math.min(item.bestScore / 100, 1),
      reason: getFeedReason(item.category, item.count),
    }));
  } catch (error) {
    logger.error("[PersonalizedFeed] Error building feed:", error);
    return getTrendingFallback(limit);
  }
}

function calculateMatchScore(
  category: string | null,
  weights: Map<string, number>,
  upvotes: number,
  createdAt: Date
): number {
  let score = 0;

  // Category match bonus
  if (category && weights.has(category)) {
    score += (weights.get(category) || 0) * 10;
  }

  // Upvote bonus
  score += Math.min(upvotes * 5, 50);

  // Recency bonus: content within last 7 days gets +10-30
  const daysOld =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 1) score += 30;
  else if (daysOld < 3) score += 20;
  else if (daysOld < 7) score += 10;

  return score;
}

function getFeedReason(category: string | null, count: number): string {
  if (category === "#tech") return "Based on your interest in technology";
  if (category === "#news") return "From topics you follow";
  if (category === "#qna") return "Similar to questions you've asked";
  if (count > 5) return "Popular in your interest areas";
  return "Recommended for you";
}

async function getTrendingFallback(limit: number): Promise<FeedItem[]> {
  const comments = await prisma.comment.findMany({
    where: { url: { not: null, notIn: [""] } },
    select: { url: true, category: true, upvotes: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const urlMap = new Map<
    string,
    { url: string; category: string | null; count: number; upvotes: number; last: Date }
  >();

  for (const c of comments) {
    if (!c.url) continue;
    const existing = urlMap.get(c.url);
    if (existing) {
      existing.count += 1;
      existing.upvotes += c.upvotes;
      if (c.createdAt > existing.last) existing.last = c.createdAt;
    } else {
      urlMap.set(c.url, {
        url: c.url,
        category: c.category,
        count: 1,
        upvotes: c.upvotes,
        last: c.createdAt,
      });
    }
  }

  return [...urlMap.values()]
    .sort((a, b) => b.count * 10 + b.upvotes * 5 - (a.count * 10 + a.upvotes * 5))
    .slice(0, limit)
    .map((item) => ({
      url: item.url,
      threadId: Buffer.from(item.url).toString("base64").slice(0, 32),
      title: null,
      commentCount: item.count,
      upvoteCount: item.upvotes,
      lastActivity: item.last,
      category: item.category,
      score: Math.min((item.count * 10 + item.upvotes * 5) / 200, 1),
      reason: "Trending now",
    }));
}
