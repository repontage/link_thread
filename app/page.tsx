'use client';

import Link from 'next/link';
import ThreadUI from '@/components/ThreadUI';
import UserNav from '@/components/UserNav';
import ProductHeroVisual from '@/components/ProductHeroVisual';
import { useRef } from 'react';

import CuratedPicks from '@/components/CuratedPicks';
import PersonalizedFeed from '@/components/PersonalizedFeed';

export default function Home() {
  const discussionRef = useRef<HTMLDivElement>(null);

  const scrollToDiscussion = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    discussionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Global Nav */}
      <nav className="global-nav">
        <div className="max-w-[1440px] w-full flex items-center justify-between px-sm md:px-lg">
          <div className="flex items-center gap-sm md:gap-xl">
            <span className="font-display font-semibold text-[14px] tracking-tight">Voidsay</span>
            <div className="hidden md:flex gap-xl">
              <button 
                type="button"
                onClick={scrollToDiscussion} 
                className="text-white/80 hover:text-white transition-colors text-nav-link"
              >
                Search
              </button>
              <a 
                href="#about" 
                className="text-white/80 hover:text-white transition-colors text-nav-link"
              >
                About
              </a>
            </div>
          </div>
          <UserNav />
        </div>
      </nav>

      {/* Hero Section - Light Tile */}
      <section className="product-tile-light pt-[140px] pb-section min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-[980px] px-lg mx-auto">
          <h1 className="text-hero mb-md">
            Comment on any website.
          </h1>
          <p className="text-lead text-ink-muted48 mb-xxl max-w-2xl mx-auto">
            Your universal discussion board for the internet.
            Paste a link below to start or join a thread.
          </p>
          <div className="flex justify-center gap-lg">
            <button 
              type="button"
              onClick={scrollToDiscussion} 
              className="btn-primary"
            >
              Get Started
            </button>
            <a href="#about" className="btn-secondary-pill">Learn more</a>
          </div>
        </div>
        
        {/* Decorative Product Placeholder */}
        <div className="mt-section w-full max-w-5xl px-lg mx-auto">
          <ProductHeroVisual onCommentClick={scrollToDiscussion} />
        </div>
      </section>

      {/* Discussion Area */}
      <section id="discussion" ref={discussionRef} className="product-tile-parchment py-section w-full min-h-screen">
        <div className="w-full max-w-2xl px-lg mx-auto">
          <div className="text-center mb-section">
             <h2 className="text-display-lg mb-xs">Join the Thread</h2>
             <p className="text-lead text-ink-muted48">Any URL, any video, any time.</p>
          </div>
          <ThreadUI />
        </div>
      </section>

      {/* Curated Picks */}
      <CuratedPicks />

      {/* Personalized Feed */}
      <PersonalizedFeed />

      {/* About Section */}
      <section id="about" className="product-tile-dark py-section w-full">
        <div className="max-w-[980px] px-lg mx-auto">
          <h2 className="text-display-lg mb-xl text-white">The Museum of Conversations</h2>
          <div className="grid md:grid-cols-2 gap-xxl text-left">
            <div>
              <h3 className="text-tagline mb-sm text-white">Universal</h3>
              <p className="text-body text-body-muted">Comment on YouTube videos, X (Twitter) threads, or any article. Voidsay brings the discussion to you.</p>
            </div>
            <div>
              <h3 className="text-tagline mb-sm text-white">Real-time</h3>
              <p className="text-body text-body-muted">Built with SSE technology, see new comments as they happen without refreshing the page.</p>
            </div>
            <div>
              <h3 className="text-tagline mb-sm text-white">Clean</h3>
              <p className="text-body text-body-muted">No distractions. Just a photography-first interface designed to let the product speak.</p>
            </div>
            <div>
              <h3 className="text-tagline mb-sm text-white">Ad-ready</h3>
              <p className="text-body text-body-muted">Designed with premium placement in mind. High-quality advertising integration coming soon.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 mt-16">
        <div className="max-w-[980px] mx-auto px-lg flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/50">
          <span>&copy; {new Date().getFullYear()} VoidSay</span>
          <Link href="/terms" className="hover:text-white/80 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-white/80 transition-colors">Refund Policy</Link>
          <a href="https://x.com/voidsay_" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">𝕏 @voidsay_</a>
        </div>
      </footer>

    </main>
  );
}
