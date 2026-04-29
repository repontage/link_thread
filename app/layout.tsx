import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "VoidSay - Universal Commenting",
  description: "Comment on any URL on the internet.",
  openGraph: {
    title: "VoidSay",
    description: "Comment on any URL on the internet.",
    url: "/",
    siteName: "VoidSay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoidSay",
    description: "Comment on any URL on the internet.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav className="border-b bg-surface sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="font-bold text-xl tracking-tight text-primary">
                VoidSay
              </Link>
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                  Home
                </Link>
                <Link href="/profile" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
