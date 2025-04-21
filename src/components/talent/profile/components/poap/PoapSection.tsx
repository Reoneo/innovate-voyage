
import React, { useState, useEffect } from 'react';
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  if (!walletAddress || (!isLoading && poaps.length === 0)) {
    return null;
  }

  return (
    <div id="poap-section" className="mt-4">
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
            <Skeleton key={i} className="min-w-[280px] h-[180px] rounded-xl" />
          ))}
        </div>
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {poaps.map((poap) => (
              <CarouselItem key={poap.tokenId} className="md:basis-1/2 lg:basis-1/3">
                <ModernPoapCard poap={poap} />
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

interface ModernPoapCardProps {
  poap: Poap;
}

const ModernPoapCard: React.FC<ModernPoapCardProps> = ({ poap }) => {
  const poapUrl = `https://collectors.poap.xyz/token/${poap.tokenId}`;
  
  return (
    <a 
      href={poapUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative">
        <div className="p-4 flex md:flex-row gap-4">
          {/* Left side - POAP image */}
          <div className="flex-shrink-0 w-[45%]">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-inner">
              <img 
                src={poap.event.image_url} 
                alt={poap.event.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 left-2 bg-gray-700/70 text-white text-xs px-2 py-1 rounded-md">
              POAP #{poap.tokenId}
            </div>
          </div>
          
          {/* Right side - POAP details */}
          <div className="flex-1 text-left">
            <h3 className="text-purple-900 font-bold text-lg mb-2 line-clamp-2">{poap.event.name}</h3>
            
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-500">DROP ID:</span>
                <span className="text-purple-800 font-semibold ml-1">#{poap.event.id}</span>
              </div>
              <div>
                <span className="text-gray-500">POAP ID:</span>
                <span className="text-purple-800 font-semibold ml-1">#{poap.tokenId}</span>
              </div>
              <div>
                <span className="text-gray-500">MINTED BY:</span>
                <span className="text-purple-800 font-semibold ml-1">{poap.owner.substring(0, 8)}...</span>
              </div>
            </div>
            
            <div className="flex mt-3 space-x-4">
              <div className="flex items-center">
                <div className="bg-purple-200 rounded-full p-1 mr-1">
                  <span className="text-purple-800 text-xs font-bold">#</span>
                </div>
                <span className="text-purple-800 font-semibold">1</span>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-200 rounded-full p-1 mr-1">
                  <span className="text-purple-800 text-xs">👥</span>
                </div>
                <span className="text-purple-800 font-semibold">{poap.event.supply || 1}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-200 rounded-full p-1 mr-1">
                  <span className="text-purple-800 text-xs">📄</span>
                </div>
                <span className="text-purple-800 font-semibold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PoapSection;
