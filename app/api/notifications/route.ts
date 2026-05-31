import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import {
  getNotificationDigest,
  buildDigestSummary,
} from "@/lib/smart-notifications";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "list";
  const limit = parseInt(searchParams.get("limit") || "20");
  const priorityFilter = searchParams.get("priority");

  try {
    if (mode === "digest") {
      const digest = await getNotificationDigest(userId, limit);
      return NextResponse.json({ success: true, ...digest });
    }

    if (mode === "summary") {
      const days = parseInt(searchParams.get("days") || "7");
      const summary = await buildDigestSummary(userId, days);
      return NextResponse.json({ success: true, summary });
    }

    const where: any = { userId };

    if (priorityFilter) {
      where.priority = { gte: parseInt(priorityFilter) };
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    logger.error("[Notifications API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json().catch(() => ({}));
  const notificationId = body?.id;

  try {
    if (notificationId) {
      // Mark single notification as read
      await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[Notifications PATCH] Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
