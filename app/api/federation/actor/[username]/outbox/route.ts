import { NextRequest, NextResponse } from "next/server";
import { getOutbox } from "@/lib/federation";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const params = await context.params;
    const { username } = params;

    const host = req.headers.get("host") || "voidsay.com";
    const outbox = await getOutbox(username, host);

    if (!outbox) {
      return NextResponse.json({ error: "Outbox not found" }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(outbox), {
      status: 200,
      headers: {
        "Content-Type": "application/activity+json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
