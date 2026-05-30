"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, ArrowRight, Zap, Sparkles } from "lucide-react";

export default function ProSuccessPage() {
  const { update } = useSession();

  useEffect(() => {
    // 성공 페이지에 왔을 때 NextAuth 세션을 수동으로 즉시 갱신해준다.
    // 이렇게 하면 헤더나 대시보드에서 변경된 Pro 권한이 실시간 적용된다.
    update();
  }, [update]);

  return (
    <div className="max-w-md mx-auto my-16 px-6 py-12 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xl text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 mb-6">
        <CheckCircle className="h-10 w-10 animate-pulse" />
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">구독을 환영합니다!</h2>
      <p className="mt-3 text-slate-500 dark:text-slate-400">
        VoidSay <strong>Pro</strong> 회원이 되신 것을 축하드립니다. 이제 모든 Pro 혜택을 제한 없이 누려보세요.
      </p>

      <div className="mt-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 text-left space-y-4">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-[#0066cc] flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">광고가 제거되었습니다</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">메인 화면 및 댓글 스레드 전역에서 스폰서 UI와 광고 요소가 숨겨집니다.</p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <Sparkles className="h-5 w-5 text-[#0066cc] flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Developer Webhooks 활성화</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">실시간 웹훅(Webhook) 엔드포인트를 무제한 생성하고 외부로 전송할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => (window.location.href = "/developer")}
          className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          개발자 포털 가기 <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
