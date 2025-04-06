
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import PoapCard from './PoapCard';

interface PoapSectionProps {
  walletAddress?: string;
}

interface Poap {
  name: string;
  tokenId: string;
  city: string;
  country: string;
  image_url: string;
  event_url: string;
  description: string;
  event: {
    start_date: string;
    end_date: string;
  };
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchPoaps = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.poap.tech/actions/scan/${walletAddress}`, {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': 'OdCiTR9uNKR1GITEaSYbwTgJrHYx2cCN3jCvQZ9U'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('POAP data:', data);
          setPoaps(data);
        } else {
          console.error('Failed to fetch POAPs:', response.status);
        }
      } catch (error) {
        console.error('Error fetching POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoaps();
  }, [walletAddress]);

  if (!walletAddress) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Doubled the size of the POAP icon */}
            <img 
              src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
              alt="POAP" 
              className="h-16 w-16" 
            />
            <div>
              <CardTitle>POAPs</CardTitle>
              <a 
                href={`https://collectors.poap.xyz/scan/${walletAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center"
              >
                View all on POAP.xyz
                <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : poaps.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide max-w-full">
            <div className="flex gap-4 py-2 min-w-max">
              {poaps.map((poap, index) => (
                <PoapCard key={index} poap={poap} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No POAPs found for this wallet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
