'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserPlus, UserMinus } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  onFollowChange?: (_following: boolean) => void;
}

export default function FollowButton({ userId, initialFollowing = false, onFollowChange }: FollowButtonProps) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const currentUserId = (session?.user as any)?.id;

  if (!session || currentUserId === userId) return null;

  const handleToggleFollow = async () => {
    setLoading(true);
    const action = following ? 'unfollow' : 'follow';

    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowing(action === 'follow');
        onFollowChange?.(action === 'follow');
      }
    } catch (_err) {
      console.error('Failed to toggle follow', _err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        following
          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50`}
    >
      {following ? (
        <>
          <UserMinus className="h-4 w-4" />
          {loading ? '...' : 'Unfollow'}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {loading ? '...' : 'Follow'}
        </>
      )}
    </button>
  );
}
