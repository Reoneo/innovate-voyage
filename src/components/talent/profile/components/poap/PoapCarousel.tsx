
import React, { useEffect, useState } from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { usePoapTheme } from './hooks/usePoapTheme';
import SinglePoapDisplay from './SinglePoapDisplay';
import PoapCarouselControls from './PoapCarouselControls';

interface PoapCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  onCarouselChange?: (index: number) => void;
  userAvatarUrl?: string;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({
  poaps,
  onPoapClick,
  onCarouselChange,
  userAvatarUrl
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const themeColors = usePoapTheme(userAvatarUrl);

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

    updateState(); // Initial state
    api.on("select", updateState); // Listen for changes

    return () => {
      api.off("select", updateState); // Cleanup
    };
  }, [api, onCarouselChange]);

  // Show single POAP without carousel for single items
  if (!poaps || poaps.length <= 1) {
    return <SinglePoapDisplay poaps={poaps} onPoapClick={onPoapClick} />;
  }

  // For large collections, show dots only for first 10 items and use counter
  const shouldShowDots = poaps.length <= 10;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Carousel 
        setApi={setApi}
        opts={{
          align: 'center',
          loop: poaps.length > 1, // Ensure loop is conditional
          skipSnaps: false,
          dragFree: false,
          containScroll: 'trimSnaps'
        }} 
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {poaps.map((poap, index) => (
            <CarouselItem key={`${poap.tokenId}-${index}`} className="pl-2 md:pl-4 basis-full flex items-center justify-center">
              <div 
                className="relative cursor-pointer group w-40 h-40" 
                onClick={() => onPoapClick(poap)}
              >
                <img 
                  src={poap.event.image_url} 
                  alt={poap.event.name} 
                  className="w-full h-full rounded-full cursor-pointer z-10 p-2 object-contain" 
                  style={{
                    background: 'rgba(0,0,0,0.7)'
                  }} 
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <PoapCarouselControls
        api={api}
        current={current}
        poapsCount={poaps.length}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
        themeColors={themeColors}
        shouldShowDots={shouldShowDots}
      />
    </div>
  );
};

export default PoapCarousel;

