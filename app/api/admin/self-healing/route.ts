import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { logToTelegram } from '@/lib/telegram-logger';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
  }

  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return NextResponse.json({ status: "error", message: "No DATABASE_URL in environment" }, { status: 500 });
  }

  const libsql = createClient({ url, authToken });
  const diagnostics: Record<string, any> = {};
  let needsHealing = false;
  let healingResult = "No healing required";

  try {
    // 1. Database Connection Ping
    const pingResult = await libsql.execute("SELECT 1 as ping");
    diagnostics.dbPing = pingResult.rows[0]?.ping === 1 ? "success" : "failed";
  } catch (error: any) {
    diagnostics.dbPing = "failed";
    diagnostics.dbPingError = error.message;
    needsHealing = true;
  }

  // 2. Table Integrity Check (핵심 테이블 검증)
  if (diagnostics.dbPing === "success") {
    try {
      const tablesResult = await libsql.execute("SELECT name FROM sqlite_master WHERE type='table'");
      const tableNames = tablesResult.rows.map((row: any) => row.name);
      
      const requiredTables = ["User", "Comment", "WebhookSubscription", "Authenticator"];
      const missingTables = requiredTables.filter(t => !tableNames.includes(t));

      diagnostics.missingTables = missingTables;
      
      if (missingTables.length > 0) {
        needsHealing = true;
        diagnostics.integrityStatus = "degraded";
      } else {
        diagnostics.integrityStatus = "healthy";
      }
    } catch (error: any) {
      diagnostics.integrityStatus = "error";
      diagnostics.integrityError = error.message;
      needsHealing = true;
    }
  }

  // 3. Column Sync (always runs to prevent schema drift)
  let repairedColumnsCount = 0;
  let columnSyncResult = "";
  if (diagnostics.dbPing === "success") {
    try {
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

      for (const col of requiredUserColumns) {
        if (!userColumns.includes(col.name)) {
          await libsql.execute(`ALTER TABLE User ADD COLUMN ${col.name} ${col.type}`);
          repairedColumnsCount++;
        }
      }

      // Notification table column check
      const notifColumnsResult = await libsql.execute("PRAGMA table_info(Notification)");
      const notifColumns = notifColumnsResult.rows.map((row: any) => row.name);
      const requiredNotifColumns = [
        { name: 'priority', type: 'INTEGER DEFAULT 0' }
      ];
      for (const col of requiredNotifColumns) {
        if (!notifColumns.includes(col.name)) {
          await libsql.execute(`ALTER TABLE Notification ADD COLUMN ${col.name} ${col.type}`);
          repairedColumnsCount++;
        }
      }

      // Create missing indexes
      try {
        await libsql.execute('CREATE INDEX IF NOT EXISTS "Notification_userId_priority_createdAt_idx" ON "Notification"("userId", "priority", "createdAt")');
      } catch (_) { /* index may already exist */ }

      columnSyncResult = repairedColumnsCount > 0 
        ? `Synced ${repairedColumnsCount} missing column(s)` 
        : "All columns in sync";
    } catch (colError: any) {
      columnSyncResult = `Column sync error: ${colError.message}`;
      needsHealing = true;
    }
  }

  // 4. Self-healing Activation (tables, full recovery)
  if (needsHealing) {
    console.warn("[SELF-HEALING] System degradation detected. Triggering automated healing...");
    try {
      // 테이블 복구
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

      await libsql.execute(`
        CREATE UNIQUE INDEX IF NOT EXISTS Report_commentId_reporterId_key ON Report (commentId, reporterId);
      `);

      healingResult = `Automated healing completed. ${columnSyncResult}.`;
      
      // 텔레그램으로 치유 완료 리포트 알림 발송
      await logToTelegram(`⚠️ *[Self-Healing Alert]*\n- Status: Degraded\n- Actions taken: ${healingResult}\n- System has been restored to HEALTHY.`);
    } catch (healError: any) {
      healingResult = `Healing failed: ${healError.message}`;
      await logToTelegram(`🚨 *[Self-Healing Critical Error]*\n- Self-healing process crashed: ${healError.message}`);
    }
  }

  return NextResponse.json({
    status: needsHealing ? "healed" : "healthy",
    timestamp: new Date().toISOString(),
    diagnostics,
    healingResult
  });
}
