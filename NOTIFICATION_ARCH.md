# Notification Center Architecture & Implementation Plan

## 1. Goal
사용자에게 내 댓글에 답글이 달리거나, 좋아요를 받았을 때 인앱 알림(Notification Center)을 제공합니다. 상단 GNB(Global Navigation Bar)에 종 모양 아이콘을 추가하고 누르면 알림 목록이 드롭다운으로 표시됩니다.

## 2. Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, Lucide React (`Bell`)
- Backend: Next.js API Routes (`/api/notifications/route.ts`)
- DB: Prisma (`Notification` 모델 신규 생성)

## 3. Database Schema Updates
`schema.prisma`에 `Notification` 모델을 추가하고 `User` 모델과 연결합니다.
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String   // 알림을 받는 유저
  type      String   // "REPLY", "LIKE"
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
}
// User 모델에 notifications Notification[] 추가 필요
```

## 4. Implementation Steps
1. **DB 스키마 수정 및 푸시 (`prisma db push`)**
2. **이벤트 트리거 적용**:
   - `/api/comments` (답글 작성/좋아요 등록 시 `Notification` 레코드 생성)
3. **UI 컴포넌트 개발 (`components/NotificationDropdown.tsx`)**:
   - `Bell` 아이콘, 안 읽은 알림 배지, 드롭다운 패널.
   - 읽음 처리 API (`PUT /api/notifications`) 호출 기능.
4. **`layout.tsx` 또는 `ThreadUI.tsx` 상단 통합**.