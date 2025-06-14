
import React, { useEffect, useState } from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PoapCarouselComponentProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  onCarouselChange?: (index: number) => void;
}

const PoapCarouselComponent: React.FC<PoapCarouselComponentProps> = ({
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

  // Show single POAP without carousel for single items
  if (poaps.length <= 1) {
    return (
      <div className="flex items-center justify-center w-full min-h-[180px] py-2">
        {poaps.map((poap) => (
          <div 
            key={poap.tokenId}
            className="relative cursor-pointer group flex items-center justify-center w-[150px] h-[150px] mx-auto"
            onClick={() => onPoapClick(poap)}
          >
            <img 
              src={poap.event.image_url} 
              alt={poap.event.name} 
              className="block w-[128px] h-[128px] object-cover rounded-full bg-black/70 border-4 border-white shadow-lg"
              style={{
                background: 'rgba(0,0,0,0.7)'
              }} 
            />
            <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border pointer-events-none"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xs mx-auto flex flex-col items-center min-h-[210px]"> 
      <Carousel 
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }} 
        className="w-full max-w-xs min-h-[180px]"
      >
        <CarouselContent className="h-full flex items-center justify-center min-h-[180px]">
          {poaps.map((poap, index) => (
            <CarouselItem 
              key={`${poap.tokenId}-${index}`} 
              className="basis-full flex items-center justify-center min-h-[180px]"
            >
              <div 
                className="relative cursor-pointer group w-[150px] h-[150px] flex items-center justify-center mx-auto"
                onClick={() => onPoapClick(poap)}
              >
                <img 
                  src={poap.event.image_url} 
                  alt={poap.event.name} 
                  className="block w-[128px] h-[128px] object-cover rounded-full bg-black/70 border-4 border-white shadow-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border pointer-events-none"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Controls */}
      {poaps.length > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-4">
          {/* Left Arrow */}
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className={`p-2 rounded-full transition-all ${
              canScrollPrev 
                ? 'bg-black text-white cursor-pointer shadow-lg hover:scale-105 hover:bg-gray-800' 
                : 'text-gray-400 cursor-not-allowed bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Counter */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 min-w-[48px] justify-center">
            <span className="font-medium text-black">
              {current + 1}
            </span>
            <span>/</span>
            <span>{poaps.length}</span>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className={`p-2 rounded-full transition-all ${
              canScrollNext 
                ? 'bg-black text-white cursor-pointer shadow-lg hover:scale-105 hover:bg-gray-800' 
                : 'text-gray-400 cursor-not-allowed bg-gray-100'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Swipe Hint Text */}
      {poaps.length > 1 && (
        <div className="text-xs text-center mt-2 text-gray-500">
          Swipe to browse POAPs
        </div>
      )}
    </div>
  );
};

export default PoapCarouselComponent;
