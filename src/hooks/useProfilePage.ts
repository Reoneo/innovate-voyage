
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

    // Set a timeout for loading - increased to 15 seconds
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 15000);

    // Always optimize for desktop on profile page
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=1024, initial-scale=1.0');
    }

    return () => {
      clearTimeout(timeoutId);
      // Reset viewport to mobile-friendly when leaving the page
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
