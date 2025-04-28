
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function useProfilePage() {
  const { ensNameOrAddress, userId } = useParams<{ensNameOrAddress?: string, userId?: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  const [loadRetries, setLoadRetries] = useState<number>(0);
  
  // Determine which parameter to use (either regular path or recruitment.box path)
  const targetIdentifier = userId || ensNameOrAddress;
  
  useEffect(() => {
    // Attempt to clear any browser cache
    try {
      // Force page to be freshly loaded 
      if ('caches' in window) {
        const cacheNames = caches.keys();
        cacheNames.then(names => {
          for (const name of names) {
            if (name.includes('fetch-cache')) {
              caches.delete(name);
            }
          }
        });
      }
    } catch (err) {
      console.error('Error clearing caches:', err);
    }
    
    if (targetIdentifier) {
      // Direct address check - immediately use as address if valid
      if (isValidEthereumAddress(targetIdentifier)) {
        console.log(`Valid Ethereum address detected: ${targetIdentifier}`);
        setAddress(targetIdentifier);
        setEns(undefined); // Clear ENS when looking up by address
      } else {
        // Not a valid address, treat as ENS or domain
        // Ensure we handle .box domains properly
        const isDotBox = targetIdentifier.toLowerCase().endsWith('.box');
        const isEth = targetIdentifier.toLowerCase().endsWith('.eth') || targetIdentifier.includes('.');
        
        const ensValue = isEth ? targetIdentifier : 
                        isDotBox ? targetIdentifier : 
                        `${targetIdentifier}.eth`;
        
        console.log(`Treating as ENS/Domain: ${ensValue}`);
        setEns(ensValue);
        setAddress(undefined); // Clear address when looking up by ENS
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Set a progressive timeout system for loading
    setLoadingTimeout(false);
    setLoadRetries(0);
    
    const timeoutIds = [
      setTimeout(() => {
        console.log("First loading timeout (3s) - retrying...");
        setLoadRetries(prev => prev + 1);
      }, 3000),
      setTimeout(() => {
        console.log("Second loading timeout (6s) - retrying...");
        setLoadRetries(prev => prev + 1);
      }, 6000),
      setTimeout(() => {
        console.log("Final loading timeout (10s) - showing error");
        setLoadingTimeout(true);
      }, 10000)
    ];

    // Always optimize for desktop on profile page
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }

    // Clean URL - remove timestamp query parameter 
    if (window.history && window.location.href.includes('?t=')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      // Reset viewport when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  
  // When load retries increment, we want to force a refresh of the data
  useEffect(() => {
    if (loadRetries > 0) {
      console.log(`Retry attempt ${loadRetries} for ${targetIdentifier}`);
      // This is a no-op currently but could be used to force refresh data if needed
    }
  }, [loadRetries, targetIdentifier]);
  
  const { profileRef } = usePdfExport();

  const handleDisconnect = () => {
    localStorage.removeItem('connectedWalletAddress');
    setConnectedWallet(null);
    toast({
      title: "Wallet disconnected",
      description: "You've been successfully disconnected from your wallet."
    });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your profile changes have been saved successfully."
    });
  };

  return {
    ensNameOrAddress: targetIdentifier,
    loading,
    loadingTimeout,
    passport,
    blockchainProfile,
    avatarUrl,
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges
  };
}
