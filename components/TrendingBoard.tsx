'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendingItem {
  url: string;
  _count: { url: number };
}

export default function TrendingBoard({ onSelectUrl }: { onSelectUrl: (url: string) => void }) {
  const [period, setPeriod] = useState('today');
  const [links, setLinks] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/trending?period=${period}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLinks(data.trending);
        }
      })
      .finally(() => setIsLoading(false));
  }, [period]);

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
          <TrendingUp className="text-blue-500 h-5 w-5" /> Trending Threads
        </h2>
        <div className="flex gap-2 text-xs font-semibold bg-zinc-50 p-1 rounded-lg border border-zinc-100">
          <button 
            onClick={() => setPeriod('today')} 
            className={`px-3 py-1.5 rounded-md transition-colors ${period === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setPeriod('month')} 
            className={`px-3 py-1.5 rounded-md transition-colors ${period === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            This Month
          </button>
          <button 
            onClick={() => setPeriod('year')} 
            className={`px-3 py-1.5 rounded-md transition-colors ${period === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-6 text-sm text-zinc-400 animate-pulse">Loading trending links...</div>
        ) : links.length === 0 ? (
          <div className="text-center py-6 text-sm text-zinc-400">No trending links found for this period.</div>
        ) : (
          links.map((link, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectUrl(link.url)}
              className="flex justify-between items-center p-3 hover:bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-sm font-bold text-zinc-300 w-4">{idx + 1}</span>
                <div className="truncate text-sm font-medium text-zinc-700 group-hover:text-blue-700 transition-colors">
                  {link.url}
                </div>
              </div>
              <div className="text-xs font-bold bg-zinc-100 group-hover:bg-blue-100 text-zinc-600 group-hover:text-blue-700 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ml-3">
                {link._count.url} comments
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
