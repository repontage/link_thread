import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * Simple in-memory event store for A/B test analytics.
 * In production, this should be replaced with a proper analytics pipeline.
 */
const eventStore: Array<{
  event: string;
  assignments: any[];
  metadata: any;
  timestamp: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, assignments, metadata, timestamp } = body;

    eventStore.push({
      event,
      assignments: assignments || [],
      metadata: metadata || {},
      timestamp: timestamp || new Date().toISOString(),
    });

    // Keep only last 10000 events in memory
    if (eventStore.length > 10000) {
      eventStore.splice(0, eventStore.length - 10000);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[Analytics Event] Error:", error);
    return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
  }
}

export async function GET() {
  // Aggregate events by test and variant
  const summary: Record<
    string,
    Record<string, { impressions: number; events: Record<string, number> }>
  > = {};

  for (const entry of eventStore) {
    for (const assignment of entry.assignments || []) {
      const { testId, variant } = assignment;
      if (!summary[testId]) summary[testId] = {};
      if (!summary[testId][variant]) {
        summary[testId][variant] = { impressions: 0, events: {} };
      }
      summary[testId][variant].impressions++;

      if (entry.event !== "impression") {
        summary[testId][variant].events[entry.event] =
          (summary[testId][variant].events[entry.event] || 0) + 1;
      }
    }
  }

  return NextResponse.json({
    success: true,
    totalEvents: eventStore.length,
    summary,
  });
}
