
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PoapCarousel from './PoapCarousel';
import PoapDetailContent from './PoapDetailContent';
import { usePoapData } from './usePoapData';

interface Poap {
  tokenId: string;
  chain?: string;
  created?: string;
  event: {
    name: string;
    description: string;
    image_url: string;
    start_date: string;
    end_date: string;
    country: string;
    city: string;
  };
  owner: {
    address: string;
  };
}

interface PoapSectionProps {
  walletAddress: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const { poaps, isLoading } = usePoapData(walletAddress);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Handle POAP selection
  const handlePoapSelect = (poap: Poap) => {
    setSelectedPoap(poap);
    setShowDialog(true);
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
          {selectedPoap && <PoapDetailContent poap={selectedPoap} onClose={handleCloseDialog} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoapSection;
