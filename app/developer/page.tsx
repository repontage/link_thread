import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeveloperPortalClient from "./DeveloperPortalClient";

export const metadata = {
  title: "Developer Portal - VoidSay",
  description: "Manage webhooks, API access, and developer tools for VoidSay.",
};

export default async function DeveloperPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true, role: true },
  });

  const isProOrAdmin = user?.isPro === true || user?.role === "ADMIN";

  if (!isProOrAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6 py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Pro Subscription Required
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            The Developer Portal is available to Pro subscribers and admins only.
            Upgrade now to access webhooks, API access, and developer tools.
          </p>
          <a
            href="/pro"
            className="inline-block py-3 px-6 rounded-xl font-semibold text-sm bg-[#0066cc] hover:bg-[#0055b3] text-white transition-colors"
          >
            Upgrade to Pro — $29/mo
          </a>
        </div>
      </div>
    );
  }

  return <DeveloperPortalClient />;
}
