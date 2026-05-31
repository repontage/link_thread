import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const toxicOnly = searchParams.get("toxic") !== "false";

    const where = toxicOnly ? { isToxic: true } : {};

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          User: { select: { id: true, name: true, username: true } },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      comments: comments.map((c) => ({
        id: c.id,
        content: c.content,
        author: c.author,
        isToxic: c.isToxic,
        createdAt: c.createdAt,
        url: c.url,
        user: c.User,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("[ADMIN MODERATION API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/moderation
 * Admin can resolve/clear toxicity flags or shadow ban users.
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { action, commentId, userId } = body;

    if (action === "clear-toxicity" && commentId) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { isToxic: false },
      });
      return NextResponse.json({ success: true, message: "Toxicity flag cleared." });
    }

    if (action === "shadow-ban" && userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { isShadowBanned: true },
      });
      return NextResponse.json({ success: true, message: "User shadow banned." });
    }

    return NextResponse.json({ error: "Invalid action or missing parameters" }, { status: 400 });
  } catch (error) {
    logger.error("[ADMIN MODERATION API PATCH] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
