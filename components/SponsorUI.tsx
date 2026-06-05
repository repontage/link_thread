"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SponsorUI() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading" || session?.user?.isPro) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">
            Go Ad-Free with Pro
          </h3>
          <p className="text-sm text-amber-700">
            Remove ads and unlock developer tools. Upgrade to Pro.
          </p>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); router.push("/pro"); }}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          Upgrade to Pro →
        </button>
      </div>
    </div>
  );
}
