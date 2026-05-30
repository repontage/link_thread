"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Shield, Zap, Sparkles, Loader2 } from "lucide-react";

export default function ProPage() {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPro = (session?.user as any)?.isPro;

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("결제 세션 생성에 실패했습니다.");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("결제 URL이 유효하지 않습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDowngradeMock = async () => {
    // 테스트용 등급 초기화 버튼 (Pro 해제)
    setLoading(true);
    try {
      const res = await fetch("/api/admin/fix-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removePro" }),
      });
      if (res.ok) {
        await update();
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-height-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066cc]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          VoidSay <span className="text-[#0066cc]">Pro</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          더 강력한 기능과 광고 없는 깔끔한 경험으로 무제한의 댓글 소통 플랫폼을 완성해보세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">소소한 링크 소통을 위한 기본 요금제</p>
            <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
              <span className="text-3xl font-extrabold tracking-tight">$0</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                댓글 무제한 작성 및 조회
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                기본 트렌딩 보드 이용
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                브라우저 확장 프로그램 및 위젯 연동
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            >
              {isPro ? "기본 플랜 사용 중" : "현재 사용 중"}
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="relative border-2 border-[#0066cc] rounded-2xl p-8 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-lg">
          <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-[#0066cc] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Popular
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Pro <span className="text-xs bg-[#0066cc]/10 text-[#0066cc] px-2 py-0.5 rounded">Special</span>
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">전문가와 파워 유저를 위한 최상의 도구</p>
            <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
              <span className="text-3xl font-extrabold tracking-tight">$29</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Zap className="h-5 w-5 text-[#0066cc] mr-2 flex-shrink-0" />
                <strong>Ad-free Experience</strong> (광고 및 스폰서 UI 완벽 비노출)
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Shield className="h-5 w-5 text-[#0066cc] mr-2 flex-shrink-0" />
                <strong>Developer Webhooks</strong> (새 댓글/리액션 발생 시 실시간 연동)
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Sparkles className="h-5 w-5 text-[#0066cc] mr-2 flex-shrink-0" />
                <strong>Developer Portal</strong> (API 생성 및 관리 권한 획득)
              </li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                특별한 <strong>Pro 배지</strong> 프로필 자동 부여
              </li>
            </ul>
          </div>
          <div className="mt-8">
            {!session ? (
              <button
                onClick={() => (window.location.href = "/api/auth/signin")}
                className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors"
              >
                로그인 후 구독 시작하기
              </button>
            ) : isPro ? (
              <div className="space-y-2">
                <div className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Pro 구독 활성화 중 ✨
                </div>
                <button
                  onClick={handleDowngradeMock}
                  disabled={loading}
                  className="w-full py-2 px-4 text-xs text-center text-slate-400 hover:text-red-500 transition-colors"
                >
                  [테스트] Pro 구독 해제하기
                </button>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Upgrade to Pro ($29/mo)"
                )}
              </button>
            )}
            {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
