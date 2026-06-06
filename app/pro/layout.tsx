import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VoidSay Pro — Power Features for $29/mo',
  description: 'Unlock Pro badges, Developer Portal access, priority support, and an ad-free experience. Powered by Lemon Squeezy for secure payments.',
  openGraph: {
    title: 'VoidSay Pro — Upgrade Your Comments',
    description: 'Pro badges, Developer Portal, ad-free. $29/mo. Powered by Lemon Squeezy.',
  },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
