# User Profiles & Karma Architecture

## 1. Goal
사용자 프로필 페이지(`/users/[id]`)를 생성하여, 유저가 그동안 작성한 댓글(활동 내역)과 누적 추천수(Karma)를 한눈에 볼 수 있게 합니다.

## 2. Tech Stack
- Frontend: Next.js (App Router), `app/users/[id]/page.tsx`
- Backend: Next.js API Routes, Prisma
- UI Components: Tailwind CSS 기반 프로필 헤더 및 활동 피드 리스트.

## 3. Database Schema Updates
기존 `User`와 `Comment` 모델을 활용합니다.
`Comment`에 `upvotes` 필드가 이미 존재하므로, 유저의 총 Karma는 `SUM(upvotes)`로 계산하거나, 단순화를 위해 `User` 모델에 `karma Int @default(0)` 필드를 추가할 수 있습니다.
현재는 Prisma 집계(aggregate) 또는 기본 댓글 조회를 사용합니다.

## 4. Implementation Steps
1. **API 개발 (`/api/users/[id]`)**: 특정 유저의 정보와 작성한 최신 댓글 20개를 반환.
2. **프로필 UI 컴포넌트 (`app/users/[id]/page.tsx`)**:
   - 상단: 유저 닉네임, 가입일, 총 Karma 점수.
   - 하단: 최근 작성한 댓글(CommentItem 또는 요약 버전) 목록.
3. 서브 에이전트에게 라우트와 컴포넌트 생성을 지시.