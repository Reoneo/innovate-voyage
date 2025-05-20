
import { useState, useEffect, useCallback } from 'react';
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
  
  // Cache control to handle browser cache management
  useEffect(() => {
    // Try to get the cached address from sessionStorage first for quick loading
    const sessionKey = `profile_${targetIdentifier}`;
    const cachedData = sessionStorage.getItem(sessionKey);
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.address) {
          setAddress(parsed.address);
        } else if (parsed.ens) {
          setEns(parsed.ens);
        }
      } catch (e) {
        console.error('Error parsing cached profile data:', e);
        // Continue with normal resolution
      }
    }
    
    // Normal address/ENS resolution
    if (targetIdentifier) {
      // Convert the identifier to lowercase for case-insensitive search
      const normalizedIdentifier = targetIdentifier.toLowerCase();
      
      // Direct address check - immediately use as address if valid
      if (isValidEthereumAddress(normalizedIdentifier)) {
        console.log(`Valid Ethereum address detected: ${normalizedIdentifier}`);
        setAddress(normalizedIdentifier);
        setEns(undefined); // Clear ENS when looking up by address
        
        // Cache for quick loading next time
        sessionStorage.setItem(sessionKey, JSON.stringify({ address: normalizedIdentifier }));
      } else {
        // Not a valid address, treat as ENS or domain
        const ensValue = normalizedIdentifier.includes('.') ? normalizedIdentifier : `${normalizedIdentifier}.eth`;
        console.log(`Treating as ENS: ${ensValue}`);
        setEns(ensValue);
        setAddress(undefined); // Clear address when looking up by ENS
        
        // Cache for quick loading next time
        sessionStorage.setItem(sessionKey, JSON.stringify({ ens: ensValue }));
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Set a timeout for loading - show timeout message if taking too long
    // Reduced from 4000ms to 3000ms for faster feedback
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000);

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

  // Setting a timeout to stop waiting for profile data if it takes too long
  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl, hasTalentProtocolData } = useProfileData(ens, address);
  
  const { profileRef } = usePdfExport();

  const handleDisconnect = useCallback(() => {
    localStorage.removeItem('connectedWalletAddress');
    setConnectedWallet(null);
    toast({
      title: "Wallet disconnected",
      description: "You've been successfully disconnected from your wallet."
    });
  }, [toast]);
  
  const handleSaveChanges = useCallback(() => {
    toast({
      title: "Changes saved",
      description: "Your profile changes have been saved successfully."
    });
  }, [toast]);

  return {
    ensNameOrAddress: targetIdentifier,
    loading,
    loadingTimeout,
    passport: passport ? { ...passport, hasTalentProtocolData } : null,
    blockchainProfile,
    avatarUrl,
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges,
    hasTalentProtocolData
  };
}
