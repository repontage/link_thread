import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { checkApiRateLimit } from '@/lib/api-rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/sponsored — get active sponsored links
export async function GET(req: NextRequest) {
  // Check API rate limit
  const rateCheck = await checkApiRateLimit(req);
  if (!rateCheck.allowed) return rateCheck.error!;
  try {
    const session = await auth();
    const isPro = (session?.user as any)?.isPro || false;

    // Pro users don't see sponsored links
    if (isPro) {
      return NextResponse.json({ success: true, data: [] });
    }

    const sponsoredLinks = await prisma.sponsoredLink.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({ success: true, data: sponsoredLinks });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
