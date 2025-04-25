
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Poap } from '@/api/services/poapService';

interface PoapCarouselProps {
  poaps: Poap[];
  className?: string;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({ poaps, className }) => {
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);

  if (!poaps.length) return null;

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="relative w-full pb-4">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {poaps.map((poap) => (
                <CarouselItem key={poap.tokenId} className="basis-1/4 md:basis-1/6">
                  <div 
                    className="relative aspect-square cursor-pointer hover:opacity-90 transition-all"
                    onClick={() => setSelectedPoap(poap)}
                  >
                    <img
                      src={poap.event.image_url}
                      alt={poap.event.name}
                      className="w-full h-full object-cover rounded-full border-2 border-primary/20"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>

      {/* Fullscreen POAP details */}
      {selectedPoap && (
        <Dialog open={!!selectedPoap} onOpenChange={() => setSelectedPoap(null)}>
          <DialogContent className="sm:max-w-lg">
            <button 
              onClick={() => setSelectedPoap(null)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={selectedPoap.event.image_url}
                  alt={selectedPoap.event.name}
                  className="w-32 h-32 rounded-full border-4 border-primary/20"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{selectedPoap.event.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPoap.event.description}</p>
                  <div className="mt-4 flex gap-2 justify-center flex-wrap">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      ID #{selectedPoap.tokenId}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {new Date(selectedPoap.event.start_date).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      Supply: {selectedPoap.event.supply || "Unlimited"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PoapCarousel;
