     1|"use client";
     2|
     3|import React, { useState, useEffect, useCallback } from "react";
     4|import { useSession } from "next-auth/react";
     5|import { Check, Shield, Zap, Sparkles, Loader2 } from "lucide-react";
     6|import type { Paddle as PaddleType } from "@paddle/paddle-js";
     7|
     8|export default function ProPage() {
     9|  const { data: session, status } = useSession();
    10|  const [loading, setLoading] = useState(false);
    11|  const [error, setError] = useState<string | null>(null);
    12|  const [paddle, setPaddle] = useState<PaddleType | null>(null);
    13|
    14|  const isPro = (session?.user as any)?.isPro;
    15|
    16|  useEffect(() => {
    17|    if (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
    18|      // Dynamically import Paddle.js
    19|      import("@paddle/paddle-js").then(({ initializePaddle }) => {
    20|        const isProduction = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
    21|        initializePaddle({
    22|          environment: isProduction ? "production" : "sandbox",
    23|          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    24|        }).then((paddleInstance) => {
    25|          if (paddleInstance) {
    26|            setPaddle(paddleInstance);
    27|          }
    28|        });
    29|      });
    30|    }
    31|  }, []);
    32|
    33|  const handleUpgrade = useCallback(async () => {
    34|    setLoading(true);
    35|    setError(null);
    36|
    37|    try {
    38|      // If Paddle is initialized, use checkout overlay
    39|      if (paddle && process.env.NEXT_PUBLIC_PADDLE_PRICE_ID) {
    40|        paddle.Checkout.open({
    41|          items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!, quantity: 1 }],
    42|          settings: {
    43|            displayMode: "overlay",
    44|            successUrl: `${window.location.origin}/pro/success`,
    45|          },
    46|        });
    47|      } else {
    48|        // Fallback: use server-side checkout or mock
    49|        const response = await fetch("/api/paddle/checkout", {
    50|          method: "POST",
    51|          headers: { "Content-Type": "application/json" },
    52|        });
    53|
    54|        if (!response.ok) {
    55|          throw new Error("결제 세션 생성에 실패했습니다.");
    56|        }
    57|
    58|        const data = await response.json();
    59|
    60|        if (data.isMock) {
    61|          window.location.href = data.checkoutUrl;
    62|        } else if (data.clientToken && data.priceId) {
    63|          // Re-initialize with the returned credentials
    64|          const { initializePaddle } = await import("@paddle/paddle-js");
    65|          const paddleInstance = await initializePaddle({
    66|            environment: process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox",
    67|            token: data.clientToken,
    68|          });
    69|          if (paddleInstance) {
    70|            paddleInstance.Checkout.open({
    71|              items: [{ priceId: data.priceId, quantity: 1 }],
    72|              settings: {
    73|                displayMode: "overlay",
    74|                successUrl: `${window.location.origin}/pro/success`,
    75|              },
    76|            });
    77|          }
    78|        } else {
    79|          throw new Error("결제 URL이 유효하지 않습니다.");
    80|        }
    81|      }
    82|    } catch (err: any) {
    83|      console.error(err);
    84|      setError(err.message || "An error occurred");
    85|    } finally {
    86|      setLoading(false);
    87|    }
    88|  }, [paddle]);
    89|
    90|  if (status === "loading") {
    91|    return (
    92|      <div className="flex min-h-[60vh] items-center justify-center">
    93|        <Loader2 className="h-8 w-8 animate-spin text-[#0066cc]" />
    94|      </div>
    95|    );
    96|  }
    97|
    98|  return (
    99|    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
   100|      <div className="text-center mb-16">
   101|        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
   102|          VoidSay <span className="text-[#0066cc]">Pro</span>
   103|        </h1>
   104|        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
   105|          더 강력한 기능과 광고 없는 깔끔한 경험으로 무제한의 댓글 소통 플랫폼을 완성해보세요.
   106|        </p>
   107|      </div>
   108|
   109|      <div className="grid md:grid-cols-2 gap-8 items-stretch">
   110|        {/* Free Plan */}
   111|        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm">
   112|          <div>
   113|            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free</h3>
   114|            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">소소한 링크 소통을 위한 기본 요금제</p>
   115|            <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
   116|              <span className="text-3xl font-extrabold tracking-tight">$0</span>
   117|              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
   118|            </div>
   119|            <ul className="mt-8 space-y-4">
   120|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   121|                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
   122|                댓글 무제한 작성 및 조회
   123|              </li>
   124|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   125|                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
   126|                기본 트렌딩 보드 이용
   127|              </li>
   128|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   129|                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
   130|                브라우저 확장 프로그램 및 위젯 연동
   131|              </li>
   132|            </ul>
   133|          </div>
   134|          <div className="mt-8">
   135|            <button
   136|              disabled
   137|              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
   138|            >
   139|              {isPro ? "기본 플랜 사용 중" : "현재 사용 중"}
   140|            </button>
   141|          </div>
   142|        </div>
   143|
   144|        {/* Pro Plan */}
   145|        <div className="relative border-2 border-[#0066cc] rounded-2xl p-8 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-lg">
   146|          <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-[#0066cc] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
   147|            <Sparkles className="h-3 w-3" /> Popular
   148|          </div>
   149|          <div>
   150|            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
   151|              Pro <span className="text-xs bg-[#0066cc]/10 text-[#0066cc] px-2 py-0.5 rounded">Powered by Paddle</span>
   152|            </h3>
   153|            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">전문가와 파워 유저를 위한 최상의 도구</p>
   154|            <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
   155|              <span className="text-3xl font-extrabold tracking-tight">$29</span>
   156|              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
   157|            </div>
   158|            <ul className="mt-8 space-y-4">
   159|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   160|                <Zap className="h-5 w-5 text-[#0066cc] mr-2 flex-shrink-0" />
   161|                <strong>Ad-free Experience</strong> (광고 및 스폰서 UI 완벽 비노출)
   162|              </li>
   163|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   164|                <Shield className="h-5 w-5 text-[#0066cc] mr-2 flex-shrink-0" />
   165|                <strong>Developer Webhooks</strong> (새 댓글/리액션 발생 시 실시간 연동)
   166|              </li>
   167|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   168|                <Sparkles className="h-5 w-5 text-[#0066cc] mr-2 flex-shrink-0" />
   169|                <strong>Developer Portal</strong> (API 생성 및 관리 권한 획득)
   170|              </li>
   171|              <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
   172|                <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
   173|                특별한 <strong>Pro 배지</strong> 프로필 자동 부여
   174|              </li>
   175|            </ul>
   176|          </div>
   177|          <div className="mt-8">
   178|            {!session ? (
   179|              <button
   180|                onClick={() => (window.location.href = "/api/auth/signin")}
   181|                className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors"
   182|              >
   183|                로그인 후 구독 시작하기
   184|              </button>
   185|            ) : isPro ? (
   186|              <div className="space-y-2">
   187|                <div className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
   188|                  Pro 구독 활성화 중 ✨
   189|                </div>
   190|                <a
   191|                  href="/pro/manage"
   192|                  className="block w-full py-2 px-4 text-xs text-center text-slate-400 hover:text-[#0066cc] transition-colors"
   193|                >
   194|                  구독 관리하기
   195|                </a>
   196|              </div>
   197|            ) : (
   198|              <button
   199|                onClick={handleUpgrade}
   200|                disabled={loading}
   201|                className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
   202|              >
   203|                {loading ? (
   204|                  <Loader2 className="h-4 w-4 animate-spin" />
   205|                ) : (
   206|                  "Upgrade to Pro ($29/mo)"
   207|                )}
   208|              </button>
   209|            )}
   210|            {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
   211|          </div>
   212|        </div>
   213|      </div>
   214|    </div>
   215|  );
   216|}
   217|