import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Facebook Comments — Privacy-First Alternative (2026)',
  description: 'Facebook Comments tracks your readers and requires Facebook accounts. VoidSay is free, privacy-first, with Markdown, YouTube/X embeds, and Passkeys. No Facebook required.',
  openGraph: {
    title: 'VoidSay vs Facebook Comments — Privacy Without the Tradeoff',
    description: 'Your readers deserve comments without Facebook tracking them.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', facebook: '✅ Free' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', facebook: '✅ Facebook-hosted' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', facebook: '❌ Tracks readers, builds ad profiles' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', facebook: '❌ Plain text + emoji only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', facebook: '⚠️ Inherits Facebook theme' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', facebook: '⚠️ Basic link previews' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', facebook: '⚠️ Basic link previews' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', facebook: '✅ Instagram native' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', facebook: '⚠️ Facebook Moderation Tool' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', facebook: '❌ Facebook account required' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', facebook: '⚠️ Heavy (Facebook SDK + tracking)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', facebook: 'N/A' },
  { feature: 'Data Ownership', voidsay: '✅ You own your comment data', facebook: '❌ Facebook owns the data' },
];

const reasons = [
  { icon: '🔒', title: 'Reader Privacy', desc: 'Facebook Comments tracks every reader to build ad profiles. VoidSay never tracks, never sells data. Your readers\' privacy is respected.' },
  { icon: '🚪', title: 'No Facebook Required', desc: '40%+ of web users don\'t have or won\'t use Facebook accounts. VoidSay accepts Google, GitHub, and Passkeys — everyone can comment.' },
  { icon: '📝', title: 'Rich Formatting', desc: 'Full Markdown with code blocks, tables, and GFM. Facebook Comments is plain text. Your technical audience will appreciate the difference.' },
];

const steps = [
  { step: '1', title: 'Remove Facebook SDK', desc: 'Delete the Facebook Comments Plugin and FB SDK from your site. Faster page loads instantly.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Paste our lightweight embed. One line, no SDK, no tracking scripts.' },
  { step: '3', title: 'Welcome All Readers Back', desc: 'Now anyone can comment — not just Facebook users. Your engagement will increase.' },
];

const testimonials = [
  {
    text: "Switching from Facebook Comments to VoidSay doubled our comment engagement. Half our readers didn't have Facebook accounts. Now everyone can participate.",
    author: '— News Publisher, Toronto',
  },
  {
    text: "I removed Facebook Comments for privacy reasons. VoidSay gave me a better comment section without the ethical compromise of tracking my readers.",
    author: '— Blogger and Privacy Advocate, Amsterdam',
  },
];

export default function FacebookCommentsComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
          <span>🔒</span>
          <span>Stop tracking your readers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Privacy-First{' '}
          <span className="text-blue-600">Facebook Comments Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Facebook Comments is convenient — but it tracks your readers, requires Facebook accounts, and gives Facebook ownership of your comment data.
          VoidSay is free, private, and works with accounts your readers already have.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from Facebook Comments</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Facebook Comments</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Facebook Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.facebook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Facebook Comments to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Respect Your Readers' Privacy?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">No Facebook required. No tracking. Just great comments. Free forever.</p>
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
