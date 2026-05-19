import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { auth } from '@/auth';

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
    // Check columns of 'Comment' table
    const columnsResult = await libsql.execute("PRAGMA table_info(Comment)");
    const columns = columnsResult.rows.map((row: any) => row.name);
    
    const requiredColumns = [
      { name: 'category', type: 'TEXT' },
      { name: 'isToxic', type: 'BOOLEAN DEFAULT 0' },
      { name: 'tags', type: 'TEXT' },
      { name: 'imageUrls', type: 'TEXT' },
      { name: 'url', type: 'TEXT' }
    ];

    const added = [];
    for (const col of requiredColumns) {
      if (!columns.includes(col.name)) {
        await libsql.execute(`ALTER TABLE Comment ADD COLUMN ${col.name} ${col.type}`);
        added.push(col.name);
      }
    }

    return NextResponse.json({ 
      success: true, 
      existingColumns: columns,
      addedColumns: added,
      message: added.length > 0 ? `Added: ${added.join(', ')}` : "All columns synced."
    });
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      return NextResponse.json({ success: true, message: "Columns already synced." });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
