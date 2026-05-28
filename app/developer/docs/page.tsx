import { auth } from "@/auth";
import Link from "next/link";

export const metadata = {
  title: "API Documentation - VoidSay",
  description: "Official API documentation for VoidSay developers.",
};

export default async function ApiDocsPage() {
  await auth(); // Trigger auth

  return (
    <div className="min-h-screen bg-zinc-50/30 p-8 sm:p-12 md:p-24 dark:bg-black">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="/developer" className="hover:text-black dark:hover:text-white transition-colors">Developer Portal</Link>
            <span>/</span>
            <span className="text-black dark:text-white">API Docs</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            VoidSay API Documentation
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Integrate VoidSay's commenting and metadata features into your application.
          </p>
        </header>

        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50">Authentication</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Currently, standard API requests do not require an API key for read access on public comments. 
            However, authenticated actions (posting comments, upvoting) require a valid user session.
            Webhooks are secured via HMAC-SHA256 signatures.
          </p>
        </section>

        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50">Endpoints</h2>
          
          <div className="space-y-8">
            {/* GET /api/comments */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono rounded font-semibold">GET</span>
                <code className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/comments</code>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Retrieve a paginated list of comments for a specific thread or URL.
              </p>
              <div className="bg-zinc-50 dark:bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-500 mb-2">// Example Request</div>
                <div className="text-zinc-800 dark:text-zinc-200">fetch('/api/comments?threadId=custom-id-123')</div>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* GET /api/analytics/link */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono rounded font-semibold">GET</span>
                <code className="text-sm font-mono text-zinc-800 dark:text-zinc-200">/api/analytics/link</code>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Get analytics data including view counts, comment volume, and engagement score for a given link.
              </p>
              <div className="bg-zinc-50 dark:bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-500 mb-2">// Example Request</div>
                <div className="text-zinc-800 dark:text-zinc-200">fetch('/api/analytics/link?url=https://example.com')</div>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

             {/* POST /api/webhooks */}
             <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono rounded font-semibold">POST</span>
                <code className="text-sm font-mono text-zinc-800 dark:text-zinc-200">Webhook Payloads</code>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                If you subscribe to webhooks, VoidSay will send a POST request to your specified URL when events occur.
              </p>
              <div className="bg-zinc-50 dark:bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-500 mb-2">// Example Payload (comment.created)</div>
                <pre className="text-zinc-800 dark:text-zinc-200">
{`{
  "event": "comment.created",
  "data": {
    "id": "cm123...",
    "content": "This is awesome!",
    "author": "Alice"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}