
import React, { useCallback, useEffect, useState } from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

  const poapSize = isMobile ? 'w-28 h-28' : 'w-44 h-44';

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
              className={`${poapSize} rounded-full cursor-pointer z-10 p-2 object-contain`}
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
    <div className={`relative w-full ${isMobile ? 'max-w-xs' : 'max-w-xs'}`}>
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
                  className={`${poapSize} rounded-full cursor-pointer z-10 p-2 object-contain`}
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
      <div className={`flex items-center justify-center ${isMobile ? 'mt-2 space-x-2' : 'mt-4 space-x-4'}`}>
        {/* Left Arrow */}
        <button
          onClick={() => api?.scrollPrev()}
          disabled={!canScrollPrev}
          className={`${isMobile ? 'p-1' : 'p-2'} rounded-full transition-all ${
            canScrollPrev 
              ? 'bg-black text-white hover:bg-gray-800 cursor-pointer shadow-lg' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
        </button>

        {/* Indicator: Either dots or counter */}
        {shouldShowDots ? (
          <div className={`flex ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            {poaps.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full transition-all ${
                  index === current 
                    ? 'bg-black scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className={`flex items-center ${isMobile ? 'space-x-1 text-xs' : 'space-x-2 text-sm'} text-muted-foreground`}>
            <span className="font-medium text-black">{current + 1}</span>
            <span>/</span>
            <span>{poaps.length}</span>
          </div>
        )}

        {/* Right Arrow */}
        <button
          onClick={() => api?.scrollNext()}
          disabled={!canScrollNext}
          className={`${isMobile ? 'p-1' : 'p-2'} rounded-full transition-all ${
            canScrollNext 
              ? 'bg-black text-white hover:bg-gray-800 cursor-pointer shadow-lg' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
        </button>
      </div>

      {/* Swipe Hint Text */}
      {poaps.length > 1 && (
        <div className={`${isMobile ? 'text-xs mt-1' : 'text-xs mt-2'} text-center text-muted-foreground`}>
          Swipe or click arrows to browse POAPs
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
