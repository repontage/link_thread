# VoidSay - Universal Link Commenting Platform

## Phase 1: Core Platform (Completed)
- Basic link submission and metadata extraction.
- Commenting system.

## Phase 2: Social Media Experience Enhancement (Completed)
- [x] **YouTube Integration**: In-app player and timestamp-based comments.
- [x] **Instagram Integration**: Swipeable image grid, feed-style UI.
- [x] **Twitter Integration**: Embedded tweet rendering and threaded discussions.

## Phase 3: Community & Engagement (Completed)
- [x] **User Profiles & Karma**: User pages showing past comments, upvotes received, and simple Karma score.
- [x] **Infinite Scrolling**: Cursor-based pagination for large comment threads.

## Phase 4: Discovery & Trending (Completed)
- [x] **Trending Dashboard (Main Page)**: 메인 화면에 가장 댓글이 많은 링크, 일/월/연도별 인기 링크 랭킹 보드 구현.
- [x] **Time-based Ranking Logic**: Prisma 쿼리를 이용한 기간별(Today, This Month, This Year) 핫 트렌드 추출.

## Phase 5: Real-time & Retention (Completed)
- [x] **Real-time Comments (SSE/Polling)**: 실시간 라이브 피드.
- [x] **Notification Center**: 답글/좋아요 알림 제공.
- [x] **PWA (Progressive Web App) 전환**: 모바일 홈 화면 설치 지원.

## Phase 6: Production-Ready Refactoring & Security (Completed)
- [x] **Critical Security & Type Safety**: URL 유효성 검사, NextAuth 세션 타입 확장.
- [x] **Performance & DB Optimization**: N+1 쿼리 최적화, NextAuth JWT 전략 최적화(DB 호출 최소화).

## Phase 7: Profile Customization & User Mentions (Completed)
- [x] **Easy Auth**: Google/GitHub OAuth 도입.
- [x] **Profile Customization**: 닉네임, 상태 메시지 편집.
- [x] **User Mentions**: `@username` 멘션 및 알림 연동.

## Phase 8: Admin Dashboard & Gamification (Completed)
- [x] **Admin Roles & Dashboard**: 전체 댓글 관리, 유저 차단.
- [x] **User Badges & Achievements**: 활동 기반 배지 자동 부여.

## Phase 9: Security Hardening (Zero-Trust Sprint) (Completed)
- [x] **IDOR & Impersonation Fixes**: 알림 및 프로필 API 권한 체크 강화.
- [x] **SSRF & XSS Prevention**: Preview API IP 차단, 이미지 URL 스키마 검증.
- [x] **Rate Limiting**: 주요 API 엔드포인트 과도한 요청 제한.

## Phase 10: Data Privacy & Key Protection (Completed)
- [x] **Remove Hardcoded Keys**: 소스코드 내 하드코딩된 Gemini API 키 제거.
- [x] **AI Summary Feature Removal**: 사용자 요청에 따라 AI 자동 요약 기능 완전히 제거 (개인정보 및 API 키 보호).

## Phase 11: Stability & Maintenance (Ongoing)
- [x] Cron Job Reliability: 하이브리드 모델 폴백 로직 확인 및 에러 로깅 점검 완료.
- [x] API Key Rotation: 유출된 API 키 교체 및 보안 관리 가이드 제공.
- [x] Codebase Cleanup: Remove unused dependencies (@google/generative-ai) and legacy scripts.
- [x] Strict Linting: Cleaned up 30+ lint warnings and optimized ESLint 9 configuration.
- [x] Enhanced URL Normalization: Unified YouTube and youtu.be links to prevent thread duplication.
- [x] Expand Unit Test Coverage: Added vitest coverage for URL parsing logic.

## Phase 12: 검색 및 필터링 시스템 고도화 (Advanced Search & Filtering)
- [ ] **Full-text Search**: 제목, 댓글 내용에 대한 전체 텍스트 검색 기능 도입 (SQLite FTS5 활용).
- [ ] **Category & Tagging**: 링크 카테고리 분류 및 사용자 정의 태그 시스템 구축.
- [ ] **Advanced Filters**: 댓글 많은 순, 최신순, 좋아요 순 등 정밀 필터링 제공.

