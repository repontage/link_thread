import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Talkyard — Lightweight Alternative to Talkyard (2026)',
  description: 'Talkyard is great for forums, but overkill for blog comments. VoidSay offers a free, lightweight, privacy-first commenting platform with rich media embeds and zero server maintenance.',
  openGraph: {
    title: 'VoidSay vs Talkyard — Lightweight, Free, No Ops',
    description: 'Forum features without the forum complexity. See the full feature comparison.',
  },
};

const features = [
  { feature: 'Purpose', voidsay: '✅ Commenting platform', talkyard: '⚠️ Forum + comments (complex)' },
  { feature: 'Hosting', voidsay: '✅ Fully managed (Vercel)', talkyard: '⚠️ Self-hosted (Docker/VPS)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', talkyard: '✅ Privacy-first, self-hosted' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', talkyard: '✅ Full Markdown' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', talkyard: '⚠️ Theme customization' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', talkyard: '⚠️ Basic embed' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', talkyard: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', talkyard: '❌ Not supported' },
  { feature: 'Setup Time', voidsay: '⚡ 30 seconds (embed)', talkyard: '🐌 20+ minutes (Docker + DB)' },
  { feature: 'Free Plan', voidsay: '✅ Free forever', talkyard: '✅ Free (open source)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', talkyard: 'N/A (self-hosted)' },
  { feature: 'Maintenance', voidsay: '✅ Zero maintenance', talkyard: '⚠️ Server + DB maintenance' },
];

const reasons = [
  { icon: '🪶', title: 'Purpose-Built for Comments', desc: 'Talkyard is a full forum platform. VoidSay is laser-focused on commenting — simpler, faster, easier.' },
  { icon: '☁️', title: 'Zero Server Management', desc: 'No Docker, no PostgreSQL, no redis. VoidSay is fully managed and scales automatically.' },
  { icon: '🎬', title: 'Rich Media Embeds', desc: 'Auto-embed YouTube (with timestamps), X/Twitter, and Instagram. Talkyard only supports basic embeds.' },
];

const steps = [
  { step: '1', title: 'Remove Talkyard', desc: 'Stop the Talkyard Docker stack and remove the embed code from your site.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our lightweight embed snippet. One line replaces your entire comment system.' },
  { step: '3', title: 'Done', desc: 'Your readers get a faster, richer commenting experience. No server to manage.' },
];

const testimonials = [
  {
    text: "Talkyard was overkill for my blog comments. VoidSay does exactly what I need — clean, fast commenting with zero maintenance.",
    author: '— Tech Blogger, Amsterdam',
  },
  {
    text: "I switched from Talkyard because I was tired of managing Docker + PostgreSQL just for blog comments. VoidSay is a breath of fresh air.",
    author: '— Developer, Toronto',
  },
];

export default function TalkyardComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🪶</span>
          <span>Too complex?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay vs Talkyard —{' '}
          <span className="text-blue-600">Lightweight & Free</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Talkyard combines forums and comments into one platform — great for communities, overkill for blogs. 
          VoidSay gives you a focused, lightweight commenting system that just works.
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
            Why Switch from Talkyard to VoidSay
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
          Feature Comparison: VoidSay vs Talkyard
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Talkyard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.talkyard}</td>
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
            How to Switch from Talkyard to VoidSay
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
          Ready for Lightweight Commenting?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Get a clean, fast commenting platform without the forum complexity. Free forever.
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
          <Link href="/alternatives/discourse" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Discourse</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">VoidSay Home</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300">𝕏 @voidsay_</a>
        </div>
      </footer>
    </main>
  );
}
