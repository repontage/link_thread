"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  MessageCircle,
  ThumbsUp,
  Clock,
  RefreshCw,
} from "lucide-react";

interface FeedItem {
  url: string;
  threadId: string;
  title: string | null;
  commentCount: number;
  upvoteCount: number;
  lastActivity: string;
  category: string | null;
  score: number;
  reason: string;
}

export default function PersonalizedFeed() {
  const { data: session, status } = useSession();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feed/personalized");
      const data = await res.json();
      if (data.success) {
        setFeed(data.feed || []);
        setIsPersonalized(data.isPersonalized);
        setNote(data.note || null);
      } else {
        setError(data.error || "Failed to load feed.");
      }
    } catch {
      setError("Network error. Could not load your feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <section className="product-tile-light py-section w-full">
        <div className="max-w-[980px] px-lg mx-auto">
          <div className="animate-pulse space-y-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white/50 rounded-2xl border border-white/20"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!feed.length && !error) return null;

  return (
    <section className="product-tile-light py-section w-full">
      <div className="max-w-[980px] px-lg mx-auto">
        <div className="flex items-center justify-between mb-section">
          <div>
            <div className="inline-flex items-center gap-sm mb-sm px-md py-xs rounded-full bg-gradient-to-r from-purple-500/10 to-action-blue/10 text-purple-600 dark:text-purple-400 text-tagline">
              <Sparkles className="w-4 h-4" />
              {isPersonalized ? "Your Feed" : "Discover"}
            </div>
            <h2 className="text-display-lg mb-xs">
              {isPersonalized ? "For You" : "Trending Threads"}
            </h2>
            <p className="text-lead text-ink-muted48">
              {note || "Threads tailored to your interests."}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary-pill flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-lg">
          {feed.map((item, idx) => (
            <a
              key={item.threadId}
              href={`/?url=${encodeURIComponent(item.url)}`}
              className="group block bg-white/50 backdrop-blur-sm rounded-2xl p-lg 
                         border border-white/20 hover:border-purple-400/30 
                         hover:shadow-lg hover:shadow-purple-500/5
                         transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-md">
                <span className="text-caption text-ink-muted48 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  {item.reason}
                </span>
                {item.category && (
                  <span className="text-caption px-sm py-0.5 rounded-full bg-ink-muted8 text-ink-muted48">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-body font-medium text-ink-primary mb-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {item.title || item.url}
              </h3>

              {/* Stats row */}
              <div className="flex items-center gap-lg text-caption text-ink-muted48">
                <span className="flex items-center gap-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {item.commentCount}
                </span>
                <span className="flex items-center gap-xs">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {item.upvoteCount}
                </span>
                <span className="flex items-center gap-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(item.lastActivity)}
                </span>
              </div>

              {/* Score bar */}
              <div className="mt-md h-1 rounded-full bg-ink-muted8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-action-blue/60 transition-all duration-500"
                  style={{ width: `${Math.min(item.score * 100, 100)}%` }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
