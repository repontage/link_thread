import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Isso — The Managed Alternative to Self-Hosted Isso (2026)',
  description: 'Tired of managing Isso on your server? VoidSay is a free, fully-managed, privacy-first commenting platform with rich media embeds, dark mode, and zero server maintenance.',
  openGraph: {
    title: 'VoidSay vs Isso — Zero Ops, Same Privacy',
    description: 'No Docker, no server maintenance, same privacy. See the full feature comparison.',
  },
};

const features = [
  { feature: 'Hosting', voidsay: '✅ Fully managed (Vercel)', isso: '⚠️ Self-hosted (Docker/VPS)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', isso: '✅ Privacy-first, self-hosted' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', isso: '⚠️ Basic Markdown only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', isso: '⚠️ CSS customization required' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', isso: '❌ Not supported' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', isso: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', isso: '❌ Not supported' },
  { feature: 'Admin Dashboard', voidsay: '✅ Built-in moderation', isso: '⚠️ Basic CLI moderation' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', isso: '❌ No built-in OAuth' },
  { feature: 'Setup Time', voidsay: '⚡ 30 seconds (embed)', isso: '🐌 30+ minutes (Docker setup)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', isso: 'N/A (self-hosted)' },
  { feature: 'Maintenance', voidsay: '✅ Zero maintenance', isso: '⚠️ Server updates, backups, SSL' },
];

const reasons = [
  { icon: '☁️', title: 'Zero Server Management', desc: 'VoidSay is fully managed. No Docker, no VPS, no SSL certificates to maintain.' },
  { icon: '🎨', title: 'Rich Media Embeds', desc: 'Auto-embed YouTube, X/Twitter, and Instagram. Isso only supports plain text.' },
  { icon: '🔒', title: 'Same Privacy, Less Work', desc: 'Same privacy-first philosophy as Isso, but without the self-hosting overhead.' },
];

const steps = [
  { step: '1', title: 'Remove Isso', desc: 'Stop your Isso Docker container and remove the embed code from your site.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our lightweight embed snippet. One line, 30 seconds.' },
  { step: '3', title: 'Done', desc: 'Your readers get a faster, richer commenting experience with zero maintenance.' },
];

const testimonials = [
  {
    text: "I loved Isso's privacy, but hated maintaining the server. VoidSay gives me the same privacy with zero ops. Best switch I've made.",
    author: '— Indie Hacker, Berlin',
  },
  {
    text: "Moved from Isso to VoidSay. The rich media embeds alone are worth it. My readers can now share YouTube clips inline.",
    author: '— Blogger, Tokyo',
  },
];

export default function IssoComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>☁️</span>
          <span>Ditching self-hosting?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay vs Isso —{' '}
          <span className="text-blue-600">Same Privacy, Zero Ops</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Isso is great for privacy purists, but someone has to maintain the server. 
          VoidSay gives you the same privacy-first commenting — fully managed, no Docker required.
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
            Why Switch from Isso to VoidSay
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
          Feature Comparison: VoidSay vs Isso
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Isso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.isso}</td>
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
            How to Switch from Isso to VoidSay
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
          Ready to Stop Managing Servers?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Get privacy-first commenting without the self-hosting headache. 30-second setup.
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
          <Link href="/alternatives/remark42" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Remark42</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">VoidSay Home</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300">𝕏 @voidsay_</a>
        </div>
      </footer>
    </main>
  );
}
