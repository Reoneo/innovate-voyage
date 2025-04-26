
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPoapsByAddress, type Poap } from '@/api/services/poapService';
import { resolveAddressToEns } from '@/utils/ens';
import { X, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const [owners, setOwners] = useState<{address: string, ensName?: string}[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
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

  const fetchPoapOwners = async (poap: Poap) => {
    setOwnersLoading(true);
    
    try {
      // For this example, we'll just simulate getting owners
      // In a real implementation, you would fetch this from POAP's API
      const mockOwners = [
        { address: '0x123456789abcdef123456789abcdef123456789a' },
        { address: '0xabcdef123456789abcdef123456789abcdef1234' },
        { address: '0x789abcdef123456789abcdef123456789abcdef1' },
      ];
      
      // Resolve ENS names for the addresses
      const ownersWithEns = await Promise.all(
        mockOwners.map(async (owner) => {
          try {
            const ensName = await resolveAddressToEns(owner.address);
            return { ...owner, ensName };
          } catch (error) {
            console.error('Error resolving ENS:', error);
            return owner;
          }
        })
      );
      
      setOwners(ownersWithEns);
    } catch (error) {
      console.error('Error fetching POAP owners:', error);
      setOwners([]);
    } finally {
      setOwnersLoading(false);
    }
  };

  const openPoapDetail = (poap: Poap) => {
    setSelectedPoap(poap);
    fetchPoapOwners(poap);
    setDetailOpen(true);
  };

  if (!walletAddress) return null;
  
  const currentPoap = poaps[currentPoapIndex];
  const mainPoapImg = "https://imgur.com/Eb2LIkP.png";

  return (
    <section className="mt-4 bg-white rounded-xl shadow-sm px-0 py-0 mb-2 overflow-hidden w-full">
      <CardHeader className="pb-1 bg-gradient-to-br from-[#e5deff] to-[#fafbfe] py-2 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gradient-primary tracking-wide">
            <img
              src={mainPoapImg}
              className="h-6 w-6"
              alt="Proof of Attendance"
            />
            POAPs
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-lg" />
        ) : poaps.length > 0 ? (
          <div className="flex flex-col items-center">
            {/* POAP Carousel */}
            <div className="relative w-full flex items-center justify-center my-2">
              <button 
                onClick={() => navigatePoap('prev')}
                className="absolute left-0 z-10 p-1 rounded-full bg-white/80 shadow-sm"
                aria-label="Previous POAP"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div 
                className="w-32 h-32 cursor-pointer" 
                onClick={() => openPoapDetail(currentPoap)}
              >
                <img 
                  src={currentPoap.event.image_url}
                  alt={currentPoap.event.name} 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              
              <button 
                onClick={() => navigatePoap('next')}
                className="absolute right-0 z-10 p-1 rounded-full bg-white/80 shadow-sm"
                aria-label="Next POAP"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Navigation indicator */}
            <div className="flex justify-center mt-2 space-x-1">
              {poaps.map((_, index) => (
                <span 
                  key={index} 
                  className={`inline-block h-1.5 rounded-full ${index === currentPoapIndex ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300'}`}
                  onClick={() => setCurrentPoapIndex(index)}
                />
              ))}
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

      {/* POAP Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedPoap && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPoap.event.name}</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedPoap.event.start_date)}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="holders">Holders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="flex justify-center my-4">
                    <img 
                      src={selectedPoap.event.image_url}
                      alt={selectedPoap.event.name}
                      className="max-h-40 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">{selectedPoap.event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Token ID</p>
                        <p className="text-sm font-medium">#{selectedPoap.tokenId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Supply</p>
                        <p className="text-sm font-medium">{selectedPoap.event.supply || "Unlimited"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">City</p>
                        <p className="text-sm font-medium">{selectedPoap.event.city || "Virtual"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Country</p>
                        <p className="text-sm font-medium">{selectedPoap.event.country || "Global"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="holders">
                  {ownersLoading ? (
                    <div className="py-8 text-center">
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : owners.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {owners.map((owner, index) => (
                        <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={`https://effigy.im/a/${owner.address}.svg`} />
                            <AvatarFallback>
                              {owner.ensName ? owner.ensName.substring(0, 1).toUpperCase() : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {owner.ensName || `${owner.address.substring(0, 6)}...${owner.address.substring(38)}`}
                            </p>
                            {owner.ensName && (
                              <p className="text-xs text-muted-foreground">
                                {`${owner.address.substring(0, 6)}...${owner.address.substring(38)}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <p className="text-muted-foreground">No holder data available</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default PoapSection;
