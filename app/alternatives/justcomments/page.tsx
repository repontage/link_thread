import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs JustComments — Free & Better Alternative (2026)',
  description: 'JustComments is paid-only. VoidSay is free forever with richer features. Compare privacy-first commenting platforms: Markdown, YouTube embeds, dark mode, and modern auth.',
  openGraph: {
    title: 'VoidSay vs JustComments — Free vs Paid: See the Difference',
    description: 'Why pay for comments? VoidSay is free forever with more features.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', justcomments: '❌ Paid only (from €5/mo)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', justcomments: '✅ Fully managed' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', justcomments: '✅ Privacy-first, GDPR compliant' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', justcomments: '⚠️ Basic Markdown only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', justcomments: '⚠️ Limited theming' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', justcomments: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', justcomments: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', justcomments: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', justcomments: '✅ Moderation dashboard' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', justcomments: '✅ Email, Google, GitHub' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', justcomments: '✅ Lightweight embed' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', justcomments: 'From €5/mo for basic, up to €29/mo' },
  { feature: 'Data Export', voidsay: '✅ Easy data export', justcomments: '✅ Data export available' },
];

const reasons = [
  { icon: '🆓', title: 'Free Forever', desc: 'JustComments charges from €5/month. VoidSay is free forever — same privacy-first philosophy, zero cost.' },
  { icon: '✨', title: 'Richer Embeds', desc: 'YouTube with timestamps, X/Twitter cards, Instagram feeds — all auto-embedded. JustComments is text-only.' },
  { icon: '🔐', title: 'Better Auth Options', desc: 'Passkeys + OAuth vs basic email. Your readers get modern, secure sign-in without passwords.' },
];

const steps = [
  { step: '1', title: 'Remove JustComments Script', desc: 'Delete the JustComments embed code from your site.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our lightweight embed snippet. One line of code.' },
  { step: '3', title: 'Cancel Your Subscription', desc: 'Stop paying for comments. VoidSay is free forever.' },
];

const testimonials = [
  {
    text: "I was paying €9/month for JustComments. Switched to VoidSay, got more features, and now pay nothing. Best decision.",
    author: '— Indie Hacker, Amsterdam',
  },
  {
    text: "JustComments was fine, but VoidSay's media embeds are a game-changer. My readers can now share YouTube links that actually render.",
    author: '— Blogger, Berlin',
  },
];

export default function JustCommentsComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
          <span>💸</span>
          <span>Stop Paying for Comments</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Free{' '}
          <span className="text-blue-600">JustComments Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          JustComments is a solid privacy-first platform — but it's paid-only. VoidSay gives you the same privacy focus,
          richer media embeds, and modern auth — completely free.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from JustComments</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs JustComments</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">JustComments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.justcomments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from JustComments to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Stop Paying for Comments?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Get richer features, better embeds, and the same privacy — completely free.</p>
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
