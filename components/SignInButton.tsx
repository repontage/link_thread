"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export function SignInButton({ inviteCode }: { inviteCode?: string }) {
  const { data: session, status } = useSession();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async () => {
    if (!inviteCode) return;
    setClaiming(true);
    setError("");

    try {
      const res = await fetch("/api/invite/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setClaimed(true);
        // Force session refresh to get isPro = true
        await fetch("/api/auth/session?update");
        // Redirect to home after a brief moment
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(data.error || "Failed to claim invite");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  if (claimed) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400">
        <p className="text-lg mb-1">🎉 Invite Claimed!</p>
        <p className="text-sm opacity-80">Welcome to VoidSay Pro. Redirecting...</p>
      </div>
    );
  }

  // If user is logged in
  if (session?.user) {
    return (
      <div className="space-y-3">
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="w-full px-6 py-3 bg-[#0066cc] text-white rounded-lg hover:bg-[#0055aa] disabled:opacity-50 transition-all font-semibold text-lg"
        >
          {claiming ? "Claiming..." : `Claim Your 7-Day Pro Trial 🎁`}
        </button>
        {error && (
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        )}
        <p className="text-gray-500 text-xs">
          Signed in as <strong>{session.user.name || session.user.email}</strong>
        </p>
      </div>
    );
  }

  // If loading
  if (status === "loading") {
    return (
      <div className="space-y-3">
        <div className="w-full h-12 bg-white/10 rounded-lg animate-pulse" />
      </div>
    );
  }

  // If not logged in
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn("google", { callbackUrl: window.location.href })}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </button>

      <button
        onClick={() => signIn("github", { callbackUrl: window.location.href })}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Sign in with GitHub
      </button>

      {error && (
        <p className="text-red-400 text-sm text-center">⚠️ {error}</p>
      )}
    </div>
  );
}
