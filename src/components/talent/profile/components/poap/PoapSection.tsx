
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [hasMoreOwners, setHasMoreOwners] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  const loadPoapOwners = async (eventId: number, currentPage = 1, reset = true) => {
    if (!eventId) return;
    
    setLoadingOwners(true);
    
    try {
      // Get 20 owners per page
      const owners = await fetchPoapEventOwners(eventId);
      const pageSize = 20;
      const startIdx = (currentPage - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const pageOwners = owners.slice(startIdx, endIdx);
      
      // Check if we have more owners to load
      setHasMoreOwners(endIdx < owners.length);
      
      if (reset) {
        setPoapOwners(pageOwners);
      } else {
        setPoapOwners(prev => [...prev, ...pageOwners]);
      }
    } catch (error) {
      console.error('Error loading POAP owners:', error);
      setHasMoreOwners(false);
    } finally {
      setLoadingOwners(false);
    }
  };

  const loadMoreOwners = useCallback(() => {
    if (loadingOwners || !hasMoreOwners || !selectedPoap) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPoapOwners(selectedPoap.event.id, nextPage, false);
  }, [loadingOwners, hasMoreOwners, page, selectedPoap]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!loadMoreRef.current || loadingOwners || !detailOpen) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreOwners) {
          loadMoreOwners();
        }
      },
      { threshold: 0.5 }
    );
    
    observerRef.current.observe(loadMoreRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingOwners, hasMoreOwners, loadMoreOwners, detailOpen]);

  const handleOpenDetail = (poap: Poap) => {
    setSelectedPoap(poap);
    setDetailOpen(true);
    setPage(1);
    setHasMoreOwners(true);
    loadPoapOwners(poap.event.id, 1, true);
  };

  if (!walletAddress) return null;
  const currentPoap = poaps[currentPoapIndex];

  if (poaps.length === 0 && !isLoading) return null;

  return (
    <section>
      <div className="relative flex items-center justify-center">
        <div className="relative w-full h-[300px] mx-auto">
          {isLoading ? (
            <Skeleton className="h-[280px] w-[280px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          ) : poaps.length > 0 ? (
            <div className="relative flex items-center justify-center h-full">
              <img 
                src={currentPoap.event.image_url} 
                alt={currentPoap.event.name} 
                onClick={() => handleOpenDetail(currentPoap)}
                className="w-56 h-56 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer rounded-full p-4" 
                style={{
                  objectFit: 'contain',
                  background: 'linear-gradient(45deg, rgba(139,92,246,0.1), rgba(30,174,219,0.1))',
                  boxShadow: '0 0 30px rgba(139,92,246,0.2)',
                  border: '2px solid rgba(139,92,246,0.2)'
                }}
              />
              <button
                onClick={() => currentPoapIndex > 0 && setCurrentPoapIndex(prev => prev - 1)}
                className="absolute left-0 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm -translate-x-1/2"
                disabled={currentPoapIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => currentPoapIndex < poaps.length - 1 && setCurrentPoapIndex(prev => prev + 1)}
                className="absolute right-0 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm translate-x-1/2"
                disabled={currentPoapIndex === poaps.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

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
                    <div>
                      <p className="text-xs text-muted-foreground">Event Date</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedPoap.event.start_date).toLocaleDateString()} - {new Date(selectedPoap.event.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">
                        {selectedPoap.event.city}, {selectedPoap.event.country || "Virtual"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">POAP Owners</h3>
                    
                    {loadingOwners && poapOwners.length === 0 ? 
                      <div className="flex flex-col space-y-2">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        ))}
                      </div> 
                      : poapOwners && poapOwners.length > 0 ? 
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {poapOwners.map((owner, index) => (
                            <PoapOwnerItem key={`${owner.owner}-${index}`} owner={owner} />
                          ))}
                          {/* Infinite scroll reference element */}
                          <div ref={loadMoreRef} className="h-4 w-full">
                            {loadingOwners && <div className="flex justify-center py-2">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>}
                          </div>
                        </div> 
                        : <p className="text-sm text-muted-foreground">No owners found</p>
                    }
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

  return (
    <Link 
      to={`/${resolvedEns || owner.owner}`} 
      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{displayName}</span>
    </Link>
  );
};

export default PoapSection;
