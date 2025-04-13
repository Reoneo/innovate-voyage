
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';
import { Button } from '@/components/ui/button';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!walletAddress) return;
    
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        // Fetch all POAPs
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

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -200, behavior: 'smooth' });
      setScrollPosition(scrollContainer.current.scrollLeft - 200);
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 200, behavior: 'smooth' });
      setScrollPosition(scrollContainer.current.scrollLeft + 200);
    }
  };

  if (!walletAddress || (poaps.length === 0 && !isLoading)) {
    return null; // Don't render the section if there are no POAPs
  }

  return (
    <Card id="poap-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <img 
                src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
                className="h-6 w-6" 
                alt="Proof of Attendance Protocol" 
              />
              Proof of Attendance
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-full" />
            ))}
          </div>
        ) : poaps.length > 0 ? (
          <div className="relative">
            {poaps.length > 4 && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 rounded-full"
                  onClick={scrollLeft}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 rounded-full"
                  onClick={scrollRight}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <div 
              ref={scrollContainer}
              className="flex gap-4 overflow-x-auto py-2 px-2 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {poaps.map((poap) => (
                <PoapCard key={poap.tokenId} poap={poap} />
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
