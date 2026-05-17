import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  try {
    const userComments = await prisma.comment.findMany({
      where: { userId },
      select: { upvotes: true }
    });

    const commentsCount = userComments.length;
    const totalUpvotesReceived = userComments.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

    // Simple score: comments + (upvotes received * 2)
    const activityScore = commentsCount + (totalUpvotesReceived * 2);

    return NextResponse.json({
      userId,
      totalComments: commentsCount,
      totalUpvotesReceived,
      activityScore,
      isTopCommenter: activityScore > 50 // arbitrary threshold for "올해의 댓글러" logic
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
