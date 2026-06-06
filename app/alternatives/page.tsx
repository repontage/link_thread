import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VoidSay Alternatives — See How We Compare',
  description: 'Looking for the best commenting platform? Compare VoidSay to Disqus, Commento, Hyvor, and more. Free, modern, privacy-first commenting for any website.',
};

const alternatives = [
  {
    slug: 'disqus',
    name: 'Disqus',
    tagline: 'The heavyweight. VoidSay is faster, private, and ad-free.',
    badge: '🔄',
  },
  {
    slug: 'commento',
    name: 'Commento',
    tagline: 'Privacy-focused but self-hosted. VoidSay is fully managed.',
    badge: '🔒',
  },
  {
    slug: 'hyvor',
    name: 'Hyvor',
    tagline: 'Feature-rich but pricey. VoidSay Pro at 1/3 the cost.',
    badge: '💰',
  },
  {
    slug: 'giscus',
    name: 'Giscus',
    tagline: 'GitHub-based comments. VoidSay opens commenting to everyone.',
    badge: '🐙',
  },
  {
    slug: 'fastcomments',
    name: 'FastComments',
    tagline: 'Solid but expensive. VoidSay Pro at $29/mo vs $49/mo.',
    badge: '⚡',
  },
  {
    slug: 'utterances',
    name: 'utterances',
    tagline: 'GitHub Issues comments. VoidSay: no GitHub required, richer features.',
    badge: '💬',
  },
  {
    slug: 'cusdis',
    name: 'Cusdis',
    tagline: 'Lightweight but self-hosted. VoidSay: managed, richer features, same privacy.',
    badge: '🪶',
  },
  {
    slug: 'intensedebate',
    name: 'IntenseDebate',
    tagline: 'Discontinued by Disqus. VoidSay is actively maintained and free.',
    badge: '🚫',
  },
  {
    slug: 'justcomments',
    name: 'JustComments',
    tagline: 'Paid-only. VoidSay is free forever with richer media embeds.',
    badge: '💸',
  },
  {
    slug: 'replybox',
    name: 'ReplyBox',
    tagline: 'Paid and basic. VoidSay is free with Markdown, embeds, and dark mode.',
    badge: '📦',
  },
  {
    slug: 'schnack',
    name: 'Schnack',
    tagline: 'Abandoned open-source. VoidSay is actively maintained and managed.',
    badge: '🛑',
  },
  {
    slug: 'commentix',
    name: 'Commentix',
    tagline: 'Self-hosted PHP. VoidSay is managed, zero-ops, with rich media.',
    badge: '🐘',
  },
  {
    slug: 'remark42',
    name: 'Remark42',
    tagline: 'Powerful but self-hosted (Docker). VoidSay: same power, zero ops.',
    badge: '🐳',
  },
  {
    slug: 'cactus',
    name: 'Cactus Comments',
    tagline: 'Matrix-based, complex setup. VoidSay: simple, free, no federation needed.',
    badge: '🌵',
  },
  {
    slug: 'muut',
    name: 'Muut',
    tagline: 'Shut down. VoidSay carries the minimalist design torch forward.',
    badge: '🪦',
  },
  {
    slug: 'discourse',
    name: 'Discourse',
    tagline: 'Great forum, overkill for blog comments. VoidSay is purpose-built.',
    badge: '🏛️',
  },
  {
    slug: 'livefyre',
    name: 'Livefyre',
    tagline: 'Discontinued by Adobe. VoidSay: enterprise features, zero enterprise cost.',
    badge: '⚠️',
  },
  {
    slug: 'facebook-comments',
    name: 'Facebook Comments',
    tagline: 'Tracks readers, requires FB. VoidSay: private, open to everyone.',
    badge: '🔒',
  },
  {
    slug: 'useresponse',
    name: 'UseResponse',
    tagline: 'Support suite, not comments. VoidSay: lightweight, purpose-built.',
    badge: '🎫',
  },
  {
    slug: 'livere',
    name: 'Livere (라이브리)',
    tagline: 'Korea\'s top comment platform. VoidSay: same simplicity, global reach.',
    badge: '🇰🇷',
  },
  {
    slug: 'isso',
    name: 'Isso',
    tagline: 'Self-hosted privacy option. VoidSay: same privacy, zero ops.',
    badge: '☁️',
  },
  {
    slug: 'talkyard',
    name: 'Talkyard',
    tagline: 'Forum + comments (complex). VoidSay: lightweight, purpose-built for comments.',
    badge: '🪶',
  },
  {
    slug: 'graphcomment',
    name: 'GraphComment',
    tagline: 'Abandoned since 2019. VoidSay: actively maintained, modern design.',
    badge: '🛑',
  },
  {
    slug: 'vuukle',
    name: 'Vuukle',
    tagline: 'Ad-heavy commenting. VoidSay: ad-free, privacy-first, 10x faster.',
    badge: '🚫',
  },
  {
    slug: 'spot-im',
    name: 'Spot.IM',
    tagline: 'Enterprise lock-in. VoidSay: free forever, self-serve, no contracts.',
    badge: '🔓',
  },
];

export default function AlternativesIndex() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          VoidSay vs the{' '}
          <span className="text-blue-600">Alternatives</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
          See how VoidSay stacks up against the most popular commenting platforms. 
          Free, modern, and built for the web of today.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternatives/${alt.slug}`}
              className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-left group"
            >
              <div className="text-2xl mb-3">{alt.badge}</div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                VoidSay vs {alt.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{alt.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">Home</Link>
          <Link href="/pro" className="hover:text-zinc-700 dark:hover:text-zinc-300">Pro</Link>
        </div>
      </footer>
    </main>
  );
}
