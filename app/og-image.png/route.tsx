import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// Pre-compute star positions
const stars = Array.from({ length: 25 }, (_, i) => ({
  left: `${Math.sin(i * 1.7) * 40 + 50}%`,
  top: `${Math.cos(i * 2.3) * 40 + 50}%`,
}));

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
          }}
        >
          {/* Stars background */}
          {stars.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "white",
                opacity: 0.08,
              }}
            />
          ))}

          {/* Main title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.04em",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            VoidSay
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 280,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(90deg, #6c5ce7, #0066cc)",
              marginBottom: 32,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.02em",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Comment on any website.
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
            }}
          >
            Free · Private · No Ads · Markdown · Dark Mode
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
