
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ThreatLevelCard from './components/ThreatLevelCard';
import SecurityDialogContent from './components/SecurityDialogContent';
import { useWebacyData } from './hooks/useWebacyData';

interface WebacySecurityProps {
  walletAddress?: string;
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { securityData, isLoading, error, riskHistory } = useWebacyData(walletAddress);

  const handleClick = () => {
    setDialogOpen(true);
  };

  if (!walletAddress) return null;

  return (
    <>
      <div 
        onClick={handleClick}
        className="cursor-pointer transition-all hover:opacity-80"
      >
        <ThreatLevelCard 
          securityData={securityData} 
          isLoading={isLoading} 
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <SecurityDialogContent 
            securityData={securityData}
            riskHistory={riskHistory}
            error={error}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebacySecurity;
