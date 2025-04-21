
import React, { useState, useEffect } from 'react';
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Skeleton } from "@/components/ui/skeleton";
import StyledPoapCard from "./StyledPoapCard";

/**
 * POAP Section with swipeable (scrollable) layout and pixel-perfect design
 */

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

  // Responsive horizontal scroll area for card carousel effect
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
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="min-w-[560px] h-[220px] rounded-2xl" />
            ))
          : poaps.map(poap => (
              <StyledPoapCard
                key={poap.tokenId}
                imageUrl={poap.event.image_url}
                name={poap.event.name}
                dropId={poap.event.id}
                poapId={poap.tokenId}
                mintedBy={poap.owner}
                tokenCount={1}
                holdersCount={poap.event.supply ?? 1}
                transferCount={1}
                explorerUrl={`https://collectors.poap.xyz/token/${poap.tokenId}`}
              />
            ))
        }
      </div>
    </div>
  );
};

export default PoapSection;
