# Instagram Integration Architecture & Implementation Plan

## 1. Goal
인스타그램 링크(Post/Reel) 메타데이터 추출, 인앱 스와이프 이미지 그리드, 피드 스타일 UI 구현.

## 2. Tech Stack
- Frontend: Next.js (React), Tailwind CSS
- UI Components: Swiper.js (또는 순수 CSS Snap Scroll) 이미지 스와이프 지원.
- Meta Parser: `cheerio` 기반 OpenGraph / Instagram oEmbed 데이터 추출.

## 3. Database Schema Updates
기존 `Comment` 모델에 인스타그램 이미지/비디오 URL을 저장하고 피드 형태로 보여주기 위해 확장합니다. 기존의 `imageUrls` 필드를 적극 활용합니다.
```prisma
model Post {
  id        String   @id @default(uuid())
  url       String   // Instagram URL
  type      String   // "instagram"
  metadata  Json?    // { author: "", authorAvatar: "", caption: "", mediaUrls: [] }
  createdAt DateTime @default(now())
  comments  Comment[]
}
```
*(현재 프로젝트는 `Post` 모델 대신 `threadId`를 사용하므로, `PreviewCard`의 API에서 oEmbed/metadata 파싱을 강화하는 방향으로 진행합니다.)*

## 4. Implementation Steps
1. **API 업데이트 (`/api/preview`)**: 인스타그램 URL 감지 시 oEmbed API 또는 HTML 파싱을 통해 여러 장의 이미지(Carousel)와 캡션을 추출합니다.
2. **UI 컴포넌트 개발 (`InstagramFeedCard.tsx`)**: 
   - 상단: 프로필 아이콘과 핸들(Handle).
   - 중간: CSS Scroll Snap을 활용한 Swipeable Image Grid.
   - 하단: 좋아요 아이콘, 원본 캡션.
3. **UI 통합 (`ThreadUI.tsx`)**: 링크 유형을 판별하여 `InstagramFeedCard`를 렌더링.
4. 서브 에이전트를 스폰하여 해당 컴포넌트 마크업과 CSS를 먼저 구현하도록 지시합니다.
