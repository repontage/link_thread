// JSON-LD Structured Data for SEO / AI Search Optimization
// Helps Google AI Overviews, ChatGPT, Perplexity, Claude understand site content

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
