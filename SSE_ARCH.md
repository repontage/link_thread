# SSE (Server-Sent Events) Refactoring Architecture

## 1. Goal
현재 15초 간격으로 수행되는 Background Polling 방식을 Next.js API Routes의 Server-Sent Events(SSE)로 전환하여, 서버 부하를 줄이고 데이터가 갱신될 때만 실시간으로 프론트엔드에 푸시하도록 개선합니다. (유료 Pusher 사용 없이 로컬/무료 원칙 유지)

## 2. Implementation Logic
1. **SSE Endpoint (`/api/comments/stream`)**:
   - 클라이언트가 연결하면 `text/event-stream` 헤더를 응답으로 보냄.
   - setInterval을 돌면서 (또는 EventEmitter를 연동해) DB나 서버 내부 상태를 확인하고, 새로운 댓글이 발견되면 이벤트 데이터를 `res.write`를 통해 밀어냄.
2. **UI Update (`ThreadUI.tsx`)**:
   - `EventSource` API를 사용하여 스트림에 연결.
   - 메시지가 수신될 때 기존 `comments` 상태의 맨 앞에 새 댓글을 삽입하여 부드러운 라이브 피드를 제공.
3. **Clean-up**:
   - 기존의 `setInterval` 기반 폴링 코드 삭제.