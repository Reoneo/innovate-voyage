
import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';
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

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentPoapIndex(prev => prev > 0 ? prev - 1 : poaps.length - 1);
  };

  const handleNext = () => {
    setCurrentPoapIndex(prev => prev < poaps.length - 1 ? prev + 1 : 0);
  };

  if (!walletAddress) return null;
  if (poaps.length === 0 && !isLoading) return null;

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Proof of Attendance</h3>
        {poaps.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {currentPoapIndex + 1} of {poaps.length}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      ) : poaps.length > 0 ? (
        <div className="flex flex-col items-center space-y-3">
          {/* Current POAP */}
          <div className="relative">
            <div 
              onClick={() => handleOpenDetail(poaps[currentPoapIndex])}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <PoapCard poap={poaps[currentPoapIndex]} />
            </div>
          </div>

          {/* Navigation */}
          {poaps.length > 1 && (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : null}

      {/* POAP Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>POAP Details</DialogTitle>
          </DialogHeader>
          {selectedPoap && (
            <PoapDetailContent 
              poap={selectedPoap}
              owners={poapOwners}
              loadingOwners={loadingOwners}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoapSection;
