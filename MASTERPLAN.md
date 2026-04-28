# LinkThread - Universal Link Commenting Platform

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

## Phase 8: Profile Customization & User Mentions & Easy Auth (Next)
- [ ] **Easy Auth**: 모바일 및 크로스 플랫폼(iOS/Android) 호환성을 위해 로그인 방식을 개선. Passkey 외에 이메일 매직 링크(Email Provider) 또는 구글 로그인(OAuth) 수단을 추가 도입.
- [ ] **Profile Customization**: 프로필 이미지, 닉네임, 상태 메시지 등 커스텀 편집 기능 추가.
- [ ] **User Mentions**: 댓글 입력 시 `@username` 형태로 다른 유저를 멘션하는 기능 및 알림 센터(Notification Center) 연동.

## Infra / Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS
- Backend: Next.js API Routes
- DB: SQLite (Local) via Prisma
- Hosting: Vercel Free Tier (Future)
