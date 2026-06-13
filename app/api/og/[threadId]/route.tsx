import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ threadId: string }> }
) {
  const { searchParams } = new URL(request.url)
  const { threadId } = await context.params
  const url = searchParams.get("url") || ""

  try {
    // Build the absolute URL for the internal API
    const host = request.headers.get("host") || "voidsay.com"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Fetch thread data from internal API (instead of Prisma which doesn't work in edge)
    let commentCount = 0
    let topComment: { content: string; author: string } | null = null

    try {
      const res = await fetch(`${baseUrl}/api/comments?threadId=${encodeURIComponent(threadId)}`, {
        headers: { Accept: "application/json" },
      })

      if (res.ok) {
        const data = await res.json()
        commentCount = data.comments?.length || 0
        // Find top comment
        const sorted = [...(data.comments || [])].sort(
          (a: any, b: any) => (b.upvotes || 0) - (a.upvotes || 0)
        )
        if (sorted.length > 0) {
          topComment = { content: sorted[0].content, author: sorted[0].author }
        }
      }
    } catch {
      // Fall back to showing no comments
    }

    // Build title from URL
    let title = "Join the discussion on VoidSay"
    if (url) {
      try {
        const urlObj = new URL(url)
        title = `${urlObj.hostname}${urlObj.pathname.length > 1 ? urlObj.pathname : ""}`
      } catch {
        title = "Join the discussion on VoidSay"
      }
    }

    // Truncate comment content
    let previewText = topComment?.content || "Be the first to comment on this link!"
    if (previewText.length > 120) {
      previewText = previewText.substring(0, 120) + "..."
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#1a1a2e",
            padding: "60px 80px",
            fontFamily: '"Inter", "Noto Sans KR", sans-serif',
            color: "white",
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(0,102,204,0.15) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(99,102,241,0.1) 0%, transparent 50%)",
          }}
        >
          {/* Brand header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0066cc, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              💬
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
                VoidSay
              </span>
              <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 400 }}>
                Universal Link Commenting
              </span>
            </div>
          </div>

          {/* Thread info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "40px", width: "100%" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.2,
                margin: 0,
                letterSpacing: "-1px",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </h1>

            <div style={{ display: "flex", gap: "32px", marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "32px", fontWeight: 700, color: "#0066cc" }}>
                  {commentCount}
                </span>
                <span style={{ fontSize: "24px", color: "#94a3b8" }}>
                  {commentCount === 1 ? "comment" : "comments"}
                </span>
              </div>
            </div>

            {topComment && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "16px",
                }}
              >
                <span style={{ fontSize: "20px", color: "#0066cc", fontWeight: 600 }}>
                  Top comment by {topComment.author}
                </span>
                <span style={{ fontSize: "24px", color: "#cbd5e1", lineHeight: 1.5 }}>
                  &ldquo;{previewText}&rdquo;
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "40px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                }}
              />
              <span style={{ fontSize: "20px", color: "#94a3b8" }}>
                voidsay.com &middot; Ad-Free &middot; Join the discussion
              </span>
            </div>
            <div
              style={{
                display: "flex",
                padding: "16px 32px",
                backgroundColor: "#0066cc",
                borderRadius: "12px",
                fontSize: "22px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Join Now &rarr;
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    )
  } catch {
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a2e",
            color: "white",
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "48px" }}>💬</span>
            <span>Join the discussion on VoidSay</span>
            <span style={{ fontSize: "20px", color: "#94a3b8" }}>voidsay.com</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
