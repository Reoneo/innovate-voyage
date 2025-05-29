
import React, { useEffect, useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const currentIndex = api.selectedScrollSnap();
    setCurrentIndex(currentIndex);
    onCarouselChange?.(currentIndex);

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
      onCarouselChange?.(api.selectedScrollSnap());
    });
  }, [api, onCarouselChange]);

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
        {/* Swipe indicators */}
        {poaps.length > 1 && (
          <>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/20 rounded-full p-1 text-white shadow-sm">
              <ChevronLeft size={18} className="opacity-70" />
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/20 rounded-full p-1 text-white shadow-sm">
              <ChevronRight size={18} className="opacity-70" />
            </div>
          </>
        )}
        
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
                  className="w-44 h-44 rounded-full cursor-pointer z-10 p-2 object-contain" 
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
      
      {/* Dot indicators for multiple POAPs */}
      {poaps.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {poaps.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? "w-3 bg-primary" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
