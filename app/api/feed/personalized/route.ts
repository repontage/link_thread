import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPersonalizedFeed, type FeedItem } from "@/lib/personalized-feed";
import { unstable_cache } from "next/cache";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const getCachedFeed = unstable_cache(
  async (userId: string, limit: number): Promise<FeedItem[]> => {
    return getPersonalizedFeed(userId, limit);
  },
  ["personalized-feed"],
  {
    revalidate: 300, // 5 minutes cache
    tags: ["feed", "personalized"],
  }
);

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!session?.user) {
      // For unauthenticated users, return general trending via feed fallback
      const feed = await getPersonalizedFeed("anonymous", limit);
      return NextResponse.json({
        success: true,
        feed,
        isPersonalized: false,
        note: "Log in for a personalized feed based on your interests.",
      });
    }

    const userId = (session.user as any).id as string;
    const feed = await getCachedFeed(userId, limit);

    return NextResponse.json({ success: true, feed, isPersonalized: true });
  } catch (error) {
    logger.error("[PERSONALIZED_FEED_API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate personalized feed", details: String(error) },
      { status: 500 }
    );
  }
}
