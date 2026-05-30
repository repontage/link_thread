import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "voidsay.com";
  return NextResponse.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `https://${host}/api/federation/inbox`,
    type: "OrderedCollection",
    totalItems: 0,
    orderedItems: [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const activity = await req.json();
    logger.info("Received ActivityPub activity", { activity });

    // Handle common activity types like Follow
    if (activity.type === "Follow") {
      logger.info(`ActivityPub Follow received from: ${activity.actor}`);
    }

    // Always respond with 202 Accepted per ActivityPub protocol specification
    return new NextResponse(JSON.stringify({ success: true, message: "Activity accepted" }), {
      status: 202,
      headers: {
        "Content-Type": "application/activity+json",
      },
    });
  } catch (error: any) {
    logger.error("Failed to process ActivityPub inbox POST", error);
    return NextResponse.json(
      { error: "Failed to process activity", details: error.message },
      { status: 400 }
    );
  }
}
