"use client";

import { useEffect, useState } from "react";
import { TrendingUp, MessageCircle, ThumbsUp, Clock } from "lucide-react";

interface CuratedThread {
  url: string;
  threadId: string;
  title: string | null;
  commentCount: number;
  upvoteCount: number;
  avgCommentLength: number;
  lastActivity: string;
  category: string | null;
  score: number;
}

export default function CuratedPicks() {
  const [threads, setThreads] = useState<CuratedThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/curated")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setThreads(data.curated || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!threads.length) return null;

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "방금 전";
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  return (
    <section className="product-tile-light py-section w-full">
      <div className="max-w-[980px] px-lg mx-auto">
        <div className="text-center mb-section">
          <div className="inline-flex items-center gap-sm mb-sm px-md py-xs rounded-full bg-action-blue/10 text-action-blue text-tagline">
            <TrendingUp className="w-4 h-4" />
            Curated Picks
          </div>
          <h2 className="text-display-lg mb-xs">Handpicked by Algorithm</h2>
          <p className="text-lead text-ink-muted48">
            The most engaging conversations, surfaced automatically.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-lg">
          {threads.slice(0, 6).map((thread, idx) => (
            <a
              key={thread.threadId}
              href={`/?url=${encodeURIComponent(thread.url)}`}
              className="group block bg-white/50 backdrop-blur-sm rounded-2xl p-lg 
                         border border-white/20 hover:border-action-blue/30 
                         hover:shadow-lg hover:shadow-action-blue/5
                         transition-all duration-300"
            >
              {/* Rank badge */}
              <div className="flex items-start justify-between mb-md">
                <span className="text-tagline text-action-blue font-mono">
                  #{idx + 1}
                </span>
                {thread.category && (
                  <span className="text-caption px-sm py-0.5 rounded-full bg-ink-muted8 text-ink-muted48">
                    {thread.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-body font-medium text-ink-primary mb-sm line-clamp-2 group-hover:text-action-blue transition-colors">
                {thread.title || thread.url}
              </h3>

              {/* Stats row */}
              <div className="flex items-center gap-lg text-caption text-ink-muted48">
                <span className="flex items-center gap-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {thread.commentCount}
                </span>
                <span className="flex items-center gap-xs">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {thread.upvoteCount}
                </span>
                <span className="flex items-center gap-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(thread.lastActivity)}
                </span>
              </div>

              {/* Score bar */}
              <div className="mt-md h-1 rounded-full bg-ink-muted8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-action-blue to-action-blue/60 transition-all duration-500"
                  style={{ width: `${Math.min(thread.score * 100, 100)}%` }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
