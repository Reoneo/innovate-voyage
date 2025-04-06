import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface PoapSectionProps {
  walletAddress?: string;
  hideTitle?: boolean;
}

interface Poap {
  event: {
    id: number;
    fancy_id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    city: string;
    country: string;
    image_url: string;
    year: number;
  };
  tokenId: string;
  owner: string;
  chain: string;
  created: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress, hideTitle = false }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchPoaps = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use POAP API to fetch POAPs for the wallet address
        const response = await fetch(`https://api.poap.tech/actions/scan/${walletAddress}`, {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': '7xCyGbvGPTHYL9RA9QKZFmGKtjuWQTm5' // Replace with your actual API key
          }
        });

        if (!response.ok) {
          throw new Error(`POAP API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('POAP data:', data);
        
        // Sort POAPs by date (newest first)
        const sortedPoaps = data.sort((a: Poap, b: Poap) => 
          new Date(b.event.start_date).getTime() - new Date(a.event.start_date).getTime()
        );
        
        setPoaps(sortedPoaps);
      } catch (err) {
        console.error('Error fetching POAPs:', err);
        setError('Failed to load POAPs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoaps();
  }, [walletAddress]);

  if (!walletAddress) {
    return null;
  }

  // If hideTitle is true, don't render the Card wrapper and title
  if (hideTitle) {
    return (
      <CardContent>
        {renderPoapContent()}
      </CardContent>
    );
  }

  return (
    <Card className="mt-4" id="poap-section">
      <CardHeader className="pb-2">
        <CardTitle>Proof of Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {renderPoapContent()}
      </CardContent>
    </Card>
  );

  function renderPoapContent() {
    if (isLoading) {
      return (
        <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-none w-[150px]">
              <Skeleton className="h-[150px] w-[150px] rounded-full" />
              <Skeleton className="h-4 w-[100px] mt-2 mx-auto" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-4">
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (poaps.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No POAPs found for this address</p>
        </div>
      );
    }

    return (
      <Carousel className="w-full">
        <CarouselContent>
          {poaps.map((poap) => (
            <CarouselItem key={poap.tokenId} className="md:basis-1/4 lg:basis-1/5">
              <div className="flex flex-col items-center p-1">
                <div className="relative group">
                  <img 
                    src={poap.event.image_url} 
                    alt={poap.event.name}
                    className="w-[120px] h-[120px] rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/60 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    <Badge variant="outline" className="bg-background text-xs">
                      {poap.event.year}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-xs text-center font-medium truncate max-w-[120px]">
                  {poap.event.name}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    );
  }
};

export default PoapSection;
