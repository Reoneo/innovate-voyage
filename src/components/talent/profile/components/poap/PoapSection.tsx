import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { type Poap } from '@/api/services/poapService';
import PoapCarousel from './PoapCarousel';
import PoapDetailContent from './PoapDetailContent';
import { usePoapData } from './usePoapData';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({
  walletAddress
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  
  const {
    poaps,
    isLoading,
    currentPoapIndex,
    setCurrentPoapIndex,
    selectedPoap,
    setSelectedPoap,
    poapOwners,
    loadingOwners,
    loadPoapOwners
  } = usePoapData(walletAddress);

  // Handler for opening POAP details
  const handleOpenDetail = (poap: Poap) => {
    setSelectedPoap(poap);
    setDetailOpen(true);
    loadPoapOwners(poap.event.id);
  };

  // Handler for carousel changes
  const handleCarouselChange = (index: number) => {
    setCurrentPoapIndex(index);
  };

  if (!walletAddress) return null;
  if (poaps.length === 0 && !isLoading) return null;

  return (
    <section className="w-full flex flex-col items-center mt-8 mb-8">
      {/* POAP count display */}
      {poaps.length > 0 && !isLoading && (
        <div className="text-sm text-center mb-10 text-muted-foreground z-10 relative">
          <span className="font-medium text-black">{poaps.length}</span> POAPs collected
        </div>
      )}

      <div className="relative w-full h-48 flex items-center justify-center mb-6">
        {isLoading ? (
          <Skeleton className="w-52 h-52 rounded-full" />
        ) : poaps.length > 0 ? (
          <div className="relative flex items-center justify-center w-full">
            {/* POAP Badge with Carousel */}
            <PoapCarousel 
              poaps={poaps} 
              onPoapClick={handleOpenDetail}
              onCarouselChange={handleCarouselChange} 
            />
          </div>
        ) : null}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedPoap && (
            <>
              <DialogHeader className="relative">
                <DialogTitle>{selectedPoap.event.name}</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-6 w-6"
                  onClick={() => setDetailOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <PoapDetailContent 
                poap={selectedPoap} 
                poapOwners={poapOwners}
                loadingOwners={loadingOwners} 
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PoapSection;
