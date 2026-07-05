import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { checkApiRateLimit } from '@/lib/api-rate-limit';

export async function GET(req: NextRequest) {
  // Check API rate limit
  const rateCheck = await checkApiRateLimit(req);
  if (!rateCheck.allowed) return rateCheck.error!;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Perform full-text search using the virtual table
    // We join back to the Comment table to get all fields, or just use the FTS data
    // Here we use rank to sort by relevance
    const results = await prisma.$queryRawUnsafe(`
      SELECT c.*, u.name as userName, u.image as userImage
      FROM Comment_FTS f
      JOIN Comment c ON f.id = c.id
      LEFT JOIN User u ON c.userId = u.id
      WHERE Comment_FTS MATCH ?
      ORDER BY rank
      LIMIT 50
    `, `${query}*`);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
