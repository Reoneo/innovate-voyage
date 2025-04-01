
import { useState, useEffect } from 'react';

export function useConnectedWallet() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  useEffect(() => {
    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
  }, []);

  return { connectedWallet };
}
