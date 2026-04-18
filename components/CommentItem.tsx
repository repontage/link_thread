'use client';

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Reply, Clock, User, ThumbsUp, Trash } from 'lucide-react';

export interface CommentType {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  upvotes: number;
  children: CommentType[];
  parentId: string | null;
  userId?: string | null;
}

const CommentItem = React.memo(({ comment, url, onReplySuccess }: { comment: CommentType, url: string, onReplySuccess: () => void }) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [optimisticUpvotes, setOptimisticUpvotes] = useState(comment.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async () => {
    if (isUpvoting) return;
    setIsUpvoting(true);
    setOptimisticUpvotes(prev => prev + 1);

    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id }),
      });
      if (!res.ok) {
        setOptimisticUpvotes(prev => prev - 1);
        alert('좋아요 처리 중 서버 에러가 발생했습니다.');
      }
    } catch (err) {
      setOptimisticUpvotes(prev => prev - 1);
      alert('좋아요 처리 중 네트워크 에러가 발생했습니다.');
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onReplySuccess(); // refresh comments
      } else {
        const data = await res.json();
        alert(data.error || '삭제 중 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('삭제 중 네트워크 에러가 발생했습니다.');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    if (!session?.user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, author: session.user.name || 'Anonymous', content: replyContent, parentId: comment.id }),
      });
      if (res.ok) {
        setReplyContent('');
        setIsReplying(false);
        onReplySuccess();
      } else {
        alert('댓글 작성 중 서버 에러가 발생했습니다.');
      }
    } catch (err) {
      alert('댓글 작성 중 네트워크 에러가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="p-6 hover:bg-zinc-50/50 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900">{comment.author}</h4>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
            <Clock className="h-3 w-3" />
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <p className="text-zinc-700 leading-relaxed text-sm mb-4 whitespace-pre-wrap">
        {comment.content}
      </p>
      <div className="flex items-center mb-4 gap-4">
        <button 
          onClick={handleUpvote}
          disabled={isUpvoting}
          aria-label="좋아요"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors"
        >
          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
          <span>{optimisticUpvotes}</span>
        </button>
        <button 
          onClick={() => setIsReplying(!isReplying)}
          aria-label="답글 달기"
          aria-expanded={isReplying}
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors"
        >
          <Reply className="h-4 w-4" aria-hidden="true" />
          Reply
        </button>
        {session?.user && (session.user as any)?.id === comment.userId && (
          <button 
            onClick={handleDelete}
            aria-label="댓글 삭제"
            className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-600 transition-colors ml-auto"
          >
            <Trash className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        )}
      </div>

      {isReplying && (
        <form onSubmit={handleReplySubmit} aria-label="답글 작성 폼" className="mb-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          {!session ? (
            <div className="flex flex-col items-center py-4">
              <p className="text-sm text-zinc-600 mb-3">로그인하여 답글을 작성하세요</p>
              <button
                type="button"
                onClick={() => signIn()}
                className="px-4 py-2 bg-zinc-900 text-white text-sm rounded-md hover:bg-zinc-800 transition-colors"
              >
                이메일/패스키로 로그인
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <textarea
                  aria-label="답글 내용"
                  placeholder="Your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                  rows={2}
                  className="w-full p-2 border border-zinc-200 rounded-md text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsReplying(false)} aria-label="취소" className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} aria-label="답글 등록" className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {isSubmitting ? 'Submitting...' : 'Post Reply'}
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="pl-6 border-l-2 border-zinc-100 mt-4 space-y-0 divide-y divide-zinc-100 -mr-6" role="list">
          {comment.children.map(child => (
            <div key={child.id} className="pt-4 first:pt-0" role="listitem">
               <CommentItem comment={child} url={url} onReplySuccess={onReplySuccess} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
});

CommentItem.displayName = 'CommentItem';
export default CommentItem;
