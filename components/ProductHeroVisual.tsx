'use client';

import React, { useState, useEffect } from 'react';

interface MockComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

interface MockTab {
  id: string;
  name: string;
  url: string;
  contentType: 'article' | 'video' | 'gallery' | 'custom';
  title: string;
  meta: string;
  comments: MockComment[];
}

const mockTabs: MockTab[] = [
  {
    id: 'article',
    name: 'Wired Article',
    url: 'wired.com/future-of-universal-web',
    contentType: 'article',
    title: 'The Web is Fragmented. Can We Reclaim the Commons?',
    meta: 'By Tech Culture Editor • 5 min read',
    comments: [
      {
        id: 'c1',
        author: 'Sarah Jenkins',
        avatar: 'SJ',
        content: 'This is why universal commenting is so powerful. We need a shared space to talk about these articles outside of siloed platforms.',
        time: '2m ago',
        likes: 14
      },
      {
        id: 'c2',
        author: 'Alex River',
        avatar: 'AR',
        content: 'True, but how do we handle moderation across the entire web? Voidsay’s model of link-threads seems like a clean approach.',
        time: 'Just now',
        likes: 5
      }
    ]
  },
  {
    id: 'video',
    name: 'YouTube Video',
    url: 'youtube.com/watch?v=misty-valleys',
    contentType: 'video',
    title: 'The Art of Wandering: Misty Valleys',
    meta: 'Adventure Journal • 840K views',
    comments: [
      {
        id: 'c3',
        author: 'Aris Thorne',
        avatar: 'AT',
        content: 'The drone footage here is absolutely breathtaking. The fog rolling over the ridge is so therapeutic.',
        time: '1h ago',
        likes: 32
      },
      {
        id: 'c4',
        author: 'Elena Rostova',
        avatar: 'ER',
        content: 'I love how calm this is. Voidsay is the perfect place to share and discuss these hidden gems on the web.',
        time: '12m ago',
        likes: 19
      }
    ]
  },
  {
    id: 'gallery',
    name: 'Design Journal',
    url: 'minimaljournal.com/arch-and-light',
    contentType: 'gallery',
    title: 'Interplay of Concrete and Sunlight in Modern Architecture',
    meta: 'Editorial Issue #42',
    comments: [
      {
        id: 'c5',
        author: 'Tadao Fan',
        avatar: 'TF',
        content: 'Giving Ando vibes. The raw concrete texture with the sharp light shadows is exquisite.',
        time: '4h ago',
        likes: 45
      },
      {
        id: 'c6',
        author: 'DesignSeeker',
        avatar: 'DS',
        content: 'This space is actually in Kyoto. Absolute masterpiece of minimalist structure.',
        time: '1h ago',
        likes: 19
      }
    ]
  },
  {
    id: 'custom',
    name: '✦ Any Website',
    url: 'any-website.com/your-favorite-link',
    contentType: 'custom',
    title: 'Universal Canvas: Discuss Anything',
    meta: 'Supports all URLs globally',
    comments: [
      {
        id: 'c7',
        author: 'Voidsay Bot',
        avatar: 'VB',
        content: 'Welcome! A secure, real-time discussion thread is automatically spawned for any URL shared on the internet.',
        time: 'Just now',
        likes: 99
      },
      {
        id: 'c8',
        author: 'InnovatorX',
        avatar: 'IX',
        content: 'No browser extensions or plugins needed? This is the open-web commenting layer we’ve been waiting for.',
        time: 'Just now',
        likes: 42
      }
    ]
  }
];

interface ProductHeroVisualProps {
  onCommentClick?: () => void;
}

