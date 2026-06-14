'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Hash } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Community {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  creator: { name: string | null; username: string | null; image: string | null };
  _count: { threads: number };
}

export default function CommunityDiscovery() {
  const { data: session } = useSession();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/community')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCommunities(data.data.slice(0, 6));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!formName.trim() || !formSlug.trim()) {
      setError('Name and slug are required');
      return;
    }
    setCreating(true);
    setError('');

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          description: formDescription.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormName('');
        setFormSlug('');
        setFormDescription('');
        setShowCreate(false);
        // Refresh list
        const refreshRes = await fetch('/api/community');
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setCommunities(refreshData.data.slice(0, 6));
        }
      } else {
        setError(data.error || 'Failed to create community');
      }
    } catch {
      setError('Failed to create community');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Hash className="h-5 w-5 text-blue-600" />
          Communities
        </h3>
        <div className="flex items-center gap-2">
          {session?.user && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Create
            </button>
          )}
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Community name"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
              }}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
            <input
              type="text"
              placeholder="slug (auto-generated)"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-mono"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 text-zinc-600 dark:text-zinc-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {communities.length === 0 ? (
        <div className="text-center py-6 text-zinc-500 text-sm">
          <Users className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
          No communities yet. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/c/${community.slug}`}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all group"
            >
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                c/{community.name}
              </h4>
              {community.description && (
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{community.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                <Users className="h-3 w-3" />
                {community._count.threads} threads
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
