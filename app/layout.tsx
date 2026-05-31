import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { ABTestProvider } from "@/lib/ab-testing";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
