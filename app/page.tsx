import ThreadUI from '@/components/ThreadUI';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Global Nav Placeholder (Should be in layout usually, but for demonstration in this page) */}
      <nav className="global-nav">
        <div className="max-w-[1440px] w-full flex items-center justify-between px-lg">
          <span className="font-display font-semibold">Voidsay</span>
          <div className="flex gap-xl">
            <a href="#" className="hover:text-white/80">Search</a>
            <a href="#" className="hover:text-white/80">About</a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Light Tile */}
      <section className="product-tile-light pt-[124px]">
        <div className="max-w-[980px] px-lg">
          <h1 className="text-hero mb-xs">
            Comment on any website.
          </h1>
          <p className="text-lead text-ink-muted80 mb-xl max-w-2xl mx-auto">
            Your universal discussion board for the internet.
            Paste a link below to start or join a thread.
          </p>
          <div className="flex justify-center gap-md">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary-pill text-primary border-primary">Learn more</button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="product-tile-parchment py-section w-full flex flex-col items-center">
        <div className="w-full max-w-4xl px-lg">
          <ThreadUI />
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="w-full bg-canvas-parchment py-section border-t border-divider-soft text-center text-fine-print text-ink-muted48">
        <p>© 2026 Voidsay Project. Built with Hermes.</p>
      </footer>
    </main>
  );
}
