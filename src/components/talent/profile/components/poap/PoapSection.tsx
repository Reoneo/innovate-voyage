import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, fetchPoapEventOwners, type Poap } from '@/api/services/poapService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  if (!walletAddress) return null;
  const currentPoap = poaps[currentPoapIndex];
  return <section className="mt-4 w-full">
      <div className="relative flex items-center justify-center">
        <div className="relative w-[400px] h-[400px] mx-auto">
          {isLoading ? <Skeleton className="h-[360px] w-[360px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : poaps.length > 0 ? <div className="relative flex items-center justify-center h-full">
              <img src={currentPoap.event.image_url} alt={currentPoap.event.name} onClick={() => handleOpenDetail(currentPoap)} className="w-72 h-72 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] z-10 cursor-pointer" style={{
            objectFit: 'contain'
          }} />

              <img src="/lovable-uploads/78b95b30-fa09-4371-9086-b91b83cd187e.png" alt="Badge background" className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none" />
              
              <button onClick={() => currentPoapIndex > 0 && setCurrentPoapIndex(prev => prev - 1)} className="absolute left-0 z-30 p-1 rounded-full bg-white/80 shadow-sm -translate-x-1/2" disabled={currentPoapIndex === 0}>
                <ChevronLeft className="h4 w4 object-cover" />
              </button>
              
              <button onClick={() => currentPoapIndex < poaps.length - 1 && setCurrentPoapIndex(prev => prev + 1)} className="absolute right-0 z-30 p-1 rounded-full bg-white/80 shadow-sm translate-x-1/2" disabled={currentPoapIndex === poaps.length - 1}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div> : <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No POAPs</p>
            </div>}
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen} className="object-contain">
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
    </section>;
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