import React from 'react';
import { Loader2, Link as LinkIcon } from 'lucide-react';

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  error?: string;
}

const PreviewCard = React.memo(({ preview, isLoading }: { preview: PreviewData | null, isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="p-4 border-b border-zinc-100 flex items-center justify-center min-h-[100px]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!preview) return null;

  return (
    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
      <a 
        href={preview.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col sm:flex-row"
      >
        {preview.image && !preview.error ? (
          <div className="sm:w-48 h-48 sm:h-auto bg-zinc-100 shrink-0 border-b sm:border-b-0 sm:border-r border-zinc-200 overflow-hidden relative">
            <img 
              src={preview.image} 
              alt={preview.title || 'Preview image'} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="sm:w-48 h-32 sm:h-auto bg-zinc-100 shrink-0 border-b sm:border-b-0 sm:border-r border-zinc-200 flex items-center justify-center">
            <LinkIcon className="h-8 w-8 text-zinc-300" />
          </div>
        )}
        <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 mb-1 truncate">
            {preview.title || preview.url}
          </h3>
          {preview.description && !preview.error && (
            <p className="text-sm text-zinc-500 line-clamp-2 mb-2">
              {preview.description}
            </p>
          )}
          <div className="text-xs text-blue-600 truncate mt-auto">
            {preview.url}
          </div>
        </div>
      </a>
    </div>
  );
});

PreviewCard.displayName = 'PreviewCard';
export default PreviewCard;
export type { PreviewData };
