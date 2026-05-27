import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * Fetches and filters comments to determine the trending URLs.
 * This is the raw database lookup function.
 */
async function fetchTrendingRaw(period: string, region: string) {
  let dateFilter = new Date();
  if (period === "today") {
    dateFilter.setDate(dateFilter.getDate() - 1);
  } else if (period === "month") {
    dateFilter.setMonth(dateFilter.getMonth() - 1);
  } else if (period === "year") {
    dateFilter.setFullYear(dateFilter.getFullYear() - 1);
  }

  const comments = await prisma.comment.findMany({
    where: {
      createdAt: { gte: dateFilter },
      url: { not: "", notIn: [""] }
    },
    select: {
      url: true,
      content: true
    }
  });

  let filteredComments = comments;
  if (region === "kr") {
    filteredComments = comments.filter(c => /[가-힣]/.test(c.content || ""));
  } else if (region === "en" || region === "us") {
    filteredComments = comments.filter(c => !/[가-힣]/.test(c.content || ""));
  }

  const urlCounts: { [url: string]: number } = {};
  for (const c of filteredComments) {
    if (c.url) {
      urlCounts[c.url] = (urlCounts[c.url] || 0) + 1;
    }
  }

  return Object.entries(urlCounts)
    .map(([url, count]) => ({
      url,
      _count: { url: count }
    }))
    .sort((a, b) => b._count.url - a._count.url)
    .slice(0, 5);
}

/**
 * Cached version of the fetchTrendingRaw function.
 * Next.js unstable_cache automatically uses function arguments as cache keys.
 * Revalidate set to 300 seconds (5 minutes).
 */
const getCachedTrending = unstable_cache(
  async (period: string, region: string) => {
    return fetchTrendingRaw(period, region);
  },
  ["trending-data-cache"],
  {
    revalidate: 300, // 5 minutes cache
    tags: ["trending"],
  }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today";
  const region = searchParams.get("region") || "global";

  try {
    // Fetch cached trending data
    const trending = await getCachedTrending(period, region);

    return NextResponse.json({ success: true, trending, region });
  } catch (error) {
    console.error("Trending API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending data", details: String(error) },
      { status: 500 }
    );
  }
}
