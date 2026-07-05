import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url) {
    return NextResponse.json({ error: 'No DATABASE_URL found in environment' }, { status: 500 });
  }

  const libsql = createClient({ url, authToken });
  
  try {
    // 1. Sync User table columns
    const userColumnsResult = await libsql.execute("PRAGMA table_info(User)");
    const userColumns = userColumnsResult.rows.map((row: any) => row.name);

    const requiredUserColumns = [
      { name: 'role', type: "TEXT DEFAULT 'USER'" },
      { name: 'isBanned', type: 'BOOLEAN DEFAULT 0' },
      { name: 'isShadowBanned', type: 'BOOLEAN DEFAULT 0' },
      { name: 'isPro', type: 'BOOLEAN DEFAULT 0' },
      { name: 'subscriptionStatus', type: 'TEXT' },
      { name: 'lsCustomerId', type: 'TEXT' },
      { name: 'lsSubscriptionId', type: 'TEXT' },
      { name: 'lsVariantId', type: 'TEXT' },
      { name: 'subscriptionEnd', type: 'DATETIME' },
      { name: 'profileBackground', type: 'TEXT' },
      { name: 'username', type: 'TEXT' },
      { name: 'bio', type: 'TEXT' }
    ];

    const userAdded = [];
    for (const col of requiredUserColumns) {
      if (!userColumns.includes(col.name)) {
        await libsql.execute(`ALTER TABLE User ADD COLUMN ${col.name} ${col.type}`);
        userAdded.push(col.name);
      }
    }

    // 2. Sync Comment table columns
    const columnsResult = await libsql.execute("PRAGMA table_info(Comment)");
    const columns = columnsResult.rows.map((row: any) => row.name);
    
    const requiredColumns = [
      { name: 'category', type: 'TEXT' },
      { name: 'isToxic', type: 'BOOLEAN DEFAULT 0' },
      { name: 'tags', type: 'TEXT' },
      { name: 'imageUrls', type: 'TEXT' },
      { name: 'url', type: 'TEXT' }
    ];

    const commentAdded = [];
    for (const col of requiredColumns) {
      if (!columns.includes(col.name)) {
        await libsql.execute(`ALTER TABLE Comment ADD COLUMN ${col.name} ${col.type}`);
        commentAdded.push(col.name);
      }
    }

    // 3. Ensure Authenticator table exists
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS Authenticator (
        credentialID TEXT UNIQUE NOT NULL,
        userId TEXT NOT NULL,
        providerAccountId TEXT NOT NULL,
        credentialPublicKey TEXT NOT NULL,
        counter INTEGER NOT NULL,
        credentialDeviceType TEXT NOT NULL,
        credentialBackedUp INTEGER NOT NULL,
        transports TEXT,
        PRIMARY KEY (userId, credentialID),
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);

    // 4. Ensure UserBadge table exists
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS UserBadge (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL,
        badgeType TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);

    await libsql.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS UserBadge_userId_badgeType_key ON UserBadge (userId, badgeType);
    `);

    await libsql.execute(`
      CREATE INDEX IF NOT EXISTS UserBadge_userId_idx ON UserBadge (userId);
    `);

    // 5. Ensure WebhookSubscription table exists in Turso DB
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS WebhookSubscription (
        id TEXT PRIMARY KEY NOT NULL,
        url TEXT NOT NULL,
        event TEXT NOT NULL,
        userId TEXT NOT NULL,
        secret TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        active INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    
    // Ensure index on WebhookSubscription(userId)
    await libsql.execute(`
      CREATE INDEX IF NOT EXISTS WebhookSubscription_userId_idx ON WebhookSubscription (userId);
    `);

    // Ensure unique index on Report(commentId, reporterId) to prevent race condition duplicates
    await libsql.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS Report_commentId_reporterId_key ON Report (commentId, reporterId);
    `);

    // 6. Sync Notification table columns
    const notifColumnsResult = await libsql.execute("PRAGMA table_info(Notification)");
    const notifColumns = notifColumnsResult.rows.map((row: any) => row.name);

    const requiredNotifColumns = [
      { name: 'priority', type: 'INTEGER DEFAULT 0' }
    ];

    const notifAdded = [];
    for (const col of requiredNotifColumns) {
      if (!notifColumns.includes(col.name)) {
        await libsql.execute(`ALTER TABLE Notification ADD COLUMN ${col.name} ${col.type}`);
        notifAdded.push(col.name);
      }
    }

    // 7. Ensure InviteCode table exists
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS InviteCode (
        id TEXT PRIMARY KEY NOT NULL,
        code TEXT UNIQUE NOT NULL,
        creatorId TEXT NOT NULL,
        maxUses INTEGER NOT NULL DEFAULT 10,
        useCount INTEGER NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expiresAt DATETIME NOT NULL,
        FOREIGN KEY (creatorId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);

    await libsql.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS InviteCode_code_key ON InviteCode (code);
    `);

    // 8. Ensure InviteUse table exists
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS InviteUse (
        id TEXT PRIMARY KEY NOT NULL,
        inviteId TEXT NOT NULL,
        userId TEXT UNIQUE NOT NULL,
        rewardGiven INTEGER NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (inviteId) REFERENCES InviteCode (id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);

    await libsql.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS InviteUse_userId_key ON InviteUse (userId);
    `);

    // 9. Ensure Phase 26 tables: Community, CommunityThread, Follow, Message
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS Community (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        creatorId TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creatorId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS Community_slug_idx ON Community (slug);`);

    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS CommunityThread (
        id TEXT PRIMARY KEY NOT NULL,
        communityId TEXT NOT NULL,
        url TEXT NOT NULL,
        title TEXT,
        addedById TEXT NOT NULL,
        addedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (communityId) REFERENCES Community (id) ON DELETE CASCADE,
        FOREIGN KEY (addedById) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    await libsql.execute(`CREATE UNIQUE INDEX IF NOT EXISTS CommunityThread_communityId_url_key ON CommunityThread (communityId, url);`);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS CommunityThread_communityId_addedAt_idx ON CommunityThread (communityId, addedAt);`);

    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS Follow (
        id TEXT PRIMARY KEY NOT NULL,
        followerId TEXT NOT NULL,
        followingId TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (followerId) REFERENCES User (id) ON DELETE CASCADE,
        FOREIGN KEY (followingId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    await libsql.execute(`CREATE UNIQUE INDEX IF NOT EXISTS Follow_followerId_followingId_key ON Follow (followerId, followingId);`);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS Follow_followerId_idx ON Follow (followerId);`);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS Follow_followingId_idx ON Follow (followingId);`);

    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS Message (
        id TEXT PRIMARY KEY NOT NULL,
        senderId TEXT NOT NULL,
        receiverId TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        readAt DATETIME,
        FOREIGN KEY (senderId) REFERENCES User (id) ON DELETE CASCADE,
        FOREIGN KEY (receiverId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS Message_senderId_receiverId_createdAt_idx ON Message (senderId, receiverId, createdAt);`);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS Message_receiverId_readAt_idx ON Message (receiverId, readAt);`);

    // 10. Ensure Phase 27 tables: Team, TeamMember, SponsoredLink
    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS Team (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        ownerId TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ownerId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS Team_slug_idx ON Team (slug);`);

    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS TeamMember (
        id TEXT PRIMARY KEY NOT NULL,
        teamId TEXT NOT NULL,
        userId TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'MEMBER',
        joinedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teamId) REFERENCES Team (id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE
      );
    `);
    await libsql.execute(`CREATE UNIQUE INDEX IF NOT EXISTS TeamMember_teamId_userId_key ON TeamMember (teamId, userId);`);
    await libsql.execute(`CREATE INDEX IF NOT EXISTS TeamMember_userId_idx ON TeamMember (userId);`);

    await libsql.execute(`
      CREATE TABLE IF NOT EXISTS SponsoredLink (
        id TEXT PRIMARY KEY NOT NULL,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        sponsorName TEXT NOT NULL,
        imageUrl TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return NextResponse.json({ 
      success: true, 
      existingUserColumns: userColumns,
      addedUserColumns: userAdded,
      existingCommentColumns: columns,
      addedCommentColumns: commentAdded,
      existingNotificationColumns: notifColumns,
      addedNotificationColumns: notifAdded,
      message: "Database tables and columns synchronized successfully (including Phase 26/27 tables)."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = (session.user as any).id;

    if (body.action === "removePro") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: false,
          subscriptionStatus: null,
          lsCustomerId: null,
          lsSubscriptionId: null,
          lsVariantId: null,
          subscriptionEnd: null,
        },
      });
      return NextResponse.json({ success: true, message: "Pro membership removed successfully." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[FIX_DB_POST_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
