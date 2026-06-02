import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs utterances — No GitHub Required, Richer Features (2026)',
  description: 'Looking for an utterances alternative? VoidSay is a fully managed commenting platform with no GitHub dependency, rich media embeds, and a free forever plan. Compare features, setup, and user experience.',
  openGraph: {
    title: 'VoidSay vs utterances — Why a Managed Platform Wins in 2026',
    description: 'No GitHub account required. YouTube, X, Instagram embeds. Built-in analytics. Free forever. Full comparison.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', utterances: '✅ Free (GitHub Issues-based)' },
  { feature: 'Hosting', voidsay: '☁️ Fully managed (Vercel)', utterances: '☁️ GitHub Issues API' },
  { feature: 'GitHub Required', voidsay: '❌ No GitHub needed', utterances: '⚠️ Commenters need GitHub account' },
  { feature: 'Privacy', voidsay: '✅ No tracking', utterances: '✅ Open source, minimal' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', utterances: '✅ GitHub-flavored Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', utterances: '✅ Follows GitHub theme' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', utterances: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', utterances: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', utterances: '❌ Not supported' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', utterances: '⚠️ GitHub OAuth only' },
  { feature: 'Reply Notifications', voidsay: '✅ Built-in notification center', utterances: '❌ No notification system' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal + Analytics', utterances: '❌ No dashboard' },
  { feature: 'Data Ownership', voidsay: '✅ Export via API', utterances: '⚠️ Comments live in GitHub Issues' },
];

const reasons = [
  { icon: '🚪', title: 'Accessible to Everyone', desc: 'Your readers don\u2019t need a GitHub account. VoidSay supports Google, GitHub, and passkeys — lowering the commenting barrier to zero.' },
  { icon: '🔔', title: 'Real Notifications', desc: 'Utterances offers no reply notifications. VoidSay has a full notification center with email digests for comment replies and upvotes.' },
  { icon: '📊', title: 'Built-in Analytics', desc: 'Track comment engagement, page views, and trend scores. Utterances provides zero analytics or insights.' },
];

const steps = [
  { step: '1', title: 'Create VoidSay Account', desc: 'Sign up free with Google, GitHub, or passkeys. No repos to configure.' },
  { step: '2', title: 'Replace the Script', desc: 'Remove the utterances script tag. Add our embed snippet. Done in under a minute.' },
  { step: '3', title: 'Open the Doors', desc: 'Every reader can now comment — no GitHub account needed. Enjoy rich embeds and real notifications.' },
];

const testimonials = [
  {
    text: "I had utterances on my blog for years — so many readers told me they couldn't comment because they didn't use GitHub. VoidSay fixed that overnight.",
    author: '— Indie Blogger, London',
  },
  {
    text: "The notification system alone was worth the switch. I finally know when people reply to my comments.",
    author: '— Developer, Seoul',
  },
];

export default function UtterancesComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
          <span>💬</span>
          <span>Outgrowing GitHub Issues comments?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Universal{' '}
          <span className="text-blue-600">utterances Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Utterances is elegant and lightweight — but it locks your readers behind GitHub authentication. 
          VoidSay opens commenting to everyone, adds rich media embeds, real notifications, and built-in analytics.
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
            Why People Switch from utterances
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
          Feature Comparison: VoidSay vs utterances
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">utterances</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.utterances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Switch */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            How to Switch from utterances to VoidSay
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
          Open Your Comments to Everyone
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Stop turning away readers who don&apos;t use GitHub. Start your free VoidSay account today.
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
