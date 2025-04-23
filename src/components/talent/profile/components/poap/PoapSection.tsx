
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!walletAddress) return;
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        // Sort POAPs by supply (ascending) so most limited supply first
        const sortedPoaps = [...fetchedPoaps].sort((a, b) => {
          const aSupply = a.event.supply ?? 999999;
          const bSupply = b.event.supply ?? 999999;
          return aSupply - bSupply;
        });
        setPoaps(sortedPoaps);
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPoaps();
  }, [walletAddress]);

  if (!walletAddress) return null;

  // Poap main image override
  const mainPoapImg = "https://imgur.com/Eb2LIkP.png";

  const minimalPoap = poaps.length > 0 ? poaps[0] : undefined;

  return (
    <section className="mt-4 bg-white rounded-xl shadow-sm px-0 py-0 mb-2 overflow-hidden max-w-full transition-all">
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
              onClick={() => setOpen((v) => !v)}
              className="ml-auto group rounded-full p-1 hover:bg-gray-100 transition"
              aria-label={open ? 'Hide POAP details' : 'Show POAP details'}
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent>
          <CardContent className="pt-2 pb-3 px-3 flex flex-col items-center min-h-0">
            {isLoading ? (
              <div className="flex gap-4 justify-center pt-8 pb-8 w-full">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : minimalPoap ? (
              <div className="flex flex-col md:flex-row md:items-center w-full md:gap-4">
                <img
                  src={mainPoapImg}
                  alt={minimalPoap.event.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border border-gray-300 shadow-sm flex-shrink-0 mx-auto md:mx-0"
                  style={{ background: "#f6f2ff" }}
                />
                <div className="flex-1 md:ml-4 mt-2 md:mt-0 text-center md:text-left">
                  <p className="text-sm font-medium mb-1 line-clamp-3">{minimalPoap.event.description || "No description available"}</p>
                  <div className="flex flex-wrap text-xs gap-3 justify-center md:justify-start mt-2">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      ID #{minimalPoap.tokenId}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {formatDate(minimalPoap.event.start_date)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      Supply: {minimalPoap.event.supply || "Unlimited"}
                    </span>
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

