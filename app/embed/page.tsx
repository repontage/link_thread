import { Suspense } from "react"
import prisma from "@/lib/prisma"
import type { Comment } from "@prisma/client"

export const dynamic = "force-dynamic"

export default function EmbedPage({
  searchParams,
}: {
  searchParams: { url?: string }
}) {
  const url = searchParams.url || ""

  if (!url) {
    return (
      <html>
        <body style={{ margin: 0, padding: "20px", fontFamily: "system-ui, sans-serif", background: "#1a1a2e", color: "#fff", textAlign: "center" }}>
          <p style={{ opacity: 0.6 }}>VoidSay Embed — Please provide a URL parameter.</p>
          <p style={{ opacity: 0.4, fontSize: "14px", marginTop: "8px" }}>
            Powered by{" "}
            <a href="https://voidsay.com" target="_blank" rel="noopener" style={{ color: "#0066cc", textDecoration: "none" }}>
              VoidSay
            </a>
          </p>
        </body>
      </html>
    )
  }

  const threadId = getThreadId(decodeURIComponent(url))

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #1a1a2e;
            color: #e2e8f0;
            line-height: 1.6;
            font-size: 14px;
          }
          .embed-container {
            padding: 16px;
            max-width: 100%;
          }
          .embed-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .embed-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #94a3b8;
            font-size: 12px;
            text-decoration: none;
          }
          .embed-brand:hover { color: #fff; }
          .embed-brand-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            background: linear-gradient(135deg, #0066cc, #6366f1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
          }
          .embed-cta {
            padding: 6px 14px;
            background: #0066cc;
            color: #fff;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s;
          }
          .embed-cta:hover { background: #0055aa; }
          .embed-thread {
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
            padding: 16px;
            border: 1px solid rgba(255,255,255,0.06);
            min-height: 200px;
          }
          .embed-thread-title {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .embed-thread-url {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .embed-empty {
            text-align: center;
            padding: 40px 20px;
            color: #64748b;
          }
          .embed-empty-icon {
            font-size: 36px;
            margin-bottom: 12px;
            display: block;
          }
        `}</style>
      </head>
      <body>
        <div className="embed-container">
          <div className="embed-header">
            <a
              href={`https://voidsay.com/?url=${encodeURIComponent(decodeURIComponent(url))}`}
              target="_blank"
              rel="noopener"
              className="embed-brand"
            >
              <span className="embed-brand-icon">💬</span>
              <span>Powered by VoidSay</span>
            </a>
            <a
              href={`https://voidsay.com/?url=${encodeURIComponent(decodeURIComponent(url))}`}
              target="_blank"
              rel="noopener"
              className="embed-cta"
            >
              View Discussion →
            </a>
          </div>

          <div className="embed-thread">
            <div className="embed-thread-title">
              {(() => {
                try {
                  const u = new URL(decodeURIComponent(url))
                  return u.hostname + u.pathname
                } catch {
                  return url
                }
              })()}
            </div>
            <div className="embed-thread-url">
              {decodeURIComponent(url)}
            </div>

            <Suspense fallback={<div className="embed-empty"><span className="embed-empty-icon">⏳</span>Loading...</div>}>
              <EmbedComments threadId={threadId} url={url} />
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  )
}

// Simple thread ID from URL
function getThreadId(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname + u.pathname
  } catch {
    return url.replace(/[^a-zA-Z0-9]/g, "-")
  }
}

// Client component for embedding comments
async function EmbedComments({ threadId, url }: { threadId: string; url: string }) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        threadId,
        parentId: null, // top-level only for embed
        isToxic: false,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        author: true,
        content: true,
        createdAt: true,
        upvotes: true,
        imageUrls: true,
      },
    })

    if (comments.length === 0) {
      return (
        <div className="embed-empty">
          <span className="embed-empty-icon">💬</span>
          <p>No comments yet. Be the first!</p>
          <a
            href={`https://voidsay.com/?url=${encodeURIComponent(decodeURIComponent(url))}`}
            target="_blank"
            rel="noopener"
            style={{ color: "#0066cc", fontSize: "13px", marginTop: "8px", display: "inline-block" }}
          >
            Add a comment →
          </a>
        </div>
      )
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: "10px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "13px" }}>
                {comment.author}
              </span>
              <span style={{ color: "#64748b", fontSize: "11px" }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <span style={{ color: "#0066cc", fontSize: "11px", marginLeft: "auto" }}>
                ↑ {comment.upvotes}
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5, margin: 0 }}>
              {comment.content.length > 200
                ? comment.content.substring(0, 200) + "..."
                : comment.content}
            </p>
          </div>
        ))}
        <a
          href={`https://voidsay.com/?url=${encodeURIComponent(decodeURIComponent(url))}`}
          target="_blank"
          rel="noopener"
          style={{
            textAlign: "center",
            padding: "8px",
            color: "#0066cc",
            fontSize: "13px",
            textDecoration: "none",
            borderRadius: "6px",
            background: "rgba(0,102,204,0.1)",
          }}
        >
          View all comments on VoidSay →
        </a>
      </div>
    )
  } catch {
    return (
      <div className="embed-empty">
        <span className="embed-empty-icon">💬</span>
        <p>Join the discussion on VoidSay</p>
      </div>
    )
  }
}
