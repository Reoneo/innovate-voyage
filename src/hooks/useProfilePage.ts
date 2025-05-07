
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
      // Convert the identifier to lowercase for case-insensitive search
      const normalizedIdentifier = targetIdentifier.toLowerCase();
      
      // Direct address check - immediately use as address if valid
      if (isValidEthereumAddress(normalizedIdentifier)) {
        console.log(`Valid Ethereum address detected: ${normalizedIdentifier}`);
        setAddress(normalizedIdentifier);
        setEns(undefined); // Clear ENS when looking up by address
      } else {
        // Not a valid address, treat as ENS or domain
        const ensValue = normalizedIdentifier.includes('.') ? normalizedIdentifier : `${normalizedIdentifier}.eth`;
        console.log(`Treating as ENS: ${ensValue}`);
        setEns(ensValue);
        setAddress(undefined); // Clear address when looking up by ENS
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Set a timeout for loading
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000);

    // Always optimize for desktop on profile page
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }

    // Clean URL - remove timestamp query parameter and fix duplicate recruitment.box
    if (window.history) {
      let cleanUrl = window.location.pathname;
      
      // Fix duplicate recruitment.box in URL
      if (cleanUrl.includes('recruitment.box/recruitment.box/')) {
        cleanUrl = cleanUrl.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
      }
      
      // Remove timestamp parameter
      if (window.location.href.includes('?t=')) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
      // Fix duplicate recruitment.box without a timestamp parameter
      else if (cleanUrl !== window.location.pathname) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    return () => {
      clearTimeout(timeoutId);
      // Reset viewport when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  
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
