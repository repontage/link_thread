/**
 * Content Curator — Smart Curation Algorithm
 * 
 * Scores threads on multiple dimensions to surface high-quality,
 * diverse, and engaging content automatically.
 * 
 * Dimensions:
 *  - Engagement (comments + upvotes): 35%
 *  - Quality (avg comment length, depth): 25%
 *  - Recency (freshness bonus): 20%
 *  - Diversity (category balance): 10%
 *  - Velocity (growth trend): 10%
 */

import prisma from "@/lib/prisma";

export interface CuratedThread {
  url: string;
  threadId: string;
  title: string | null;
  commentCount: number;
  upvoteCount: number;
  avgCommentLength: number;
  lastActivity: Date;
  category: string | null;
  score: number;
  scoreBreakdown: {
    engagement: number;
    quality: number;
    recency: number;
    diversity: number;
    velocity: number;
  };
}

const MAX_RESULTS = 8;
const RECENT_WINDOW_HOURS = 72; // how recent for freshness bonus

function clampScore(value: number, max: number): number {
  return Math.min(value / max, 1.0);
}

/**
 * Scores a set of threads and returns curated picks sorted by overall score.
 */
export async function getCuratedContent(): Promise<CuratedThread[]> {
  const now = new Date();
  const recentThreshold = new Date(now.getTime() - RECENT_WINDOW_HOURS * 60 * 60 * 1000);

  // 1. Fetch all threads with aggregated stats
  const threads = await prisma.comment.groupBy({
    by: ["url", "threadId"],
    _count: { id: true },
    _sum: { upvotes: true },
    _max: { createdAt: true },
    _min: { createdAt: true },
    where: {
      url: { not: null },
      parentId: null, // only top-level, not replies
    },
  });

  if (!threads.length) return [];

  // 2. Fetch category info and comment lengths for quality assessment
  const allComments = await prisma.comment.findMany({
    where: {
      url: { not: null },
    },
    select: {
      threadId: true,
      content: true,
      url: true,
      category: true,
      createdAt: true,
      upvotes: true,
    },
    orderBy: { createdAt: "desc" },
    take: 500, // reasonable sample for performance
  });

  // 3. Fetch link stats for view counts
  const linkStats = await prisma.linkStats.findMany({
    select: { threadId: true, views: true },
  });
  const viewsMap = new Map(linkStats.map(s => [s.threadId, s.views]));

  // 4. Compute per-thread metrics
  const threadMap = new Map<string, {
    threadId: string;
    url: string;
    commentCount: number;
    upvoteSum: number;
    lastActivity: Date;
    firstActivity: Date;
    totalContentLength: number;
    category: string | null;
    views: number;
    recentCommentCount: number;
    recentUpvotes: number;
    olderCommentCount: number;
    olderUpvotes: number;
  }>();

  // Initialize from groupBy results
  for (const t of threads) {
    const tid = t.threadId || "unknown";
    threadMap.set(tid, {
      threadId: tid,
      url: t.url || "",
      commentCount: t._count.id,
      upvoteSum: t._sum.upvotes || 0,
      lastActivity: t._max.createdAt || now,
      firstActivity: t._min.createdAt || now,
      totalContentLength: 0,
      category: null,
      views: viewsMap.get(tid) || 0,
      recentCommentCount: 0,
      recentUpvotes: 0,
      olderCommentCount: 0,
      olderUpvotes: 0,
    });
  }

  // Enrich with comment-level details
  for (const c of allComments) {
    const entry = threadMap.get(c.threadId);
    if (!entry) continue;
    entry.totalContentLength += c.content?.length || 0;
    if (c.category && !entry.category) entry.category = c.category;

    // Split into recent vs older for velocity calculation
    if (c.createdAt >= recentThreshold) {
      entry.recentCommentCount++;
      entry.recentUpvotes += c.upvotes || 0;
    } else {
      entry.olderCommentCount++;
      entry.olderUpvotes += c.upvotes || 0;
    }
  }

  // 5. Compute global max values for normalization
  let maxComments = 1;
  let maxUpvotes = 1;
  let maxAvgLength = 1;
  let maxViews = 1;
  let maxVelocity = 0;

  const entries = Array.from(threadMap.values());
  for (const e of entries) {
    if (e.commentCount > maxComments) maxComments = e.commentCount;
    if (e.upvoteSum > maxUpvotes) maxUpvotes = e.upvoteSum;
    if (e.views > maxViews) maxViews = e.views;
    const avgLen = e.commentCount > 0 ? e.totalContentLength / e.commentCount : 0;
    if (avgLen > maxAvgLength) maxAvgLength = avgLen;
    const velocity = e.recentCommentCount * 2 + e.recentUpvotes * 3;
    if (velocity > maxVelocity) maxVelocity = velocity;
  }
  if (maxVelocity === 0) maxVelocity = 1;

  // 6. Detect categories for diversity weighting
  const categoryCounts = new Map<string, number>();
  for (const e of entries) {
    const cat = e.category || "uncategorized";
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  }

  // 7. Compute final scores
  const scored: CuratedThread[] = entries.map(e => {
    const avgCommentLength = e.commentCount > 0 ? e.totalContentLength / e.commentCount : 0;
    const velocity = e.recentCommentCount * 2 + e.recentUpvotes * 3;
    const ageHours = (now.getTime() - e.lastActivity.getTime()) / (1000 * 60 * 60);

    // Engagement score (35%)
    const engagementScore = (
      clampScore(e.commentCount, maxComments) * 0.5 +
      clampScore(e.upvoteSum, maxUpvotes) * 0.35 +
      clampScore(e.views, maxViews) * 0.15
    );

    // Quality score (25%)
    const qualityScore = clampScore(avgCommentLength, maxAvgLength);

    // Recency score (20%) — exponential decay over RECENT_WINDOW_HOURS
    const recencyScore = Math.exp(-ageHours / (RECENT_WINDOW_HOURS / 2));

    // Diversity score (10%) — less common categories get a boost
    const cat = e.category || "uncategorized";
    const catCount = categoryCounts.get(cat) || 1;
    const diversityScore = 1 - (catCount / entries.length);

    // Velocity score (10%)
    const velocityScore = maxVelocity > 0 ? velocity / maxVelocity : 0;

    // Weighted total
    const totalScore =
      engagementScore * 0.35 +
      qualityScore * 0.25 +
      recencyScore * 0.20 +
      diversityScore * 0.10 +
      velocityScore * 0.10;

    return {
      url: e.url,
      threadId: e.threadId,
      title: extractTitle(e.url),
      commentCount: e.commentCount,
      upvoteCount: e.upvoteSum,
      avgCommentLength: Math.round(avgCommentLength),
      lastActivity: e.lastActivity,
      category: e.category,
      score: Math.round(totalScore * 1000) / 1000,
      scoreBreakdown: {
        engagement: Math.round(engagementScore * 1000) / 1000,
        quality: Math.round(qualityScore * 1000) / 1000,
        recency: Math.round(recencyScore * 1000) / 1000,
        diversity: Math.round(diversityScore * 1000) / 1000,
        velocity: Math.round(velocityScore * 1000) / 1000,
      },
    };
  });

  // Sort by score descending, limit to top picks
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS);
}

/**
 * Extract a human-readable title from a URL.
 */
function extractTitle(url: string): string | null {
  try {
    const u = new URL(url);
    // Remove www. prefix
    const host = u.hostname.replace(/^www\./, "");
    // Extract last meaningful path segment
    const pathParts = u.pathname.split("/").filter(Boolean);
    const lastPath = pathParts[pathParts.length - 1] || "";
    const cleanPath = lastPath
      .replace(/[-_]/g, " ")
      .replace(/\.(html|php|asp|jsp)$/, "")
      .slice(0, 60);
    
    if (cleanPath && cleanPath.length > 3) {
      return `${host}: ${cleanPath}`;
    }
    return host;
  } catch {
    return url.slice(0, 60);
  }
}
