
import React, { useState, useEffect } from 'react';
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Skeleton } from "@/components/ui/skeleton";
import PoapCarousel from "./PoapCarousel";

/**
 * POAP Section using compact swipeable carousel
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

  return (
    <div id="poap-section" className="mt-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <img 
          src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png"
          className="h-6 w-6" 
          alt="POAP"
        />
        POAPs
      </h2>
      {isLoading ? (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[120px] h-[120px] rounded-xl" />
          ))}
        </div>
      ) : (
        <PoapCarousel
          poaps={poaps.map((poap) => ({
            id: poap.tokenId,
            image_url: poap.event.image_url,
            name: poap.event.name,
            drop_id: poap.event.id,
            minted_by: poap.owner,
            token_count: 1,
            holders_count: poap.event.supply ?? 1,
            transfer_count: 1
          }))}
        />
      )}
    </div>
  );
};

export default PoapSection;
