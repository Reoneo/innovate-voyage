import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';

const WalletConnectButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { toast } = useToast();

  // Store the connected address securely and in window object
  React.useEffect(() => {
    if (address && isConnected) {
      // Use secure storage instead of plain localStorage
      secureStorage.setWalletAddress(address);
      
      // Keep window object for compatibility (but mark as deprecated)
      window.connectedWalletAddress = address;
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
      });
    } else if (!isConnected) {
      secureStorage.removeSecureItem('wallet_address');
      localStorage.removeItem('connectedWalletAddress'); // Clean up old storage
      window.connectedWalletAddress = null;
    }
  }, [address, isConnected, toast]);

  const handleDisconnect = () => {
    disconnect();
    secureStorage.clearAll(); // Clear all secure storage
    localStorage.removeItem('connectedWalletAddress'); // Clean up old storage
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

  return (
    <Button 
      onClick={() => open()}
      variant="outline"
      className="flex items-center gap-2"
    >
      <span className="hidden sm:inline">Connect Wallet</span>
      <Wallet className="h-4 w-4" />
    </Button>
  );
};

export default WalletConnectButton;
