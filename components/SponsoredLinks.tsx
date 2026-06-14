'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ExternalLink, Tag } from 'lucide-react';

interface SponsoredLink {
  id: string;
  url: string;
  title: string;
  description: string | null;
  sponsorName: string;
  imageUrl: string | null;
  active: boolean;
}

export default function SponsoredLinks() {
  const { data: session } = useSession();
  const [sponsored, setSponsored] = useState<SponsoredLink[]>([]);
  const [loading, setLoading] = useState(true);
  const isPro = (session?.user as any)?.isPro;

  useEffect(() => {
    // Pro users don't see sponsored links
    fetch('/api/sponsored')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSponsored(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (sponsored.length === 0) return null;

  // Return null for Pro users (API also returns empty array, but double-check)
  if (isPro) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="space-y-2">
        {sponsored.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-3">
              {link.imageUrl && (
                <img
                  src={link.imageUrl}
                  alt={link.title}
                  className="w-10 h-10 rounded object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 transition-colors">
                    {link.title}
                  </h4>
                  <ExternalLink className="h-3 w-3 text-zinc-400 shrink-0" />
                </div>
                {link.description && (
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{link.description}</p>
                )}
                <p className="text-xs text-red-500 mt-0.5">
                  Sponsored by {link.sponsorName}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <p className="text-xs text-zinc-400 mt-2">
        <a href="/pro" className="text-blue-600 hover:underline">
          Go Ad-Free with VoidSay Pro
        </a>
      </p>
    </div>
  );
}
