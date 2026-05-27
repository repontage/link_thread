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
    <div className="flex items-center gap-xl text-nav-link font-text">
      <ThemeToggle />
      <Link href="/" className="text-white/80 hover:text-white transition-colors">
        Home
      </Link>
      {session ? (
        <>
          <Link href="/profile" className="text-white/80 hover:text-white transition-colors">
            Profile
          </Link>
          <Link href="/developer" className="text-white/80 hover:text-white transition-colors">
            Developer
          </Link>
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
