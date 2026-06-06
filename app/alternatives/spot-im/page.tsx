import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Spot.IM — The Free, Open Alternative to Spot.IM (2026)',
  description: 'Spot.IM is expensive and closed. VoidSay is a free, privacy-first commenting platform with rich media embeds, dark mode, and no enterprise lock-in.',
  openGraph: {
    title: 'VoidSay vs Spot.IM — Free, Open, No Lock-In',
    description: 'Spot.IM targets large publishers with enterprise pricing. VoidSay is free forever for everyone. See the comparison.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever, full features', spotim: '❌ No free plan (enterprise only)' },
  { feature: 'Pricing', voidsay: '$29/mo Pro (optional)', spotim: '$$$$ Enterprise pricing (quote-based)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', spotim: '⚠️ Data monetization model' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', spotim: '⚠️ Rich text (proprietary)' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', spotim: '⚠️ Publisher-customizable' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', spotim: '⚠️ Basic embed' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', spotim: '⚠️ Basic embed' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', spotim: '❌ Not supported' },
  { feature: 'Embed Widget', voidsay: '✅ Universal embed (any site)', spotim: '⚠️ Publisher-only integration' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', spotim: '⚠️ Enterprise SSO only' },
  { feature: 'Data Portability', voidsay: '✅ Export your data anytime', spotim: '❌ Proprietary data lock-in' },
  { feature: 'Self-Serve Setup', voidsay: '⚡ 30 seconds (embed)', spotim: '🐌 Requires sales call + contract' },
];

const reasons = [
  { icon: '🔓', title: 'No Enterprise Lock-In', desc: 'Spot.IM requires a sales call, contract, and enterprise budget. VoidSay is free, self-serve, and takes 30 seconds to set up.' },
  { icon: '💰', title: 'Free Forever', desc: 'Spot.IM charges enterprise rates. VoidSay offers all core features free forever. Pro is just $29/mo.' },
  { icon: '🌍', title: 'Universal Comments', desc: 'VoidSay works on any URL — blog posts, YouTube, X threads. Spot.IM is publisher-site only.' },
];

const steps = [
  { step: '1', title: 'Remove Spot.IM', desc: 'Remove the Spot.IM integration from your site. Cancel your enterprise contract.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Paste our lightweight embed snippet. No sales call, no contract, no waiting.' },
  { step: '3', title: 'Enjoy', desc: 'Your readers get a fast, modern commenting experience. You keep the savings.' },
];

const testimonials = [
  {
    text: "Spot.IM wanted $2,000/month for our small publication. VoidSay gave us everything we needed — for free. The embed was live in 30 seconds.",
    author: '— Publisher, Nairobi',
  },
  {
    text: "The enterprise lock-in with Spot.IM was real. VoidSay let us own our data and save thousands. Best switch we ever made.",
    author: '— Media Startup, Austin',
  },
];

export default function SpotimComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔓</span>
          <span>Enterprise lock-in?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay vs Spot.IM —{' '}
          <span className="text-blue-600">Free, Open, No Lock-In</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Spot.IM is built for large publishers with enterprise budgets. 
          VoidSay gives every site — big or small — a free, powerful commenting platform without contracts, sales calls, or data lock-in.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
          >
            Try VoidSay Free →
          </Link>
          <a
            href="#comparison"
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            See Comparison ↓
          </a>
        </div>
      </section>

      {/* Why Switch */}
      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
            Why Switch from Spot.IM to VoidSay
          </h2>
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

      {/* Feature Comparison Table */}
      <section id="comparison" className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
          Feature Comparison: VoidSay vs Spot.IM
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Spot.IM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.spotim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Switch */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            How to Switch from Spot.IM to VoidSay
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
            {steps.map((item) => (
              <div key={item.step} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  {item.step}
                </div>
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

      {/* Testimonials */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
          What Switchers Say
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.text} className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700">
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Ready to Break Free from Enterprise Lock-In?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Get a powerful commenting platform without the contracts, sales calls, or enterprise pricing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-lg"
        >
          Get Started Free →
        </Link>
      </section>

      <footer className="py-8 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy</Link>
          <Link href="/alternatives" className="hover:text-zinc-700 dark:hover:text-zinc-300">All Alternatives</Link>
          <Link href="/alternatives/disqus" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Disqus</Link>
          <Link href="/alternatives/justcomments" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs JustComments</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">VoidSay Home</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300">𝕏 @voidsay_</a>
        </div>
      </footer>
    </main>
  );
}
