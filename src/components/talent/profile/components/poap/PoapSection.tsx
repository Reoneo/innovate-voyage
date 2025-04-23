
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!walletAddress) return;
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        console.log("Fetched POAPs:", fetchedPoaps);
        // Sort POAPs by supply (ascending) so most limited supply first
        const sortedPoaps = [...fetchedPoaps].sort((a, b) => {
          const aSupply = a.event.supply ?? 999999;
          const bSupply = b.event.supply ?? 999999;
          return aSupply - bSupply;
        });
        setPoaps(sortedPoaps);
        setCurrentPoapIndex(0); // Reset to first POAP when loading new ones
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPoaps();
  }, [walletAddress]);

  const navigatePoap = (direction: 'prev' | 'next') => {
    if (poaps.length === 0) return;
    
    if (direction === 'prev') {
      setCurrentPoapIndex(prev => (prev > 0 ? prev - 1 : poaps.length - 1));
    } else {
      setCurrentPoapIndex(prev => (prev < poaps.length - 1 ? prev + 1 : 0));
    }
  };

  if (!walletAddress) return null;

  // Poap main image override
  const mainPoapImg = "https://imgur.com/Eb2LIkP.png";
  const currentPoap = poaps.length > 0 ? poaps[currentPoapIndex] : undefined;

  return (
    <section className="mt-4 bg-white rounded-xl shadow-sm px-0 py-0 mb-2 overflow-hidden max-w-full transition-all">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="pb-1 bg-gradient-to-br from-[#e5deff] to-[#fafbfe] py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gradient-primary tracking-wide">
              <img
                src={mainPoapImg}
                className="h-6 w-6"
                alt="Proof of Attendance"
              />
              Proof of Attendance
            </CardTitle>
            <CollapsibleTrigger asChild>
              <button
                onClick={() => setOpen(!open)}
                className="ml-auto group rounded-full p-1 hover:bg-gray-100 transition"
                aria-label={open ? 'Hide POAP details' : 'Show POAP details'}
              >
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-2 pb-3 px-3 flex flex-col items-center min-h-0">
            {isLoading ? (
              <div className="flex gap-4 justify-center pt-8 pb-8 w-full">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : currentPoap ? (
              <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentPoap.event.image_url}
                      alt={currentPoap.event.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                      style={{ background: "#f6f2ff" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-1 line-clamp-2">{currentPoap.event.description || "No description available"}</p>
                    <div className="flex flex-wrap gap-3 mt-2 items-center">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        ID #{currentPoap.tokenId}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {formatDate(currentPoap.event.start_date)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        Supply: {currentPoap.event.supply || "Unlimited"}
                      </span>
                      
                      <div className="flex items-center ml-auto">
                        <button 
                          onClick={() => navigatePoap('prev')}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Previous POAP"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs mx-2">
                          {currentPoapIndex + 1}/{poaps.length}
                        </span>
                        <button 
                          onClick={() => navigatePoap('next')}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Next POAP"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
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
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default PoapSection;
