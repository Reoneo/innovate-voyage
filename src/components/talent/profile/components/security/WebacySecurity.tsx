
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWebacyData } from './hooks/useWebacyData';
import SecuritySummary from './components/SecuritySummary';
import SecurityDetailContent from './components/SecurityDetailContent';

interface WebacySecurityProps {
  walletAddress?: string;
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  const { securityData, isLoading, error } = useWebacyData(walletAddress);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = () => {
    setDialogOpen(true);
  };

  // If there's no wallet address, don't render anything
  if (!walletAddress) {
    console.log("No wallet address provided to WebacySecurity component");
    return null;
  }

  console.log("WebacySecurity rendering with data:", { 
    walletAddress, 
    isLoading, 
    threatLevel: securityData?.threatLevel 
  });

  return (
    <>
      <SecuritySummary 
        isLoading={isLoading}
        threatLevel={securityData?.threatLevel}
        onClick={handleClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${securityData?.threatLevel ? 
                (securityData.threatLevel === 'LOW' ? 'text-green-500' : 
                 securityData.threatLevel === 'MEDIUM' ? 'text-yellow-500' : 
                 securityData.threatLevel === 'HIGH' ? 'text-red-500' : 
                 'text-gray-500') : 'text-gray-500'}`} 
              />
              Wallet Security Analysis
            </DialogTitle>
            <DialogDescription>
              Powered by Webacy security intelligence
            </DialogDescription>
          </DialogHeader>
          
          <SecurityDetailContent 
            securityData={securityData}
            error={error}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebacySecurity;
