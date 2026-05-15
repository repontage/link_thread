"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-4 bg-zinc-100 animate-pulse rounded" />;
  }

  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      <ThemeToggle />
      <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">
        Home
      </Link>
      {session ? (
        <>
          <Link href="/profile" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Profile
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          Profile
        </button>
      )}
    </div>
  );
}
