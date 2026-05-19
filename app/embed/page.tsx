import React from 'react';
import Link from 'next/link';

export default function EmbedPage({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  const url = searchParams.url;

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full p-4 font-sans bg-gray-50 text-gray-500">
        No URL provided to VoidSay Embed.
      </div>
    );
  }

  // Next.js 16 (App router) allows async components, but for a simple embed UI we can just link to it.
  // In a real app we'd fetch the thread ID and show top comments. For now, we guide them.
  return (
    <div className="p-4 font-sans bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">VoidSay Discussions</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
          Beta
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4 line-clamp-1">
        Join the conversation for: <span className="font-mono text-xs">{url}</span>
      </p>
      <div className="text-center">
        <Link 
          href={`/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          View Comments on VoidSay
        </Link>
      </div>
    </div>
  );
}