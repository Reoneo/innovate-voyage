
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
    if (!api) return;

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

  useEffect(() => {
    console.log('[POAP Carousel] poaps:', poaps);
  }, [poaps]);

  // If loading or poaps not defined/empty
  if (!poaps || poaps.length === 0) {
    return (
      <div className="flex items-center justify-center w-full min-h-[160px] text-gray-400 text-sm">
        No POAPs to display.
      </div>
    );
  }

  // If poaps exist but each missing image, show error/info
  if (poaps.every(p => !p.event || !p.event.image_url)) {
    return (
      <div className="flex items-center justify-center w-full min-h-[160px] text-red-500 text-sm">
        POAP data loaded, but no images available.
      </div>
    );
  }

  // Single POAP (no carousel)
  if (poaps.length <= 1) {
    const poap = poaps[0];
    return (
      <div className="flex items-center justify-center w-full min-h-[160px] sm:min-h-[180px] py-2">
        <div
          key={poap.tokenId}
          className="relative cursor-pointer group flex items-center justify-center 
            w-[42vw] h-[42vw] max-w-[170px] max-h-[170px] sm:w-[150px] sm:h-[150px] mx-auto"
          style={{ minWidth: 80, minHeight: 80 }}
          onClick={() => onPoapClick(poap)}
        >
          <img
            src={poap.event.image_url}
            alt={poap.event.name}
            className="block w-[36vw] h-[36vw] max-w-[128px] max-h-[128px] sm:w-[128px] sm:h-[128px] 
              object-cover rounded-full bg-black/70 border-4 border-white shadow-lg"
            style={{ background: 'rgba(0,0,0,0.7)', minWidth: 64, minHeight: 64 }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
          <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border pointer-events-none"></div>
        </div>
      </div>
    );
  }

  // Carousel for multiple POAPs
  return (
    <div className="relative w-full mx-auto flex flex-col items-center min-h-[150px] sm:min-h-[210px]">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent
          className="flex items-center justify-center min-h-[130px] sm:min-h-[180px] w-full touch-pan-x scroll-smooth"
          style={{
            WebkitOverflowScrolling: 'touch',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
          }}
        >
          {poaps.map((poap, index) => (
            <CarouselItem
              key={`${poap.tokenId}-${index}`}
              className="flex-shrink-0 flex-grow-0 flex items-center justify-center py-2 w-full sm:w-auto transition-all min-w-0 sm:min-w-[180px] max-w-full"
              style={{
                scrollSnapAlign: 'center',
                width: "100vw",
                maxWidth: 220
              }}
            >
              <div
                className="relative cursor-pointer group flex items-center justify-center 
                  w-[42vw] h-[42vw] max-w-[170px] max-h-[170px] sm:w-[150px] sm:h-[150px] mx-auto"
                style={{ minWidth: 80, minHeight: 80 }}
                onClick={() => onPoapClick(poap)}
              >
                {poap.event?.image_url ? (
                  <img
                    src={poap.event.image_url}
                    alt={poap.event.name}
                    loading="lazy"
                    className="block w-[36vw] h-[36vw] max-w-[128px] max-h-[128px] sm:w-[128px] sm:h-[128px] 
                      object-cover rounded-full bg-black/70 border-4 border-white shadow-lg"
                    style={{ background: 'rgba(0,0,0,0.7)', minWidth: 64, minHeight: 64 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                  />
                ) : (
                  <div className="w-[36vw] h-[36vw] max-w-[128px] max-h-[128px] flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded-full border-4 border-white shadow-lg"
                      style={{ minWidth: 64, minHeight: 64 }}
                  >
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border pointer-events-none"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Controls */}
      {poaps.length > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-4">
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
        <div className="text-xs text-center mt-2 text-gray-500 select-none">
          Swipe or scroll to browse POAPs
        </div>
      )}
    </div>
  );
};

export default PoapCarouselComponent;
