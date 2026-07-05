# LinkThread DESIGN.md

## Concept
LinkThread is a community-driven link-sharing platform with AI-enhanced summaries and modern authentication.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Auth**: Auth.js v5 (WebAuthn Passkeys & Magic Links)
- **DB**: Turso (LibSQL) with Prisma
- **Style**: Tailwind CSS, Lucide Icons

## Key Flows
1. **Posting**: User shares URL -> Cheerio extracts OG data -> Gemini generates AI summary.
2. **Engagement**: Users upvote/comment with Optimistic UI updates.
3. **Operational**: Cron jobs monitor DB health and send Telegram alerts.
