import React from 'react';

interface ImageCarouselProps {
  images: string[];
  onDoubleTap?: () => void;
}

export default function ImageCarousel({ images, onDoubleTap }: ImageCarouselProps) {
  let lastTap = 0;

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      if (onDoubleTap) onDoubleTap();
      e.preventDefault();
    }
    lastTap = currentTime;
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 mt-3 no-scrollbar"
      onClick={handleTouchEnd}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={() => onDoubleTap && onDoubleTap()}
    >
      {images.map((url, idx) => (
        <div key={idx} className="shrink-0 snap-center w-full max-w-[300px] h-48 rounded-lg overflow-hidden border border-zinc-200">
          <img src={url} alt={`carousel-${idx}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}