import { NextRequest, NextResponse } from "next/server";
import { getWebfinger } from "@/lib/federation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get("resource");
    if (!resource) {
      return NextResponse.json({ error: "Missing resource parameter" }, { status: 400 });
    }

    const host = req.headers.get("host") || "voidsay.com";
    const webfinger = await getWebfinger(resource, host);

    if (!webfinger) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(webfinger), {
      status: 200,
      headers: {
        "Content-Type": "application/jrd+json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
