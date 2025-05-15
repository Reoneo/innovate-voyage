
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPoapsByAddress, fetchPoapEventOwners, type Poap } from '@/api/services/poapService';
import { Link } from 'react-router-dom';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const [poapOwners, setPoapOwners] = useState<any[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

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

  const loadPoapOwners = async (eventId: number) => {
    if (!eventId) return;
    setLoadingOwners(true);
    try {
      const owners = await fetchPoapEventOwners(eventId);
      if (owners && owners.length > 0) {
        setPoapOwners(owners);
      } else {
        setPoapOwners([]);
      }
    } catch (error) {
      console.error('Error loading POAP owners:', error);
      setPoapOwners([]);
    } finally {
      setLoadingOwners(false);
    }
  };

  const handleOpenDetail = (poap: Poap) => {
    setSelectedPoap(poap);
    setDetailOpen(true);
    loadPoapOwners(poap.event.id);
  };

  if (!walletAddress) return null;
  
  // Don't render anything if no POAPs and not loading
  if (poaps.length === 0 && !isLoading) return null;
  
  const currentPoap = poaps[currentPoapIndex];

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">POAPs</h3>
        {poaps.length > 0 && (
          <div className="text-sm text-muted-foreground">{currentPoapIndex + 1} of {poaps.length}</div>
        )}
      </div>
      
      <div className="relative flex items-center justify-center">
        {/* Purple bordered POAP badge container */}
        <div className="relative w-full max-w-[280px] mx-auto">
          <div className="aspect-square w-full flex items-center justify-center">
            {/* Purple border SVG */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
              <path
                d="M100,10 C120,10 140,20 160,40 C180,60 190,80 190,100 C190,120 180,140 160,160 C140,180 120,190 100,190 C80,190 60,180 40,160 C20,140 10,120 10,100 C10,80 20,60 40,40 C60,20 80,10 100,10 Z"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="4"
              />
              {/* Pink ribbons */}
              <path
                d="M100,190 L70,230 L100,210 L130,230 L100,190"
                fill="#FFD6E8"
                stroke="#000"
                strokeWidth="1"
              />
            </svg>
            
            {/* POAP Content */}
            <div className="relative z-10 w-[70%] h-[70%] flex items-center justify-center">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : poaps.length > 0 ? (
                <img 
                  src={currentPoap.event.image_url} 
                  alt={currentPoap.event.name} 
                  onClick={() => handleOpenDetail(currentPoap)}
                  className="w-full h-full object-contain rounded-full cursor-pointer" 
                />
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">No POAPs found</p>
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            {poaps.length > 1 && (
              <>
                <button
                  onClick={() => currentPoapIndex > 0 && setCurrentPoapIndex(prev => prev - 1)}
                  className="absolute left-0 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm -translate-x-1/2"
                  disabled={currentPoapIndex === 0}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => currentPoapIndex < poaps.length - 1 && setCurrentPoapIndex(prev => prev + 1)}
                  className="absolute right-0 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm translate-x-1/2"
                  disabled={currentPoapIndex === poaps.length - 1}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Show POAP name if available */}
      {poaps.length > 0 && !isLoading && (
        <div className="text-center mt-3">
          <p className="text-sm font-medium truncate">{currentPoap.event.name}</p>
          <p className="text-xs text-muted-foreground">{currentPoap.event.year}</p>
        </div>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedPoap && <>
              <DialogHeader>
                <DialogTitle>{selectedPoap.event.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img src={selectedPoap.event.image_url} alt={selectedPoap.event.name} className="w-32 h-32 mx-auto object-contain" />
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

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">POAP Owners</h3>
                    
                    {loadingOwners ? <div className="flex flex-col space-y-2">
                        {[1, 2, 3].map((_, i) => <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>)}
                      </div> : poapOwners && poapOwners.length > 0 ? <div className="max-h-48 overflow-y-auto space-y-2">
                        {poapOwners.map((owner, index) => <PoapOwnerItem key={`${owner.owner}-${index}`} owner={owner} />)}
                      </div> : <p className="text-sm text-muted-foreground">Loading owners...</p>}
                  </div>
                </div>
              </div>
            </>}
        </DialogContent>
      </Dialog>
    </section>
  );
};

const PoapOwnerItem = ({
  owner
}: {
  owner: any;
}) => {
  const {
    resolvedEns,
    avatarUrl
  } = useEnsResolver(undefined, owner.owner);
  const shortAddress = `${owner.owner.substring(0, 6)}...${owner.owner.substring(owner.owner.length - 4)}`;
  const displayName = resolvedEns || shortAddress;

  return <Link to={`/${resolvedEns || owner.owner}/`} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{displayName}</span>
    </Link>;
};

export default PoapSection;
