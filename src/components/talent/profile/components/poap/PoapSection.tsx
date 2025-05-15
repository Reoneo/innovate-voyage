
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPoapsByAddress, Poap } from '@/api/services/poapService';
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
      const owners = await fetchPoapEventById(eventId);
      setPoapOwners(owners ? [owners] : []);
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

  // Skip rendering if no wallet address or no POAPs and finished loading
  if (!walletAddress) return null;
  if (poaps.length === 0 && !isLoading) return null;

  const currentPoap = poaps[currentPoapIndex];

  return (
    <section className="mb-6">
      <h3 className="text-lg font-medium mb-2">POAPs</h3>
      <div className="relative w-full aspect-square max-w-[240px] mx-auto">
        {/* Purple badge border SVG background */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 300 300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Purple Border Badge */}
          <path 
            d="M150,5 C129,5 118,12 105,20 C92,28 76,38 60,38 C43,38 28,28 15,20 C10,18 5,15 5,25 C5,45 5,77 5,100 C5,140 5,150 15,180 C25,210 45,235 75,255 C105,275 120,280 150,295 C180,280 195,275 225,255 C255,235 275,210 285,180 C295,150 295,140 295,100 C295,77 295,45 295,25 C295,15 290,18 285,20 C272,28 257,38 240,38 C224,38 208,28 195,20 C182,12 171,5 150,5 Z" 
            fill="transparent" 
            stroke="#8B5CF6" 
            strokeWidth="10" 
          />
          {/* Pink Ribbon at Bottom */}
          <path 
            d="M75,255 L50,290 L75,275 L105,295 L135,275 L150,295 L165,275 L195,295 L225,275 L250,290 L225,255" 
            fill="#FBCFE8" 
            stroke="#000" 
            strokeWidth="2" 
          />
        </svg>

        {/* POAP image or loading skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-36 w-36 rounded-full" />
          ) : poaps.length > 0 ? (
            <img 
              src={currentPoap.event.image_url} 
              alt={currentPoap.event.name} 
              onClick={() => handleOpenDetail(currentPoap)}
              className="w-32 h-32 rounded-full object-contain cursor-pointer z-10"
            />
          ) : null}
        </div>

        {/* Navigation buttons */}
        {poaps.length > 1 && (
          <>
            <button
              onClick={() => currentPoapIndex > 0 && setCurrentPoapIndex(prev => prev - 1)}
              className="absolute left-0 top-1/2 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm -translate-x-1/2 -translate-y-1/2"
              disabled={currentPoapIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => currentPoapIndex < poaps.length - 1 && setCurrentPoapIndex(prev => prev + 1)}
              className="absolute right-0 top-1/2 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm translate-x-1/2 -translate-y-1/2"
              disabled={currentPoapIndex === poaps.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* POAP Detail Dialog */}
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

// Helper function from the original API
async function fetchPoapEventById(eventId: number) {
  try {
    const response = await fetch(`https://api.poap.tech/events/id/${eventId}`, {
      headers: {
        'X-API-Key': "K6o3vqiX0yr5BXqOCKGVGoJbVqJQNXebRNgg2NnFfvCQ8g0vCowmpv4fgD9sXsDR6wrEhCCv7sLEoaN4neqT9whf3KNO43ILdKpfepOIvDm4nL4BTRdbETbD10ibpizW",
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching POAP event:', error);
    return null;
  }
}

export default PoapSection;
