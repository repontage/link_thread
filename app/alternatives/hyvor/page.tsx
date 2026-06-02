import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Hyvor — Flexible, Feature-Rich Alternative (2026)',
  description: 'Hyvor is feature-rich but pricey. VoidSay gives you YouTube/Twitter embeds, Markdown, dark mode, and a generous free plan — all at a better price. Compare side by side.',
  openGraph: {
    title: 'VoidSay vs Hyvor — Better Features, Better Price',
    description: 'Full media embeds, Markdown, dark mode, and a free plan Hyvor cannot match. See the comparison.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', hyvor: '⚠️ 30-day trial only' },
  { feature: 'Pricing', voidsay: '$29/mo Pro', hyvor: '$89/mo Business' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', hyvor: '✅ Full Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', hyvor: '✅ Built-in themes' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', hyvor: '⚠️ Link preview only' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', hyvor: '⚠️ Link preview only' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', hyvor: '❌ Not supported' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', hyvor: '✅ Google, GitHub, X' },
  { feature: 'Privacy', voidsay: '✅ No tracking', hyvor: '✅ GDPR compliant' },
  { feature: 'Setup Time', voidsay: '⚡ 30 seconds', hyvor: '⚡ Quick setup' },
  { feature: 'Hosting', voidsay: '☁️ Fully managed', hyvor: '☁️ Fully managed' },
  { feature: 'Data Export', voidsay: '✅ API access', hyvor: '✅ Full export' },
];

const reasons = [
  { icon: '💰', title: 'Better Price', desc: 'VoidSay Pro is $29/mo vs Hyvor Business at $89/mo. Same features, 3x less.' },
  { icon: '🎬', title: 'Better Embeds', desc: 'YouTube with timestamp, X/Twitter cards, Instagram feeds. Hyvor shows plain links.' },
  { icon: '🆓', title: 'Actually Free', desc: 'VoidSay free plan has no time limit. Hyvor free trial expires after 30 days.' },
];

export default function HyvorComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
          <span>💰</span>
          <span>Better Value Alternative</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Affordable{' '}
          <span className="text-blue-600">Hyvor Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Hyvor has great features — but at $89/mo for business. VoidSay delivers the same power with richer media embeds, a truly free plan, and Pro at just $29/mo.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
          Try VoidSay Free →
        </Link>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why Switch from Hyvor</h2>
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
                <th className="text-left p-4 font-semibold text-zinc-500">Hyvor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.hyvor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Get More for Less</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Better embeds, truly free plan, and Pro at 1/3 the price of Hyvor Business.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-lg">
          Get Started Free →
        </Link>
      </section>

      <footer className="py-8 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy</Link>
          <Link href="/alternatives/disqus" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Disqus</Link>
          <Link href="/alternatives/commento" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Commento</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
        </div>
      </footer>
    </main>
  );
}
