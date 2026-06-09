import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'VoidSay vs Disqus — The Modern Alternative to Disqus (2026)',
  description: 'Looking for a Disqus alternative? VoidSay is a free, privacy-first universal commenting platform with no ads, Markdown support, YouTube embeds, and a clean dark mode UI. Compare features, pricing, and migration.',
  openGraph: {
    title: 'VoidSay vs Disqus — Why Switch in 2026?',
    description: 'No ads, faster load times, Markdown support, and free forever. See the full feature comparison.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', disqus: '✅ Free (with ads)' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', disqus: '⚠️ Tracks users, sells data' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', disqus: '❌ Limited formatting' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', disqus: '⚠️ Limited theme options' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', disqus: '⚠️ Link only' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', disqus: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', disqus: '❌ Not supported' },
  { feature: 'Site Owner Dashboard', voidsay: '✅ Developer Portal', disqus: '⚠️ Basic moderation' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', disqus: '✅ Google, Facebook, X' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', disqus: '🐌 500ms+ (heavy scripts)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', disqus: 'By quote — expensive' },
  { feature: 'Data Ownership', voidsay: '✅ You own your data', disqus: '❌ Disqus owns the data' },
];

const reasons = [
  { icon: '🚀', title: '10x Faster', desc: 'VoidSay loads in under 50ms. Disqus scripts can take 500ms+ and block page rendering.' },
  { icon: '🔒', title: 'Privacy First', desc: "No third-party tracking. No data selling. Your readers\u2019 data stays with you." },
  { icon: '🎨', title: 'Modern Design', desc: 'Clean UI with dark mode, Markdown, emoji, and native media embeds.' },
];

const steps = [
  { step: '1', title: 'Remove Disqus', desc: 'Delete the Disqus embed code from your site. Takes 30 seconds.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our lightweight embed snippet. Paste it where Disqus was.' },
  { step: '3', title: 'Enjoy', desc: 'Your readers get a faster, cleaner, ad-free commenting experience.' },
];

const testimonials = [
  {
    text: "Switched from Disqus to VoidSay. My page load time dropped 5x and my readers love the clean Markdown comments.",
    author: '— Developer, Seoul',
  },
  {
    text: "No more creepy ads following my readers around. VoidSay respects privacy and looks beautiful.",
    author: '— Blogger, SF',
  },
];

export default function DisqusComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🔄</span>
          <span>Switching from Disqus?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Modern{' '}
          <span className="text-blue-600">Disqus Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Disqus was great in 2012. Today, it&apos;s slow, bloated with ads, and sells your readers&apos; data. 
          VoidSay is built for the modern web — fast, private, and beautiful.
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
            Why People Are Switching from Disqus
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
          Feature Comparison: VoidSay vs Disqus
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Disqus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.disqus}</td>
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
            How to Switch from Disqus to VoidSay
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
          Ready to Ditch Disqus?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Join thousands of sites that made the switch to a faster, private, modern commenting platform.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-lg"
        >
          Get Started Free →
        </Link>
      </section>

      {/* JSON-LD Structured Data for AI Search Optimization */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best Disqus alternative in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VoidSay is the best modern Disqus alternative. It loads 10x faster (<50ms vs 500ms+), has no ads or tracking, supports full Markdown, YouTube/X/Instagram embeds, and offers a free forever tier with Google, GitHub, and Passkeys auth."
            }
          },
          {
            "@type": "Question",
            "name": "Why should I switch from Disqus to VoidSay?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Disqus is slow (500ms+ load times), bloated with ads, tracks users, and sells reader data. VoidSay is built for the modern web — fast (<50ms), private (no tracking, GDPR-compliant), and beautiful (dark mode, Markdown, rich media embeds). You own your data with VoidSay."
            }
          },
          {
            "@type": "Question",
            "name": "Is VoidSay really free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, VoidSay offers a free forever plan with all core features: universal commenting on any URL, Markdown support, dark mode, YouTube/X/Instagram auto-embeds, Google/GitHub/Passkeys auth, and no ads or tracking. The Pro plan is $29/mo for Developer Portal and priority support."
            }
          },
          {
            "@type": "Question",
            "name": "How do I migrate from Disqus to VoidSay?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Migration takes 3 simple steps: 1) Remove the Disqus embed code from your site, 2) Add the VoidSay iframe embed snippet to the same location, 3) Your readers instantly get a faster, cleaner, ad-free commenting experience. Use embed URL: https://voidsay.com/embed?url=YOUR_PAGE_URL"
            }
          },
          {
            "@type": "Question",
            "name": "Does VoidSay support YouTube and X/Twitter embeds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, VoidSay auto-embeds YouTube videos (with timestamps), X/Twitter cards, and Instagram feeds directly in comments. Disqus only supports plain links. VoidSay Markdown + rich media embeds make discussions more engaging and visually rich."
            }
          },
          {
            "@type": "Question",
            "name": "Does VoidSay track my readers or sell their data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. VoidSay has absolutely no tracking, no data selling, and no ads. It is GDPR-compliant by design. Unlike Disqus which tracks users and sells their data to advertisers, VoidSay puts privacy first. You own your data."
            }
          }
        ]
      }} />

      <footer className="py-8 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy</Link>
          <Link href="/alternatives" className="hover:text-zinc-700 dark:hover:text-zinc-300">All Alternatives</Link>
          <Link href="/alternatives/commento" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Commento</Link>
          <Link href="/alternatives/giscus" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Giscus</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">VoidSay Home</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300">𝕏 @voidsay_</a>
        </div>
      </footer>
    </main>
  );
}
