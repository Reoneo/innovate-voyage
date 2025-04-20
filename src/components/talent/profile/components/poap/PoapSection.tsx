
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
    <Card id="poap-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <img 
            src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
            className="h-6 w-6" 
            alt="POAP" 
          />
          Rarest POAP
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
        ) : rarestPoap ? (
          <div className="flex flex-col items-center gap-4">
            <PoapCard poap={rarestPoap} />
            <div className="text-sm text-center">
              <p className="text-muted-foreground mb-2">{rarestPoap.event.description}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://collectors.poap.xyz/scan/${walletAddress}`, '_blank')}
                className="gap-2"
              >
                View Collection <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
