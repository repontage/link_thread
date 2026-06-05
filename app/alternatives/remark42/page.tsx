import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Remark42 — Managed Alternative to Self-Hosted (2026)',
  description: 'Remark42 is a powerful self-hosted comment engine. VoidSay is free, fully managed, with Markdown, YouTube/X embeds, and Passkeys. No Docker, no maintenance.',
  openGraph: {
    title: 'VoidSay vs Remark42 — Keep the Power, Drop the Server',
    description: 'All the privacy of Remark42, none of the Docker complexity.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever, managed', remark42: '✅ Free (self-hosted)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', remark42: '❌ Self-hosted (Docker/Go)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', remark42: '✅ Privacy-first, self-hosted' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', remark42: '✅ Full Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', remark42: '✅ Built-in dark/light' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', remark42: '⚠️ Limited embed support' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', remark42: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', remark42: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', remark42: '✅ Admin UI (self-hosted)' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', remark42: '✅ Google, GitHub, Facebook, and more' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', remark42: '✅ Fast (Go backend)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', remark42: 'N/A (open source)' },
  { feature: 'Telegram Notifications', voidsay: '✅ Coming soon', remark42: '✅ Native Telegram support' },
];

const reasons = [
  { icon: '☁️', title: 'Zero Ops', desc: 'Remark42 requires Docker, Go runtime, and ongoing maintenance. VoidSay is fully managed — no servers, no Docker, no updates to worry about.' },
  { icon: '✨', title: 'Richer Embeds', desc: 'Auto-embed YouTube with timestamps, X/Twitter cards, Instagram feeds. Remark42 has great Markdown but limited media support.' },
  { icon: '🔐', title: 'Passkey Auth', desc: 'VoidSay adds Passkeys to the OAuth lineup. Remark42 has great OAuth options — VoidSay matches them and adds passwordless sign-in.' },
];

const steps = [
  { step: '1', title: 'Remove Remark42', desc: 'Delete the Remark42 embed code and shut down your Docker container.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our one-line embed snippet. No server configuration needed.' },
  { step: '3', title: 'Enjoy Managed Comments', desc: 'Same privacy, richer features, zero maintenance.' },
];

const testimonials = [
  {
    text: "Remark42 is the best self-hosted option, but I was tired of Docker updates. VoidSay gives me the same privacy with zero server work.",
    author: '— DevOps Engineer, Berlin',
  },
  {
    text: "I loved Remark42's feature set but hated the maintenance. VoidSay feels like Remark42-as-a-service — all the power, none of the hassle.",
    author: '— Blogger, Moscow',
  },
];

export default function Remark42ComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔄</span>
          <span>Tired of Docker maintenance?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Managed{' '}
          <span className="text-blue-600">Remark42 Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Remark42 is arguably the best self-hosted commenting engine — full Markdown, rich OAuth, Telegram integration. But it needs Docker,
          Go runtime, and weekly maintenance. VoidSay delivers the same power as a free, fully managed service.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from Remark42</h2>
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

      <section id="comparison" className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Remark42</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Remark42</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.remark42}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Remark42 to VoidSay</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
            {steps.map((item) => (
              <div key={item.step} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">{item.step}</div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-left font-mono text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
            <code>{'<iframe src="https://voidsay.com/embed?url=YOUR_PAGE_URL" width="100%" height="400" frameborder="0"></iframe>'}</code>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">What Switchers Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.text} className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Simplify Your Stack?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">All the power of Remark42, zero Docker maintenance. Free forever.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-lg">Get Started Free →</Link>
      </section>

      <footer className="py-8 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy</Link>
          <Link href="/alternatives" className="hover:text-zinc-700 dark:hover:text-zinc-300">All Alternatives</Link>
          <Link href="/alternatives/disqus" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Disqus</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">VoidSay Home</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300">𝕏 @voidsay_</a>
        </div>
      </footer>
    </main>
  );
}
