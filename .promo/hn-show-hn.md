Title: Show HN: VoidSay — I Built a Universal Commenting System Because Disqus Sells Your Data

URL: https://voidsay.com

First comment (post immediately after submission):
---
I got tired of every website's comment section being owned by Disqus — slow, bloated, selling reader data to advertisers.

So I built VoidSay:
• Comment on ANY URL — YouTube videos, X threads, articles, anything
• Next.js 16 + Turso (distributed SQLite) + Passkeys — no password DB
• Markdown, dark mode, YouTube/X/Instagram auto-embeds
• Free forever. Pro at $29/mo via Paddle.

Tech decisions I'd love HN's feedback on:
• Turso as primary DB — distributed SQLite, surprisingly good
• Passkey-only auth — no password DB to leak
• SSE for real-time comments instead of WebSockets

Try it: https://voidsay.com
Compare vs Disqus: https://voidsay.com/alternatives/disqus
---
