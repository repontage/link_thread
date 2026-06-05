import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Discourse — Lightweight Alternative to Forum Software (2026)',
  description: 'Discourse is powerful forum software, but overkill for blog comments. VoidSay is a free, lightweight commenting platform with Markdown, media embeds, and Passkeys. No server needed.',
  openGraph: {
    title: 'VoidSay vs Discourse — When You Need Comments, Not a Forum',
    description: 'Discourse is great for communities. VoidSay is better for blog comments.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever, managed', discourse: '✅ Free (self-hosted) or $100+/mo hosted' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed, zero setup', discourse: '⚠️ Self-hosted (Docker) or $100+/mo' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', discourse: '✅ Self-hosted = full privacy' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', discourse: '✅ Full Markdown + BBCode' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', discourse: '✅ Built-in dark/light' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', discourse: '✅ Onebox embeds' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', discourse: '✅ Onebox embeds' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', discourse: '⚠️ Limited' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', discourse: '✅ Full admin panel' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', discourse: '✅ Google, GitHub, Facebook, and more' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', discourse: '⚠️ Heavier (full app framework)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', discourse: '$100+/mo for hosted' },
  { feature: 'Best For', voidsay: '✅ Blog comments, article discussions', discourse: '✅ Full community forums' },
];

const reasons = [
  { icon: '🪶', title: 'Lightweight Embed', desc: 'Discourse is a full Rails app — heavy, complex, and expensive to host. VoidSay is a lightweight embed that loads in under 50ms.' },
  { icon: '💸', title: 'Free vs $100+/mo', desc: 'Discourse hosted starts at $100/month. VoidSay is free forever. For blog comments, you don\'t need a full forum.' },
  { icon: '🎯', title: 'Purpose-Built for Comments', desc: 'Discourse is amazing forum software, but blog comments don\'t need categories, badges, trust levels, or admin dashboards. VoidSay does one thing well.' },
];

const steps = [
  { step: '1', title: 'Keep Discourse for Community', desc: 'Discourse is great for forums. Keep it for community discussions. Use VoidSay for blog/article comments.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Paste our embed snippet on blog posts and articles. One line, instant setup.' },
  { step: '3', title: 'Best of Both Worlds', desc: 'Discourse for your forum, VoidSay for your content. Lightweight where it matters, powerful where you need it.' },
];

const testimonials = [
  {
    text: "We run Discourse for our community forum, but embedding it on blog posts was overkill. VoidSay handles article comments perfectly — fast, clean, free.",
    author: '— Community Manager, Austin',
  },
  {
    text: "Discourse is great but not for blog comments. VoidSay is exactly what we needed — a simple, modern comment section alongside our Discourse forum.",
    author: '— Tech Lead, Vancouver',
  },
];

export default function DiscourseComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔄</span>
          <span>Using Discourse for blog comments?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay vs Discourse:{' '}
          <span className="text-blue-600">Comments, Not Forums</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Discourse is the best forum software on the market. But for blog comments, it's overkill — heavy, expensive, and complex.
          VoidSay is a lightweight, free commenting platform purpose-built for article discussions.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why People Use VoidSay Alongside Discourse</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Discourse</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Discourse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.discourse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Use VoidSay with Discourse</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">What Users Say</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Lightweight Comments for Your Content</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Discourse for community. VoidSay for content. Free forever.</p>
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
