
import React from 'react';
import { Button } from '@/components/ui/button';

const WalletConnectButton: React.FC = () => {
  return (
    <Button 
      variant="outline"
      className="flex items-center gap-2"
      disabled
    >
      <span className="hidden sm:inline">Wallet Disabled</span>
    </Button>
  );
};

export default WalletConnectButton;
