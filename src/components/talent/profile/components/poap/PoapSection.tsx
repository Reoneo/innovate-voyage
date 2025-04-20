
import React, { useState, useEffect } from 'react';
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
    <div 
      id="poap-card-section" 
      className="mt-4 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-lg rounded-lg p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <img 
            src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
            className="h-6 w-6" 
            alt="POAP" 
          />
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Rarest POAP
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
        ) : rarestPoap ? (
          <div className="flex items-start gap-8">
            <div className="w-40 flex-shrink-0">
              <PoapCard poap={rarestPoap} />
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">{rarestPoap.event.name}</h3>
                <p className="text-muted-foreground">{rarestPoap.event.description}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://collectors.poap.xyz/scan/${walletAddress}`, '_blank')}
                className="gap-2 bg-background/50 hover:bg-background/80 transition-all duration-300"
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
