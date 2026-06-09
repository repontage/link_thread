"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

export default function ProSuccessPage() {
  const { update } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "done" | "timeout">("loading");

  useEffect(() => {
    // Refresh the session to pick up new isPro status.
    // useSession().update() returns the fresh session — we use that
    // instead of the stale closure-captured value from deps.
    let attempts = 0;
    const maxAttempts = 15; // 15 seconds max
    const interval = setInterval(async () => {
      attempts++;
      try {
        const fresh = await update();
        if ((fresh?.user as any)?.isPro) {
          setStatus("done");
          clearInterval(interval);
          return;
        }
      } catch {
        // continue polling
      }

      if (attempts >= maxAttempts) {
        setStatus("timeout");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [update]); // session removed from deps — prevents infinite intervals

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#0066cc]" />
        <p className="text-slate-500 dark:text-slate-400">Confirming your Pro subscription...</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">This may take a few moments.</p>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Successful!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
          Your subscription is being activated. It may take a few minutes for your Pro status to appear.
        </p>
        <button
          onClick={() => router.push("/pro")}
          className="mt-4 py-3 px-6 rounded-xl text-sm font-semibold bg-[#0066cc] hover:bg-[#0055b3] text-white transition-colors"
        >
          Go to Pro Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <CheckCircle className="h-10 w-10 text-emerald-500" />
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You&apos;re now a Pro member!</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
        Welcome to VoidSay Pro. Enjoy ad-free browsing, developer webhooks, and more.
      </p>
      <button
        onClick={() => router.push("/pro")}
        className="mt-4 py-3 px-6 rounded-xl text-sm font-semibold bg-[#0066cc] hover:bg-[#0055b3] text-white transition-colors"
      >
        Go to Pro Dashboard
      </button>
    </div>
  );
}

