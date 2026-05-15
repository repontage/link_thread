import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const email = 'repontage@gmail.com';
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    return NextResponse.json({ message: `Admin access granted to ${user.email}. Please logout and login again.` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to grant admin access. Make sure the user exists.' }, { status: 500 });
  }
}
