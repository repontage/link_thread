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

    return NextResponse.json({
      success: true,
      results: results.length > 0 ? results : ['All columns already exist'],
      userColumns,
      notifColumns,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
