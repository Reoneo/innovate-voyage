
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
  className?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({
  walletAddress,
  className = ""
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

  // Early returns for edge cases
  if (!walletAddress) return null;
  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center">
          <Skeleton className="w-52 h-52 rounded-full mx-auto" />
          <div className="mt-4">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }
  
  if (poaps.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* POAP Collection Display */}
      <div className="text-center space-y-4">
        {/* POAP count header */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{poaps.length}</span> POAPs collected
        </div>
        
        {/* POAP Carousel */}
        <div className="flex items-center justify-center">
          <PoapCarousel 
            poaps={poaps} 
            onPoapClick={handleOpenDetail}
            onCarouselChange={handleCarouselChange} 
          />
        </div>
      </div>

      {/* POAP Detail Modal */}
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
    </div>
  );
};

export default PoapSection;
