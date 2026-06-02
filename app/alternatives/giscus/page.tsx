import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Giscus — Managed Alternative to GitHub-Based Comments (2026)',
  description: 'Looking for a Giscus alternative? VoidSay is a fully managed universal commenting platform with no GitHub dependency, rich media embeds, and a generous free plan. Compare features, host requirements, and embed experience.',
  openGraph: {
    title: 'VoidSay vs Giscus — Why Choose a Managed Platform in 2026?',
    description: 'No GitHub account required for your readers. YouTube, X, Instagram embeds. Free forever plan. See the full feature comparison.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', giscus: '✅ Free (GitHub required)' },
  { feature: 'Hosting', voidsay: '☁️ Fully managed (Vercel)', giscus: '☁️ GitHub Discussions API' },
  { feature: 'GitHub Required', voidsay: '❌ No GitHub needed', giscus: '⚠️ Readers need GitHub account' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', giscus: '✅ Open source, privacy-first' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', giscus: '✅ Full Markdown + GFM' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', giscus: '✅ Follows GitHub theme' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', giscus: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', giscus: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', giscus: '❌ Not supported' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', giscus: '⚠️ GitHub only' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal + Analytics', giscus: '⚠️ GitHub Discussions UI' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', giscus: 'N/A (free only)' },
  { feature: 'Data Ownership', voidsay: '✅ Export via API', giscus: '⚠️ Tied to GitHub repos' },
];

const reasons = [
  { icon: '🚪', title: 'No GitHub Required', desc: 'Your readers don\u2019t need a GitHub account. VoidSay works with Google, GitHub, or passkeys — lowering the barrier for 95% of web users.' },
  { icon: '🎬', title: 'Rich Media Embeds', desc: 'YouTube with timestamps, X/Twitter cards, Instagram feeds. Giscus is text-only with link previews.' },
  { icon: '📊', title: 'Analytics Built-in', desc: 'Page-level analytics, engagement scores, and trend predictions. Giscus offers zero built-in analytics.' },
];

const steps = [
  { step: '1', title: 'Sign Up on VoidSay', desc: 'Create a free account with Google, GitHub, or a passkey. No GitHub repos to configure.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our lightweight embed snippet. Paste it into your site. 30 seconds.' },
  { step: '3', title: 'Welcome Everyone', desc: 'Your readers can comment immediately — no GitHub account required.' },
];

const testimonials = [
  {
    text: "I loved Giscus for my dev blog but 70% of my readers don't have GitHub accounts. VoidSay opened commenting to everyone.",
    author: '— Tech Blogger, Berlin',
  },
  {
    text: "Switched from Giscus. The YouTube embed alone was worth it — now my readers comment on video timestamps.",
    author: '— Indie Hacker, Tokyo',
  },
];

export default function GiscusComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
          <span>🐙</span>
          <span>Moving beyond GitHub-only comments?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Managed{' '}
          <span className="text-blue-600">Giscus Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Giscus is brilliant for developer-centric sites — but it requires every commenter to have a GitHub account. 
          VoidSay opens your comments to everyone, with rich media embeds, built-in analytics, and zero GitHub dependency.
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
            Why People Switch from Giscus
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
          Feature Comparison: VoidSay vs Giscus
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Giscus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.giscus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Switch */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            How to Switch from Giscus to VoidSay
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
          Ready to Open Your Comments to Everyone?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Join sites that moved beyond GitHub-only comments. Free, fast, and beautiful.
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
