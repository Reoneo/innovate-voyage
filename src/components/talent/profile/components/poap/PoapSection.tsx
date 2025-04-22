
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';
import { Button } from '@/components/ui/button';

interface PoapSectionProps {
  walletAddress?: string;
}

// Futuristic gradient utilities
const futuristicBox = "bg-gradient-to-br from-[#23234d]/80 via-[#6E59A5]/30 to-[#0FA0CE]/20 border-0 shadow-[0_6px_24px_-6px_#657ae76a,0_1.5px_0.5px_#76acf361_inset,0_0_24px_2px_#7e69abe6_inset] glass-morphism";

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainer = React.useRef<HTMLDivElement>(null);

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

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (!walletAddress) {
    return null;
  }

  return (
    <section id="poap-card-section" className={`mt-4 rounded-xl ${futuristicBox} p-0`}>
      <CardHeader className="pb-1 bg-transparent">
        <div className="flex justify-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gradient-primary tracking-wide">
            <img 
              src="https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/65217fd9e31608b8b6814481_F6VrGAv1R6NfwsvJ98qWV-3DIpAg113tZkQOcTEKXS7rfWUDL3vLOGTk6FthuMHVk4Q9GgPslbKcbABUSM5wXdjgkEywl2cNZYrrkxggrpj018IahtxoJPeD4J5McyUO4oNqsF9T_bCJMWtYwSo9nQE.png" 
              className="h-7 w-7" 
              alt="Proof of Attendance Protocol" 
            />
            Proof of Attendance
          </CardTitle>
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
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/70 shadow-glass rounded-full border-none hover:bg-gradient-to-r hover:from-[#9b87f5] hover:to-[#0FA0CE]"
                  onClick={scrollLeft}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/70 shadow-glass rounded-full border-none hover:bg-gradient-to-l hover:from-[#9b87f5] hover:to-[#0FA0CE]"
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
                <div key={poap.tokenId}
                  className="transition-transform duration-300 hover:scale-105 will-change-transform select-none"
                >
                  <PoapCard poap={poap} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
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
