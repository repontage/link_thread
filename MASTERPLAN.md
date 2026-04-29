# VoidSay - Universal Link Commenting Platform

## Phase 1: Core Platform (Completed / Stabilized)
- Basic link submission and metadata extraction.
- Commenting system.

## Phase 2: Social Media Experience Enhancement (Completed)
- [x] **YouTube Integration**: In-app player and timestamp-based comments.
- [x] **Instagram Integration**: Swipeable image grid, feed-style UI.
- [x] **Twitter Integration**: Embedded tweet rendering and threaded discussions.

## Phase 3: Community & Engagement (Completed)
- [x] **User Profiles & Karma**: User pages showing past comments, upvotes received, and simple Karma score.
- [x] **Infinite Scrolling**: Cursor-based pagination for large comment threads.
- [x] **AI Content Filter (Local)**: Basic local toxicity filter using simple keyword matching or free API.

## Phase 4: Discovery & Trending (Completed)
- [x] **Trending Dashboard (Main Page)**: 메인 화면에 가장 댓글이 많은 링크, 일/월/연도별 인기 링크 랭킹 보드 구현.
- [x] **Time-based Ranking Logic**: Prisma 쿼리를 이용한 기간별(Today, This Month, This Year) 핫 트렌드 추출.

## Phase 5: Real-time & Retention (Current)
- [x] **Real-time Comments (SSE/Polling)**: 유저들이 같은 링크를 보고 있을 때 새로 달린 댓글을 실시간으로 띄워주는 라이브 피드.
- [x] **Notification Center**: 내 댓글에 답글이 달리거나 좋아요를 받으면 인앱 알림(종 모양 아이콘) 제공.
- [ ] **PWA (Progressive Web App) 전환**: 모바일 홈 화면에 앱처럼 설치 가능하게 하여 접근성 및 리텐션 강화.

## Phase 6: Production-Ready Refactoring & Security (Claude Review 반영)
- [x] **Critical Security & Type Safety**: `app/api/preview` URL 유효성 검사 강화(javascript:// 등 스킴 차단), NextAuth 세션 타입 확장(`(session.user as any).id` 제거), CSRF 방어 점검.
- [x] **Performance & DB Optimization**: 댓글 N+1 쿼리 최적화(`include: { children: true }`), `imageUrls` 및 `tags` 릴레이션 스키마 분리, 누락된 인덱스(`url`, `isToxic`) 추가.
- [x] **Real-time & API Upgrade**: 기존 15초 백그라운드 폴링을 SSE(Server-Sent Events)로 전환, API 에러 응답 포맷 통일, Rate Limiting 추가.
- [x] **Code Quality & Testing**: 중복 필터 모듈 제거, 미사용 패키지(`nodemailer`) 정리, 하드코딩 태그 정리, Jest/Vitest 테스트 환경 세팅 및 핵심 로직 테스트 작성.

## Phase 7: PWA & Final Polish (Completed)
- [x] **PWA (Progressive Web App) 전환**: 모바일 홈 화면에 앱처럼 설치 가능하게 하여 접근성 및 리텐션 강화.
- [x] **Production Deployment**: Vercel 배포 및 운영 환경 점검.

## Phase 8: Profile Customization & User Mentions & Easy Auth (Completed)
- [x] **Easy Auth**: 모바일 및 크로스 플랫폼(iOS/Android) 호환성을 위해 로그인 방식을 개선. Google 및 GitHub OAuth 로그인 수단 추가 도입 완료.
- [x] **Profile Customization**: 프로필 이미지(URL), 닉네임, 상태 메시지 편집이 가능한 ProfileEditForm 기능 및 /api/profile 추가 완료.
- [x] **User Mentions**: 댓글 입력 시 `@username` 형태로 다른 유저 멘션 시 Notification 자동 생성 및 화면 내 하이퍼링크 처리 완료. 댓글 답글 및 좋아요 알림 생성 로직 포함.


## Phase 11: Security Hardening & Zero-Trust Architecture (1-Week Sprint 🚨)
*Based on the comprehensive security audit. This is the absolute priority for the next 7 days.*

**🔴 Day 1-2: Critical Vulnerability Fixes (IDOR & Impersonation)**
- [ ] **Fix Notification IDOR**: `app/api/notifications/route.ts` - Verify `session.user.id` matches the requested/patched user.
- [ ] **Secure User Profile API**: `app/api/users/[id]/route.ts` - Add authentication checks. Prevent leakage of private data (email) to unauthorized users.
- [ ] **Prevent Comment Impersonation**: `app/api/comments/route.ts` - Discard `author` from request body. Inject `author` strictly from the authenticated `session.user.name`.

**🟠 Day 3-4: High Vulnerability Fixes (SSRF, XSS, Abuse)**
- [ ] **Block SSRF in Preview API**: `app/api/preview/route.ts` - Implement a strict URL parser to block private/internal IP ranges (127.0.0.1, 169.254.169.254, 10.x, 192.168.x).
- [ ] **Validate Image URLs**: `app/api/comments/route.ts` - Validate `imageUrls` array. Block `data:` and `javascript:` schemas to prevent XSS and malicious payloads.
- [ ] **Implement Rate Limiting**: Apply API rate limiting (using an in-memory Map or Vercel KV) to `/api/preview`, `/api/comments` (POST), and auth endpoints to prevent DDoS and spam.

**🟡 Day 5-6: Medium Vulnerability & Architecture Refactoring**
- [ ] **Optimize NextAuth DB Strategy**: `auth.ts` - Fix the `jwt` callback. Stop making a DB call on every session validation. Cache `role` and `isBanned` properly in the JWT token upon initial login.
- [ ] **Enforce Type Safety**: `types/next-auth.d.ts` - Declare module augmentation for NextAuth Session to safely include `id`, `role`, and `isBanned`. Remove all `(session.user as any).id` type casts.
- [ ] **Setup `.env.example`**: Create an example environment file documenting `AUTH_SECRET` and DB variables for safe deployments.

**🟢 Day 7: Final Audit & Production Deployment**
- [ ] **Regression Testing**: Verify all core features (commenting, OAuth, previews, notifications) still function correctly after security patches.
- [ ] **Vercel Deployment**: Deploy to production and run a final live-environment sanity check.

## Infra / Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS
- Backend: Next.js API Routes
- DB: SQLite (Local) via Prisma
- Hosting: Vercel Free Tier (Future)


## Phase 9: Admin Dashboard & Global Moderation (Completed)
- [x] **Admin Roles & Dashboard**: 관리자 권한(Role) 스키마 추가, /admin 페이지에서 전체 댓글 관리, 유저 차단 및 통계 모니터링 뷰어 기능.
- [x] **Report System**: 유저들이 유해한 댓글이나 스팸을 신고할 수 있는 기능 및 관리자 페이지 연동.
- [x] **SEO & Metadata Optimization**: Dynamic OpenGraph tags, sitemap.xml, robots.txt 추가를 통한 검색 최적화.

## Phase 10: Gamification & Advanced Features (Next)
- [ ] **User Badges & Achievements**: 활동 기반 배지(예: '첫 댓글', '좋아요 100개', '인기 작성자') 부여 및 프로필 표시.
- [ ] **Rich Content Formatting**: 댓글 내 Markdown(굵게, 기울임꼴, 코드 블록, 인용구) 지원.
- [ ] **Thread Sponsors (Monetization Prep)**: 실제 결제 연동 전 'Sponsor this thread' 형태의 후원 UI 플레이스홀더 및 UI 구조 확보.