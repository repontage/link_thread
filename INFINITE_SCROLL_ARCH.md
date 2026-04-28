# Infinite Scrolling Architecture & Implementation Plan

## 1. Goal
대규모 댓글 스레드 환경에서 사용자 경험을 개선하기 위해, 기존의 '더 보기(Load More)' 버튼 방식을 무한 스크롤(Infinite Scrolling) 방식으로 개선합니다.

## 2. Tech Stack
- Frontend: Next.js, React (`react-intersection-observer` 활용 또는 기본 `IntersectionObserver` API)
- Backend: Next.js API Routes (`/api/comments`)
- DB: Prisma (기존 커서/오프셋 기반 페이지네이션 활용)

## 3. Database Schema Updates
- 기존 `Comment` 모델과 데이터베이스 스키마는 변경할 필요가 없습니다. 
- API의 Pagination 속성(`page`, `limit`)은 이미 구현되어 있으므로 프론트엔드 연동에 집중합니다.

## 4. Implementation Steps
1. **패키지 설치**: `npm install react-intersection-observer` (필요시)
2. **UI 업데이트 (`ThreadUI.tsx`)**:
   - `react-intersection-observer`의 `useInView` 훅을 사용하여 마지막 댓글 또는 하단 감지 요소를 렌더링.
   - 해당 요소가 화면에 나타나면(inView === true), `hasNextPage`가 참일 때 `handleLoadMore` 함수를 자동으로 트리거.
   - 로딩 스피너 UI 개선.
3. 서브 에이전트에게 해당 로직을 `ThreadUI.tsx`에 적용하도록 지시.