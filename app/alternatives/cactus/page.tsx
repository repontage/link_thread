import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Cactus Comments — Simpler Alternative (2026)',
  description: 'Cactus Comments uses Matrix protocol for federated commenting. VoidSay is simpler — free, managed, with Markdown, media embeds, and Passkeys. No Matrix server needed.',
  openGraph: {
    title: 'VoidSay vs Cactus Comments — Federated vs Simple',
    description: 'Cactus is clever but complex. VoidSay just works.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever, managed', cactus: '✅ Free (Matrix-based, self-hosted)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', cactus: '❌ Requires Matrix homeserver' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', cactus: '✅ Federated, decentralized' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', cactus: '⚠️ Limited Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', cactus: '⚠️ CSS theming' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', cactus: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', cactus: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', cactus: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', cactus: '⚠️ Matrix client moderation' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', cactus: '✅ Matrix accounts (federated)' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', cactus: '✅ Lightweight' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', cactus: 'N/A (open source)' },
];

const reasons = [
  { icon: '🎯', title: 'Simple Setup', desc: 'Cactus needs a Matrix homeserver — fascinating tech but heavy infrastructure. VoidSay is one line of HTML and you\'re done.' },
  { icon: '✨', title: 'Rich Media', desc: 'YouTube, X/Twitter, Instagram auto-embeds. Cactus is text-only. Your readers get a richer experience with VoidSay.' },
  { icon: '👥', title: 'Broader Audience', desc: 'Cactus requires Matrix accounts. VoidSay accepts Google, GitHub, and Passkeys — readers can comment without learning new protocols.' },
];

const steps = [
  { step: '1', title: 'Remove Cactus Embed', desc: 'Delete the Cactus Comments snippet from your site.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Paste our one-line embed. No Matrix, no federation config.' },
  { step: '3', title: 'Welcome All Readers', desc: 'Anyone with a Google or GitHub account can now comment. No Matrix required.' },
];

const testimonials = [
  {
    text: "I love the idea of federated comments, but Cactus was too complex for my readers. VoidSay keeps things simple and my comment section is alive again.",
    author: '— Open Source Maintainer, Remote',
  },
  {
    text: "Cactus is brilliant technically, but my non-technical readers couldn't figure out Matrix. VoidSay's Passkeys + OAuth onboarding is seamless.",
    author: '— Blogger, Helsinki',
  },
];

export default function CactusComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔄</span>
          <span>Simplifying from Cactus?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Simpler{' '}
          <span className="text-blue-600">Cactus Comments Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Cactus Comments is a clever federated system built on Matrix. But it requires a Matrix homeserver and your readers need Matrix accounts.
          VoidSay is free, managed, and works with accounts your readers already have.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from Cactus Comments</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Cactus Comments</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Cactus Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.cactus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Cactus to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready for Simple, Powerful Comments?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">No federation to manage. No Matrix to learn. Just great comments that work.</p>
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
