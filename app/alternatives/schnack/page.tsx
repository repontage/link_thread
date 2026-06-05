import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Schnack — The Modern, Managed Alternative (2026)',
  description: 'Schnack is open-source but abandoned. VoidSay is a free, actively maintained, privacy-first commenting platform. No self-hosting needed. Compare features and switch.',
  openGraph: {
    title: 'VoidSay vs Schnack — From Self-Hosted to Fully Managed',
    description: 'Schnack development stopped. VoidSay is actively maintained and free.',
  },
};

const features = [
  { feature: 'Status', voidsay: '✅ Actively maintained (2026)', schnack: '❌ Abandoned (last update 2022)' },
  { feature: 'Free Plan', voidsay: '✅ Free forever, managed', schnack: '✅ Free (self-hosted)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', schnack: '❌ Self-hosted only (Node.js + DB)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', schnack: '✅ Privacy-first, no tracking' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', schnack: '⚠️ Basic Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', schnack: '⚠️ Basic theming' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', schnack: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', schnack: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', schnack: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', schnack: '⚠️ Basic moderation UI' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', schnack: '✅ GitHub, Twitter, Google OAuth' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', schnack: '✅ Lightweight' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', schnack: 'N/A (open source)' },
];

const reasons = [
  { icon: '🚀', title: 'Actively Maintained', desc: 'Schnack development stopped in 2022. VoidSay is actively developed with weekly updates, security patches, and new features.' },
  { icon: '☁️', title: 'No Server Management', desc: 'Schnack requires Node.js, a database, and ongoing maintenance. VoidSay handles everything — zero DevOps required.' },
  { icon: '✨', title: 'Modern Experience', desc: 'Rich media embeds, dark mode, Passkeys. Schnack is basic and unmaintained. Your readers notice the difference.' },
];

const steps = [
  { step: '1', title: 'Remove Schnack Script', desc: 'Delete the Schnack embed code and shut down your Schnack server.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our embed snippet. One line, no server needed.' },
  { step: '3', title: 'Enjoy Modern Comments', desc: 'Your site now has rich embeds, dark mode, and an actively maintained platform.' },
];

const testimonials = [
  {
    text: "I self-hosted Schnack for years until it stopped getting updates. VoidSay gave me back my weekends — no server maintenance, just great comments.",
    author: '— Developer, Munich',
  },
  {
    text: "Schnack was great when it was maintained. VoidSay feels like what Schnack could have been — modern, managed, and free.",
    author: '— Blogger, Seattle',
  },
];

export default function SchnackComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔄</span>
          <span>Migrating from Schnack?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Modern{' '}
          <span className="text-blue-600">Schnack Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Schnack was a great open-source commenting system — but development stopped in 2022. VoidSay carries the same
          privacy-first torch with a fully managed, modern experience that's free forever.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Are Switching from Schnack</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Schnack</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Schnack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.schnack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Schnack to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Move On from Schnack?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Get an actively maintained, fully managed commenting platform — free forever.</p>
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
