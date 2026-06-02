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
