import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Commento — Free, Modern Alternative (2026)',
  description: 'Commento is self-hosted and limited. VoidSay offers a fully managed, free commenting platform with Markdown, YouTube embeds, dark mode, and no setup required. Compare features and see why sites are switching.',
  openGraph: {
    title: 'VoidSay vs Commento — Which Is Right for You?',
    description: 'No self-hosting. No monthly fees. Full media embeds. Compare VoidSay and Commento side by side.',
  },
};

const features = [
  { feature: 'Hosting', voidsay: '☁️ Fully managed (Vercel)', commento: '🖥️ Self-hosted required' },
  { feature: 'Free Plan', voidsay: '✅ Free forever', commento: '✅ Free (self-hosted)' },
  { feature: 'Setup Time', voidsay: '⚡ 30 seconds (embed)', commento: '🐌 30+ min (Docker, DB)' },
  { feature: 'Privacy', voidsay: '✅ No tracking', commento: '✅ Privacy-focused' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', commento: '⚠️ Basic only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', commento: '❌ Not built-in' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', commento: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', commento: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', commento: '❌ Not supported' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', commento: '✅ Google, GitHub, GitLab' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge', commento: '$5/mo — Commento Cloud' },
  { feature: 'Data Ownership', voidsay: '✅ Export via API', commento: '✅ Full control (self-hosted)' },
];

const reasons = [
  { icon: '⚡', title: 'Zero Setup', desc: 'Paste one line of code. No Docker, no database, no server maintenance. VoidSay handles everything.' },
  { icon: '🎬', title: 'Rich Media Embeds', desc: 'YouTube, X/Twitter, and Instagram embeds work automatically. Commento only supports plain text.' },
  { icon: '🌐', title: 'Managed at Scale', desc: 'Turso distributed database, Vercel edge network. Your comments are fast everywhere in the world.' },
];

export default function CommentoComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
          <span>🔒</span>
          <span>Privacy-Focused Alternative</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Managed{' '}
          <span className="text-blue-600">Commento Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Commento is great for privacy. But self-hosting is a hassle. VoidSay gives you the same privacy-first philosophy — fully managed, zero setup, with rich media embeds.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
          Try VoidSay Free →
        </Link>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why Switch from Commento</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map((item) => (
              <div key={item.title} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Commento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.commento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Stop Self-Hosting?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Get the privacy of Commento with the convenience of a fully managed platform.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-lg">
          Get Started Free →
        </Link>
      </section>

      <footer className="py-8 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy</Link>
          <Link href="/alternatives/disqus" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Disqus</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
        </div>
      </footer>
    </main>
  );
}
