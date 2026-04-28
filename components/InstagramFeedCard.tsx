'use client';

import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

export interface InstagramFeedCardProps {
  author: string;
  authorAvatar?: string;
  mediaUrls: string[];
  caption?: string;
  onLike?: () => void;
}

export default function InstagramFeedCard({
  author,
  authorAvatar,
  mediaUrls,
  caption,
  onLike
}: InstagramFeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(true);
    setShowHeartAnim(true);
    if (onLike) onLike();
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      // Calculate index based on scroll position
      const index = Math.round(scrollLeft / width);
      setCurrentIdx(index);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked && onLike) onLike();
  };

  if (!mediaUrls || mediaUrls.length === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-zinc-200 sm:rounded-lg overflow-hidden my-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px]">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
              {authorAvatar ? (
                <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-200" />
              )}
            </div>
          </div>
          <span className="font-semibold text-sm text-zinc-900">{author}</span>
        </div>
        <button className="text-zinc-900 hover:text-zinc-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media Carousel - CSS Scroll Snap */}
      <div className="relative w-full bg-zinc-100 aspect-square group">
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-ping opacity-75">
            <Heart className="h-24 w-24 text-white fill-white drop-shadow-md" />
          </div>
        )}
        
        <div 
          ref={scrollRef}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={handleScroll}
          onDoubleClick={handleDoubleTap}
        >
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative bg-black">
              <img src={url} alt={`media-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {mediaUrls.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {mediaUrls.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'w-1.5 bg-blue-500' : 'w-1.5 bg-white/70 shadow-sm'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="transition-transform active:scale-90">
              <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-zinc-900 hover:text-zinc-600'}`} />
            </button>
            <button className="transition-transform active:scale-90 text-zinc-900 hover:text-zinc-600">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="transition-transform active:scale-90 text-zinc-900 hover:text-zinc-600">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="transition-transform active:scale-90 text-zinc-900 hover:text-zinc-600">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-1 text-zinc-900">
          {isLiked ? '1 like' : 'Be the first to like this'}
        </div>

        {/* Caption */}
        {caption && (
          <div className="text-sm text-zinc-900 break-words mt-1">
            <span className="font-semibold mr-2">{author}</span>
            <span className="whitespace-pre-wrap">{caption}</span>
          </div>
        )}
      </div>
    </div>
  );
}
