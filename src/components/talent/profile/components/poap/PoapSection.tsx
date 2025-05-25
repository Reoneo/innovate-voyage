
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
    setCurrentPoapIndex((prev) => prev > 0 ? prev - 1 : poaps.length - 1);
  };

  const handleNext = () => {
    setCurrentPoapIndex((prev) => prev < poaps.length - 1 ? prev + 1 : 0);
  };

  if (!walletAddress) return null;
  if (poaps.length === 0 && !isLoading) return null;

  return (
    <section className="w-full flex flex-col items-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">POAP Collection</h3>
        {poaps.length > 0 && !isLoading && (
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">{poaps.length}</span> POAPs collected
          </div>
        )}
      </div>

      <div className="relative w-full max-w-sm flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="w-48 h-48 rounded-full" />
        ) : poaps.length > 0 ? (
          <div className="relative flex items-center justify-center w-full">
            {/* Previous button */}
            {poaps.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-0 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Current POAP */}
            <div 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleOpenDetail(poaps[currentPoapIndex])}
            >
              <PoapCard poap={poaps[currentPoapIndex]} />
            </div>

            {/* Next button */}
            {poaps.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-0 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : null}
      </div>

      {/* POAP counter */}
      {poaps.length > 1 && !isLoading && (
        <div className="mt-4 text-center text-sm text-gray-600">
          POAP {currentPoapIndex + 1} of {poaps.length}
        </div>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedPoap && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPoap.event.name}</DialogTitle>
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
