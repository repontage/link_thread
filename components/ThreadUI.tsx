'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Search, MessageSquare, Loader2, Send } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import type { CommentType } from './CommentItem';
import type { PreviewData } from './PreviewCard';
import YouTubePlayer, { YouTubePlayerRef } from './YouTubePlayer';
import InstagramFeedCard from './InstagramFeedCard';
import TwitterEmbedCard from './TwitterEmbedCard';
import TrendingBoard from './TrendingBoard';

// 동적 로딩 적용 (필요할 때만 모듈 로드)
const PreviewCard = dynamic(() => import('./PreviewCard'), {
  loading: () => (
    <div className="p-4 border-b border-zinc-100 flex items-center justify-center min-h-[100px]">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
    </div>
  ),
});

const CommentItem = dynamic(() => import('./CommentItem'), {
  loading: () => (
    <div className="p-6 text-center text-sm text-zinc-400 animate-pulse">
      Loading comment...
    </div>
  ),
});

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function isInstagramUrl(url: string): boolean {
  return /instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/.test(url);
}

function getTwitterStatusId(url: string): string | null {
  const regExp = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function ThreadUI() {
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const [newContent, setNewContent] = useState('');
  const [newImageUrls, setNewImageUrls] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoadingMore) {
      handleLoadMore();
    }
  }, [inView, hasNextPage, isLoadingMore]);

  // SSE (Server-Sent Events) 로 실시간 스트림 연결
  useEffect(() => {
    if (!currentUrl || !showComments) return;
    
    const eventSource = new EventSource(`/api/comments/stream?url=${encodeURIComponent(currentUrl)}`);
    
    eventSource.onmessage = (event) => {
      try {
        const newComments = JSON.parse(event.data);
        if (newComments && newComments.length > 0) {
          // 기존 댓글 목록 상단에 새 댓글 병합 (중복 방지 로직 포함)
          setComments(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const uniqueNew = newComments.filter((c: any) => !existingIds.has(c.id));
            return [...uniqueNew, ...prev];
          });
        }
      } catch (err) {
        console.error("SSE Parse Error:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [currentUrl, showComments]);

  const searchIdRef = React.useRef(0);
  const playerRef = React.useRef<YouTubePlayerRef>(null);

  const handleTimestampClick = React.useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  }, []);

  const fetchComments = React.useCallback(async (targetUrl: string, searchId?: number, pageNumber: number = 1) => {
    if (pageNumber === 1) setFetchError(null);
    try {
      const res = await fetch(`/api/comments?url=${encodeURIComponent(targetUrl)}&page=${pageNumber}&limit=10`);
      if (searchId !== undefined && searchId !== searchIdRef.current) return;
      
      if (!res.ok) {
        throw new Error('서버 에러가 발생했습니다.');
      }
      const data = await res.json();
      if (searchId !== undefined && searchId !== searchIdRef.current) return;
      
      if (data.success) {
        if (pageNumber === 1) {
          setComments(data.comments || []);
        } else {
          setComments(prev => [...prev, ...(data.comments || [])]);
        }
        setPage(data.pagination?.page || 1);
        setHasNextPage(data.pagination?.hasNextPage || false);
      } else {
        if (pageNumber === 1) setFetchError(data.error || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (err) {
      if (searchId !== undefined && searchId !== searchIdRef.current) return;
      if (pageNumber === 1) setFetchError('네트워크 에러가 발생하여 댓글을 불러올 수 없습니다.');
    }
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasNextPage || !currentUrl) return;
    setIsLoadingMore(true);
    await fetchComments(currentUrl, searchIdRef.current, page + 1);
    setIsLoadingMore(false);
  };

  const handleReplySuccess = React.useCallback(() => {
    if (currentUrl) {
      fetchComments(currentUrl, searchIdRef.current, 1);
    }
  }, [currentUrl, fetchComments]);

  const fetchPreview = async (targetUrl: string, searchId: number) => {
    setIsPreviewLoading(true);
    setPreviewData(null);
    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      if (searchId !== searchIdRef.current) return;
      setPreviewData(data);
    } catch (err) {
      if (searchId !== searchIdRef.current) return;
      setPreviewData({ url: targetUrl, error: 'Failed' });
    } finally {
      if (searchId === searchIdRef.current) {
        setIsPreviewLoading(false);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    const currentSearchId = ++searchIdRef.current;
    
    setIsLoading(true);
    setShowComments(false);
    setCurrentUrl(url);
    
    await Promise.all([
      fetchComments(url, currentSearchId, 1),
      fetchPreview(url, currentSearchId)
    ]);
    
    if (currentSearchId === searchIdRef.current) {
      setIsLoading(false);
      setShowComments(true);
    }
  };

  const handleNewCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    if (!session?.user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmittingNew(true);
    
    let timestampToSave: number | null = null;
    if (includeTimestamp && playerRef.current) {
      timestampToSave = Math.floor(playerRef.current.getCurrentTime());
    }
    
    try {
      const imageUrlsArray = newImageUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: currentUrl, 
          author: session.user.name || 'Anonymous', 
          content: newContent, 
          timestamp: timestampToSave,
          imageUrls: imageUrlsArray
        }),
      });
      if (res.ok) {
        setNewContent('');
        setNewImageUrls('');
        setIncludeTimestamp(false);
        await fetchComments(currentUrl, searchIdRef.current, 1);
      } else {
        alert('새 댓글 작성 중 서버 에러가 발생했습니다.');
      }
    } catch (err) {
      alert('새 댓글 작성 중 네트워크 에러가 발생했습니다.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleSelectTrendingUrl = React.useCallback((selectedUrl: string) => {
    setUrl(selectedUrl);
    // Trigger search after state updates
    setTimeout(() => {
      const form = document.getElementById('search-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 50);
  }, []);

  const renderedComments = React.useMemo(() => {
    return comments.map((comment) => (
      <div key={comment.id} role="listitem">
        <CommentItem 
          comment={comment} 
          url={currentUrl} 
          onReplySuccess={handleReplySuccess}
          onTimestampClick={handleTimestampClick}
        />
      </div>
    ));
  }, [comments, currentUrl, handleReplySuccess, handleTimestampClick]);

  return (
    <section className="w-full flex flex-col items-center">
      <form id="search-form" onSubmit={handleSearch} aria-label="URL 검색 폼" className="w-full relative max-w-2xl mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" />
        </div>
        <input
          type="url"
          aria-label="분석할 웹사이트 URL 입력"
          className="block w-full pl-12 pr-32 py-4 text-base border border-zinc-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Paste any website URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-label="스레드 보기"
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isLoading ? 'Loading' : 'View Threads'}
        </button>
      </form>

      {!showComments && !isLoading && (
        <TrendingBoard onSelectUrl={handleSelectTrendingUrl} />
      )}

      <div className="w-full transition-all duration-500 ease-in-out relative">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 animate-pulse transition-opacity duration-300">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" aria-hidden="true" />
            <p>Fetching threads for this URL...</p>
          </div>
        )}

        {showComments && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {fetchError && (
              <div className="bg-red-50 text-red-600 p-4 text-center border-b border-red-100 font-medium">
                {fetchError}
              </div>
            )}
            
            {(() => {
              const ytVideoId = getYouTubeVideoId(currentUrl);
              if (ytVideoId) {
                return (
                  <YouTubePlayer ref={playerRef} videoId={ytVideoId} />
                );
              }
              
              const tweetId = getTwitterStatusId(currentUrl);
              if (tweetId) {
                return <TwitterEmbedCard tweetId={tweetId} />;
              }
              
              if (isInstagramUrl(currentUrl)) {
                return (
                  <InstagramFeedCard 
                    author={previewData?.siteName || 'Instagram User'} 
                    authorAvatar={previewData?.favicon || ''}
                    mediaUrls={previewData?.images?.length ? previewData.images : [previewData?.image || '']}
                    caption={previewData?.description || ''}
                  />
                );
              }

              return <PreviewCard preview={previewData} isLoading={isPreviewLoading} />;
            })()}

            <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-zinc-800">Discussions</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full ml-auto">
                {comments.length}
              </span>
            </div>
            
            <div className="p-6 bg-white border-b border-zinc-100">
              {!session ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <MessageSquare className="h-10 w-10 text-zinc-300 mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">대화에 참여하세요</h3>
                  <p className="text-zinc-500 mb-6 text-center max-w-sm">로그인하면 자유롭게 댓글을 남기고 다른 사람들과 의견을 나눌 수 있습니다.</p>
                  <button
                    onClick={() => signIn()}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    이메일 / 소셜 / 패스키로 로그인하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNewCommentSubmit} aria-label="새 댓글 작성 폼">
                  <h3 className="text-sm font-semibold text-zinc-800 mb-3">Leave a comment as {session.user?.name || 'User'}</h3>
                  <div className="mb-3">
                    <textarea
                      aria-label="새 댓글 내용"
                      placeholder="What are your thoughts?"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      required
                      rows={3}
                      className="w-full p-3 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      aria-label="이미지 URL (쉼표로 구분)"
                      placeholder="Image URLs (comma separated)"
                      value={newImageUrls}
                      onChange={(e) => setNewImageUrls(e.target.value)}
                      className="w-full p-3 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {getYouTubeVideoId(currentUrl) && (
                        <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={includeTimestamp} 
                            onChange={(e) => setIncludeTimestamp(e.target.checked)} 
                            className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                          />
                          현재 영상 시간 포함하기
                        </label>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingNew}
                      aria-label="댓글 등록"
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSubmittingNew ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                      {isSubmittingNew ? 'Submitting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="divide-y divide-zinc-100" role="list">
              {!fetchError && comments.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center bg-gradient-to-b from-transparent to-zinc-50/50 animate-in fade-in duration-500">
                  <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105">
                    <MessageSquare className="h-8 w-8 text-blue-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">아직 댓글이 없습니다</h3>
                  <p className="text-zinc-500 max-w-sm">
                    첫 댓글을 남겨보세요! 의견을 나누고 대화를 시작할 수 있습니다.
                  </p>
                </div>
              ) : (
                <>
                  {renderedComments}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className="p-6 flex justify-center border-t border-zinc-100">
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm font-medium">Loading more comments...</span>
                        </div>
                      ) : (
                        <div className="h-10" />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
