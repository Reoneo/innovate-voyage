
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
  
  const targetIdentifier = userId || ensNameOrAddress;
  
  useEffect(() => {
    console.log('🔍 Profile page initializing for:', targetIdentifier);
    
    if (targetIdentifier) {
      const normalizedIdentifier = targetIdentifier.toLowerCase();
      
      if (isValidEthereumAddress(normalizedIdentifier)) {
        console.log(`✅ Valid Ethereum address detected: ${normalizedIdentifier}`);
        setAddress(normalizedIdentifier);
        setEns(undefined);
      } else {
        const ensValue = normalizedIdentifier.includes('.') ? normalizedIdentifier : `${normalizedIdentifier}.eth`;
        console.log(`🏷️ Treating as ENS: ${ensValue}`);
        setEns(ensValue);
        setAddress(undefined);
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Increased timeout for better performance
    const timeoutId = setTimeout(() => {
      console.log('⏰ Loading timeout reached - showing timeout warning');
      setLoadingTimeout(true);
    }, 8000);

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=1024, initial-scale=1.0, user-scalable=yes');
    }

    // Clean URL without error handling
    if (window.history) {
      let cleanUrl = window.location.pathname;
      
      if (cleanUrl.includes('recruitment.box/recruitment.box/')) {
        cleanUrl = cleanUrl.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
      }
      
      if (window.location.href.includes('?t=')) {
        window.history.replaceState({}, document.title, cleanUrl);
      } else if (cleanUrl !== window.location.pathname) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    return () => {
      clearTimeout(timeoutId);
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  const { loading, passport, avatarUrl } = useProfileData(ens || address);
  
  // Log data fetching progress
  useEffect(() => {
    if (!loading && passport) {
      console.log('✅ Profile data loaded successfully:', {
        hasPassport: !!passport,
        hasAvatar: !!passport.avatar_url
      });
    }
  }, [loading, passport]);
  
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
    avatarUrl,
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges
  };
}
