import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs FastComments — More Value, Better Features (2026)',
  description: 'Looking for a FastComments alternative? VoidSay delivers richer media embeds, a truly free forever plan, and Pro at $29/mo vs FastComments at $49/mo. Compare features, pricing, and embed experience.',
  openGraph: {
    title: 'VoidSay vs FastComments — Why VoidSay is the Better Value in 2026',
    description: 'YouTube embeds, Instagram feeds, X/Twitter cards — all included. Free forever plan with no limits. Pro at $29/mo.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever, no limits', fastcomments: '⚠️ 30-day trial / limited' },
  { feature: 'Pricing (Paid)', voidsay: '$29/mo Pro', fastcomments: '$49/mo Basic, $99/mo Pro' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', fastcomments: '⚠️ Analytics included' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', fastcomments: '✅ Full Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', fastcomments: '✅ Built-in themes' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', fastcomments: '⚠️ Link only' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', fastcomments: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', fastcomments: '❌ Not supported' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', fastcomments: '✅ SSO + social login' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal + Analytics', fastcomments: '✅ Moderation tools' },
  { feature: 'Hosting', voidsay: '☁️ Fully managed (Vercel)', fastcomments: '☁️ Fully managed' },
  { feature: 'Setup Time', voidsay: '⚡ 30 seconds (embed)', fastcomments: '⚡ Quick setup' },
  { feature: 'Data Ownership', voidsay: '✅ Export via API', fastcomments: '✅ Data export available' },
];

const reasons = [
  { icon: '💰', title: '2x Better Value', desc: 'VoidSay Pro is $29/mo vs FastComments at $49/mo. And our free plan has no time limits or comment caps.' },
  { icon: '🎬', title: 'Rich Media First', desc: 'YouTube timestamps, X/Twitter cards, Instagram feeds — all auto-embedded. FastComments shows plain URLs.' },
  { icon: '🌏', title: 'Global Performance', desc: 'Turso distributed database + Vercel edge network. Comments load in <50ms worldwide.' },
];

const steps = [
  { step: '1', title: 'Sign Up Free', desc: 'Create a VoidSay account. No credit card. No time limit.' },
  { step: '2', title: 'Add the Embed', desc: 'One line of code. Paste it where FastComments was. Takes 30 seconds.' },
  { step: '3', title: 'Save Money', desc: 'Same features at half the price. Your readers get richer embeds too.' },
];

const testimonials = [
  {
    text: "Moved from FastComments. Saving $20/mo and my readers love the YouTube timestamp feature. Win-win.",
    author: '— Content Creator, NYC',
  },
  {
    text: "VoidSay's free plan is genuinely free — no comment limits, no trial expiration. My small blog finally has proper comments.",
    author: '— Blogger, Seoul',
  },
];

export default function FastCommentsComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
          <span>💸</span>
          <span>Overpaying for comments?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Better-Value{' '}
          <span className="text-blue-600">FastComments Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          FastComments is solid — but at $49+/mo and no rich media embeds, you&apos;re paying more for less. 
          VoidSay gives you more features at $29/mo, with a truly free forever plan.
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
            Why People Switch from FastComments
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
          Feature Comparison: VoidSay vs FastComments
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">FastComments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.fastcomments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Switch */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-blue-50 dark:from-amber-950/30 dark:to-blue-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            How to Switch from FastComments to VoidSay
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
          Get More for Less
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Better features, half the price. Start with our free forever plan today.
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
        </div>
      </footer>
    </main>
  );
}
