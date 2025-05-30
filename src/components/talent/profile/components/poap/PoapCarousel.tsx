
import React, { useCallback, useEffect, useState } from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PoapCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  onCarouselChange?: (index: number) => void;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({
  poaps,
  onPoapClick,
  onCarouselChange
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateState = () => {
      const currentIndex = api.selectedScrollSnap();
      setCurrent(currentIndex);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      onCarouselChange?.(currentIndex);
    };

    updateState();
    api.on("select", updateState);

    return () => {
      api.off("select", updateState);
    };
  }, [api, onCarouselChange]);

  if (poaps.length <= 1) {
    return (
      <div className="flex items-center justify-center">
        {poaps.map((poap) => (
          <div 
            key={poap.tokenId}
            className="relative cursor-pointer group" 
            onClick={() => onPoapClick(poap)}
          >
            <img 
              src={poap.event.image_url} 
              alt={poap.event.name} 
              className="w-36 h-36 rounded-full cursor-pointer z-10 p-2 object-contain" 
              style={{
                background: 'rgba(0,0,0,0.7)'
              }} 
            />
            <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
          </div>
        ))}
      </div>
    );
  }

  // For large collections, show dots only for first 10 items and use counter
  const shouldShowDots = poaps.length <= 10;

  return (
    <div className="relative w-full max-w-xs">
      <Carousel 
        setApi={setApi}
        opts={{
          align: 'center',
          loop: poaps.length > 3
        }} 
        className="w-full"
      >
        <CarouselContent>
          {poaps.map((poap) => (
            <CarouselItem key={poap.tokenId} className="flex items-center justify-center">
              <div 
                className="relative cursor-pointer group" 
                onClick={() => onPoapClick(poap)}
              >
                <img 
                  src={poap.event.image_url} 
                  alt={poap.event.name} 
                  className="w-36 h-36 rounded-full cursor-pointer z-10 p-2 object-contain" 
                  style={{
                    background: 'rgba(0,0,0,0.7)'
                  }} 
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center mt-2 space-x-4">
        {/* Left Arrow */}
        <button
          onClick={() => api?.scrollPrev()}
          disabled={!canScrollPrev}
          className={`p-2 rounded-full transition-all ${
            canScrollPrev 
              ? 'bg-black text-white hover:bg-gray-800 cursor-pointer shadow-lg' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicator: Either dots or counter */}
        {shouldShowDots ? (
          <div className="flex space-x-2">
            {poaps.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current 
                    ? 'bg-black scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="font-medium text-black">{current + 1}</span>
            <span>/</span>
            <span>{poaps.length}</span>
          </div>
        )}

        {/* Right Arrow */}
        <button
          onClick={() => api?.scrollNext()}
          disabled={!canScrollNext}
          className={`p-2 rounded-full transition-all ${
            canScrollNext 
              ? 'bg-black text-white hover:bg-gray-800 cursor-pointer shadow-lg' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Swipe Hint Text */}
      {poaps.length > 1 && (
        <div className="text-xs text-center mt-1 text-muted-foreground">
          Swipe or click arrows to browse POAPs
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
