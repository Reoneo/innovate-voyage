
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PoapCard from './PoapCard';
import { Poap } from './usePoapData';

interface PoapCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({ poaps, onPoapClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCarouselChange = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full">
      <Carousel 
        className="w-full" 
        onValueChange={(value) => handleCarouselChange(parseInt(value))}
      >
        <CarouselContent>
          {poaps.map((poap, index) => (
            <CarouselItem key={poap.tokenId} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <PoapCard 
                  poap={poap} 
                  onClick={() => onPoapClick(poap)} 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default PoapCarousel;
