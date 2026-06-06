import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs GraphComment — Modern Alternative to GraphComment (2026)',
  description: 'GraphComment is outdated and abandoned. VoidSay is a free, modern commenting platform with Markdown, dark mode, rich media embeds, and active development.',
  openGraph: {
    title: 'VoidSay vs GraphComment — Active, Modern, Free',
    description: 'GraphComment hasn\'t been updated in years. VoidSay is actively maintained with modern features. See the comparison.',
  },
};

const features = [
  { feature: 'Active Development', voidsay: '✅ Actively maintained (2026)', graphcomment: '❌ Abandoned (last updated 2019)' },
  { feature: 'Free Plan', voidsay: '✅ Free forever', graphcomment: '⚠️ Free with limitations' },
  { feature: 'Privacy', voidsay: '✅ No tracking, no data selling', graphcomment: '⚠️ GDPR compliance unclear' },
  { feature: 'Markdown', voidsay: '✅ Full Markdown + GFM', graphcomment: '❌ Basic text only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', graphcomment: '❌ No dark mode' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', graphcomment: '⚠️ Link only' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', graphcomment: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', graphcomment: '❌ Not supported' },
  { feature: 'Mobile UX', voidsay: '✅ Responsive, PWA-ready', graphcomment: '⚠️ Desktop-first design' },
  { feature: 'SSO / OAuth', voidsay: '✅ Google, GitHub, Passkeys', graphcomment: '⚠️ Limited SSO options' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', graphcomment: 'Paid plans discontinued' },
  { feature: 'Support', voidsay: '✅ Active community + priority', graphcomment: '❌ No active support' },
];

const reasons = [
  { icon: '🚀', title: 'Actively Maintained', desc: 'VoidSay is under active development with new features shipped weekly. GraphComment hasn\'t been updated since 2019.' },
  { icon: '🎨', title: 'Modern Design', desc: 'Clean UI with dark mode, Markdown, emoji, and native media embeds. GraphComment looks like 2015.' },
  { icon: '🔒', title: 'Privacy by Default', desc: 'No tracking, no data selling, GDPR-compliant. Your readers\' data stays with them.' },
];

const steps = [
  { step: '1', title: 'Remove GraphComment', desc: 'Delete the GraphComment embed code from your site. Takes 30 seconds.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Copy our lightweight embed snippet. Paste it where GraphComment was.' },
  { step: '3', title: 'Enjoy', desc: 'Your readers get a modern, fast, actively maintained commenting experience.' },
];

const testimonials = [
  {
    text: "GraphComment was collecting dust. Switched to VoidSay and my readers immediately noticed the cleaner, faster experience.",
    author: '— Blogger, London',
  },
  {
    text: "Finally, a comment platform that's actually maintained. VoidSay's dark mode alone won my readers over.",
    author: '— Developer, Sydney',
  },
];

export default function GraphCommentComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span>🛑</span>
          <span>Abandoned platform?</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay vs GraphComment —{' '}
          <span className="text-blue-600">Modern & Actively Maintained</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          GraphComment was discontinued years ago and hasn&apos;t seen an update since 2019. 
          VoidSay is actively maintained with weekly feature updates, modern design, and a free forever plan.
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
            Why Switch from GraphComment to VoidSay
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
          Feature Comparison: VoidSay vs GraphComment
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">GraphComment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.graphcomment}</td>
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
            How to Switch from GraphComment to VoidSay
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
          Ready for an Actively Maintained Platform?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Join the growing community of sites that switched to a modern, maintained commenting system.
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
          <Link href="/alternatives/livefyre" className="hover:text-zinc-700 dark:hover:text-zinc-300">vs Livefyre</Link>
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">VoidSay Home</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300">𝕏 @voidsay_</a>
        </div>
      </footer>
    </main>
  );
}
