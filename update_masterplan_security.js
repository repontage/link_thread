const fs = require('fs');

const masterplanPath = '/Users/seonghoonjung/workspace/link-thread-project/MASTERPLAN.md';
let content = fs.readFileSync(masterplanPath, 'utf8');

const securityPhase = `
## Phase 11: Security Hardening & Zero-Trust Architecture (1-Week Sprint 🚨)
*Based on the comprehensive security audit. This is the absolute priority for the next 7 days.*

**🔴 Day 1-2: Critical Vulnerability Fixes (IDOR & Impersonation)**
- [ ] **Fix Notification IDOR**: \`app/api/notifications/route.ts\` - Verify \`session.user.id\` matches the requested/patched user.
- [ ] **Secure User Profile API**: \`app/api/users/[id]/route.ts\` - Add authentication checks. Prevent leakage of private data (email) to unauthorized users.
- [ ] **Prevent Comment Impersonation**: \`app/api/comments/route.ts\` - Discard \`author\` from request body. Inject \`author\` strictly from the authenticated \`session.user.name\`.

**🟠 Day 3-4: High Vulnerability Fixes (SSRF, XSS, Abuse)**
- [ ] **Block SSRF in Preview API**: \`app/api/preview/route.ts\` - Implement a strict URL parser to block private/internal IP ranges (127.0.0.1, 169.254.169.254, 10.x, 192.168.x).
- [ ] **Validate Image URLs**: \`app/api/comments/route.ts\` - Validate \`imageUrls\` array. Block \`data:\` and \`javascript:\` schemas to prevent XSS and malicious payloads.
- [ ] **Implement Rate Limiting**: Apply API rate limiting (using an in-memory Map or Vercel KV) to \`/api/preview\`, \`/api/comments\` (POST), and auth endpoints to prevent DDoS and spam.

**🟡 Day 5-6: Medium Vulnerability & Architecture Refactoring**
- [ ] **Optimize NextAuth DB Strategy**: \`auth.ts\` - Fix the \`jwt\` callback. Stop making a DB call on every session validation. Cache \`role\` and \`isBanned\` properly in the JWT token upon initial login.
- [ ] **Enforce Type Safety**: \`types/next-auth.d.ts\` - Declare module augmentation for NextAuth Session to safely include \`id\`, \`role\`, and \`isBanned\`. Remove all \`(session.user as any).id\` type casts.
- [ ] **Setup \`.env.example\`**: Create an example environment file documenting \`AUTH_SECRET\` and DB variables for safe deployments.

**🟢 Day 7: Final Audit & Production Deployment**
- [ ] **Regression Testing**: Verify all core features (commenting, OAuth, previews, notifications) still function correctly after security patches.
- [ ] **Vercel Deployment**: Deploy to production and run a final live-environment sanity check.
`;

// Insert the new phase before "Infra / Tech Stack"
content = content.replace('## Infra / Tech Stack', securityPhase + '\n## Infra / Tech Stack');

fs.writeFileSync(masterplanPath, content);
console.log('Masterplan updated with Security Sprint');
