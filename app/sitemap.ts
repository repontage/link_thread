import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ];

  try {
    const recentComments = await prisma.comment.findMany({
      where: {
        url: { not: null },
      },
      select: {
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const threadMap = new Map<string, Date>();
    for (const comment of recentComments) {
      if (comment.url && !threadMap.has(comment.url)) {
        threadMap.set(comment.url, comment.createdAt);
      }
      if (threadMap.size >= 10) break;
    }

    const threadRoutes: MetadataRoute.Sitemap = Array.from(threadMap.entries()).map(([url, lastModified]) => ({
      url: `${baseUrl}/?url=${encodeURIComponent(url)}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.5,
    }));

    return [...routes, ...threadRoutes];
  } catch (error) {
    console.error('Failed to generate sitemap for threads:', error);
    return routes;
  }
}
