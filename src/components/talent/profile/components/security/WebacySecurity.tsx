
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWebacyData } from './hooks/useWebacyData';
import SecuritySummary from './components/SecuritySummary';
import SecurityDetailContent from './components/SecurityDetailContent';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface WebacySecurityProps {
  walletAddress?: string;
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  const { securityData, isLoading, error } = useWebacyData(walletAddress);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Reset dialog state when wallet address changes
  useEffect(() => {
    setDialogOpen(false);
  }, [walletAddress]);

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
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://img.cryptorank.io/coins/webacy1675847088001.png" alt="Webacy" />
                <AvatarFallback>W</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-left">
                  Wallet Security Analysis
                </DialogTitle>
                <DialogDescription className="text-left">
                  Powered by Webacy security intelligence
                </DialogDescription>
              </div>
            </div>
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
