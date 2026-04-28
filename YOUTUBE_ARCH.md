# YouTube Integration Architecture & Implementation Plan

## 1. Goal
Implement YouTube link parsing, in-app video playback, and timestamp-based commenting.

## 2. Tech Stack
- Frontend: Next.js (React), Tailwind CSS
- Video Player: `react-player` or native YouTube iframe API.
- Backend/DB: Next.js API Routes + Prisma + SQLite

## 3. Database Schema (Prisma)
```prisma
model Post {
  id        String   @id @default(uuid())
  url       String   // YouTube URL
  type      String   // "youtube", "instagram", etc.
  title     String?
  createdAt DateTime @default(now())
  comments  Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  text      String
  timestamp Int?     // Video timestamp in seconds
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
}
```

## 4. Implementation Steps
1. Initialize Next.js project with Tailwind CSS & Prisma.
2. Set up SQLite database and run migrations.
3. Create the `Post` and `Comment` APIs.
4. Build the YouTube Player UI with timestamp syncing (click timestamp to seek video).
5. Build the Comment Form (auto-capture current video time if it's a YouTube post).
