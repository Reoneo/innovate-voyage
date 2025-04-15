
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  // Determine which parameter to use (either regular path or recruitment.box path)
  const targetIdentifier = userId || ensNameOrAddress;
  
  useEffect(() => {
    if (targetIdentifier) {
      // Direct address check - immediately use as address if valid
      if (isValidEthereumAddress(targetIdentifier)) {
        console.log(`Valid Ethereum address detected: ${targetIdentifier}`);
        setAddress(targetIdentifier);
        setEns(undefined); // Clear ENS when looking up by address
      } else {
        // Not a valid address, treat as ENS or domain
        const ensValue = targetIdentifier.includes('.') ? targetIdentifier : `${targetIdentifier}.eth`;
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
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    }

    // Add CSS to prevent horizontal scrolling on mobile
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        max-width: 100%;
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearTimeout(timeoutId);
      // Reset viewport to default when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
      // Remove the added style
      document.head.removeChild(style);
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Check if we're already on a recruitment.box URL path
      if (window.location.pathname.includes('recruitment.box')) {
        // Navigate to the recruitment.box format
        window.location.href = `/recruitment.box/${query.trim()}`;
      } else {
        // Complete page refresh for the new user's profile
        window.location.href = `/${query.trim()}`;
      }
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
    handleSearch
  };
}
