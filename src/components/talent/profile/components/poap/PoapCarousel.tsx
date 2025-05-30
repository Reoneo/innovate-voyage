
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
        {poaps.map(poap => (
          <div key={poap.tokenId} className="relative cursor-pointer group" onClick={() => onPoapClick(poap)}>
            <img 
              src={poap.event.image_url} 
              alt={poap.event.name} 
              className="w-20 h-20 rounded-full cursor-pointer z-10 p-1 object-cover" 
              style={{ background: 'rgba(0,0,0,0.1)' }}
            />
            <div className="absolute inset-0 rounded-full border-2 border-transparent animate-rainbow-border"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel 
        setApi={setApi} 
        opts={{
          align: 'start',
          loop: false,
          slidesToScroll: 1
        }} 
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {poaps.map((poap, index) => (
            <CarouselItem key={poap.tokenId} className="pl-2 basis-auto">
              <div 
                className="relative cursor-pointer group" 
                onClick={() => onPoapClick(poap)}
              >
                <img 
                  src={poap.event.image_url} 
                  alt={poap.event.name} 
                  className="w-16 h-16 rounded-full cursor-pointer z-10 p-1 object-cover hover:scale-105 transition-transform" 
                  style={{ background: 'rgba(0,0,0,0.1)' }}
                />
                <div className="absolute inset-0 rounded-full border-2 border-transparent animate-rainbow-border"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation hint for mobile */}
      {poaps.length > 3 && (
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">Swipe to see more</p>
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
