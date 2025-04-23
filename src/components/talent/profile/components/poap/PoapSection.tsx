
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!walletAddress) return;
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        // Sort POAPs by supply (ascending) so limited editions show first
        const sortedPoaps = [...fetchedPoaps].sort((a, b) => (a.event.supply || 999999) - (b.event.supply || 999999));
        setPoaps(sortedPoaps);
        if (sortedPoaps.length > 0) {
          setSelectedPoap(sortedPoaps[0]);
        }
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPoaps();
  }, [walletAddress]);

  if (!walletAddress) return null;

  return (
    <section className="mt-4 bg-white rounded-xl shadow-sm px-0 py-0 mb-2 overflow-hidden max-w-full">
      <CardHeader className="pb-1 bg-gradient-to-br from-[#e5deff] to-[#fafbfe] py-4">
        <div className="flex justify-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gradient-primary tracking-wide">
            <img
              src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png"
              className="h-7 w-7"
              alt="Proof of Attendance Protocol"
            />
            POAPs
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex gap-4 justify-center p-6">
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        ) : poaps.length > 0 && selectedPoap ? (
          <div className="flex flex-col">
            {/* Featured POAP display */}
            <div className="p-4 bg-white">
              <PoapCard poap={selectedPoap} detailed={true} />
            </div>
            
            {/* Thumbnail list */}
            <div className="overflow-x-auto scrollbar-hide px-4 py-3 bg-gray-50 border-t">
              <div className="flex gap-3">
                {poaps.map((poap, index) => (
                  <div 
                    key={poap.tokenId} 
                    onClick={() => setSelectedPoap(poap)}
                    className={`cursor-pointer flex-shrink-0 ${selectedPoap.tokenId === poap.tokenId ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <img 
                      src={poap.event.image_url}
                      alt={poap.event.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              No POAPs found for this wallet address.
            </p>
          </div>
        )}
      </CardContent>
    </section>
  );
};

export default PoapSection;
