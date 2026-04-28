# Twitter Integration Architecture & Implementation Plan

## 1. Goal
트위터(X) 링크 메타데이터 추출, 인앱 트윗 임베드 렌더링, 스레드형 댓글 토론 UI 구현.

## 2. Tech Stack
- Frontend: Next.js (React), Tailwind CSS
- UI Components: `react-tweet` 패키지 활용 (Vercel 제공, 가장 빠르고 공식적인 트윗 임베드 방식) 또는 커스텀 `TwitterEmbedCard.tsx` 제작.
- Meta Parser: `x.com` 및 `twitter.com` URL 정규식 감지.

## 3. Database Schema Updates
기존 `Comment` 모델 스키마 유지. 트위터 링크의 `threadId`를 기준으로 기존 댓글 시스템과 완벽히 호환됨.

## 4. Implementation Steps
1. **패키지 설치**: `npm install react-tweet`
2. **UI 컴포넌트 개발 (`TwitterEmbedCard.tsx`)**: 
   - `react-tweet` 라이브러리를 래핑하는 컴포넌트 구현.
   - 다크모드/라이트모드 및 Tailwind CSS 스타일링 조화.
3. **UI 통합 (`ThreadUI.tsx`)**: 
   - `isTwitterUrl(url)` 정규식(`/(twitter\.com|x\.com)\/\w+\/status\/(\d+)/`) 추가.
   - 해당 URL 입력 시 `TwitterEmbedCard` 렌더링 및 트윗 ID 추출.
4. 서브 에이전트를 활용하여 위 코드 작성 지시.