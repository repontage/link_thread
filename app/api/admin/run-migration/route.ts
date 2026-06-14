import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (token !== 'migrate-pak74-20260609') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return NextResponse.json({ error: 'No DATABASE_URL' }, { status: 500 });
  }

  const libsql = createClient({ url, authToken });
  const results: string[] = [];

  try {
    // User columns
    const userColumnsResult = await libsql.execute("PRAGMA table_info(User)");
    const userColumns = userColumnsResult.rows.map((row: any) => row.name);

    const requiredUserColumns = [
      { name: 'isPro', type: 'BOOLEAN DEFAULT 0' },
      { name: 'subscriptionStatus', type: 'TEXT' },
      { name: 'lsCustomerId', type: 'TEXT' },
      { name: 'lsSubscriptionId', type: 'TEXT' },
      { name: 'lsVariantId', type: 'TEXT' },
      { name: 'subscriptionEnd', type: 'DATETIME' },
    ];

    for (const col of requiredUserColumns) {
      if (!userColumns.includes(col.name)) {
        await libsql.execute(`ALTER TABLE User ADD COLUMN ${col.name} ${col.type}`);
        results.push(`Added User.${col.name}`);
      }
    }

    // Notification columns
    const notifColumnsResult = await libsql.execute("PRAGMA table_info(Notification)");
    const notifColumns = notifColumnsResult.rows.map((row: any) => row.name);

    if (!notifColumns.includes('priority')) {
      await libsql.execute('ALTER TABLE Notification ADD COLUMN priority INTEGER DEFAULT 0');
      results.push('Added Notification.priority');
    }

    try {
      await libsql.execute('CREATE INDEX IF NOT EXISTS "Notification_userId_priority_createdAt_idx" ON "Notification"("userId", "priority", "createdAt")');
      results.push('Created Notification index');
    } catch (_) { /* index may already exist */ }

    // Phase 26 & 27: New tables
    const tablesResult = await libsql.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tablesResult.rows.map((row: any) => row.name);

    // Community table
    if (!tableNames.includes('Community')) {
      await libsql.execute(`
        CREATE TABLE "Community" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "slug" TEXT NOT NULL UNIQUE,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "creatorId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      await libsql.execute('CREATE INDEX "Community_slug_idx" ON "Community"("slug")');
      results.push('Created Community table');
    }

    // CommunityThread table
    if (!tableNames.includes('CommunityThread')) {
      await libsql.execute(`
        CREATE TABLE "CommunityThread" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "communityId" TEXT NOT NULL,
          "url" TEXT NOT NULL,
          "title" TEXT,
          "addedById" TEXT NOT NULL,
          "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE,
          FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      await libsql.execute('CREATE UNIQUE INDEX "CommunityThread_communityId_url_key" ON "CommunityThread"("communityId", "url")');
      await libsql.execute('CREATE INDEX "CommunityThread_communityId_addedAt_idx" ON "CommunityThread"("communityId", "addedAt")');
      results.push('Created CommunityThread table');
    }

    // Follow table
    if (!tableNames.includes('Follow')) {
      await libsql.execute(`
        CREATE TABLE "Follow" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "followerId" TEXT NOT NULL,
          "followingId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE,
          FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      await libsql.execute('CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId")');
      await libsql.execute('CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId")');
      await libsql.execute('CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId")');
      results.push('Created Follow table');
    }

    // Message table
    if (!tableNames.includes('Message')) {
      await libsql.execute(`
        CREATE TABLE "Message" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "senderId" TEXT NOT NULL,
          "receiverId" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "readAt" DATETIME,
          FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE,
          FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      await libsql.execute('CREATE INDEX "Message_senderId_receiverId_createdAt_idx" ON "Message"("senderId", "receiverId", "createdAt")');
      await libsql.execute('CREATE INDEX "Message_receiverId_readAt_idx" ON "Message"("receiverId", "readAt")');
      results.push('Created Message table');
    }

    // Team table
    if (!tableNames.includes('Team')) {
      await libsql.execute(`
        CREATE TABLE "Team" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL UNIQUE,
          "description" TEXT,
          "ownerId" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      await libsql.execute('CREATE INDEX "Team_slug_idx" ON "Team"("slug")');
      results.push('Created Team table');
    }

    // TeamMember table
    if (!tableNames.includes('TeamMember')) {
      await libsql.execute(`
        CREATE TABLE "TeamMember" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "teamId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'MEMBER',
          "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      await libsql.execute('CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId")');
      await libsql.execute('CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId")');
      results.push('Created TeamMember table');
    }

    // SponsoredLink table
    if (!tableNames.includes('SponsoredLink')) {
      await libsql.execute(`
        CREATE TABLE "SponsoredLink" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "url" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "sponsorName" TEXT NOT NULL,
          "imageUrl" TEXT,
          "active" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      results.push('Created SponsoredLink table');
    }

    return NextResponse.json({
      success: true,
      results: results.length > 0 ? results : ['All tables and columns already exist'],
      userColumns,
      notifColumns,
      tableNames,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
