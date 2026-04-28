"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth.js v5 환경: 세션 만료 및 잦은 재인증 경고 방지 로직 강화
  return (
    <SessionProvider 
      refetchInterval={5 * 60} 
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
