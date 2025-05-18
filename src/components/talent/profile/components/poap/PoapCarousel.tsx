
import React from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

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
  return (
    <Carousel 
      opts={{
        align: 'center',
        loop: poaps.length > 3
      }} 
      className="w-full max-w-xs" 
      onSelect={(api) => {
        if (api && onCarouselChange) {
          const currentIndex = api.selectedScrollSnap();
          onCarouselChange(currentIndex);
        }
      }}
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
                className="w-44 h-44 rounded-full cursor-pointer z-10 p-2 object-contain" 
                style={{
                  background: 'rgba(0,0,0,0.7)'
                }} 
              />
              <div className="absolute inset-0 rounded-full border-2 border-transparent animate-rainbow-border"></div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* No navigation buttons as requested */}
    </Carousel>
  );
};

export default PoapCarousel;
