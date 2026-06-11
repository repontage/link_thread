import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { ABTestProvider } from "@/lib/ab-testing";
import Navbar from "@/components/Navbar";
import JsonLd from "@/components/JsonLd";
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
        <meta name="saashub-verification" content="zx1cj87msb4n" />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "VoidSay",
          "url": "https://voidsay.com",
          "logo": "https://voidsay.com/favicon.ico",
          "sameAs": [
            "https://x.com/voidsay_",
            "https://github.com/voidsay",
            "https://dev.to/voidsay"
          ],
          "description": "Universal commenting platform for any website. Free, privacy-first, no tracking.",
          "foundingDate": "2026",
          "founders": [{
            "@type": "Person",
            "name": "VoidSay Team"
          }]
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "VoidSay",
          "url": "https://voidsay.com",
          "description": "Comment on any website, YouTube video, or X thread. Free, privacy-first universal commenting with Markdown, dark mode, and rich media embeds.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://voidsay.com/?url={url}",
            "query-input": "required name=url"
          }
        }} />
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
