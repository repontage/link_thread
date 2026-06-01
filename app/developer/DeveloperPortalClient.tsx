"use client";

import dynamic from "next/dynamic";

const DeveloperPortal = dynamic(() => import("@/components/DeveloperPortal"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066cc] border-t-transparent" />
    </div>
  ),
});

export default function DeveloperPortalClient() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <DeveloperPortal />
    </div>
  );
}
