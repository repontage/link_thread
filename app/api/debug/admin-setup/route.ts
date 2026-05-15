import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const email = 'repontage@gmail.com';
    // Direct SQL update to avoid Prisma model mismatches during schema sync
    await prisma.$executeRawUnsafe(`UPDATE User SET role = 'ADMIN' WHERE email = '${email}'`);
    
    return NextResponse.json({ 
      message: `Admin access granted to ${email}. If the query affected 0 rows, ensure you have logged in at least once. Please logout and login again.` 
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
