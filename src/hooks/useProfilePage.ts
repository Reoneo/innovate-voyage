
import { useState, useEffect, useRef } from 'react';
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
  
  // Updated loading timeout behavior - we'll no longer show the timeout message unless user opts to see it
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

    // Set a timeout for loading - but make it longer, 15 seconds instead of 10
    // Clear any existing timeout first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Increase timeout to 15 seconds to allow more time for profiles to load
    timeoutRef.current = setTimeout(() => {
      console.log("Loading timeout reached - we'll continue loading in background");
      setLoadingTimeout(true);
    }, 15000);

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
      // Clean up timeout when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Reset viewport when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  
  // Automatically reset timeout message when data is loaded
  useEffect(() => {
    if (!loading && passport && loadingTimeout) {
      setLoadingTimeout(false);
    }
  }, [loading, passport, loadingTimeout]);
  
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

  // Add a manual refresh function to allow users to retry loading
  const handleRetry = () => {
    if (loadingTimeout) {
      setLoadingTimeout(false);
      
      // Force reload the page with a timestamp to bust cache
      const timestamp = Date.now();
      const currentPath = window.location.pathname;
      window.location.href = `${currentPath}?t=${timestamp}`;
    }
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
    handleSaveChanges,
    handleRetry
  };
}
