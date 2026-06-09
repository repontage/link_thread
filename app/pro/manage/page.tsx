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
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load subscription details.");
        }
        const data = await response.json();
        setPortalUrl(data.customerPortalUrl);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated" && isPro) {
      fetchPortalUrl();
    } else if (status === "authenticated" && !isPro) {
      setLoading(false);
      setError("Pro subscription required.");
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
        <ArrowLeft className="h-4 w-4" /> Back to Pro
      </button>

      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manage Subscription</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Manage your subscription, payment methods, and billing info via the Paddle customer portal.
        </p>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : portalUrl ? (
          <div className="space-y-3">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors"
            >
              Manage Subscription <ExternalLink className="h-4 w-4" />
            </a>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              Powered by Paddle · Secure payment processing
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
            Loading subscription details...
          </div>
        )}
      </div>
    </div>
  );
}
