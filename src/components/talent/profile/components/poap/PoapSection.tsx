
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PoapCarousel from './PoapCarousel';
import PoapDetailContent from './PoapDetailContent';
import { usePoapData } from './usePoapData';
import { Poap as PoapType } from '@/api/services/poapService';

interface PoapSectionProps {
  walletAddress: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const { 
    poaps, 
    isLoading,
    loadPoapOwners,
    poapOwners,
    loadingOwners
  } = usePoapData(walletAddress);
  const [selectedPoap, setSelectedPoap] = useState<PoapType | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Handle POAP selection
  const handlePoapSelect = (poap: PoapType) => {
    setSelectedPoap(poap);
    setShowDialog(true);
    
    // Load POAP owners when a POAP is selected
    if (poap?.event?.id) {
      loadPoapOwners(poap.event.id);
    }
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">POAPs</h2>
        <div className="h-28 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
          <p className="text-gray-400">Loading POAPs...</p>
        </div>
      </div>
    );
  }
  
  if (!poaps || poaps.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">POAPs</h2>
      <PoapCarousel 
        poaps={poaps} 
        onSelect={handlePoapSelect}
      />
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedPoap && (
            <PoapDetailContent 
              poap={selectedPoap}
              poapOwners={poapOwners}
              loadingOwners={loadingOwners}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoapSection;
