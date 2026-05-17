'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';

import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 max-w-sm mx-4" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted48" />
        <input
          type="text"
          placeholder="Search comments or links..."
          className="w-full pl-11 pr-10 h-[44px] bg-canvas border border-black/10 rounded-pill text-body focus:outline-none focus:ring-2 focus:ring-primary-focus/20 transition-all placeholder:text-ink-muted48"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-ink-muted48" />
        )}
        {query && !loading && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-ink-muted48 hover:text-ink" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-canvas border border-hairline rounded-lg shadow-product overflow-hidden z-50">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/thread?url=${encodeURIComponent(result.url || '')}`}
                  className="block px-lg py-md hover:bg-canvas-parchment transition-colors border-b last:border-0 border-divider-soft"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-caption text-primary font-semibold truncate max-w-[70%]">
                      {result.url}
                    </div>
                    {result.category && (
                      <span className="text-micro-legal bg-primary/10 text-primary px-xs py-[2px] rounded-pill font-semibold">
                        {result.category}
                      </span>
                    )}
                  </div>
                  <div className="text-body text-ink line-clamp-1">
                    {result.content}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-lg text-center text-body text-ink-muted48">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
