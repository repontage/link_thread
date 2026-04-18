'use client';

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Search, MessageSquare, Loader2, Send } from 'lucide-react';
import type { CommentType } from './CommentItem';
import type { PreviewData } from './PreviewCard';

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

export default function ThreadUI() {
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const [newContent, setNewContent] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const fetchComments = React.useCallback(async (targetUrl: string) => {
    setFetchError(null);
    try {
      const res = await fetch(`/api/comments?url=${encodeURIComponent(targetUrl)}`);
      if (!res.ok) {
        throw new Error('서버 에러가 발생했습니다.');
      }
      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
      } else {
        setFetchError(data.error || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setFetchError('네트워크 에러가 발생하여 댓글을 불러올 수 없습니다.');
    }
  }, []);

  const handleReplySuccess = React.useCallback(() => {
    if (currentUrl) {
      fetchComments(currentUrl);
    }
  }, [currentUrl, fetchComments]);

  const fetchPreview = async (targetUrl: string) => {
    setIsPreviewLoading(true);
    setPreviewData(null);
    try {
      const res = await fetch(`/api/preview?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      setPreviewData(data);
    } catch (err) {
      setPreviewData({ url: targetUrl, error: 'Failed' });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsLoading(true);
    setShowComments(false);
    setCurrentUrl(url);
    
    await Promise.all([
      fetchComments(url),
      fetchPreview(url)
    ]);
    
    setIsLoading(false);
    setShowComments(true);
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
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentUrl, author: session.user.name || 'Anonymous', content: newContent }),
      });
      if (res.ok) {
        setNewContent('');
        await fetchComments(currentUrl);
      } else {
        alert('새 댓글 작성 중 서버 에러가 발생했습니다.');
      }
    } catch (err) {
      alert('새 댓글 작성 중 네트워크 에러가 발생했습니다.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  return (
    <section className="w-full flex flex-col items-center">
      <form onSubmit={handleSearch} aria-label="URL 검색 폼" className="w-full relative max-w-2xl mb-8 group">
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
            
            <PreviewCard preview={previewData} isLoading={isPreviewLoading} />

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
                    이메일 / 패스키로 로그인하기
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
                  <div className="flex justify-end">
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
                comments.map((comment) => (
                  <div key={comment.id} role="listitem">
                    <CommentItem 
                      comment={comment} 
                      url={currentUrl} 
                      onReplySuccess={handleReplySuccess} 
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
