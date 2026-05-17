import React from 'react';

export default function EmbedPage({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  const url = searchParams.url || 'No URL provided';

  return (
    <div className="p-4 font-sans">
      <h3 className="text-lg font-bold mb-2">VoidSay Comments</h3>
      <p className="text-sm text-gray-500 mb-4">Viewing comments for: {url}</p>
      <div className="border border-gray-200 rounded p-4 text-center text-gray-400">
        Embed widget coming soon.
      </div>
    </div>
  );
}