import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function GET(req: Request) {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return NextResponse.json({ error: 'No DATABASE_URL' });

  const libsql = createClient({ url, authToken });
  const queries = [
    `CREATE TABLE IF NOT EXISTS "Reaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "emoji" TEXT NOT NULL,
        "commentId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Report" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "commentId" TEXT NOT NULL,
        "reporterId" TEXT NOT NULL,
        "reason" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "UserBadge" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "badgeType" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    `CREATE INDEX IF NOT EXISTS "Reaction_commentId_idx" ON "Reaction"("commentId")`,
    `CREATE INDEX IF NOT EXISTS "Reaction_userId_idx" ON "Reaction"("userId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Reaction_commentId_userId_emoji_key" ON "Reaction"("commentId", "userId", "emoji")`,
    `CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead")`,
    `CREATE INDEX IF NOT EXISTS "Report_commentId_idx" ON "Report"("commentId")`,
    `CREATE INDEX IF NOT EXISTS "Report_reporterId_idx" ON "Report"("reporterId")`,
    `CREATE INDEX IF NOT EXISTS "Report_status_idx" ON "Report"("status")`,
    `CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "UserBadge_userId_badgeType_key" ON "UserBadge"("userId", "badgeType")`
  ];

  try {
    for (const q of queries) {
      await libsql.execute(q);
    }
    return NextResponse.json({ success: true, message: 'Migration successful' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