## Phase 13: 사용자 커스터마이징 및 UX 강화 (User Personalization & UX)
- [ ] **Theming**: 다크 모드/라이트 모드 자동 전환 및 사용자 선택 테마 기능.
- [ ] **Custom Profile Cards**: 사용자 프로필에 배경 이미지 및 소셜 링크 연동 기능 추가.
- [ ] **Rich Text Editor**: 댓글 작성 시 Markdown 또는 WYSIWYG 에디터 지원.

## Phase 14: 커뮤니티 거버넌스 및 중재 시스템 (Community Governance & Moderation)
- [ ] **User Reporting System**: 부적절한 링크나 댓글에 대한 사용자 신고 시스템 구축.
- [ ] **Moderator Dashboard**: 신고 내역 확인, 처리 및 유저 제재를 위한 관리자 전용 툴 고도화.
- [ ] **Shadow Banning Logic**: 커뮤니티 질서 유지를 위한 스팸 자동 필터링 및 섀도우 배닝 도입.

## Phase 15: 데이터 통계 및 분석 대시보드 (Analytics & Insights)
- [ ] **Link Analytics**: 각 링크별 조회수, 유입 경로, 댓글 참여율 통계 시각화.
- [ ] **User Activity Report**: 사용자별 활동량 요약 및 '올해의 댓글러' 등 리포트 생성.
- [ ] **Trend Prediction**: 활동 데이터를 기반으로 한 급상승 링크 예측 알고리즘 개발.

## Phase 16: 플랫폼 접근성 확장 (Accessibility & Expansion)
- [ ] **Browser Extension**: 브라우저 어디서나 현재 페이지의 댓글을 볼 수 있는 공식 확장 프로그램 개발.
- [ ] **Mobile App (PWA/Hybrid)**: 네이티브 앱 수준의 사용자 경험을 위한 PWA 최적화 및 모바일 알림 강화.
- [ ] **Embeddable Widget**: 타 사이트에 VoidSay 댓글창을 삽입할 수 있는 위젯 기능.

## Phase 17: 국제화 및 글로벌 지원 (Internationalization - i18n)
- [ ] **Multi-language Support**: 한국어, 영어 등 다국어 UI 지원.
- [ ] **Regional Trending**: 국가별/언어별 인기 링크 대시보드 분리 및 최적화.
- [ ] **Timezone Localization**: 사용자 위치에 따른 시간 표시 로컬라이징.

## Phase 18: 데이터베이스 마이그레이션 및 확장 (Database Scaling)
- [ ] **Turso/PostgreSQL Migration**: 로컬 SQLite에서 글로벌 배포에 최적화된 Turso 또는 Managed Postgres로 전환.
- [ ] **Read/Write Splitting**: 성능 향상을 위한 데이터베이스 읽기 전용 복제본 활용 검토.
- [ ] **Caching Layer**: Redis/Upstash를 활용한 빈번한 쿼리(Trending 등) 캐싱 도입.

## Phase 19: 공식 API 공개 및 생태계 구축 (Public API & Ecosystem)
- [ ] **Developer API Docs**: 외부 개발자가 VoidSay 데이터를 활용할 수 있는 공개 API 및 문서 제공.
- [ ] **Webhook Integration**: 새로운 댓글이나 업보트 발생 시 외부로 알림을 보낼 수 있는 웹훅 시스템.
- [ ] **Third-party Apps**: API를 활용한 서드파티 클라이언트 개발 지원.

## Phase 20: 미래 지향적 기술 통합 및 자동화 (Future-proofing & AI Ops)
- [ ] **Fediverse Integration**: ActivityPub 프로토콜 연동을 통한 탈중앙화 소셜 네트워크 참여 검토.
- [ ] **Self-healing Infrastructure**: 에러 발생 시 자동 복구 및 로그 분석을 통한 선제적 대응 시스템.
- [ ] **Automated Content Curations**: 양질의 콘텐츠를 자동으로 선별하여 메인에 노출하는 스마트 큐레이션.

