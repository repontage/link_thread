"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function SponsorUI() {
  const { data: session } = useSession();

  if (session?.user?.isPro) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">
            Sponsor this Thread
          </h3>
          <p className="text-sm text-amber-700">
            Enjoying the conversation? Support the creator with a small donation.
          </p>
        </div>
        <button 
          onClick={() => alert("Sponsor feature coming soon!")}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          ☕ Support Creator
        </button>
      </div>
    </div>
  );
}
