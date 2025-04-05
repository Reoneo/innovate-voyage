
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';

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
        // Fetch all POAPs (removed the limit)
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress, 20); 
        setPoaps(fetchedPoaps);
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPoaps();
  }, [walletAddress]);

  if (!walletAddress) {
    return null;
  }

  return (
    <Card id="poap-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <img 
            src="https://blog.poap.xyz/content/images/2022/10/POAP-Logo.png" 
            alt="POAP Logo" 
            className="h-7 w-7"
          />
          <CardTitle>POAP Badges</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-28 rounded-full" />
            ))}
          </div>
        ) : poaps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
            {poaps.map((poap) => (
              <PoapCard key={poap.tokenId} poap={poap} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No POAPs found for this wallet address.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
