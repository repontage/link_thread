'use client';

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Reply, Clock, User, ThumbsUp, Trash, Heart } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export interface ReactionType {
  id?: string;
  emoji: string;
  userId: string;
}

export interface CommentType {
  id: string;
  author: string;
  content: string;
  timestamp?: number | null;
  imageUrls?: string[];
  createdAt: string;
  upvotes: number;
  reactions?: ReactionType[];
  children: CommentType[];
  parentId: string | null;
  userId?: string | null;
  isToxic?: boolean;
  tags?: string | null;
}

const CommentItem = React.memo(({ comment, url, onReplySuccess, onTimestampClick }: { comment: CommentType, url: string, onReplySuccess: () => void, onTimestampClick?: (seconds: number) => void }) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const [reactions, setReactions] = useState<ReactionType[]>(comment.reactions || []);
  const [isReacting, setIsReacting] = useState(false);
  const [showHeartEffect, setShowHeartEffect] = useState(false);

  React.useEffect(() => {
    setReactions(comment.reactions || []);
  }, [comment.reactions]);

  const handleReaction = async (emoji: string) => {
    if (!session?.user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (isReacting) return;
    setIsReacting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id, emoji }),
      });
      if (!res.ok) throw new Error('Reaction failed');
      const data = await res.json();
      if (data.success && data.data.reactions) {
        setReactions(data.data.reactions);
      }
    } catch (err) {
      alert('반응을 남기는 중 오류가 발생했습니다.');
    } finally {
      setIsReacting(false);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHeartEffect(true);
    handleReaction('❤️');
    setTimeout(() => setShowHeartEffect(false), 800);
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

  const processContentForMarkdown = (content: string) => {
    // 멘션과 타임스탬프를 마크다운 링크로 변환
    let processed = content.replace(/@([a-zA-Z0-9_]+)/g, '[@$1](/users?username=$1)');
    processed = processed.replace(/\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/g, (match) => `[${match}](#timestamp-${match})`);
    return processed;
  };

  const formatTimestamp = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <article 
      className="p-6 hover:bg-zinc-50/50 transition-colors relative cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      {showHeartEffect && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-ping opacity-75">
          <Heart className="h-24 w-24 text-red-500 fill-red-500" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        {comment.userId ? (
          <Link href={`/users/${comment.userId}`} className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200 hover:border-blue-400 transition-colors">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </Link>
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
            <User className="h-5 w-5 text-blue-600" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            {comment.userId ? (
              <Link href={`/users/${comment.userId}`}>
                <h4 className="text-sm font-semibold text-zinc-900 hover:text-blue-600 hover:underline">{comment.author}</h4>
              </Link>
            ) : (
              <h4 className="text-sm font-semibold text-zinc-900">{comment.author}</h4>
            )}
            {/* 배지 표시 */}
            {(comment as any).user?.badges?.length > 0 && (
              <div className="flex gap-1">
                {(comment as any).user.badges.slice(0, 2).map((badge: any) => (
                  <span key={badge.id} className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full border border-yellow-200">
                    {badge.badgeType}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
            <Clock className="h-3 w-3" />
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {comment.timestamp != null && (
          <button 
            onClick={(e) => { e.stopPropagation(); onTimestampClick?.(comment.timestamp!); }}
            className="ml-auto px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md hover:bg-blue-100 transition-colors"
          >
            {formatTimestamp(comment.timestamp)}
          </button>
        )}
      </div>
      
      {comment.isToxic && !isRevealed ? (
        <div 
          onClick={(e) => { e.stopPropagation(); setIsRevealed(true); }}
          className="mb-4 p-4 bg-zinc-100 text-zinc-500 text-sm font-medium rounded-md border border-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors text-center"
        >
          ⚠️ 시스템에 의해 유해한 콘텐츠로 분류되어 숨김 처리되었습니다. (클릭하여 보기)
        </div>
      ) : (
        <>
          <div className="text-zinc-700 leading-relaxed text-sm mb-4 prose prose-sm max-w-none break-words">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, href, children, ...props }: any) => {
                  if (href?.startsWith('#timestamp-')) {
                    const timestamp = href.replace('#timestamp-', '');
                    const match = /\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/.exec(timestamp);
                    if (match) {
                      const hrs = match[1] ? parseInt(match[1], 10) : 0;
                      const mins = parseInt(match[2], 10);
                      const secs = parseInt(match[3], 10);
                      const totalSeconds = hrs * 3600 + mins * 60 + secs;
                      return (
                        <span
                          className="text-blue-500 hover:underline cursor-pointer font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTimestampClick?.(totalSeconds);
                          }}
                        >
                          {children}
                        </span>
                      );
                    }
                  }
                  if (href?.startsWith('/users?username=')) {
                    return (
                      <Link href={href} className="text-blue-500 font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                        {children}
                      </Link>
                    );
                  }
                  return <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                },
                p: ({node, ...props}: any) => <p className="mb-2 last:mb-0" {...props} />
              }}
            >
              {processContentForMarkdown(comment.content)}
            </ReactMarkdown>
          </div>
          {comment.imageUrls && comment.imageUrls.length > 0 && (
            <div className="mb-4 relative">
              <ImageCarousel 
                images={comment.imageUrls} 
                onDoubleTap={() => {
                  setShowHeartEffect(true);
                  handleReaction('❤️');
                  setTimeout(() => setShowHeartEffect(false), 800);
                }} 
              />
            </div>
          )}
        </>
      )}

      {comment.tags && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {comment.tags.split(',').map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* 다중 이모지 반응 요약 */}
        {['❤️', '👍', '😂'].map(emoji => {
          const count = reactions.filter(r => r.emoji === emoji).length;
          const hasReacted = reactions.some(r => r.emoji === emoji && r.userId === session?.user?.id);
          
          return (
            <button 
              key={emoji}
              onClick={(e) => { e.stopPropagation(); handleReaction(emoji); }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${hasReacted ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'}`}
            >
              <span>{emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>
      <div className="flex items-center mb-4 gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); setIsReplying(!isReplying); }}
          aria-label="답글 달기"
          aria-expanded={isReplying}
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors"
        >
          <Reply className="h-4 w-4" aria-hidden="true" />
          Reply
        </button>
        {session?.user && session.user.id === comment.userId && (
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
                이메일/소셜/패스키로 로그인
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 relative">
                <textarea
                  aria-label="답글 내용"
                  placeholder="Your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                  rows={2}
                  className="w-full p-2 pb-6 border border-zinc-200 rounded-md text-sm outline-none focus:border-blue-500"
                />
                <div className="absolute bottom-1 right-2 text-[10px] text-zinc-400 font-medium pointer-events-none">
                  Markdown Supported
                </div>
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
               <CommentItem comment={child} url={url} onReplySuccess={onReplySuccess} onTimestampClick={onTimestampClick} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
});

CommentItem.displayName = 'CommentItem';
export default CommentItem;
