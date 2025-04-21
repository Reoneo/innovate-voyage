
import React, { useState, useEffect } from 'react';
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PoapListCard from "./PoapListCard";

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        setPoaps(fetchedPoaps);
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPoaps();
  }, [walletAddress]);

  if (!walletAddress || (!isLoading && poaps.length === 0)) return null;

  return (
    <div id="poap-section" className="mt-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <img 
          src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png"
          className="h-6 w-6" 
          alt="POAP"
        />
        POAPs
      </h2>
      {isLoading ? (
        <div className="flex space-x-4 overflow-x-auto py-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="min-w-[345px] h-[170px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <Carousel className="w-full max-w-full">
          <CarouselContent>
            {poaps.map((poap) => (
              <CarouselItem key={poap.tokenId} className="md:basis-1/2 lg:basis-1/3">
                <PoapListCard
                  imageUrl={poap.event.image_url}
                  title={poap.event.name}
                  dropId={poap.event.id}
                  poapId={poap.tokenId}
                  mintedBy={poap.owner}
                  stats={{
                    count: 1,
                    holders: poap.event.supply ?? 1,
                    copies: 1,
                  }}
                  href={`https://collectors.poap.xyz/token/${poap.tokenId}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
    </div>
  );
};

export default PoapSection;
