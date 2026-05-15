import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import UserNav from "@/components/UserNav";
import SearchBar from "@/components/SearchBar";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VoidSay",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8285887641787672" 
          crossOrigin="anonymous"
        ></script>
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <nav className="border-b bg-surface sticky top-0 z-50">
              <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl tracking-tight text-primary flex-shrink-0">
                  VoidSay
                </Link>
                <SearchBar />
                <UserNav />
              </div>
            </nav>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
