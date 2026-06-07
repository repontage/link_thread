"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, ArrowRight, Zap, Sparkles, Clock } from "lucide-react";

export default function ProSuccessPage() {
  const { update } = useSession();

  useEffect(() => {
    // Refresh NextAuth session when landing on success page.
    // This ensures Pro access is immediately reflected in the header and dashboard.
    update();
  }, [update]);

  return (
    <div className="max-w-md mx-auto my-16 px-6 py-12 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xl text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 mb-6">
        <CheckCircle className="h-10 w-10 animate-pulse" />
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome to Pro!</h2>
      <p className="mt-3 text-slate-500 dark:text-slate-400">
        Congratulations — you are now a VoidSay <strong>Pro</strong> member. All Pro benefits are now unlocked.
      </p>

      {/* Activation delay notice */}
      <div className="mt-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-left">
        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Pro status may take up to 1 minute to fully activate. If you don't see changes immediately, try refreshing the page.
        </p>
      </div>

      <div className="mt-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 text-left space-y-4">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-[#0066cc] flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ads Removed</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sponsor UI and ad elements are hidden across the entire site.</p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <Sparkles className="h-5 w-5 text-[#0066cc] flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Developer Webhooks Enabled</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create unlimited real-time webhook endpoints and send them anywhere.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => (window.location.href = "/developer")}
          className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          Go to Developer Portal <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
