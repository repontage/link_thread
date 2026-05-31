import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import {
  analyzeRetention,
  analyzeChurn,
  analyzeCohorts,
} from "@/lib/advanced-analytics";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const getCachedRetention = unstable_cache(
  async () => analyzeRetention(),
  ["advanced-analytics-retention"],
  { revalidate: 3600, tags: ["analytics"] } // 1 hour cache
);

const getCachedChurn = unstable_cache(
  async () => analyzeChurn(),
  ["advanced-analytics-churn"],
  { revalidate: 3600, tags: ["analytics"] }
);

const getCachedCohorts = unstable_cache(
  async () => analyzeCohorts(),
  ["advanced-analytics-cohorts"],
  { revalidate: 3600, tags: ["analytics"] }
);

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "all";

    let retention = null;
    let churn = null;
    let cohorts = null;

    if (mode === "all" || mode === "retention") {
      retention = await getCachedRetention();
    }
    if (mode === "all" || mode === "churn") {
      churn = await getCachedChurn();
    }
    if (mode === "all" || mode === "cohorts") {
      cohorts = await getCachedCohorts();
    }

    return NextResponse.json({ success: true, retention, churn, cohorts });
  } catch (error) {
    logger.error("[Advanced Analytics API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: String(error) },
      { status: 500 }
    );
  }
}