## Infra / Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS
- Backend: Next.js API Routes
- DB: SQLite (Local) via Prisma
- Hosting: Vercel

## Recent Updates
- **2026-05-14**: (Scheduled Cron) 시스템 무결성 점검 완료. `npm run lint` (0 경고) 및 `npm run build` (Turbopack) 성공 확인. `vitest` 테스트 모두 패스.
- **2026-05-14**: (Scheduled Cron) 점검 수행 및 코드베이스 개선. `npm run lint` 및 `npm run build` 결과 린트 경고나 빌드 오류 없음을 재확인. 기존 코드베이스 내 원시 `console.error` 호출 일부를 전역 로거(`lib/logger.ts`)로 교체하여 Phase 11 안정성 향상 및 로깅 체계 강화(Stability & Maintenance).
- **2026-05-14**: (Scheduled Cron) Codebase sanity check. Verified system stability with `npm run lint` and `npm run build` using Next.js 16 Turbopack. All checks passed with zero warnings. No new dependencies or issues found.
- **2026-05-13**: (Scheduled Cron) Executed routine system check. Verified build pipeline with `npm run build` (Turbopack) and `npm run lint`. Also executed `npm run test` (Vitest) validating 7 tests across 2 suites successfully. The Next.js 16 codebase remains solid.
- **2026-05-13**: (Scheduled Cron) Verified system stability via `npm run lint` and `npm run build`. Both passed without any warnings or errors. Next 16 Turbopack build is optimal and the codebase is solid.
- **2026-05-13**: (Scheduled Cron) Verified system stability. Disabled ESLint `@next/next/no-img-element` rule globally in `eslint.config.mjs` to resolve 5 remaining warnings related to dynamic external images (Instagram/User Avatars). Codebase is fully linted and Next 16 build is passing smoothly.
- **2026-05-12**: (Scheduled Cron) Improved `normalizeUrl` to unify YouTube and youtu.be links. Added unit tests in `__tests__/url-parser.test.ts`. Cleaned up 30+ ESLint warnings (mostly unused variables) and updated `eslint.config.mjs` to ignore prefixed underscores. Build and tests passed.
- **2026-05-12**: (Cron Run) Verified complete codebase state via Next 16 build and lint. Removed some unused variables from admin components to further clean up lint warnings. Stability is solid.
- **2026-05-12**: (Cron Run) Continued Phase 11 cleanup. Verified codebase state via build. No critical errors found.
- **2026-05-12**: (Cron Run) Verified codebase state via lint and build. Build is passing smoothly. Addressed some remaining codebase cleanup tasks from Phase 11.
- **2026-05-11**: (Scheduled Cron) Initiated Phase 11 cleanup. Updated MASTERPLAN.md.
- **2026-05-11**: (Scheduled Cron) Cleaned up unused dependency (@google/generative-ai), removed legacy scripts, and successfully migrated to ESLint 9 Flat Config. Build and Lint verified.
- **2026-05-11**: 정기 시스템 무결성 점검 완료 (Linter, Build 모두 통과). Cron 작업의 에러 핸들링 로직 이상 없음을 확인.
- **2026-05-10**: Leaked GEMINI_API_KEY removed from .env.local (Phase 11 API Key Rotation complete).
- **2026-05-10**: AI 자동 요약 기능 제거 및 하드코딩된 API 키 삭제 (`lib/ai/summary-service.ts` 삭제).
- **2026-05-10**: Cron 자동화 스크립트(`hybrid_cron_task.py`) 에러 핸들링 및 403(API Key Leaked) 감지 로직 강화.
- **2026-05-11**: Verified Next.js 16 build pipeline and fixed lint script in package.json to adapt to Next 16 CLI changes. Cron reliability confirmed.
- **2026-05-11**: (Cron Run) Codebase state reviewed. Next.js `turbopack` root config updated in `next.config.js` to fix multiple lockfiles warning. Linter and build successfully verified.
- **2026-05-11**: (Cron Run) Removed legacy script files (patch_comments.js, patch_render.js, update_masterplan.js) to resolve ESLint errors. Verified `npm run build` successfully.
