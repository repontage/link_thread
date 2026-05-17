import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const commentsCount = await prisma.comment.count({
      where: { url: url },
    });

    const uniqueUsers = await prisma.comment.groupBy({
      by: ['userId'],
      where: { url: url, userId: { not: null } },
    });

    return NextResponse.json({
      url,
      totalComments: commentsCount,
      uniqueParticipants: uniqueUsers.length,
      engagementScore: commentsCount + (uniqueUsers.length * 2),
    });
  } catch (error) {
    console.error("Error fetching link analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
