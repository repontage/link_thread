'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Plus, Link as LinkIcon, Users, Clock } from 'lucide-react';
import ThreadUI from '@/components/ThreadUI';

interface Community {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  creator: { id: string; name: string | null; username: string | null; image: string | null };
  _count: { threads: number };
}

interface CommunityThread {
  id: string;
  url: string;
  title: string | null;
  addedAt: string;
  addedBy: { id: string; name: string | null; username: string | null; image: string | null };
}

export default function CommunityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const [community, setCommunity] = useState<Community | null>(null);
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchCommunity = useCallback(async () => {
    try {
      const res = await fetch(`/api/community?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.success) {
        setCommunity(data.data);
      }
    } catch (_err) {
      console.error('Failed to fetch community', _err);
    }
  }, [slug]);

  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(slug)}/threads`);
      const data = await res.json();
      if (data.success) {
        setThreads(data.data);
      }
    } catch (_err) {
      console.error('Failed to fetch threads', _err);
    }
  }, [slug]);

  useEffect(() => {
    Promise.all([fetchCommunity(), fetchThreads()]).finally(() => setLoading(false));
  }, [fetchCommunity, fetchThreads]);

  const handleAddThread = async () => {
    if (!newUrl.trim()) {
      setError('URL is required');
      return;
    }
    setAdding(true);
    setError('');
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(slug)}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl.trim(), title: newTitle.trim() || null }),
      });
      const data = await res.json();
      if (data.success) {
        setNewUrl('');
        setNewTitle('');
        await fetchThreads();
      } else {
        setError(data.error || 'Failed to add thread');
      }
    } catch (_err) {
      setError('Failed to add thread');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Users className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Community Not Found</h1>
        <p className="text-zinc-500 mb-6">This community doesn&apos;t exist or may have been removed.</p>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Community Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">c/{community.name}</h1>
        {community.description && (
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">{community.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {community._count.threads} threads
          </span>
          <span>
            Created by {community.creator.name || community.creator.username || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Add Thread Form */}
      {session?.user && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Add a Link</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
            <button
              onClick={handleAddThread}
              disabled={adding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {/* Threads List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Threads</h2>
        {threads.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
            <LinkIcon className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500">No threads yet. Be the first to add a link!</p>
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setSelectedUrl(selectedUrl === thread.url ? null : thread.url)}
                      className="text-left w-full"
                    >
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors">
                        {thread.title || thread.url}
                      </h3>
                      {thread.title && (
                        <p className="text-sm text-zinc-500 truncate mt-0.5">{thread.url}</p>
                      )}
                    </button>
                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(thread.addedAt).toLocaleDateString()}</span>
                      <span>by {thread.addedBy.name || thread.addedBy.username || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expand thread comments */}
              {selectedUrl === thread.url && (
                <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-900/50">
                  <ThreadUI />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
