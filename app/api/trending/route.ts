import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today";
  const region = searchParams.get("region") || "global";

  let dateFilter = new Date();
  if (period === "today") {
    dateFilter.setDate(dateFilter.getDate() - 1);
  } else if (period === "month") {
    dateFilter.setMonth(dateFilter.getMonth() - 1);
  } else if (period === "year") {
    dateFilter.setFullYear(dateFilter.getFullYear() - 1);
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        createdAt: { gte: dateFilter },
        url: { not: "", notIn: [""] }
      },
      select: {
        url: true,
        content: true
      }
    });

    let filteredComments = comments;
    if (region === "kr") {
      filteredComments = comments.filter(c => /[가-힣]/.test(c.content || ""));
    } else if (region === "en" || region === "us") {
      filteredComments = comments.filter(c => !/[가-힣]/.test(c.content || ""));
    }

    const urlCounts: { [url: string]: number } = {};
    for (const c of filteredComments) {
      if (c.url) {
        urlCounts[c.url] = (urlCounts[c.url] || 0) + 1;
      }
    }

    const trending = Object.entries(urlCounts)
      .map(([url, count]) => ({
        url,
        _count: { url: count }
      }))
      .sort((a, b) => b._count.url - a._count.url)
      .slice(0, 5);

    return NextResponse.json({ success: true, trending, region });
  } catch (error) {
    console.error("Trending API Error:", error);
    return NextResponse.json({ error: "Failed to fetch trending data", details: String(error) }, { status: 500 });
  }
}
