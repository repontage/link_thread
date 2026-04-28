'use client';

import React from 'react';
import { Tweet } from 'react-tweet';

interface TwitterEmbedCardProps {
  tweetId: string;
}

export default function TwitterEmbedCard({ tweetId }: TwitterEmbedCardProps) {
  if (!tweetId) return null;

  return (
    <div className="flex justify-center w-full my-4 light">
      <div className="w-full max-w-lg">
        <Tweet id={tweetId} />
      </div>
    </div>
  );
}