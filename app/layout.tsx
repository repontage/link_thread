import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { ABTestProvider } from "@/lib/ab-testing";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://voidsay.com"),
  title: {
    default: "VoidSay — Universal Commenting for Any Website",
    template: "%s | VoidSay",
  },
  description: "Comment on any website, YouTube video, or X thread. Free, privacy-first universal commenting with Markdown, dark mode, and rich media embeds. No ads, no tracking.",
  keywords: ["commenting platform", "universal comments", "Disqus alternative", "website comments", "YouTube comments", "blog comments", "Commento alternative"],
  openGraph: {
    title: "VoidSay — Comment on Any Website",
    description: "Free, privacy-first universal commenting. Markdown, dark mode, YouTube/X embeds. No ads, no tracking.",
    url: "/",
    siteName: "VoidSay",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoidSay — Universal Commenting",
    description: "Comment on any URL. Free, private, modern. No ads.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
          <LanguageProvider>
            <AuthProvider>
              <ABTestProvider>
                <Navbar />
                {children}
              </ABTestProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
