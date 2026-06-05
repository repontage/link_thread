import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs ReplyBox — Free Alternative with More Features (2026)',
  description: 'ReplyBox is paid-only and basic. VoidSay is free forever with Markdown, YouTube/X embeds, dark mode, and Passkeys. Compare features, pricing, and switch in 3 steps.',
  openGraph: {
    title: 'VoidSay vs ReplyBox — Free vs Paid Commenting',
    description: 'Why pay $6/mo for basic comments? VoidSay is free with more features.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', replybox: '❌ Paid only (from $6/mo)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', replybox: '✅ Fully managed' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', replybox: '✅ Privacy-first, no ads' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', replybox: '⚠️ Basic formatting only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', replybox: '⚠️ Custom CSS needed' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', replybox: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', replybox: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', replybox: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', replybox: '✅ Basic dashboard' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', replybox: '⚠️ Email only' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', replybox: '✅ Lightweight embed' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', replybox: '$6–$24/mo based on pageviews' },
];

const reasons = [
  { icon: '🆓', title: 'Free Forever', desc: 'ReplyBox charges from $6/month. VoidSay delivers more features — media embeds, dark mode, Passkeys — at zero cost.' },
  { icon: '🎬', title: 'Media-Rich Comments', desc: 'Auto-embed YouTube, X/Twitter, and Instagram. ReplyBox is text-only. Your readers deserve better.' },
  { icon: '🔐', title: 'Modern Authentication', desc: 'Passkeys, Google, GitHub OAuth. ReplyBox only supports email login. More options = more comments.' },
];

const steps = [
  { step: '1', title: 'Remove ReplyBox Script', desc: 'Delete the ReplyBox embed code from your site.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our embed snippet. One line replaces ReplyBox.' },
  { step: '3', title: 'Cancel ReplyBox', desc: 'Stop the $6–$24/month subscription. VoidSay is free.' },
];

const testimonials = [
  {
    text: "ReplyBox was fine for basic commenting, but I needed media embeds. VoidSay does everything ReplyBox does — plus YouTube/X embeds — for free.",
    author: '— Developer, Toronto',
  },
  {
    text: "Switched from ReplyBox to VoidSay. Saved $12/month and my readers love the dark mode and Markdown support.",
    author: '— Blogger, Portland',
  },
];

export default function ReplyBoxComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
          <span>💸</span>
          <span>Save $6–$24/month</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Free{' '}
          <span className="text-blue-600">ReplyBox Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          ReplyBox is simple and private, but it's paid-only and lacks rich features. VoidSay gives you more — media embeds,
          Markdown, dark mode, Passkeys — all free forever.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from ReplyBox</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs ReplyBox</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">ReplyBox</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.replybox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from ReplyBox to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Switch from ReplyBox?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">More features, better embeds, zero cost. Your readers will thank you.</p>
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
