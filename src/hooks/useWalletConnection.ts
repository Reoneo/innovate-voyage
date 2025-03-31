
import { useState, useEffect } from 'react';

export function useWalletConnection() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    // Initialize from localStorage
    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
    
    // Event handler for wallet connection modal
    const handleWalletConnect = () => {
      if (window.connectWalletModal) {
        window.connectWalletModal.showModal();
      }
    };
    
    // Event handler for wallet disconnection
    const handleWalletDisconnect = () => {
      setConnectedWallet(null);
    };
    
    // Register event listeners
    document.addEventListener('open-wallet-connect', handleWalletConnect);
    document.addEventListener('wallet-disconnected', handleWalletDisconnect);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('open-wallet-connect', handleWalletConnect);
      document.removeEventListener('wallet-disconnected', handleWalletDisconnect);
    };
  }, []);

  return { connectedWallet };
}
