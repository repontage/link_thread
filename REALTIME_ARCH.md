# Real-time Comments Architecture

## 1. Goal
사용자들이 같은 링크의 댓글 스레드를 보고 있을 때, 페이지 새로고침 없이 새로 달린 댓글이 실시간으로 보이도록(Live Feed) 개선합니다.

## 2. Tech Stack
- Frontend: Next.js (React Hooks)
- Backend: 기존 `/api/comments` API 활용
- Mechanism: Vercel Free Tier 및 Local 환경에서의 호환성과 비용(무료) 원칙을 위해, 외부 웹소켓(Pusher 등) 대신 **Background Polling (10~15초 주기)** 방식을 채택합니다.

## 3. Implementation Steps
1. **`ThreadUI.tsx` 프론트엔드 업데이트**:
   - `setInterval`을 이용한 Polling 로직 구현.
   - 백그라운드 폴링 중에는 UI에 로딩 스피너를 표시하지 않아 사용자 경험(UX)을 해치지 않게 합니다.
   - 새로운 데이터가 도착하면 기존 댓글 목록과 병합하여 최신 상태를 유지합니다. (페이지 1 기준 리프레시)
2. **최적화**:
   - 브라우저 탭이 백그라운드로 가면 폴링을 멈추거나 주기를 늘려 리소스를 절약하도록 구현.