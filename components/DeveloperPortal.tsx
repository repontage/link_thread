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
        setError(data.error || "Failed to load webhooks.");
      }
    } catch {
      setError("Network error. Failed to retrieve webhook list.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("Invalid URL format. Must start with http:// or https://");
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
        setSuccess("Webhook subscription registered successfully!");
        setUrl("");
        setSecret("");
        setEvent("*");
        fetchWebhooks();
      } else {
        setError(data.error || "Failed to register webhook.");
      }
    } catch {
      setError("Network error. Failed to add webhook subscription.");
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook subscription?")) return;
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/webhooks?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("Webhook subscription deleted successfully.");
        fetchWebhooks();
      } else {
        setError(data.error || "Failed to delete webhook.");
      }
    } catch {
      setError("Network error. Failed to delete webhook.");
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
    "author": "John Doe",
    "content": "This platform is amazing! @developer",
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
        <p className="text-zinc-500 max-w-2xl text-sm">
          Develop custom clients, integrate notification bots, and analyze community data with VoidSay's public REST APIs and real-time Webhooks.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Grid: Webhook Config & Active List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left: Webhook Subscription Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add Webhook
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
                <option value="*">All Events (*)</option>
                <option value="comment.created">Comment Created (comment.created)</option>
                <option value="comment.liked">Comment Liked (comment.liked)</option>
                <option value="reaction.created">Emoji Reaction Created (reaction.created)</option>
                <option value="reaction.deleted">Emoji Reaction Deleted (reaction.deleted)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Secret (Optional)
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Leave blank to auto-generate"
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Webhook className="h-4 w-4" />
              Subscribe
            </button>
          </form>
        </div>

        {/* Right: Active Webhooks */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Webhook className="h-5 w-5 text-blue-600" />
              Active Webhooks
            </h2>
            <button
              onClick={fetchWebhooks}
              className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              Loading webhook configurations...
            </div>
          ) : webhooks.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-200 rounded-xl">
              <Webhook className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm font-medium">No active webhook subscriptions found.</p>
              <p className="text-zinc-400 text-xs mt-1">Configure your first webhook subscription on the left.</p>
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
                    title="Delete webhook subscription"
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
          API & Webhooks Integration Guide
        </h2>

        {/* REST API Endpoints */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 mb-4">REST API Endpoints</h3>
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
                Retrieve comment threads in a nested tree structure for any given webpage. Supports cursor-based pagination.
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
                Post a new comment or nested reply to a specific link thread. Requires user authentication session cookies.
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
                Fetch trending link discussions and community analytics, filterable by time ranges and content regions.
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
                Signature Verification
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                VoidSay includes an <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">x-voidsay-signature</code> header in webhook dispatches to secure payloads. You can verify the authenticity of incoming payloads using your signing Secret and HMAC SHA256.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => handleCopyDocs(exampleSignatureCode, "signature")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 bg-white/80 p-1.5 rounded-lg border border-zinc-100 transition-colors"
                title="Copy code"
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
                Webhook Payload Sample (comment.created)
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                Standard JSON payload schema received on your server on dispatch. All webhook events contain metadata envelopes with distinct event types and unique delivery IDs.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => handleCopyDocs(commentPayloadExample, "payload")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 bg-white/80 p-1.5 rounded-lg border border-zinc-100 transition-colors"
                title="Copy payload"
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
