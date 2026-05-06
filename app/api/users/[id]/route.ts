import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 20, // 최근 20개 가져오기
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const session = await auth();
    
    // Strip sensitive info if the requester is not the user themselves
    const isOwner = session?.user?.id === user.id;
    const isAdmin = session?.user?.role === 'admin';
    
    let returnedUser: any = { ...user };
    if (!isOwner && !isAdmin) {
      delete returnedUser.email;
      delete returnedUser.emailVerified;
    }

    return NextResponse.json({ success: true, user: returnedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
