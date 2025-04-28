
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
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
  
  const currentPoap = poaps[currentPoapIndex];

  return (
    <section className="mt-4 w-full">
      <div className="relative flex items-center justify-center">
        <div className="relative w-60 h-60 mx-auto"> {/* Increased from w-40 h-40 to w-60 h-60 */}
          <img
            src="/lovable-uploads/78b95b30-fa09-4371-9086-b91b83cd187e.png"
            alt="Badge background"
            className="absolute inset-0 w-full h-full object-contain"
          />
          
          {isLoading ? (
            <Skeleton className="h-48 w-48 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> // Increased from h-32 w-32 to h-48 w-48
          ) : poaps.length > 0 ? (
            <div className="relative flex items-center justify-center h-full">
              <button 
                onClick={() => currentPoapIndex > 0 && setCurrentPoapIndex(prev => prev - 1)}
                className="absolute left-0 z-10 p-1 rounded-full bg-white/80 shadow-sm -translate-x-1/2"
                disabled={currentPoapIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <img 
                src={currentPoap.event.image_url}
                alt={currentPoap.event.name}
                onClick={() => {
                  setSelectedPoap(currentPoap);
                  setDetailOpen(true);
                }}
                className="w-42 h-42 object-contain rounded-full cursor-pointer absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" // Increased from w-28 h-28 to w-42 h-42, adjusted top positioning
                style={{ 
                  objectFit: 'contain',
                }}
              />
              
              <button 
                onClick={() => currentPoapIndex < poaps.length - 1 && setCurrentPoapIndex(prev => prev + 1)}
                className="absolute right-0 z-10 p-1 rounded-full bg-white/80 shadow-sm translate-x-1/2"
                disabled={currentPoapIndex === poaps.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No POAPs</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedPoap && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPoap.event.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={selectedPoap.event.image_url}
                  alt={selectedPoap.event.name}
                  className="w-32 h-32 mx-auto object-contain"
                />
                <div className="space-y-2">
                  <p className="text-sm">{selectedPoap.event.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Token ID</p>
                      <p className="text-sm font-medium">#{selectedPoap.tokenId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Supply</p>
                      <p className="text-sm font-medium">{selectedPoap.event.supply || "Unlimited"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PoapSection;

