import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPoapsByAddress, fetchPoapEventOwners, type Poap } from '@/api/services/poapService';
import { Link } from 'react-router-dom';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({
  walletAddress
}) => {
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
  if (poaps.length === 0 && !isLoading) return null;

  const handleCarouselChange = (index: number) => {
    setCurrentPoapIndex(index);
  };

  return (
    <section className="w-full flex flex-col items-center">
      {/* POAP count display */}
      {poaps.length > 0 && !isLoading && (
        <div className="text-sm text-center mb-2 text-muted-foreground">
          <span className="font-medium text-primary">{poaps.length}</span> POAPs collected
        </div>
      )}

      <div className="relative w-full aspect-square flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="w-52 h-52 rounded-full" />
        ) : poaps.length > 0 ? (
          <div className="relative flex items-center justify-center w-full">
            {/* POAP Badge with Carousel for touch swipe */}
            <Carousel
              opts={{
                align: 'center',
                loop: poaps.length > 3,
              }}
              className="w-full max-w-xs"
              onSelect={(api) => {
                if (api) {
                  const currentIndex = api.selectedScrollSnap();
                  setCurrentPoapIndex(currentIndex);
                }
              }}
            >
              <CarouselContent>
                {poaps.map((poap, index) => (
                  <CarouselItem key={poap.tokenId} className="flex items-center justify-center">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => handleOpenDetail(poap)}
                    >
                      <img 
                        src={poap.event.image_url} 
                        alt={poap.event.name} 
                        className="w-44 h-44 rounded-full cursor-pointer z-10 p-2 object-contain"
                        style={{
                          background: 'rgba(0,0,0,0.7)',
                          boxShadow: '0 0 20px rgba(139,92,246,0.3)'
                        }}
                      />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {poaps.length > 1 && (
                <>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </>
              )}
            </Carousel>
          </div>
        ) : null}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedPoap && (
            <>
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
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedPoap.event.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Chain</p>
                      <p className="text-sm font-medium">{selectedPoap.chain}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">POAP Owners ({poapOwners.length})</h3>
                    
                    {loadingOwners ? (
                      <div className="flex flex-col space-y-2">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        ))}
                      </div>
                    ) : poapOwners && poapOwners.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {poapOwners.map((owner, index) => (
                          <PoapOwnerItem key={`${owner.owner}-${index}`} owner={owner} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No other owners found</p>
                    )}
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

  return (
    <Link to={`/${resolvedEns || owner.owner}/`} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{displayName}</span>
    </Link>
  );
};

export default PoapSection;
