
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import PoapCard from './PoapCard';

interface PoapCarouselProps {
  poaps: any[];
  onPoapClick: (poap: any) => void;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({ poaps, onPoapClick }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full space-y-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {poaps.map((poap, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="cursor-pointer hover:shadow-md transition-shadow rounded-full border-2">
                  <CardContent className="flex aspect-square items-center justify-center p-0 rounded-full overflow-hidden">
                    <PoapCard poap={poap} onClick={() => onPoapClick(poap)} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {count > 0 && (
        <div className="py-2 text-center text-sm text-muted-foreground">
          POAP {current} of {count}
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
