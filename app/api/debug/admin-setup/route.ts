import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const email = 'repontage@gmail.com';
    // Use upsert to ensure the user exists
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN' },
      create: {
        email,
        name: 'yeonwoo',
        role: 'ADMIN'
      }
    });
    return NextResponse.json({ message: `Admin access granted to ${user.email}. Please logout and login again.` });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
