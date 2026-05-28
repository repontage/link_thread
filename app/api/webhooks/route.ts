import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Allowed event types for subscriptions
const ALLOWED_EVENTS = [
  "*",
  "comment.created",
  "comment.liked",
  "reaction.created",
  "reaction.deleted",
];

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isPro = (session.user as any).isPro; // Prepared for Phase 21 schema extension

    if (userRole !== "ADMIN" && !isPro) {
      return NextResponse.json({ error: "Access Restricted. Pro subscription or Admin role required to manage Webhooks." }, { status: 403 });
    }

    const userId = (session.user as any).id;

    const subscriptions = await prisma.webhookSubscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve subscriptions", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isPro = (session.user as any).isPro; // Prepared for Phase 21 schema extension

    if (userRole !== "ADMIN" && !isPro) {
      return NextResponse.json({ error: "Access Restricted. Pro subscription or Admin role required to manage Webhooks." }, { status: 403 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { url, event, secret } = body;

    if (!url || !event) {
      return NextResponse.json(
        { error: "Missing required fields: url, event" },
        { status: 400 }
      );
    }

    // Validate URL schema
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return NextResponse.json(
          { error: "Invalid URL protocol. Only http: and https: are allowed." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Invalid webhook URL format" }, { status: 400 });
    }

    // Validate event type
    if (!ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json(
        {
          error: `Invalid event type. Allowed event types: ${ALLOWED_EVENTS.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Auto-generate high entropy signing secret if not supplied
    const subscriptionSecret = secret && secret.trim() !== ""
      ? secret
      : crypto.randomBytes(24).toString("hex");

    const newSub = await prisma.webhookSubscription.create({
      data: {
        id: crypto.randomUUID(),
        url,
        event,
        userId,
        secret: subscriptionSecret,
        active: true,
      },
    });

    return NextResponse.json({ success: true, subscription: newSub }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create subscription", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const isPro = (session.user as any).isPro; // Prepared for Phase 21 schema extension

    if (userRole !== "ADMIN" && !isPro) {
      return NextResponse.json({ error: "Access Restricted. Pro subscription or Admin role required to manage Webhooks." }, { status: 403 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    // Ensure the subscription exists and belongs to this user
    const existingSub = await prisma.webhookSubscription.findFirst({
      where: { id, userId },
    });

    if (!existingSub) {
      return NextResponse.json(
        { error: "Subscription not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.webhookSubscription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Subscription deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete subscription", details: error.message },
      { status: 500 }
    );
  }
}
