import Link from "next/link"

export const metadata = {
  title: "Weekly Digest — VoidSay",
  description: "Your weekly VoidSay activity summary — comments, upvotes, trending threads.",
}

export default function DigestPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", color: "#e2e8f0" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
          Weekly Digest
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "32px" }}>
          Your personal VoidSay activity summary — every week.
        </p>

        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          textAlign: "left",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>
            📋 What&apos;s Inside
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "💬", text: "Your comment activity this week" },
              { icon: "⬆️", text: "Upvotes received on your comments" },
              { icon: "🔥", text: "Top 10 trending threads on VoidSay" },
              { icon: "👥", text: "Platform-wide stats and top commenters" },
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ color: "#cbd5e1", fontSize: "15px" }}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a
            href="/api/digest?format=html"
            style={{
              display: "block",
              padding: "14px 24px",
              background: "#0066cc",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "16px",
              transition: "background 0.2s",
            }}
          >
            View My Digest →
          </a>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Sign in required. Digest covers the last 7 days.
          </p>
          <Link
            href="/"
            style={{ color: "#64748b", fontSize: "13px", marginTop: "16px" }}
          >
            ← Back to VoidSay
          </Link>
        </div>
      </div>
    </div>
  )
}
