
import React, { useState, useEffect } from 'react';
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="mt-4 bg-gradient-to-br from-[#f8f3ff] to-[#efebff] rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <img 
          src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
          className="h-6 w-6" 
          alt="POAP" 
        />
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7856FF] bg-clip-text text-transparent">
          Rarest POAP
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
      ) : rarestPoap ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <PoapCard poap={rarestPoap} />
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-bold">{rarestPoap.event.name}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {rarestPoap.event.description}
            </p>
            <Button 
              variant="outline"
              onClick={() => window.open(`https://collectors.poap.xyz/scan/${walletAddress}`, '_blank')}
              className="gap-2 bg-white hover:bg-[#9b87f5] hover:text-white transition-all duration-300 border-[#9b87f5] text-[#9b87f5]"
            >
              View Collection <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PoapSection;
