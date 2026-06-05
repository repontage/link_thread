import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Commentix — Managed vs Self-Hosted (2026)',
  description: 'Commentix is a self-hosted open-source solution. VoidSay is free, fully managed, with Markdown, YouTube/X embeds, dark mode. No server maintenance required.',
  openGraph: {
    title: 'VoidSay vs Commentix — Ditch the Server, Keep the Comments',
    description: 'Managed vs self-hosted. See why people are switching.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever, managed', commentix: '✅ Free (self-hosted)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', commentix: '❌ Self-hosted (PHP + DB)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', commentix: '✅ Self-hosted, full privacy' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', commentix: '⚠️ Basic formatting' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', commentix: '⚠️ CSS customization needed' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', commentix: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', commentix: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', commentix: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', commentix: '⚠️ Basic admin panel' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', commentix: '⚠️ Basic logins' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', commentix: '✅ Fast (PHP-based)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', commentix: 'N/A (open source)' },
];

const reasons = [
  { icon: '☁️', title: 'No Server to Maintain', desc: 'Commentix requires PHP hosting, database setup, and ongoing maintenance. VoidSay is zero-ops — we handle infrastructure.' },
  { icon: '✨', title: 'Richer Experience', desc: 'Auto-embed YouTube, X/Twitter, Instagram. Full Markdown + dark mode. Commentix is text-only with basic formatting.' },
  { icon: '🔐', title: 'Modern Auth', desc: 'Passkeys, Google, and GitHub OAuth out of the box. Commentix requires plugins and configuration for auth options.' },
];

const steps = [
  { step: '1', title: 'Remove Commentix', desc: 'Delete the Commentix embed code and shut down your PHP server.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our one-line embed snippet. Paste it anywhere.' },
  { step: '3', title: 'Enjoy Zero-Ops Comments', desc: 'No PHP, no database, no updates. Just comments that work.' },
];

const testimonials = [
  {
    text: "I ran Commentix on a VPS for years. VoidSay freed me from PHP updates, database backups, and server monitoring. Best switch ever.",
    author: '— Webmaster, Paris',
  },
  {
    text: "Commentix was reliable but basic. VoidSay's media embeds and dark mode made my readers actually want to comment again.",
    author: '— Tech Blogger, Singapore',
  },
];

export default function CommentixComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔄</span>
          <span>Tired of managing PHP servers?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Managed{' '}
          <span className="text-blue-600">Commentix Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Commentix is a solid open-source commenting system, but self-hosting means PHP servers, database maintenance, and no media embeds.
          VoidSay is free, fully managed, and packed with modern features.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from Commentix</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Commentix</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Commentix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.commentix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Commentix to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Ditch the Server?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Zero PHP, zero database maintenance, zero updates. Just modern comments that work.</p>
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
