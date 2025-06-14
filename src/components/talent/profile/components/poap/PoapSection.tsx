
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePoapData } from './usePoapData';
import PoapCarousel from './PoapCarousel';
import PoapDetailContent from './PoapDetailContent';
import { Poap } from '@/api/services/poapService';
import { useProfileData } from '@/hooks/useProfileData';

interface PoapSectionProps {
  walletAddress: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const { poaps, loading, error } = usePoapData(walletAddress);
  const { avatarUrl } = useProfileData(undefined, walletAddress);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);

  const handlePoapClick = (poap: Poap) => {
    setSelectedPoap(poap);
  };

  const handleCloseDialog = () => {
    setSelectedPoap(null);
  };

  const handleCarouselChange = (index: number) => {
    setCurrentPoapIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full mt-4">
        <div className="flex items-center justify-center">
          <div className="w-36 h-36 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !poaps || poaps.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-4">
      <PoapCarousel 
        poaps={poaps}
        onPoapClick={handlePoapClick}
        onCarouselChange={handleCarouselChange}
        userAvatarUrl={avatarUrl}
      />
      
      <Dialog open={!!selectedPoap} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>POAP Details</DialogTitle>
          </DialogHeader>
          {selectedPoap && (
            <PoapDetailContent poap={selectedPoap} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoapSection;
