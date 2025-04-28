import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);
  const [enlargeOpen, setEnlargeOpen] = useState(false);
  const [selectedPoapImage, setSelectedPoapImage] = useState<string>("");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!walletAddress) return;
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        console.log("Fetched POAPs:", fetchedPoaps);
        const sortedPoaps = [...fetchedPoaps].sort((a, b) => {
          const aSupply = a.event.supply ?? 999999;
          const bSupply = b.event.supply ?? 999999;
          return aSupply - bSupply;
        });
        setPoaps(sortedPoaps);
        setCurrentPoapIndex(0);
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

  const openEnlargeDialog = (imageUrl: string) => {
    setSelectedPoapImage(imageUrl);
    setEnlargeOpen(true);
  };

  if (!walletAddress) return null;

  const displayedPoaps = poaps.slice(0, Math.min(poaps.length, 12));

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
            ) : displayedPoaps.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
                  <div className="grid grid-cols-4 gap-2 w-full min-w-max">
                    {displayedPoaps.map((poap, index) => (
                      <div 
                        key={poap.tokenId}
                        onClick={() => {
                          setCurrentPoapIndex(index);
                          openEnlargeDialog(poap.event.image_url);
                        }}
                        className="aspect-square w-24 cursor-pointer hover:opacity-90 transition-all"
                      >
                        <img
                          src={poap.event.image_url}
                          alt={poap.event.name}
                          className="w-full h-full object-cover rounded-md border border-gray-200 shadow-sm"
                          style={{ background: "#f6f2ff" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {currentPoap && (
                  <div className="flex flex-col w-full border-t pt-3 mt-2">
                    <div className="overflow-hidden">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              navigatePoap('prev');
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <span className="text-xs mx-2">
                            {currentPoapIndex + 1}/{poaps.length}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigatePoap('next');
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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

      {enlargeOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setEnlargeOpen(false)}
        >
          <button 
            onClick={() => setEnlargeOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={selectedPoapImage} 
            alt="POAP" 
            className="max-w-full max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default PoapSection;
