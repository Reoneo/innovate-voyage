
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

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const showLeft = poaps.length > 1 && activeIndex > 0;
  const showRight = poaps.length > 1 && activeIndex < poaps.length - 1;

  const goLeft = () => setActiveIndex(Math.max(activeIndex - 1, 0));
  const goRight = () => setActiveIndex(Math.min(activeIndex + 1, poaps.length - 1));

  if (!walletAddress) return null;

  return (
    <section className="mt-4 bg-gradient-to-br from-[#e5deff] via-[#d3e4fd]/50 to-[#fafbfe] rounded-xl shadow-lg px-2 py-6 mb-2 min-h-[230px] max-w-full">
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
      <CardContent className="flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex gap-4 justify-center">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-28 rounded-full" />
            ))}
          </div>
        ) : poaps.length > 0 ? (
          <div className="relative w-full flex flex-col items-center">
            <div className="flex items-center justify-center w-full mt-2 max-w-xl mx-auto gap-2">
              {showLeft && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={goLeft}
                  className="rounded-full bg-white border shadow transition hover:bg-[#e5deff]/70"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex-grow flex justify-center">
                <div className="transition-transform duration-300">
                  <PoapCard poap={poaps[activeIndex]} />
                  <div className="mt-2 text-xs text-center text-muted-foreground opacity-80">
                    {activeIndex + 1} / {poaps.length}
                  </div>
                </div>
              </div>
              {showRight && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={goRight}
                  className="rounded-full bg-white border shadow transition hover:bg-[#e5deff]/70"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
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
