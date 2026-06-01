"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-4 bg-canvas-parchment animate-pulse rounded-pill" />;
  }

  return (
    <div className="flex items-center gap-sm md:gap-xl text-nav-link font-text">
      <ThemeToggle />
      <Link href="/" className="hidden sm:inline text-white/80 hover:text-white transition-colors">
        Home
      </Link>
      <Link href="/pro" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
        Pro <span className="text-[10px] bg-[#0066cc] text-white px-1 py-0.2 rounded-full font-bold">New</span>
      </Link>
      {session ? (
        <>
          <Link href="/profile" className="text-white/80 hover:text-white transition-colors">
            Profile
          </Link>
          {(session?.user as any)?.isPro || (session?.user as any)?.role === "ADMIN" ? (
            <Link href="/developer" className="text-white/80 hover:text-white transition-colors">
              Developer
            </Link>
          ) : (
            <Link href="/pro" className="text-white/50 hover:text-white transition-colors text-sm">
              Developer
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-dark-utility"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="btn-dark-utility"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
