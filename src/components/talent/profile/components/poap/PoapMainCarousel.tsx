
import React from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";

interface PoapMainCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  setApi: (api: CarouselApi | undefined) => void;
}

const PoapMainCarousel: React.FC<PoapMainCarouselProps> = ({
  poaps,
  onPoapClick,
  setApi,
}) => {
  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'center',
        loop: poaps.length > 1,
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
  );
};

export default PoapMainCarousel;