export default function ProductHeroVisual({ onCommentClick }: ProductHeroVisualProps) {
  const [activeTabId, setActiveTabId] = useState<string>('article');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const activeTab = mockTabs.find((tab) => tab.id === activeTabId) || mockTabs[0];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTabId((prevId) => {
        const currentIndex = mockTabs.findIndex((tab) => tab.id === prevId);
        const nextIndex = (currentIndex + 1) % mockTabs.length;
        return mockTabs[nextIndex].id;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    setIsAutoPlaying(false); // Pause auto play when user interacts
  };

  return (
    <div className="w-full bg-[#1e1e1f] rounded-lg border border-white/10 overflow-hidden shadow-2xl transition-all duration-500">
      {/* Mock Browser Header */}
      <div className="bg-[#161617] px-md py-sm flex items-center gap-md border-b border-white/5 select-none">
        {/* Window Dots */}
        <div className="flex gap-[6px]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] opacity-80"></span>
        </div>

        {/* Tab Switcher */}
        <div className="hidden sm:flex gap-xs flex-1 max-w-lg">
          {mockTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-sm py-[6px] rounded-sm text-micro-legal font-text transition-all truncate max-w-[120px] ${
                activeTabId === tab.id
                  ? 'bg-[#272729] text-white font-medium'
                  : 'text-white/40 hover:text-white/60 hover:bg-[#272729]/50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Browser URL Bar */}
        <div className="flex-1 max-w-md bg-[#272729] rounded-sm px-md py-[6px] flex items-center justify-between text-caption font-text text-white/50 border border-white/5 mx-auto">
          <div className="flex items-center gap-xs truncate">
            <span className="text-white/30 text-[10px]">🔒</span>
            <span className="truncate text-white/80">{activeTab.url}</span>
          </div>
          <span className="text-white/20 text-[10px]">↻</span>
        </div>

        {/* Active/Pause Indicator */}
        <div className="hidden md:flex items-center gap-xs">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-white/40 hover:text-white text-micro-legal px-xs py-[4px] rounded border border-white/10 transition-colors"
          >
            {isAutoPlaying ? '⏸ Auto' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* Main Container - Split View */}
      <div className="grid md:grid-cols-12 h-[340px] md:h-[420px] bg-[#121213] relative text-left">
        {/* Left Side: Mock Target Website Content */}
        <div className="md:col-span-7 p-lg flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-[#0f0f10]">
          {activeTab.contentType === 'article' && (
            <div className="space-y-sm animate-fade-in flex flex-col justify-between h-full">
              <div className="space-y-xxs">
                <span className="text-[11px] font-semibold text-primary-dark tracking-wider uppercase">Editorial</span>
                <h2 className="text-tagline font-display text-white font-bold leading-snug">{activeTab.title}</h2>
                <p className="text-micro-legal text-white/40">{activeTab.meta}</p>
              </div>
              
              <div className="aspect-[16/7] w-full rounded-sm border border-white/5 relative overflow-hidden my-xxs">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" 
                  alt="Future of Web"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              
              <p className="text-micro-legal text-white/70 leading-relaxed font-text line-clamp-3">
                The internet was envisioned as an open, shared square for human collaboration. Yet, over the last decades, digital walled gardens have isolated us, restricting how we discuss and analyze our shared experiences online. Voidsay bridges those gaps.
              </p>
            </div>
          )}

          {activeTab.contentType === 'video' && (
            <div className="space-y-md animate-fade-in h-full flex flex-col justify-between">
              <div 
                className="aspect-[16/9] w-full bg-[#1c1c1e] rounded-sm border border-white/5 relative overflow-hidden flex-1"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-85 border-0 pointer-events-none"
                  title="Aesthetic Nature Video"
                />
                
                {/* Video controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-xs bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-[10px] text-white/60 z-10 pointer-events-none">
                  <div className="flex items-center gap-xs">
                    <span className="text-primary-dark">● LIVE</span>
                    <span className="opacity-60">03:14</span>
                    <div className="w-20 h-1 bg-white/20 rounded-pill overflow-hidden">
                      <div className="w-3/5 h-full bg-primary-dark"></div>
                    </div>
                  </div>
                  <span>1080p HD</span>
                </div>
              </div>
              <div className="pt-xxs">
                <h2 className="text-caption-strong text-white font-medium truncate">{activeTab.title}</h2>
                <p className="text-micro-legal text-white/40 mt-[2px]">{activeTab.meta}</p>
              </div>
            </div>
          )}

          {activeTab.contentType === 'gallery' && (
            <div className="space-y-md animate-fade-in h-full flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-primary-dark tracking-wider uppercase">Photo Essay</span>
                <h2 className="text-caption-strong text-white font-medium mt-xxs">{activeTab.title}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-sm my-auto">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1c1c1e] to-[#272729] rounded-sm border border-white/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80")' }} />
                  <span className="text-[10px] text-white/40 absolute bottom-xs left-xs bg-black/50 px-xs py-[2px] rounded">Ando Concrete</span>
                </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1c1c1e] to-[#272729] rounded-sm border border-white/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=300&q=80")' }} />
                  <span className="text-[10px] text-white/40 absolute bottom-xs left-xs bg-black/50 px-xs py-[2px] rounded">Sunlight Line</span>
                </div>
              </div>
              
              <p className="text-micro-legal text-white/40">{activeTab.meta}</p>
            </div>
          )}

          {activeTab.contentType === 'custom' && (
            <div className="space-y-sm animate-fade-in h-full flex flex-col justify-between">
              <div className="space-y-xxs">
                <span className="text-[11px] font-semibold text-primary-dark tracking-wider uppercase">Universal Canvas</span>
                <h2 className="text-tagline font-display text-white font-bold leading-snug">{activeTab.title}</h2>
                <p className="text-micro-legal text-white/40">{activeTab.meta}</p>
              </div>

              {/* Dynamic Grid of logos / platform names representing universal support */}
              <div className="grid grid-cols-3 gap-xs my-auto py-xs text-center select-none">
                {['Wikipedia', 'GitHub', 'Medium', 'Reddit', 'Substack', 'NY Times', 'Notion', 'TechCrunch', 'X / Twitter'].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 border border-white/5 rounded-xs p-xs text-[10px] text-white/60 font-medium hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center h-8"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1c1e] border border-white/5 rounded-sm p-sm text-center space-y-xs">
                <p className="text-micro-legal text-white/80 font-text leading-relaxed">
                  Blogs, newsletters, source code, research papers, news outlets, wikis, or forums. 
                  If it has a URL, Voidsay instantly spawns a beautiful comment thread for it.
                </p>
                <button
                  onClick={onCommentClick}
                  className="w-full text-white bg-primary hover:bg-primary-focus transition-all rounded-pill font-medium text-micro-legal py-xs focus:outline-none focus:ring-2 focus:ring-primary-focus active:scale-[0.98]"
                >
                  Try Any Website Link Below ↴
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Voidsay Floating Panel Simulation */}
        <div className="md:col-span-5 bg-[#171718] p-lg flex flex-col justify-between overflow-hidden">
          <div className="space-y-md flex-1 overflow-y-auto custom-scrollbar">
            {/* Voidsay Brand Overlay Header */}
            <div className="flex items-center justify-between pb-sm border-b border-white/5">
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-primary-dark animate-pulse"></span>
                <span className="text-[11px] font-display font-semibold text-white tracking-tight">Voidsay Thread</span>
              </div>
              <span className="text-micro-legal text-primary-dark font-medium">{activeTab.comments.length} active</span>
            </div>

            {/* Simulated Live Comments */}
            <div className="space-y-sm pt-xs">
              {activeTab.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#212123] rounded-sm p-sm border border-white/5 transition-all duration-500 hover:border-white/10 hover:bg-[#252528] animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-xxs">
                    <div className="flex items-center gap-xs">
                      <div className="w-5 h-5 rounded-full bg-primary-dark flex items-center justify-center text-[9px] font-bold text-white">
                        {comment.avatar}
                      </div>
                      <span className="text-caption-strong text-white font-medium">{comment.author}</span>
                    </div>
                    <span className="text-micro-legal text-white/30">{comment.time}</span>
                  </div>
                  <p className="text-[13px] text-white/70 leading-normal font-text">{comment.content}</p>
                  <div className="flex items-center gap-xs mt-sm text-micro-legal text-white/40">
                    <button className="hover:text-primary-dark transition-colors flex items-center gap-[3px]">
                      <span>▲</span> {comment.likes}
                    </button>
                    <span>•</span>
                    <button className="hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Box Simulation */}
          <div className="mt-md pt-md border-t border-white/5 space-y-sm">
            <button
              onClick={onCommentClick}
              className="w-full bg-[#121213] border border-white/5 rounded-sm px-sm py-[8px] flex items-center justify-between text-caption text-white/40 font-text cursor-pointer hover:border-white/15 hover:bg-[#1a1a1c] transition-all text-left focus:outline-none focus:ring-1 focus:ring-primary-dark"
            >
              <span>Write a universal comment...</span>
              <span className="text-xs bg-primary px-xs py-[2px] rounded text-white font-medium">↵</span>
            </button>
            <div className="flex justify-between items-center text-[10px] text-white/30 px-xxs select-none">
              <span>Click to post a real comment below</span>
              <span className="text-primary-dark font-medium">Secured with Passkey</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
