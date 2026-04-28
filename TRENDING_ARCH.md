# Trending Dashboard Architecture & Implementation Plan

## 1. Goal
Phase 4의 핵심인 '인기 링크 랭킹 보드(Trending Dashboard)'를 메인 화면에 구현합니다. 일간(Today), 월간(This Month), 연간(This Year) 기준으로 가장 많은 댓글이 달린 링크 Top 5를 보여주어 사용자들의 관심도를 높입니다.

## 2. Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS
- Backend: Next.js API Routes (`/api/trending/route.ts`)
- DB: Prisma (`groupBy`, `_count`, `where` date filters 활용)

## 3. Implementation Steps
1. **API 개발 (`/api/trending/route.ts`)**:
   - `period` 쿼리 파라미터('today', 'month', 'year')에 따라 날짜 필터를 적용.
   - Prisma의 `groupBy`를 사용하여 `url`별로 댓글 수를 카운트하고, 내림차순으로 Top 5 추출.
2. **UI 컴포넌트 (`components/TrendingBoard.tsx`)**:
   - 상단에 기간 필터 탭(Today, Month, Year) 제공.
   - 하단 리스트에 URL과 댓글 수 렌더링. 클릭 시 해당 URL 스레드로 이동.
3. **메인 화면 통합 (`app/page.tsx` 또는 `ThreadUI.tsx` 상단)**:
   - 검색창 위 또는 아래에 `TrendingBoard` 컴포넌트 배치.