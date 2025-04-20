
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [rarestPoap, setRarestPoap] = useState<Poap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        
        // Find the POAP with the lowest supply
        const poapsWithSupply = fetchedPoaps.filter(poap => poap.event.supply > 0);
        if (poapsWithSupply.length > 0) {
          const rarest = poapsWithSupply.reduce((prev, current) => 
            (prev.event.supply || Infinity) < (current.event.supply || Infinity) ? prev : current
          );
          setRarestPoap(rarest);
        }
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPoaps();
  }, [walletAddress]);

  if (!walletAddress || (!isLoading && !rarestPoap)) {
    return null;
  }

  return (
    <div id="poap-card-section" className="mt-4 bg-gradient-to-br from-[#1A1F2C] to-[#221F26] rounded-lg p-6 shadow-xl backdrop-blur-sm">
      <div className="pb-2 flex items-center gap-2">
        <img 
          src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
          className="h-6 w-6" 
          alt="POAP" 
        />
        <h2 className="text-xl font-semibold text-white">Rarest POAP</h2>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
        ) : rarestPoap ? (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <PoapCard poap={rarestPoap} />
            </div>
            <div className="flex-1 text-white/80 space-y-4">
              <p className="text-sm leading-relaxed">{rarestPoap.event.description}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://collectors.poap.xyz/scan/${walletAddress}`, '_blank')}
                className="gap-2 bg-[#9b87f5] text-white hover:bg-[#7856FF] border-none"
              >
                View Collection <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PoapSection;
