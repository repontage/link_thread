"use client";

import React, { useState, useEffect } from "react";
import {
  Webhook,
  Trash,
  Plus,
  Code,
  Copy,
  Check,
  Shield,
  Globe,
  CornerDownRight,
  RefreshCw,
} from "lucide-react";

interface WebhookSub {
  id: string;
  url: string;
  event: string;
  secret: string | null;
  createdAt: string;
  active: boolean;
}

export default function DeveloperPortal() {
  const [webhooks, setWebhooks] = useState<WebhookSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [event, setEvent] = useState("*");
  const [secret, setSecret] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/webhooks");
      const data = await res.json();
      if (data.success) {
        setWebhooks(data.subscriptions);
      } else {
        setError(data.error || "웹훅 목록을 불러오지 못했습니다.");
      }
    } catch {
      setError("네트워크 오류로 웹훅 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("올바른 URL 형식이어야 합니다. (http:// 또는 https://)");
      return;
    }

    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, event, secret: secret.trim() || undefined }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("웹훅이 성공적으로 등록되었습니다!");
        setUrl("");
        setSecret("");
        setEvent("*");
        fetchWebhooks();
      } else {
        setError(data.error || "웹훅 등록에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류로 웹훅을 등록하지 못했습니다.");
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm("정말로 이 웹훅 구독을 삭제하시겠습니까?")) return;
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/webhooks?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("웹훅 구독이 삭제되었습니다.");
        fetchWebhooks();
      } else {
        setError(data.error || "웹훅 삭제에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류로 웹훅을 삭제하지 못했습니다.");
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyDocs = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const exampleSignatureCode = `const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const digest = 'sha256=' + hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}`;

  const commentPayloadExample = `{
  "id": "delivery-id-uuid",
  "event": "comment.created",
  "timestamp": 1716900000000,
  "data": {
    "id": "comment-id",
    "threadId": "sha256-hash-of-url",
    "url": "https://example.com/page",
    "parentId": null,
    "author": " Yeonwoo",
    "content": "이 사이트 정말 유용하네요! @developer",
    "userId": "user-id",
    "category": "Tech",
    "createdAt": "2026-05-27T12:00:00.000Z"
  }
}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-zinc-100 pb-6">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
          VoidSay Developer Portal
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          VoidSay 공개 API와 실시간 웹훅을 사용하여 나만의 커스텀 클라이언트를 개발하거나, 알림 봇을 연동하고 커뮤니티 데이터를 분석해보세요.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {success}
        </div>
      )}

      {/* Grid: Webhook Config & Active List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left: Webhook Subscription Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            웹훅 구독 추가
          </h2>

          <form onSubmit={handleAddWebhook} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Target Payload URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-api.com/webhook"
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Trigger Event
              </label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 focus:bg-white transition-all"
              >
                <option value="*">모든 이벤트 (*)</option>
                <option value="comment.created">댓글 생성 (comment.created)</option>
                <option value="comment.liked">댓글 좋아요 (comment.liked)</option>
                <option value="reaction.created">이모지 반응 생성 (reaction.created)</option>
                <option value="reaction.deleted">이모지 반응 삭제 (reaction.deleted)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Secret (선택)
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="자동 생성하려면 비워두세요"
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Webhook className="h-4 w-4" />
              구독하기
            </button>
          </form>
        </div>

        {/* Right: Active Webhooks */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Webhook className="h-5 w-5 text-blue-600" />
              내 웹훅 목록
            </h2>
            <button
              onClick={fetchWebhooks}
              className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors"
              title="새로고침"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              웹훅 정보를 불러오는 중입니다...
            </div>
          ) : webhooks.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-200 rounded-xl">
              <Webhook className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">등록된 웹훅 구독이 없습니다.</p>
              <p className="text-zinc-400 text-xs mt-1">왼쪽 폼에서 첫 웹훅 구독을 만들어보세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-600 rounded">
                        {sub.event}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-zinc-800 truncate flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{sub.url}</span>
                    </div>
                    {sub.secret && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white border border-zinc-100 px-2.5 py-1 rounded-md max-w-max">
                        <Shield className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-mono">Secret: {sub.secret}</span>
                        <button
                          onClick={() => handleCopy(sub.secret || "", sub.id)}
                          className="hover:text-zinc-800 transition-colors"
                        >
                          {copiedId === sub.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteWebhook(sub.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 self-end md:self-center border border-zinc-100 bg-white md:bg-transparent"
                    title="웹훅 구독 삭제"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Reference & Guides */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600" />
          API & 웹훅 연동 가이드
        </h2>

        {/* REST API Endpoints */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 mb-4">REST API 가이드</h3>
          <div className="space-y-6">
            {/* Get Comments */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-green-50 text-green-700 rounded uppercase font-mono">
                  GET
                </span>
                <span className="font-mono text-sm font-semibold text-zinc-800">
                  /api/comments?url={"{TARGET_URL}"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 pl-2">
                특정 웹페이지 URL 스레드에 작성된 댓글 목록을 트리 구조로 가져옵니다. (Cursor 기반 페이징 지원)
              </p>
            </div>

            {/* Post Comments */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 rounded uppercase font-mono">
                  POST
                </span>
                <span className="font-mono text-sm font-semibold text-zinc-800">
                  /api/comments
                </span>
              </div>
              <p className="text-xs text-zinc-500 pl-2">
                특정 URL 스레드에 새로운 댓글을 추가합니다. 로그인 세션(쿠키)이 필요합니다.
              </p>
            </div>

            {/* Get Trending */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-green-50 text-green-700 rounded uppercase font-mono">
                  GET
                </span>
                <span className="font-mono text-sm font-semibold text-zinc-800">
                  /api/trending?period={"{today|month|year}"}&region={"{global|kr|en}"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 pl-2">
                가장 핫한 급상승 인기 링크와 통계 랭킹을 기간별/지역별로 조회합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Webhooks Signature Verification & Payload Example */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Signature Verification */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 mb-3 flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-blue-600" />
                서명 검증 (Signature Verification)
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                VoidSay는 웹훅 전송 시 페이로드를 보호하기 위해 헤더에 <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">x-voidsay-signature</code>를 포함합니다. 발급받은 Secret 키와 HMAC SHA256 알고리즘을 사용해 전달받은 페이로드가 정당한지 검증할 수 있습니다.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => handleCopyDocs(exampleSignatureCode, "signature")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 bg-white/80 p-1.5 rounded-lg border border-zinc-100 transition-colors"
                title="코드 복사"
              >
                {copiedText === "signature" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <pre className="text-[11px] font-mono bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto max-h-[220px]">
                {exampleSignatureCode}
              </pre>
            </div>
          </div>

          {/* Webhook Payload Example */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 mb-3 flex items-center gap-2">
                <CornerDownRight className="h-4.5 w-4.5 text-blue-600" />
                웹훅 페이로드 샘플 (comment.created)
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                웹훅 발송 시 수신하게 되는 표준 JSON 페이로드 규격입니다. 모든 이벤트는 고유의 <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">id</code>를 가지며, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">data</code> 객체 내부에 구체적인 리소스 필드를 담고 있습니다.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => handleCopyDocs(commentPayloadExample, "payload")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 bg-white/80 p-1.5 rounded-lg border border-zinc-100 transition-colors"
                title="샘플 복사"
              >
                {copiedText === "payload" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <pre className="text-[11px] font-mono bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto max-h-[220px]">
                {commentPayloadExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
