import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const email = 'repontage@gmail.com';
    
    console.log('Starting manual migration for Turso DB...');
    const migrationQueries = [
      "ALTER TABLE User ADD COLUMN profileBackground TEXT",
      "ALTER TABLE User ADD COLUMN isShadowBanned INTEGER DEFAULT 0",
      "CREATE TABLE IF NOT EXISTS LinkStats (id TEXT PRIMARY KEY, url TEXT UNIQUE, threadId TEXT UNIQUE, views INTEGER DEFAULT 0, updatedAt DATETIME)"
    ];

    const results: any[] = [];
    for (const query of migrationQueries) {
      try {
        await prisma.$executeRawUnsafe(query);
        results.push({ query, status: 'success' });
      } catch (e: any) {
        results.push({ query, status: 'failed', error: e.message });
      }
    }

    // Direct SQL update for admin access
    await prisma.$executeRawUnsafe(`UPDATE User SET role = 'ADMIN' WHERE email = '${email}'`);
    
    return NextResponse.json({ 
      message: `Migration and admin setup completed for ${email}.`,
      migrationResults: results
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
