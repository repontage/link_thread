import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET: Generate weekly digest for authenticated user
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id as string
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format") || "json" // json | html

  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // 1. User's recent activity
    const myComments = await prisma.comment.count({
      where: { userId, createdAt: { gte: oneWeekAgo } },
    })

    const myUpvotesReceived = await prisma.comment.aggregate({
      _sum: { upvotes: true },
      where: { userId, createdAt: { gte: oneWeekAgo } },
    })

    // 2. Trending threads (most comments this week)
    const trendingThreads = await prisma.comment.groupBy({
      by: ["threadId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      where: { createdAt: { gte: oneWeekAgo }, isToxic: false },
      take: 10,
    })

    // Get thread URL info for trending
    const threadUrls = await Promise.all(
      trendingThreads.map(async (t) => {
        const first = await prisma.comment.findFirst({
          where: { threadId: t.threadId },
          select: { url: true, content: true },
        })
        return {
          threadId: t.threadId,
          commentCount: t._count.id,
          url: first?.url || "",
          snippet: first?.content?.substring(0, 80) || "",
        }
      })
    )

    // 3. Platform stats
    const totalCommentsThisWeek = await prisma.comment.count({
      where: { createdAt: { gte: oneWeekAgo } },
    })

    const totalUsersThisWeek = await prisma.comment.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: oneWeekAgo } },
    })

    const topCommenter = await prisma.comment.groupBy({
      by: ["userId", "author"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      where: { createdAt: { gte: oneWeekAgo } },
      take: 1,
    })

    const digest = {
      period: {
        from: oneWeekAgo.toISOString(),
        to: new Date().toISOString(),
      },
      myActivity: {
        commentsWritten: myComments,
        upvotesReceived: myUpvotesReceived._sum.upvotes || 0,
        badge: myComments >= 10 ? "🔥 On Fire" : myComments >= 3 ? "💬 Active" : "👋 Getting Started",
      },
      trendingThreads: threadUrls,
      platformStats: {
        totalComments: totalCommentsThisWeek,
        activeUsers: totalUsersThisWeek.length,
        topCommenter: topCommenter.length > 0 ? {
          name: topCommenter[0].author,
          comments: topCommenter[0]._count.id,
        } : null,
      },
    }

    if (format === "html") {
      return new NextResponse(generateDigestHtml(digest), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    }

    return NextResponse.json(digest)
  } catch (error: any) {
    console.error("[DIGEST_ERROR]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function generateDigestHtml(d: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your VoidSay Weekly Digest</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e2e8f0; padding: 40px 20px; max-width: 640px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 32px; }
    .header h1 { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .header p { color: #64748b; font-size: 14px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .card h2 { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .stat { text-align: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; }
    .stat-value { font-size: 28px; font-weight: 800; color: #0066cc; }
    .stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .trend-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .trend-item:last-child { border-bottom: none; }
    .trend-url { font-size: 13px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; margin: 0 12px; }
    .trend-count { font-size: 13px; font-weight: 700; color: #0066cc; }
    .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
    .footer p { font-size: 12px; color: #64748b; }
    .footer a { color: #0066cc; text-decoration: none; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(0,102,204,0.2); color: #0066cc; border-radius: 20px; font-size: 14px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h1>💬 Your VoidSay Weekly Digest</h1>
    <p>${new Date(d.period.from).toLocaleDateString()} — ${new Date(d.period.to).toLocaleDateString()}</p>
  </div>

  <div class="card">
    <h2>👤 Your Activity <span class="badge">${d.myActivity.badge}</span></h2>
    <div class="stat-grid">
      <div class="stat">
        <div class="stat-value">${d.myActivity.commentsWritten}</div>
        <div class="stat-label">Comments Written</div>
      </div>
      <div class="stat">
        <div class="stat-value">${d.myActivity.upvotesReceived}</div>
        <div class="stat-label">Upvotes Received</div>
      </div>
    </div>
  </div>

  <div class="card">
    <h2>🔥 Trending Threads</h2>
    ${d.trendingThreads.map((t: any) => `
      <div class="trend-item">
        <span style="font-size:12px;color:#64748b;">#${d.trendingThreads.indexOf(t) + 1}</span>
        <span class="trend-url">${t.url || t.threadId}</span>
        <span class="trend-count">${t.commentCount} 💬</span>
      </div>
    `).join("")}
    ${d.trendingThreads.length === 0 ? '<p style="color:#64748b;text-align:center;padding:16px;">No trending threads this week.</p>' : ''}
  </div>

  <div class="card">
    <h2>📊 Platform</h2>
    <div class="stat-grid">
      <div class="stat">
        <div class="stat-value">${d.platformStats.totalComments}</div>
        <div class="stat-label">Total Comments</div>
      </div>
      <div class="stat">
        <div class="stat-value">${d.platformStats.activeUsers}</div>
        <div class="stat-label">Active Users</div>
      </div>
    </div>
    ${d.platformStats.topCommenter ? `<p style="margin-top:12px;font-size:13px;color:#94a3b8;text-align:center;">🏆 Top commenter: <strong style="color:#fff;">${d.platformStats.topCommenter.name}</strong> (${d.platformStats.topCommenter.comments} comments)</p>` : ''}
  </div>

  <div class="footer">
    <p>Powered by <a href="https://voidsay.com">VoidSay</a> — Universal, Ad-Free Commenting</p>
    <p style="margin-top:4px;">You received this digest because you're a VoidSay user.</p>
  </div>
</body>
</html>`
}
