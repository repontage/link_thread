# AI Content Filter Architecture & Implementation Plan

## 1. Goal
사용자들이 남기는 댓글 중 유해한 단어(욕설, 스팸 키워드 등)를 포함한 댓글을 자동으로 감지하고, 해당 댓글에 `isToxic` 플래그를 true로 설정하여 UI 상에서 가리기(숨김 처리) 기능을 구현합니다. 비용 원칙에 따라 서버 내 로컬 로직으로 처리합니다.

## 2. Tech Stack
- Backend: Next.js API Routes (`/api/comments/route.ts`)
- Logic: 단순 키워드 매칭(Regex) 유틸리티 함수 생성 (`lib/filter.ts`)
- DB: Prisma `Comment` 모델의 `isToxic` 필드 활용 (이미 스키마에 존재)

## 3. Implementation Steps
1. **유틸리티 생성 (`lib/filter.ts`)**:
   - `checkToxicity(content: string): boolean` 함수 구현.
   - 기본적인 금지어 목록(예: "욕설1", "욕설2", "spam", "광고" 등 더미 데이터)을 포함.
2. **API 연동 (`app/api/comments/route.ts`)**:
   - POST 요청으로 새 댓글이 등록될 때, `checkToxicity`를 실행하여 결과값을 `isToxic`에 저장.
3. **UI 업데이트 (`CommentItem.tsx`)**:
   - `isToxic`이 true인 경우 기본적으로 내용을 숨기고, "⚠️ 유해한 콘텐츠로 분류되어 숨김 처리되었습니다. (클릭하여 보기)" 문구를 띄웁니다. (이미 이전 세션에서 UI 일부는 준비됨, 연동만 확인).
4. 서브 에이전트에게 `lib/filter.ts` 작성 및 API 라우트 반영 지시.