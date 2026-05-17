'use client';

import ThreadUI from '@/components/ThreadUI';
import UserNav from '@/components/UserNav';
import { useRef, useEffect } from 'react';

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
        <div className="max-w-[1440px] w-full flex items-center justify-between px-lg">
          <div className="flex items-center gap-xl">
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
           <div className="aspect-[21/9] bg-canvas-parchment rounded-lg border border-divider-soft overflow-hidden product-shadow flex items-center justify-center text-ink-muted48 italic">
              [ Product Hero Visual Placeholder ]
           </div>
        </div>
      </section>

      {/* Discussion Area */}
      <section id="discussion" ref={discussionRef} className="product-tile-parchment py-section w-full min-h-screen">
        <div className="w-full max-w-4xl px-lg mx-auto">
          <div className="text-center mb-section">
             <h2 className="text-display-lg mb-xs">Join the Thread</h2>
             <p className="text-lead text-ink-muted48">Any URL, any video, any time.</p>
          </div>
          <ThreadUI />
        </div>
      </section>

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
      <footer className="w-full bg-canvas-parchment py-section border-t border-divider-soft">
        <div className="max-w-[1440px] px-lg mx-auto">
          <div className="flex flex-col gap-sm">
            <span className="text-body-strong">Voidsay</span>
            <p className="text-fine-print text-ink-muted48">Universal Discussion Platform</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
