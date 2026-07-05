import { NextResponse } from "next/server";
import { getCuratedContent } from "@/lib/content-curator";
import { unstable_cache } from "next/cache";
import { checkApiRateLimit } from "@/lib/api-rate-limit";

export const dynamic = "force-dynamic";

const getCachedCurated = unstable_cache(
  async () => {
    return getCuratedContent();
  },
  ["curated-content-cache"],
  {
    revalidate: 600, // 10 minutes cache
    tags: ["curated"],
  }
);

export async function GET(request: Request) {
  // Check API rate limit
  const rateCheck = await checkApiRateLimit(request);
  if (!rateCheck.allowed) return rateCheck.error!;

  try {
    const curated = await getCachedCurated();

    return NextResponse.json({
      success: true,
      curated,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Curated API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate curated content", details: String(error) },
      { status: 500 }
    );
  }
}
