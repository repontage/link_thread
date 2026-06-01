"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, ExternalLink, ArrowLeft } from "lucide-react";

export default function ProManagePage() {
  const { data: session, status } = useSession();
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPro = (session?.user as any)?.isPro;

  useEffect(() => {
    async function fetchPortalUrl() {
      try {
        const response = await fetch("/api/paddle/manage", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("고객 포털 URL을 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setPortalUrl(data.url);
      } catch (err: any) {
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated" && isPro) {
      fetchPortalUrl();
    } else if (status === "authenticated" && !isPro) {
      setLoading(false);
      setError("Pro 구독이 필요합니다.");
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, isPro]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066cc]" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 sm:px-6">
      <button
        onClick={() => (window.location.href = "/pro")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Pro 구독 페이지로 돌아가기
      </button>

      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">구독 관리</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          구독 취소, 결제 수단 변경, 청구 정보를 Paddle 고객 포털에서 관리하세요.
        </p>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : portalUrl ? (
          <div className="space-y-4">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors"
            >
              Paddle 고객 포털 열기 <ExternalLink className="h-4 w-4" />
            </a>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              Paddle 고객 포털에서 구독을 관리할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
            포털 URL을 불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
}
