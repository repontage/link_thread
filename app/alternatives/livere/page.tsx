import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay vs Livere (라이브리) — Global Alternative to Korea\'s Top Comment Platform (2026)',
  description: 'Livere is Korea\'s #1 commenting platform. VoidSay offers richer YouTube/X/Instagram embeds, Passkey auth, and global reach — free forever.',
  openGraph: {
    title: 'VoidSay vs Livere — Global Reach, Richer Embeds, Same Free Price',
    description: 'All the community features of Livere, with global audience reach and modern embed support.',
  },
};

const features = [
  { feature: 'Free Plan', voidsay: '✅ Free forever', livere: '✅ Free (ad-supported)' },
  { feature: 'Managed Hosting', voidsay: '✅ Fully managed', livere: '✅ Fully managed' },
  { feature: 'YouTube Embed', voidsay: '✅ Auto-embed + timestamp', livere: '⚠️ Limited support' },
  { feature: 'X/Twitter Embed', voidsay: '✅ Auto-embed cards', livere: '❌ Not supported' },
  { feature: 'Instagram Embed', voidsay: '✅ Auto-embed feed', livere: '❌ Not supported' },
  { feature: 'Markdown', voidsay: '✅ Full GFM Markdown', livere: '⚠️ Basic formatting only' },
  { feature: 'Dark Mode', voidsay: '✅ Built-in dark/light', livere: '⚠️ Limited theme support' },
  { feature: 'Auth Methods', voidsay: '✅ Google, GitHub, Passkeys', livere: '✅ Kakao, Naver, Facebook, Twitter' },
  { feature: 'Global Reach', voidsay: '✅ Global CDN, i18n ready', livere: '⚠️ Korea-focused, slower abroad' },
  { feature: 'No Ads', voidsay: '✅ No ads (Pro: no sponsor UI)', livere: '❌ Ad-supported free tier' },
  { feature: 'Page Speed', voidsay: '⚡ < 50ms load', livere: '⚠️ ~200ms (Korea CDN)' },
  { feature: 'Pro Plan', voidsay: '$29/mo — Pro badge, priority', livere: 'N/A (ad-based model)' },
  { feature: 'Browser Extension', voidsay: '✅ Official extension', livere: '❌ Not available' },
];

const reasons = [
  { icon: '🌏', title: 'Global Audience', desc: 'Livere is optimized for Korean users with Kakao/Naver auth. VoidSay reaches a global audience with Google, GitHub, and Passkey sign-in.' },
  { icon: '✨', title: 'Richer Embeds', desc: 'Auto-embed YouTube with timestamps, X/Twitter cards, Instagram feeds. Livere has basic embed support — VoidSay makes every link come alive.' },
  { icon: '🚫', title: 'No Ads', desc: 'Livere\'s free tier is ad-supported. VoidSay is completely ad-free, forever. Pro users get Sponsor UI removed entirely.' },
];

const steps = [
  { step: '1', title: 'Export from Livere', desc: 'Export your existing comments from the Livere dashboard.' },
  { step: '2', title: 'Add VoidSay Embed', desc: 'Replace the Livere embed code with our single-line snippet.' },
  { step: '3', title: 'Go Global', desc: 'Your Korean and international readers can now comment side by side.' },
];

const testimonials = [
  {
    text: "Livere worked well for my Korean blog, but my international readers couldn't sign in. VoidSay lets everyone participate with Google or GitHub.",
    author: '— Tech Blogger, Seoul',
  },
  {
    text: "I liked Livere's simplicity, but the ads were getting aggressive. VoidSay is cleaner, faster, and doesn't sell my reader data.",
    author: '— Developer, Busan',
  },
];

export default function LivereComparisonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
          <span>🇰🇷</span>
          <span>한국 개발자가 만든 글로벌 댓글 플랫폼</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay is the Global{' '}
          <span className="text-blue-600">Livere (라이브리) Alternative</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Livere is Korea's most popular commenting platform — loved for its simplicity and Kakao/Naver integration. 
          But it's ad-supported and Korea-optimized. VoidSay delivers a cleaner, global experience with richer embeds 
          and Passkey auth, built by a solo developer in Seoul.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">Try VoidSay Free →</Link>
          <a href="#comparison" className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">See Comparison ↓</a>
        </div>
      </section>

      <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Why Korean Developers Are Switching from Livere</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Feature Comparison: VoidSay vs Livere</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Feature</th>
                <th className="text-left p-4 font-semibold text-blue-600">VoidSay ✅</th>
                <th className="text-left p-4 font-semibold text-zinc-500">Livere</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {features.map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">{row.feature}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{row.voidsay}</td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.livere}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">How to Switch from Livere to VoidSay</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">What Korean Developers Say</h2>
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Ready to Go Global?</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Same simplicity as Livere, with global reach and zero ads. Free forever.</p>
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
