
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Web3Button } from '@web3modal/react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WalletConnectButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  // Store the connected address in localStorage and window object
  React.useEffect(() => {
    if (address && isConnected) {
      localStorage.setItem('connectedWalletAddress', address);
      window.connectedWalletAddress = address;
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
      });
    } else if (!isConnected) {
      localStorage.removeItem('connectedWalletAddress');
      window.connectedWalletAddress = null;
    }
  }, [address, isConnected, toast]);

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('connectedWalletAddress');
    window.connectedWalletAddress = null;
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
    
    // Refresh the page after disconnecting
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (isConnected && address) {
    return (
      <Button 
        onClick={handleDisconnect}
        variant="outline"
        className="flex items-center gap-2"
      >
        <span className="hidden sm:inline">
          {address.substring(0, 6)}...{address.substring(38)}
        </span>
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return <Web3Button icon="hide" label="Connect Wallet" balance="hide" />;
};

export default WalletConnectButton;
