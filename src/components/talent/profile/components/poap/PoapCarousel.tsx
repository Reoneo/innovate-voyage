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
    return <div className="flex items-center justify-center">
        {poaps.map(poap => <div key={poap.tokenId} className="relative cursor-pointer group" onClick={() => onPoapClick(poap)}>
            <img src={poap.event.image_url} alt={poap.event.name} className="w-44 h-44 rounded-full cursor-pointer z-10 p-2 object-contain" style={{
          background: 'rgba(0,0,0,0.7)'
        }} />
            <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
          </div>)}
      </div>;
  }

  // For large collections, show dots only for first 10 items and use counter
  const shouldShowDots = poaps.length <= 10;
  return <div className="relative w-full max-w-xs">
      <Carousel setApi={setApi} opts={{
      align: 'center',
      loop: poaps.length > 3
    }} className="w-full">
        <CarouselContent>
          {poaps.map(poap => {})}
        </CarouselContent>
      </Carousel>

      {/* Navigation Controls */}
      

      {/* Swipe Hint Text */}
      {poaps.length > 1}
    </div>;
};
export default PoapCarousel;