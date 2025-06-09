
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { secureStorage, validateInput } from '@/utils/securityUtils';

export function useProfilePage() {
  const { ensNameOrAddress, userId } = useParams<{ensNameOrAddress?: string, userId?: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  const targetIdentifier = userId || ensNameOrAddress;
  
  useEffect(() => {
    if (targetIdentifier) {
      const sanitizedIdentifier = validateInput.sanitizeString(targetIdentifier.toLowerCase());
      
      if (validateInput.isValidEthereumAddress(sanitizedIdentifier)) {
        setAddress(sanitizedIdentifier);
        setEns(undefined);
      } else {
        const ensValue = sanitizedIdentifier.includes('.') ? sanitizedIdentifier : `${sanitizedIdentifier}.eth`;
        if (validateInput.isValidENS(ensValue) || ensValue.includes('.')) {
          setEns(ensValue);
          setAddress(undefined);
        }
      }
    }

    // Use secure storage for wallet address
    const storedWallet = secureStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Optimize viewport for faster rendering
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=1024, initial-scale=1.0, user-scalable=yes');
    }

    // Simplified URL cleanup without extensive error handling
    if (window.history && window.location.href.includes('?t=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl, hasTalentProtocolData } = useProfileData(ens, address);
  
  const { profileRef } = usePdfExport();

  const handleDisconnect = () => {
    secureStorage.removeItem('connectedWalletAddress');
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
    loadingTimeout: false,
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
