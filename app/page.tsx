import ThreadUI from '@/components/ThreadUI';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 pb-2">
          Comment on any website.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Paste a link below to see what others are saying, or start a new thread. 
          Your universal discussion board for the internet.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <ThreadUI />
      </div>
    </main>
  );
}
