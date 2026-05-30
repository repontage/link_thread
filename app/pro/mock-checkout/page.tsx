"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";

export default function MockCheckoutPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // next/navigation을 사용하되 혹시 모를 임포트 호환성을 위해 window.location을 폴백으로 둔다.
  const handleMockPay = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/mock-success", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("모의 결제 처리에 실패했습니다.");
      }

      const data = await response.json();
      if (data.success) {
        // NextAuth 세션 갱신
        await update();
        window.location.href = "/pro/success?session_id=mock_session_" + Date.now();
      } else {
        throw new Error("결제 처리가 실패했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-6 py-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xl">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#0066cc] mb-4">
          <CreditCard className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Stripe Mock Sandbox</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          현재 Stripe 환경 변수가 비어 있으므로 <strong>모의 결제(Mock Sandbox)</strong>로 연결되었습니다.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">상품명</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">VoidSay Pro (Monthly)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">결제 금액</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">$29.00 / mo</span>
        </div>
        <div className="flex justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
          <span className="text-slate-500 dark:text-slate-400">구매자 계정</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{session?.user?.email}</span>
        </div>
      </div>

      <button
        onClick={handleMockPay}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "테스트 결제 승인하기 ($29.00)"
        )}
      </button>

      {error && <p className="mt-3 text-xs text-red-500 text-center">{error}</p>}

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        보안 테스트 샌드박스 환경입니다. 실제 비용은 청구되지 않습니다.
      </div>
    </div>
  );
}
