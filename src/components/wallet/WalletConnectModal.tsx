
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/securityUtils';

// No need to redeclare the window interface here since it's defined in types/ethereum.d.ts
// Just use the existing interface

const WalletConnectModal: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up event listener for opening the modal
    const openWalletHandler = () => {
      if (window.connectWalletModal) {
        window.connectWalletModal.showModal();
      }
    };

    document.addEventListener('open-wallet-connect', openWalletHandler);
    
    return () => {
      document.removeEventListener('open-wallet-connect', openWalletHandler);
    };
  }, []);

  const connectMetamask = async () => {
    setConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask browser extension to continue",
          variant: "destructive",
        });
        setConnecting(false);
        return;
      }
      
      // Request account access - using a safer method with error handling
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          // Save connected address to window and localStorage for persistence
          window.connectedWalletAddress = accounts[0];
          await secureStorage.setItem('connectedWalletAddress', accounts[0]);
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
          });
          
          if (window.connectWalletModal) {
            window.connectWalletModal.close();
          }
          
          // Use a timeout before refreshing to ensure toast is displayed
          setTimeout(() => {
            // Use a reload triggered by the user instead of an automatic one
            // to prevent breaking the page
            window.location.href = window.location.href;
          }, 1500);
        }
      } catch (error: any) {
        console.error('MetaMask request error:', error);
        toast({
          title: "Connection Failed",
          description: error.message || "There was an error connecting to your wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting to your wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const closeModal = () => {
    if (window.connectWalletModal) {
      window.connectWalletModal.close();
    }
  };

  return (
    <dialog id="connectWalletModal" className="modal backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-lg shadow-xl p-0 w-[90%] max-w-md">
      <div className="bg-background p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Connect Wallet</h3>
          <Button variant="ghost" size="icon" onClick={closeModal}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Connect your wallet to view and edit your profile
        </p>

        <div className="space-y-2">
          <Button 
            className="w-full justify-between"
            disabled={connecting}
            onClick={connectMetamask}
          >
            <span>MetaMask</span>
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <img src="/metamask-fox.svg" alt="MetaMask" className="h-5 w-5" />}
          </Button>
            
          <Button 
            className="w-full justify-between" 
            variant="outline"
            disabled={connecting}
            onClick={closeModal}
          >
            <span>Cancel</span>
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          By connecting, you agree to let this app view your wallet address
        </p>
      </div>
    </dialog>
  );
};

export default WalletConnectModal;
