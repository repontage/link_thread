import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Muut — The Modern Alternative to Muut (2026)',
  description: 'Muut was a beautiful forum-comment hybrid but it shut down. VoidSay is free, actively maintained, with Markdown, YouTube/X embeds, dark mode, and modern auth.',
  openGraph: {
    title: 'VoidSay vs Muut — Replace the Shutdown Service',
    description: 'Muut is gone. VoidSay carries the minimalist torch forward.',
  },
};

const features = [
  { feature: 'Status', voidsay: '✅ Actively maintained (2026)', muut: '❌ Shut down / discontinued' },
  { feature: 'Free Plan', voidsay: '✅ Free forever', muut: '❌ Service unavailable' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', muut: '❌ Service offline' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', muut: '⚠️ Unknown (defunct)' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', muut: '⚠️ Basic formatting' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', muut: '❌ No dark mode' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', muut: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', muut: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', muut: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', muut: '❌ Dashboard unavailable' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', muut: '⚠️ Had basic auth' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', muut: '❌ Service offline' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', muut: 'N/A (discontinued)' },
];

const reasons = [
  { icon: '🚀', title: 'Alive & Maintained', desc: 'Muut shut down leaving users stranded. VoidSay is actively developed in 2026 — your comments have a future here.' },
  { icon: '🎨', title: 'Beautiful, Minimal UI', desc: 'Muut was loved for its clean design. VoidSay carries that minimalist philosophy with dark mode and modern aesthetics.' },
  { icon: '🆓', title: 'Free Forever', desc: 'Muut charged for premium features. VoidSay is completely free with a Pro plan for power users only.' },
];

const steps = [
  { step: '1', title: 'Remove Muut Code', desc: 'Delete the old Muut embed from your site.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Paste our embed snippet. One line, instant setup.' },
  { step: '3', title: 'Welcome Back Your Readers', desc: 'Muut users will appreciate VoidSay\'s familiar clean design with modern features.' },
];

const testimonials = [
  {
    text: "I loved Muut's minimalist design. When it shut down I was lost. VoidSay has that same clean aesthetic but with modern features Muut never had.",
    author: '— Designer, Copenhagen',
  },
  {
    text: "Muut was my favorite commenting system. VoidSay is the first service since Muut that feels as thoughtfully designed.",
    author: '— Publisher, Sydney',
  },
];

export default function MuutComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
          <span>⚠️</span>
          <span>Muut shut down. Need a replacement?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Modern{' '}
          <span className="text-blue-600">Muut Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Muut was a beautiful, minimalist commenting system — but it shut down. VoidSay carries the same clean-design philosophy
          forward with modern features Muut never had: media embeds, dark mode, Passkeys, and active maintenance.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from Muut</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Muut</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Muut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.muut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Muut to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready for a Muut Replacement?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Beautiful, minimal, and actively maintained. Free forever.</p>
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
