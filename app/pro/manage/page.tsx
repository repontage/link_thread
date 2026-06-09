"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, ArrowLeft, AlertTriangle, CreditCard, Calendar } from "lucide-react";

export default function ProManagePage() {
  const { data: session, status } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [nextBilledAt, setNextBilledAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const isPro = (session?.user as any)?.isPro;

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/paddle/manage", {
          method: "POST",
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load subscription details.");
        }
        const data = await response.json();
        setSubscriptionStatus(data.subscriptionStatus);
        setNextBilledAt(data.nextBilledAt);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated" && isPro) {
      fetchSubscription();
    } else if (status === "authenticated" && !isPro) {
      setLoading(false);
      setError("Pro subscription required.");
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, isPro]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel? Your Pro access will remain until the end of the billing period.")) {
      return;
    }
    setCancelling(true);
    setError(null);
    try {
      const response = await fetch("/api/paddle/manage", { method: "DELETE" });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Cancellation failed.");
      }
      setCancelSuccess(true);
      setSubscriptionStatus("canceled");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setCancelling(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066cc]" />
      </div>
    );
  }

  const statusLabel =
    subscriptionStatus === "active" ? "Active" :
    subscriptionStatus === "canceled" ? "Cancelled (ends at period end)" :
    subscriptionStatus === "past_due" ? "Past Due" :
    subscriptionStatus || "Unknown";

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
          View and manage your VoidSay Pro subscription.
        </p>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
        ) : null}

        {cancelSuccess ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400 mb-4">
            <p className="font-semibold mb-1">Subscription cancelled</p>
            <p>Your Pro access will remain active until the end of the current billing period.</p>
          </div>
        ) : null}

        {/* Subscription details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
            <span className={`text-sm font-medium ${
              subscriptionStatus === "active" ? "text-emerald-600 dark:text-emerald-400" :
              subscriptionStatus === "past_due" ? "text-red-600 dark:text-red-400" :
              "text-slate-600 dark:text-slate-300"
            }`}>
              {statusLabel}
            </span>
          </div>

          {nextBilledAt && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5 inline mr-1.5" />
                Next billing
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {new Date(nextBilledAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/pro"
            className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white flex items-center justify-center gap-2 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            Update Payment Method
          </a>

          {subscriptionStatus === "active" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {cancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              Cancel Subscription
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">
          Powered by Paddle · Secure payment processing
        </p>
      </div>
    </div>
  );
}

