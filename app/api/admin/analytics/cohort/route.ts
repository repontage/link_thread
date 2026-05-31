import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyzeCohorts } from "@/lib/advanced-analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await analyzeCohorts();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS_COHORT] Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze cohorts", details: String(error) },
      { status: 500 }
    );
  }
}
