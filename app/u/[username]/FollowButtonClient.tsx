'use client';

import FollowButton from '@/components/FollowButton';

export default function FollowButtonClient({ userId, initialFollowing }: { userId: string; initialFollowing: boolean }) {
  return <FollowButton userId={userId} initialFollowing={initialFollowing} />;
}
