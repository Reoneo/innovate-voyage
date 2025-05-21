
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import PoapCard from './PoapCard';

interface PoapCarouselProps {
  poaps: any[];
  onSelect: (poap: any) => void;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({ poaps, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Function to get appropriate classes for dot indicators
  const getDotClasses = (index: number) => {
    return cn(
      'h-2 w-2 rounded-full transition-all duration-300',
      index === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'
    );
  };

  // Update current index when API changes
  React.useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      if (!api) return;
      const currentSlide = api.selectedScrollSnap();
      setCurrentIndex(currentSlide);
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {poaps.map((poap, index) => (
            <CarouselItem key={poap.tokenId} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-1">
              <div onClick={() => onSelect(poap)}>
                <PoapCard poap={poap} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-0 transform -translate-y-1/2 bg-white/80 border-0 shadow-lg" />
        <CarouselNext className="absolute right-0 transform -translate-y-1/2 bg-white/80 border-0 shadow-lg" />
      </Carousel>

      {/* Dot indicators */}
      {poaps.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: Math.min(poaps.length, 8) }).map((_, index) => (
            <div key={`dot-${index}`} className={getDotClasses(index)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
